# RouterX
A stupid simple functional reactive router built for use with Rx.js apps. Hashbang mode and other config options coming soon.

## Install
    npm install routerx

## API
Define routes as a list of route objects using express like paths


```
const routes = [
  {name: 'home', path: '/'},
  {name: 'users', path: '/users/:id'},
  {name: 'hello', path: '/hello/:name?'},
  {name: 'notFound', path: '*'},
]
```


The routerx function takes an array of routes and returns a function.

    routerx(routes)

The returned function takes an observable of route objects and returns an observable of context objects

    const parameters = {
        id: '4',
        color: 'blue'
    }
    const routeObject = ['routeName', parameters]

    const contextObject = {
        name: 'routeName',
        path: 'routeName/4/blue'
        params: {
            id: '4',
            color: 'blue'
        }
    }


## Simple Useless Example
    const route$ = rx.Observable.fromArray([
      ['login', {}],
      ['home', {}],
      ['users', {id: '4'}]
    ])

    const sub = routerx(routes)(route$).subscribe(
      context => {
        console.log(context)
      },
      error => {
        console.log(error);
      },
      () => {
        console.log('complete')
      }
    )


## Use with Cycle.js
    import routerx from 'routerx'
    import Cycle from '@cycle/core'
    import {h, makeDOMDriver} from '@cycle/dom'

    const routes = [
      {name: 'home', path: '/'},
      {name: 'users', path: '/users/:id'},
      {name: 'hello', path: '/hello/:name?'},
      {name: 'notFound', path: '*'},
    ]

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

    function main({DOM, router}) {
      return {
        DOM: routeHandler(router),
        router: routeStream(DOM)
      };
    };

    Cycle.run(main, {
      DOM: makeDOMDriver('#app'),
      router: routerx(routes)
    });
