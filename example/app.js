import Cycle from '@cycle/core'
import {h, makeDOMDriver} from '@cycle/dom'
import routerx from '../routerx'

console.log(routerx)

function routeHandler(DOM) {
  return Cycle.Rx.Observable.merge(
    DOM.get('.home', 'click')
    .map(event => {
      return ['home', {}]
    }),
    DOM.get('.users', 'click')
    .map(event => {
      return ['hello', {
        name: 'George'
      }]
    })
  )
}

function view(router) {
  return router
    .map(route => {
      console.log('NAV TO', route)
      switch (route.name) {
        case 'users':
          return h('button.home', 'home')
          break
        case 'home':
          return h('button.users', 'Say Hi')
          break
        case 'hello':
          return h('h1', 'Hello ' + route.params.name)
          break
        case 'notFound':
          return h('h1', 'Page Not Found')
          break
      }
    })
}

function main({DOM, router}) {
  return {
    DOM: view(router),
    router: routeHandler(DOM)
  };
};

const routes = [
  {name: 'login', path: '/'},
  {name: 'home', path: '/home'},
  {name: 'users', path: '/users/:id'},
  {name: 'hello', path: '/hello/:name?'},
  {name: 'notFound', path: '*'},
]

Cycle.run(main, {
  DOM: makeDOMDriver('#app'),
  router: routerx(routes)
});
