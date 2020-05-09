/* Api methods to call /functions */

// with auth
// https://www.netlify.com/blog/2018/03/29/jamstack-architecture-on-netlify-how-identity-and-functions-work-together/
import netlifyIdentity from 'netlify-identity-widget'
if(typeof window == 'object'){
  netlifyIdentity.init()
}
const generateHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (typeof window == 'object' && netlifyIdentity.currentUser()) {
    return netlifyIdentity.currentUser().jwt().then((token) => {
      return { ...headers, Authorization: `Bearer ${token}` };
    })
  }
  return Promise.resolve(headers);
}

// many drops
// cf. https://www.smashingmagazine.com/2019/10/bookmarking-application-faunadb-netlify-11ty/
const mapTodos = (data) => {
  return data.map(todo => {
    const dateTime = new Date(todo.ts / 1000);
    return { time: dateTime, ...todo.data }
  })
}

const call = (endpoint, params) => {
  if(typeof window != 'object'){
    return new Promise(()=>{})
  }
  if(!params){
    params = {}
  }
  return generateHeaders().then((headers) => {
    return fetch(endpoint, {...params, headers})
  }).then(response => {
    if(!response.ok){
      return response.text().then(err => {throw(err)});
    }
    return response
  }).then(response => {
    return response.json()
  })
}

const create = (data) => {
  return call('/.netlify/functions/todos-create', {
      body: JSON.stringify(data),
      method: 'POST'
    })
}

const readAll = () => {
  return call('/.netlify/functions/todos-read-all')
}

const update = (todoId, data) => {
  return call(`/.netlify/functions/todos-update/${todoId}`, {
    body: JSON.stringify(data),
    method: 'POST'
  })
}

const deleteTodo = (todoId) => {
  return call(`/.netlify/functions/todos-delete/${todoId}`, {
    method: 'POST',
  })
}

const batchDeleteTodo = (todoIds) => {
  return call(`/.netlify/functions/todos-delete-batch`, {
    body: JSON.stringify({
      ids: todoIds
    }),
    method: 'POST'
  })
}

export default {
  mapTodos,
  create: create,
  readAll: readAll,
  update: update,
  delete: deleteTodo,
  batchDelete: batchDeleteTodo
}
