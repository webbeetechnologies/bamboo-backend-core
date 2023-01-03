import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  printSchema,
} from 'graphql';

const defaultData = {
  customers: [
    {id: 1, firstName: 'Tobias', lastName: 'Anhalt'},
    {id: 2, firstName: 'Max', lastName: 'Muster'},
  ],

  bills: [
    {id: 1, customerId: 1, amount: 200},
    {id: 2, customerId: 1, amount: 800},
    {id: 3, customerId: 2, amount: 800},
  ],
};

const customers = () => defaultData.customers;
const bills = () => defaultData.bills;

const createGraphQlSchema = () => {
  const BillType = new GraphQLObjectType({
    name: 'Bill',
    fields: {
      id: {type: GraphQLInt},
      customerId: {type: GraphQLInt},
      amount: {type: GraphQLInt},
    },
  });

  const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields: {
      id: {type: GraphQLInt},
      firstName: {type: GraphQLString},
      lastName: {type: GraphQLString},
      bills: {
        type: new GraphQLList(BillType),
        // @ts-ignore
        resolve: async (parent, args) => {
          return bills().filter(bill => bill.customerId === parent.id);
        },
      },
    },
  });

  /*const rootMutation = new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      createCustomer: {
        type: CustomerType,
        args: {
          firstName: {type: new GraphQLNonNull(GraphQLString)},
          lastName: {type: new GraphQLNonNull(GraphQLString)},
        },
        resolve: async (parent, {firstName, lastName}) => {
          const data = await getWorkerData(db);
          const id = data.customers.length + 1;

          data.customers.push({id, firstName, lastName});

          await db.put('myObjectStore', {
            key: 'workerData',
            value: JSON.stringify(data),
          });

          return id;
        },
      },
    },
  });*/

  const rootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      customers: {
        type: new GraphQLList(CustomerType),
        // @ts-ignore
        resolve: async (parent, args) => {
          return customers();
        },
      },
      customer: {
        type: CustomerType,
        args: {id: {type: GraphQLInt}},
        // @ts-ignore
        resolve: async (parent, args) => {
          return customers().find(customer => customer.id === args.id);
        },
      },
      bills: {
        type: new GraphQLList(BillType),
        // @ts-ignore
        resolve: async (parent, args) => {
          return bills();
        },
      },
      bill: {
        type: BillType,
        args: {id: {type: GraphQLInt}},
        // @ts-ignore
        resolve: async (parent, args) => {
          return bills().find(bill => bill.id === args.id);
        },
      },
    },
  });

  return new GraphQLSchema({
    query: rootQuery,
    // mutation: rootMutation,
  });
};

export default createGraphQlSchema;
