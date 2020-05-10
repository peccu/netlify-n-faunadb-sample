<script>
 import api from '../api.js'
 if(typeof window == 'object'){
   window.api = api
 }
 // Fetch all todos
 export let todos = [];
 api.readAll().then((_todos) => {
   if (_todos.message === 'unauthorized') {
     if (isLocalHost()) {
       alert('FaunaDB key is not unauthorized. Make sure you set it in terminal session where you ran `npm start`. Visit http://bit.ly/set-fauna-key for more info')
     } else {
       alert('FaunaDB key is not unauthorized. Verify the key `FAUNADB_SERVER_SECRET` set in Netlify enviroment variables is correct')
     }
     return false
   }

   console.log('all todos', _todos)
   todos = api.mapTodos(_todos)
 }).catch(err => {
   console.log('something went wrong', err)
 })

</script>

<style>
 ul {
   margin: 0 0 1em 0;
   line-height: 1.5;
 }
</style>

<svelte:head>
  <title>Todos</title>
</svelte:head>

<h1>Todos</h1>

<ul>
  {#each todos as todo}
    <li>{todo.title} - {todo.completed}, {todo.time}</li>
  {/each}
</ul>
