import Cycle from '@cycle/core'
import {h, makeDOMDriver} from '@cycle/dom'
import routerx from '../routerx'

console.log(routerx)

function routeStream(DOM) {
  return Cycle.Rx.Observable.merge(
    DOM.get('.home', 'click')
    .map(event => {
      return ['home', {}]
    }),
    DOM.get('.hello', 'click')
    .map(event => {
      return ['hello', {
        name: 'George'
      }]
    })
  )
}

function routeHandler(router) {
  return router
    .map(route => {
      console.log('NAV TO', route)
      switch (route.name) {
        case 'users':
          return h('button.home', 'home')
          break
        case 'home':
          return h('button.hello', 'Say Hi')
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
    DOM: routeHandler(router),
    router: routeStream(DOM)
  };
};

const routes = [
  {name: 'home', path: '/'},
  {name: 'users', path: '/users/:id'},
  {name: 'hello', path: '/hello/:name?'},
  {name: 'notFound', path: '*'},
]

Cycle.run(main, {
  DOM: makeDOMDriver('#app'),
  router: routerx(routes)
});
