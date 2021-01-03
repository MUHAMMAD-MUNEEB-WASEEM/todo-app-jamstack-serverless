const { ApolloServer, gql } = require('apollo-server-lambda')
var faunadb = require('faunadb'),
  q = faunadb.query;




const typeDefs = gql`
  type Query {
    todos: [Todo!]
  }
  type Mutation {
    addTodo(task: String!):Todo
  }
  type Todo {
    id: ID!
    task: String!
    status: Boolean!
  }
`

const resolvers = {
  Query: {
    todos: async (root, args,context) => {
      try{
        var adminClient = new faunadb.Client({ secret: 'fnAD-ovF7cACDVrIBSkqCtnP_uqtSS8YESjiYk7-' });
        const result = await adminClient.query(
          q.Map(
            q.Paginate(
              q.Match(q.Index('task'))),
              q.Lambda(x => q.Get(x))
          )
        )
        console.log(result)
        return result.data.map(d=>{
          return {
            task: d.data.task,
            status: d.data.status,
            id: d.ts
  
          }
        })

    }catch(error){
      console.log(error)
    }
  }

},
Mutation:{
  addTodo:async (_, {task}) =>{
    try{
      var adminClient = new faunadb.Client({ secret: 'fnAD-ovF7cACDVrIBSkqCtnP_uqtSS8YESjiYk7-' });
      const result = await adminClient.query(
        q.Create(
          q.Collection('todos'),
          { data :{
            task: task,
            status: true,
            
          }
          }
        )
      )
      return result.ref.data

  }catch(error){
    console.log(error)
  }
  }
}
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = server.createHandler()

module.exports = { handler }
