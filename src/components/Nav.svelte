<script>
 export let segment;

 import netlifyIdentity from 'netlify-identity-widget'
 import { user, redirectURL } from '../store.js'

 import { onMount } from 'svelte';
 export let beforeLoad = true
 let href = null
 onMount(async () => {
   netlifyIdentity.init()
   const localUser = JSON.parse(localStorage.getItem('gotrue.user'))
   if (localUser) {
     user.login(localUser)
   }
   beforeLoad = false
   href = location.href
 });

 $: isLoggedIn = beforeLoad || !!$user
 $: username = $user !== null ? $user.username : ' there!'

 import { goto } from '@sapper/app';
 const handleUserAction = async (action) => {
   if (action === 'login' || action === 'signup') {
     netlifyIdentity.open(action)
     netlifyIdentity.on('login', async u => {
       console.log(u)
       console.log($redirectURL)
       user.login(u)
       netlifyIdentity.close()
       if ($redirectURL !== '') {
         await goto($redirectURL)
         redirectURL.clearRedirectURL()
       }
     })
   } else if (action === 'logout') {
     await goto('/')
     user.logout()
     netlifyIdentity.logout()
   }
 }

 import Swal from 'sweetalert2'
 onMount(async () => {
   await import('sweetalert2/src/sweetalert2.scss')
 })

 const handlePrivateRoute = async (segment) => {
   redirectURL.setRedirectURL(segment)
   console.log('set redirect url', segment, href)
   await goto('/', { replaceState: true })
   Swal.fire({
     title: 'You are not authenticated',
     text: 'Please log in or sign up to view this page',
     allowOutsideClick: false,
     confirmButtonText: 'Will do!',
   })
 }

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

    <!-- for the blog link, we're using rel=prefetch so that Sapper prefetches
         the blog data when we hover over the link or tap it on a touchscreen -->
    <li><a rel=prefetch aria-current='{segment === "blog" ? "page" : undefined}' href='blog'>blog</a></li>
  </ul>
</nav>

{#if isLoggedIn}
  <div class="center">
    <p>Hello {username}</p>
    <div>
      <button on:click={() => handleUserAction('logout')}>Log Out</button>
    </div>
  </div>
{:else}
  <div class="center">
    <p>You are not logged in.</p>
    <div>
      <button on:click={() => handleUserAction('login')}>Log In</button>
      <button on:click={() => handleUserAction('signup')}>Sign Up</button>
    </div>
  </div>
{/if}

{#if !isLoggedIn && segment === "blog" }
  {handlePrivateRoute(segment)}
{/if}
