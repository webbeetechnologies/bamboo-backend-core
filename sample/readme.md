# Graphql webworker tutorial
This is a learning project with a graphql api running in a webworker that communicate using the `webworker-promise` library.

## Pre-requisites
- [Knowledge of web workers](../js-webworker/readme.md)
- [Basic knowledge of graphql](../../graphql.md)
- [Knowledge of web worker promises](https://www.npmjs.com/package/webworker-promise)
- [Knowledge of idb](https://www.npmjs.com/package/idb)

## Getting started

To get started with this project, navigate to `webworker`, first install the dependencies by running `npm install` in the project directory. Then, run `npm run start` to start the development server and build the project with webpack. The app will be served at `http://localhost:9000`. You can make changes to the TypeScript files in the `src` directory and the changes will be reflected in the app after saving.

## graphiql
The graphiql folder contains the code for the GraphiQL app. The app is built using React and TypeScript. The app uses the `webworker-promise` library to communicate with the worker file.

## worker.ts

The `worker.ts` file uses the `webworker-promise/lib/register` function to register the worker and the `graphql` library to process GraphQL queries. It has a `createGraphQlSchema` function that creates a GraphQL schema with a `Customer` type and a `Bill` type, and defines root queries and mutations for retrieving and creating customer and bill data. It also has functions for storing and retrieving the data in an IndexedDB database. The worker listens for messages and processes them as GraphQL queries, returning the result to the app.
