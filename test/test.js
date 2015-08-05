import {expect} from 'chai'
import jsdom from 'jsdom'
import rx from 'rx'
import routerx from '../routerx.js'
import {contextify
       , parameterize
       , initialContext
       , pathContext
       } from '../routerx.js'

describe('routerx', () => {
  it('should navigate to provided routes', () => {
    global.window = jsdom.jsdom().defaultView
    global.window.location.href = 'http://routerx.com/users/5'

    const route$ = rx.Observable.fromArray([
      ['login', {}],
      ['home', {}],
      ['users', {id: '4'}]
    ])

    const routes = [
      {name: 'login', path: '/'},
      {name: 'home', path: '/home'},
      {name: 'users', path: '/users/:id'}
    ]
    const sub = routerx(routes)(route$).subscribe(
      context => {
        console.log('test.js', context)
        expect(context.path).to.equal(global.window.location.pathname)
      },
      error => {
        console.log(error);
      },
      () => {
        console.log('complete')
      }
    )
  })
})

describe('contextify', () => {
  it('should generate a context object from a named route', () => {
    const routes = [
      {name: 'login', path: '/'},
      {name: 'home', path: '/home'},
      {name: 'users', path: '/users/:id'}
    ]

    const route = ['users', {id: '4'}]

    const expectedContext = {
      name: 'users',
      path: '/users/4',
      params: {
        id: '4'
      }
    }

    expect(contextify(route, routes)).to.deep.equal(expectedContext)
  })
})

describe('pathContext', () => {
  it('should return the context of a path', () => {
    const path = '/users/4/blue'
    const routes = [
      {name: 'login', path: '/'},
      {name: 'home', path: '/home'},
      {name: 'users', path: '/users/:id'},
      {name: 'complex', path: '/users/:id/:color'}
    ]
    const expectedContext = {
      name: 'complex',
      path: '/users/4/blue',
      params: {
        id: '4',
        color: 'blue'
      }
    }

    expect(pathContext(path, routes)).to.deep.equal(expectedContext);
  })
})
