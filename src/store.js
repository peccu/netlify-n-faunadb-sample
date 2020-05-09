// https://github.com/babycourageous/netlify-identity-demo-svelte/blob/master/src/store.js
import { writable } from 'svelte/store'

function createUser() {
  let u = null
  const { subscribe, set } = writable(u)

  return {
    subscribe,
    login(user) {
      let name = (user.user_metadata && user.user_metadata.full_name !== '')
          ? user.user_metadata.full_name
          : user.email
      const currentUser = {
        username: name,
        email: user.email,
        access_token: user.token.access_token,
        expires_at: user.token.expires_at,
        refresh_token: user.token.refresh_token,
        token_type: user.token.token_type,
      }
      set(currentUser)
    },
    logout(){
      set(null)
    },
  }
}

const createRedirectURL = () => {
  const { subscribe, set } = writable('')
  return {
    subscribe,
    setRedirectURL(url){
      set(url)
    },
    clearRedirectURL(){
      set('')
    },
  }
}

export const user = createUser()
export const redirectURL = createRedirectURL()
