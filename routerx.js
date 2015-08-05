import rx from 'rx'
import p2r from 'path-to-regexp'
import {zipObject, map, find, includes, keys, reduce} from 'lodash'

//routes -> route$ -> context$
export default function makeDriver(routes) {
  return function(route$) {
    const popStateSubject = rx.Observable.create(observer => {
      window.onpopstate = function popstateCallback() {
        observer.onNext(pathContext(window.location.pathname, routes))
      }
    })

    return route$.map(route => {
      const context = contextify(route, routes)
      window.history.pushState(context, context.name, context.path)
      return context
    })
    .merge(popStateSubject)
    .startWith(pathContext(window.location.pathname, routes))
  }
}

//path -> routes -> context
export function pathContext(path, routes) {
  const matchedRoute = map(routes, route => {
    let keys = []
    let _re = p2r(route.path, keys)
    let re = _re.exec(path)
    if (re === null) {return null}

    return {
      name: route.name,
      path: path,
      params: zipObject(
        map(keys, key => key.name),
        re.splice(1)
      )
    }
  })

  return find(matchedRoute, val => {return val})
}

//route -> routes -> context
export function contextify(route, routes) {
  const name   = route[0]
  const params = route[1]
  const path   = find(routes, (r) => {
    return r.name == name;
  }).path

  return {
    name: name,
    path: p2r.compile(path)(params),
    params: params
  }
}
