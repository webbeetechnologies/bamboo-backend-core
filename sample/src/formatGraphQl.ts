const createError = require('http-errors');

import type {
  DocumentNode,
  ExecutionArgs,
  ExecutionResult,
  FormattedExecutionResult,
  ValidationRule,
} from 'graphql';

import {
  Source,
  validateSchema,
  specifiedRules,
  getOperationAST,
  GraphQLSchema,
  GraphQLFieldResolver,
  GraphQLTypeResolver,
  GraphQLError,
  parse,
  execute,
  validate,
  formatError,
} from 'graphql';

export type MaybePromise<T> = Promise<T> | T;

type GraphQlObjectOptions = {
  schema: GraphQLSchema;
  query: string;
  // optional

  operationName?: string;
  readonly?: boolean;
  parseFn?: (source: Source) => DocumentNode;
  executeFn?: (args: ExecutionArgs) => MaybePromise<ExecutionResult>;
  validateFn?: (
    schema: GraphQLSchema,
    documentAST: DocumentNode,
    rules: ReadonlyArray<ValidationRule>
  ) => ReadonlyArray<GraphQLError>;
  validationRules?: ReadonlyArray<ValidationRule>;
  rootValue?: unknown;
  fieldResolver?: GraphQLFieldResolver<unknown, unknown>;
  typeResolver?: GraphQLTypeResolver<unknown, unknown>;
  variables?: {readonly [name: string]: unknown} | null;
  context?: unknown;
};

const defaultOptions = {
  parseFn: parse,
  executeFn: execute,
  validateFn: validate,
  readonly: false,
  validationRules: [],
};

export async function graphqlObject(
  options: GraphQlObjectOptions
): Promise<ExecutionResult> {
  const {
    schema,
    query,
    parseFn,
    validateFn,
    validationRules,
    executeFn,
    readonly,
    operationName,
    rootValue,
    fieldResolver,
    typeResolver,
    variables,
    context,
  } = {...defaultOptions, ...options};

  // Validate Schema
  const schemaValidationErrors = validateSchema(schema);
  if (schemaValidationErrors.length > 0) {
    // Return 500: Internal Server Error if invalid schema.
    throw createError(500, 'GraphQL schema validation error.', {
      graphqlErrors: schemaValidationErrors,
    });
  }

  // Parse source to AST, reporting any syntax error.
  let documentAST: DocumentNode;
  try {
    documentAST = parseFn(new Source(query, 'GraphQL request'));
  } catch (syntaxError: unknown) {
    // Return 400: Bad Request if any syntax errors exist.
    throw createError(400, 'GraphQL syntax error.', {
      graphqlErrors: [syntaxError],
    });
  }

  // Validate AST, reporting any errors.
  const validationErrors = validateFn(schema, documentAST, [
    ...specifiedRules,
    ...validationRules,
  ]);

  if (validationErrors.length > 0) {
    // Return 400: Bad Request if any validation errors exist.
    throw createError(400, 'GraphQL validation error.', {
      graphqlErrors: validationErrors,
    });
  }

  // Only query operations are allowed on GET requests.
  if (readonly) {
    // Determine if we should be in readonly mode.
    const operationAST = getOperationAST(documentAST, operationName);
    if (operationAST && operationAST.operation !== 'query') {
      // Otherwise, report a 405: Method Not Allowed error.
      throw createError(
        405,
        `Can only perform a ${operationAST.operation} operation from a POST request.`,
        {headers: {Allow: 'POST'}}
      );
    }
  }

  // Perform the execution, reporting any errors creating the context.
  const result = await executeFn({
    schema,
    document: documentAST,
    rootValue,
    contextValue: context,
    variableValues: variables,
    operationName,
    fieldResolver,
    typeResolver,
  });

  return result;
}

export default async function formatGraphQl(
  options: GraphQlObjectOptions
): Promise<FormattedExecutionResult> {
  let result: ExecutionResult;

  try {
    result = await graphqlObject(options);
  } catch (rawError) {
    // If an error was caught, report the httpError status, or 500.
    const error = createError(
      500,
      /* istanbul ignore next: Thrown by underlying library. */
      rawError instanceof Error ? rawError : String(rawError)
    );

    if (error.graphqlErrors == null) {
      const graphqlError = new GraphQLError(
        error.message,
        undefined,
        undefined,
        undefined,
        undefined,
        error
      );
      result = {data: undefined, errors: [graphqlError]};
    } else {
      result = {data: undefined, errors: error.graphqlErrors};
    }
  }

  const formattedResult: FormattedExecutionResult = {
    ...result,
    errors: result.errors?.map(err => err.toJSON()),
  };

  return formattedResult;
}
