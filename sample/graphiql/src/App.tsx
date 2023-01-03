import React from 'react';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.min.css';
import {worker} from './worker';
import { timeout, TimeoutError } from 'promise-timeout';
export type FetcherParams = {
    query: string;
    operationName?: string | null;
    variables?: any;
};

const withRetries = ({ attempt, maxRetries }: { attempt: (...args: any[]) => Promise<any>, maxRetries: number }) =>
    async (...args: any[]): Promise<any> => {
        const slotTime = 500;
        let retryCount = 0;
        while (retryCount < maxRetries) {
            try {
                console.log('Attempting...', Date.now());
                return await attempt(...args);
            } catch (error) {
                if (error instanceof TimeoutError) {
                    const isLastAttempt = retryCount === maxRetries - 1;
                    if (isLastAttempt) {
                        throw error;
                    }
                    const randomTime = Math.floor(Math.random() * slotTime);
                    const delay = 2 ** retryCount * slotTime + randomTime;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    retryCount++;
                } else {
                    throw error;
                }
            }
        }
    }


const execute = async (graphQLParams: FetcherParams) => {
    return timeout(worker.postMessage(graphQLParams), 3000);
}

const fetcher = async (graphQLParams: FetcherParams) => {
    console.log('getting from worker...');

    const resultObj = await withRetries({
        attempt: () => execute(graphQLParams),
        maxRetries: 20
    })();

    console.log('got from worker', resultObj);

    return resultObj;
}

const App = () => (
    <GraphiQL
        fetcher={fetcher}
    />
);

/*

const App = () => (
    <GraphiQL
        fetcher={async graphQLParams => {
          const data = await fetch(
              'https://swapi-graphql.netlify.app/.netlify/functions/index',
              {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(graphQLParams),
                credentials: 'same-origin',
              },
          );
          return data.json().catch(() => data.text());
        }}
    />
);


 */

export default App;
