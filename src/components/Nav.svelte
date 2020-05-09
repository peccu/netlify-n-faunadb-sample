<script>
 export let segment;

 import { handleUserAction, handlePrivateRoute } from '../auth.js'

 import { user, redirectURL, message } from '../store.js'
 $: isLoggedIn = !!$user
 $: username = $user !== null ? $user.username : ' there!'
</script>

<style>
 nav {
   border-bottom: 1px solid rgba(255,62,0,0.1);
   font-weight: 300;
   padding: 0 1em;
 }

 ul {
   margin: 0;
   padding: 0;
 }

 /* clearfix */
 ul::after {
   content: '';
   display: block;
   clear: both;
 }

 li {
   display: block;
   float: left;
 }

 [aria-current] {
   position: relative;
   display: inline-block;
 }

 [aria-current]::after {
   position: absolute;
   content: '';
   width: calc(100% - 1em);
   height: 2px;
   background-color: rgb(255,62,0);
   display: block;
   bottom: -1px;
 }

 a {
   text-decoration: none;
   padding: 1em 0.5em;
   display: block;
 }
</style>

<nav>
  <ul>
    <li><a aria-current='{segment === undefined ? "page" : undefined}' href='.'>home</a></li>
    <li><a aria-current='{segment === "about" ? "page" : undefined}' href='about'>about</a></li>
    <li><a aria-current='{segment === "todo" ? "page" : undefined}' href='todo'>todo</a></li>

    <!-- for the blog link, we're using rel=prefetch so that Sapper prefetches
         the blog data when we hover over the link or tap it on a touchscreen -->
    <li><a rel=prefetch aria-current='{segment === "blog" ? "page" : undefined}' href='blog'>blog</a></li>
  </ul>
</nav>

{#if $message != ''}
  {$message}
{/if}

{#if isLoggedIn}
  <div class="center">
    <p>Hello {username}</p>
    <div>
      <button on:click={() => handleUserAction('logout', $redirectURL)}>Log Out</button>
    </div>
  </div>
{:else}
  <div class="center">
    <p>You are not logged in.</p>
    <div>
      <button on:click={() => handleUserAction('login', $redirectURL)}>Log In</button>
      <button on:click={() => handleUserAction('signup', $redirectURL)}>Sign Up</button>
    </div>
  </div>
{/if}

{#if !isLoggedIn && (segment === "blog" || segment === "todo" ) }
  {handlePrivateRoute(segment)}
{/if}
