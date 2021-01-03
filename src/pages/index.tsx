import React, { useRef } from "react"
import { useQuery, useMutation } from '@apollo/client'
import gql from 'graphql-tag';
import {Checkbox} from 'theme-ui';
import "./style.css"

const GET_ALL_TODOS = gql`
{
  todos {
    task,
    id,
    status
  }
}
`;

const ADD_TODO = gql`
  mutation addTodo($task: String!){
    addTodo(task: $task){
      task
    }
  }
`

const DELETE_TODO = gql`
  mutation deleteTodo($id: String!) {
    deleteTodo(id: $id)
  }
`
const UPDATE_TODO = gql`
  mutation updateTodo($id: String!, $done: Boolean!) {
    updateTodo(id: $id, done: $done)
  }
`

export default function Home() {
  const { loading, error, data } = useQuery(GET_ALL_TODOS);
  const [addTodo] = useMutation(ADD_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO)
  const [updateTodo] = useMutation(UPDATE_TODO)
  const { refetch } = useQuery(GET_ALL_TODOS)
  const [checked, setChecked]:any = React.useState(true);
  


  let taskField:any;
  let statusField:Boolean;
  const addTask = ()=>{
    addTodo({
      variables: {
        task: taskField.value
      },
      refetchQueries: () => [{ query: GET_ALL_TODOS }]
    })
    taskField.value = "";

  }


  const updateTodoFunc = (id:any, status:any) => {
    updateTodo({
      variables: { id: id, status: status },
      refetchQueries: [{ query: GET_ALL_TODOS }]

    })
    refetch()

  }

  

  if (loading)
    return <h3>Loading..</h3>

  if (error)
    return <h3>Error</h3>

  return (
    <div className='app-container'>
    <h2 className='app-header'>Add Todo</h2>
    <label >
      <input className='task-input' type="text"
        placeholder="Enter Todo"
        ref={node => { taskField = node}}
        required={true} />
      
    </label>
    <button className='submit-task' onClick={addTask}>+</button>

    <h2 className='my-Todo'>My Todos</h2>
    <div >
        {data?.todos.map((td)=> {
          return <div className='task-list-item' key={td.id}>
            {td.task}
          </div>
          })}
      </div>
    
      

  </div>
  );
}
