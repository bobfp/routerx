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
      return ['users', {
        id: '4'
      }]
    })
  )
}

function view(router) {
  return router
    .map(route => {
      console.log('NAV TO', route)
      if (route.name === 'users') {
        return h('button.home', 'home')
      } else {
        return h('button.users', 'user 4')
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
  {name: 'users', path: '/users/:id'}
]

Cycle.run(main, {
  DOM: makeDOMDriver('#app'),
  router: routerx(routes)
});
