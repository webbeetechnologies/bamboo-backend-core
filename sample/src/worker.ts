import {printSchema} from 'graphql';

const registerWebworker = require('webworker-promise/lib/register');
import {FetcherParams} from './types';
//
import formatGraphQl from './formatGraphQl';
import createGraphQlSchema from './createGraphQlSchema';

console.log('yolo');

(async () => {
  console.log('yolo');

  const schema = createGraphQlSchema();
  console.log(printSchema(schema));

  registerWebworker(async (message, emit) => {
    // return 'yolo';

    const fetcherParams = message as FetcherParams;

    return formatGraphQl({
      schema,
      ...fetcherParams,
    });
  });
})();
