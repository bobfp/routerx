import Cycle from '@cycle/core'
import {h, makeDOMDriver} from '@cycle/dom'
import routerx from '../routerx'

console.log(routerx)

function routeHandler(DOM) {
  return DOM.get('.test', 'click')
    .map(event => {
      return ['users', {id: 4}]
    })
    .startWith(['home', {}])
}

function view(router) {
  return router
    .map(route => {
      console.log('NAV TO', route)
      if (route.name === 'home') {
        return h('button.test', 'users')
      } else {
        return h('button.test', 'home')
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
