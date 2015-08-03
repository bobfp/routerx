import rx from 'rx'
import {find, includes, keys, reduce} from 'lodash'

//path$ -> context$
export default function makeDriver(routes) {
  return function(route$) {
    return route$.map(route => {
      const context = contextify(route, routes)
      window.history.pushState({}, 'title', context.path)
      return context
    })
  }
}

//route -> routes -> context
export function contextify(route, routes) {
  const name = route[0]
  const params = route[1]
  let path

  ({path} = find(routes, (r) => {
    return r.name == name;
  }))

  return {
    name: name,
    path: parameterize(path, params),
    params: params
  }
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
