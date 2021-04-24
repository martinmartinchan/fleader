const Fleader = require('../src/fleader')
const { Future } = require('fluture')
const { fork } = require('fluture')
const should = require('chai').should()

describe('Fleader', () => {
  describe('of', () => {
    it('of', () => {
      const wrappedValue = Fleader.of(37)
      wrappedValue.run({})
        .pipe(fork(
          (err) => {throw err})
          (result => result.should.be.equal(37)))
    })
  })

  describe('ask and run', () => {
    const add37Real = number => number + 37
    const add37Fake = number => number
    
    it('real add', () => {
      const env = { add37: add37Real }
      const wrappedValue = Fleader.ask.map(({ add37 }) => {
        return add37(0)
      })
      wrappedValue.run(env)
        .pipe(fork(
          (err) => {throw err})
          (result => result.should.be.equal(37)))
    })

    it('fake add', () => {
      const env = { add37: add37Fake }
      const wrappedValue = Fleader.ask.map(({ add37 }) => {
        return add37(0)
      })
      wrappedValue.run(env)
        .pipe(fork(
          (err) => {throw err})
          (result => result.should.be.equal(0)))
    })
  })

  describe('lift', () => {
    const wrappedValue = Fleader.lift(Future['fantasy-land/of'](37))
    wrappedValue.run({})
        .pipe(fork(
          (err) => {throw err})
          (result => result.should.be.equal(37)))
  })

  describe('map and chain', () => {
    const firstValue = Fleader.of(0)
    const secondValue = Fleader.of(37)
    it('map and chain', () => {
      const wrappedValue = firstValue
      .chain(() => secondValue)
      .map(value => `The last value is ${value}`)
      wrappedValue.run({})
        .pipe(fork(
          (err) => {throw err})
          (result => result.should.be.equal('The last value is 37')))
    })
  })

  describe('ap', () => {
    const value = Fleader.of(0)
    const add37 = Fleader.of((a) => (a + 37))
    it('ap', () => {
      const wrappedValue = value.ap(add37)
      wrappedValue.run({})
        .pipe(fork(
          (err) => {throw err})
          (result => result.should.be.equal(37)))
    })
  })

  describe('props', () => {
    const fleaderObj = {
      a: Fleader.of('This is a fleader'),
      b: Fleader.of(37)
    }
    it('props', () => {
      const wrappedValue = Fleader.props(fleaderObj)
      wrappedValue.run({})
        .pipe(fork(
          (err) => {throw err})
          (result => result.should.be.deep.equal({
            a: 'This is a fleader',
            b: 37
          })))
    })
  })
})

