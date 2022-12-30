import formatGraphQl from "./formatGraphQl";
const registerWebworker = require('webworker-promise/lib/register');

import {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLString,
    GraphQLList, GraphQLNonNull, printSchema,
} from 'graphql';

import { openDB } from 'idb';
import {FetcherParams} from "./types";

const defaultData = {
    'customers': [
        { id: 1, firstName: 'Tobias', lastName: 'Anhalt' },
        { id: 2, firstName: 'Max', lastName: 'Muster' }
    ],

    'bills': [
        { id: 1, customerId: 1, amount: 200 },
        { id: 2, customerId: 1, amount: 800 },
        { id: 3, customerId: 2, amount: 800 }
    ]
};

const createGraphQlSchema = (db) => {
    const BillType = new GraphQLObjectType({
        name: 'Bill',
        fields: {
            id: { type: GraphQLInt },
            customerId: { type: GraphQLInt },
            amount: { type: GraphQLInt },
        },
    });

    const CustomerType = new GraphQLObjectType({
        name: 'Customer',
        fields: {
            id: { type: GraphQLInt },
            firstName: { type: GraphQLString },
            lastName: { type: GraphQLString },
            bills: {
                type: new GraphQLList(BillType),
                resolve: async (parent, args) => {
                    return (await bills(db)).filter(bill => bill.customerId === parent.id);
                },
            },
        },
    });

    const rootMutation = new GraphQLObjectType({
        name: 'RootMutationType',
        fields: {
            createCustomer: {
                type: CustomerType,
                args: {
                    firstName: { type: new GraphQLNonNull(GraphQLString) },
                    lastName: { type: new GraphQLNonNull(GraphQLString) },
                },
                resolve: async (parent, {firstName, lastName}) => {
                    const data = await getWorkerData(db);
                    const id = data.customers.length + 1;

                    data.customers.push({ id, firstName, lastName });

                    await db.put('myObjectStore', { key: 'workerData', value: JSON.stringify(data) });

                    return id;
                },
            },
        },
    });

    const rootQuery = new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
            customers: {
                type: new GraphQLList(CustomerType),
                resolve: async (parent, args) => {
                    const theCustomers = await customers(db);
                    const a = 4;
                    return theCustomers;
                },
            },
            customer: {
                type: CustomerType,
                args: { id: { type: GraphQLInt } },
                resolve: async (parent, args) => {
                    return (await customers(db)).find(customer => customer.id === args.id);
                },
            },
            bills: {
                type: new GraphQLList(BillType),
                resolve: async (parent, args) => {
                    return await bills(db);
                },
            },
            bill: {
                type: BillType,
                args: { id: { type: GraphQLInt } },
                resolve: async (parent, args) => {
                    return (await bills(db)).find(bill => bill.id === args.id);
                },
            },
        },
    });

    return new GraphQLSchema({
        query: rootQuery,
        mutation: rootMutation,
    });
};

const getWorkerData = async (db) => {
    const dataStr = (await db.get('myObjectStore', 'workerData')).value;
    return JSON.parse(dataStr);
}

const customers = async (db) => {
    return (await getWorkerData(db)).customers;
}

const bills = async (db) => {
    return (await getWorkerData(db)).bills;
}

(async () => {
    const db = await openDB('myDatabase', 2, {
        upgrade(db) {
            const objectStore = db.createObjectStore('myObjectStore', { keyPath: 'key' });
            objectStore.add({ key: 'workerData', value: JSON.stringify(defaultData) });
        },
    });

    //ass


    const schema  = createGraphQlSchema(db);
    console.log(printSchema(schema));

    registerWebworker(async (message, emit) => {
        const fetcherParams = message as FetcherParams;

        return formatGraphQl({
            schema,
            ...fetcherParams
        })
    });
})();
