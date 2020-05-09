import { goto } from '@sapper/app';

import Swal from 'sweetalert2'
(typeof window == 'object') && import('sweetalert2/src/sweetalert2.scss')
const fire = () => {
  Swal.fire({
    title: 'You are not authenticated',
    text: 'Please log in or sign up to view this page',
    allowOutsideClick: false,
    confirmButtonText: 'Will do!',
  })
}

import netlifyIdentity from 'netlify-identity-widget'
(typeof window == 'object') && netlifyIdentity.init()

import { user, redirectURL } from './store.js'

export const handleUserAction = async (action, redirect) => {
  if(action === 'login' || action === 'signup'){
    netlifyIdentity.open(action)
    netlifyIdentity.on('login', async u => {
      user.login(u)
      netlifyIdentity.close()
      if (redirect !== '') {
        await goto(redirect)
        redirectURL.clearRedirectURL()
      }
    })
  }else if(action === 'logout'){
    await goto('/')
    user.logout()
    netlifyIdentity.logout()
  }
}

export const handlePrivateRoute = async (segment) => {
  let href = (typeof window == 'object') ? location.href : ''
  redirectURL.setRedirectURL(href)
  await goto('/', { replaceState: true })
  fire()
}
