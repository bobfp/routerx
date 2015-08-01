import rx from 'rx'
import {find, includes, keys, reduce} from 'lodash'

/*
context = {
  name: 'users',
  path: '/users/4',
  params: {
    id: '4'
  }
}

routes = [
  {name: 'login', path: '/'}
  {name: 'home', path: '/home'},
  {name: 'users', path: '/users/:id'}
]

route = [users, {id: '4'}]
*/

//path$ -> context$
export function start(route$, routes) {
  return route$.map(route => {
    const context = contextify(route, routes)
    window.history.pushState({}, 'title', context.path)
    return context
  })
}

//name -> context
export function contextify(route, routes) {
  const name = route[0]
  const params = route[1]
  let context = {}
  let path

  ({path} = find(routes, (r) => {
    return r.name == name;
  }))

  context.name = name;
  context.path = parameterize(path, params)
  context.params = params
  return context
}

//path -> params -> paramPath
export function parameterize(path, params) {
  const splitPaths = path.split('/')
  const paramerterizedSplitPaths = splitPaths
    .map(splitPath => {
      if (includes(keys(params), splitPath.slice(1))) {
        return params[splitPath.slice(1)]
      } else {
        return splitPath
      }
    })
  return reduce(paramerterizedSplitPaths, (total, n) => {
    return total + '/' + n
  })
}
