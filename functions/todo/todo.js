const { ApolloServer, gql } = require('apollo-server-lambda')
var faunadb = require('faunadb'),
  q = faunadb.query;

require('dotenv').config();


const typeDefs = gql`
  type Query {
    todos: [Todo!]
  }
  type Mutation {
    addTodo(task: String!):Todo
    deleteTodo(id: String): String
    updateTodo(id: String, done: Boolean): String
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
        var adminClient = new faunadb.Client({ secret: process.env.FAUNA });
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
      var adminClient = new faunadb.Client({ secret: process.env.FAUNA });
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
      return result.data.data

  }catch(error){
    console.log(error)
  }
  },
  deleteTodo: async (_, { id }) => {
    const results = await client.query(
      q.Delete(q.Ref(q.Collection("todos"), `${id}`))
    )
    return results.ref.id
  },
  updateTodo: async (_, { id, done }) => {
    const results = await client.query(
      q.Update(q.Ref(q.Collection("todos"), `${id}`), {
        data: {
          done: !done,
        },
      })
    )
    return results.ref.id

}
}
}


const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = server.createHandler()

module.exports = { handler }
