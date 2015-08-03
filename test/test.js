import {expect} from 'chai'
import jsdom from 'jsdom'
import {makeDriver, contextify, parameterize} from '../routerx.js'
import rx from 'rx'

describe('routerx', () => {
  it('should navigate to provided routes', (done) => {
    global.window = jsdom.jsdom().defaultView
    global.window.location.href = 'http://routerx.com/start-path'

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
    makeDriver(routes)(route$).subscribe(
      context => {
        expect(context.path).to.equal(global.window.location.pathname)
      },
      error => {
        console.log(error);
        done();
      },
      () => {
        console.log('complete')
        done();
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

describe('parameterize', () => {
  it('should place parameters into path', () => {
    const path = '/users/:id/:color'
    const params = {id: 4, color: 'blue'}

    expect(parameterize(path, params)).to.equal('/users/4/blue')
  })
})
