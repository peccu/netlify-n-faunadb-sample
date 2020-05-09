<script context="module">
 export function preload({ params, query }) {
   return this.fetch(`blog.json`).then(r => r.json()).then(posts => {
     return { posts };
   });
 }
</script>

<script>
 export let posts;
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
   todos = _todos
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
  <title>Blog</title>
</svelte:head>

<h1>Recent posts</h1>

<ul>
  {#each posts as post}
    <!-- we're using the non-standard `rel=prefetch` attribute to
	 tell Sapper to load the data for the page as soon as
	 the user hovers over the link or taps it, instead of
	 waiting for the 'click' event -->
    <li><a rel='prefetch' href='blog/{post.slug}'>{post.title}</a></li>
  {/each}
</ul>
<ul>
  {#each todos as todo}
    {todo}
  {/each}
</ul>
