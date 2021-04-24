const { Future, pap, map, chain, resolve } = require('fluture')

const curryAssoc = (key) => (value) => (obj) => {
  obj[key] = value
  return obj
}

const futureAssoc = (key, value, obj) => {
  return pap(obj)(pap(value)(pap(key)(resolve(curryAssoc))))
}

function transform (M) {
  class ReaderT {
    constructor (f) {
      this.f = f
    }

    run (env) {
      return this.f(env)
    }

    map (g) {
      return new ReaderT(e =>
        map(a => g(a))(this.run(e)))
    }

    chain (g) {
      return new ReaderT(e =>
        chain(a => g(a).run(e))((this.run(e))))
    }

    ap (f) {
      return new ReaderT(e =>
        pap(this.run(e))(f.run(e)))
    }
  }

  ReaderT.of = (a) => new ReaderT(e => M['fantasy-land/of'](a))

  ReaderT.ask = new ReaderT(e => M['fantasy-land/of'](e))

  ReaderT.lift = (m) => new ReaderT(b => m)

  ReaderT.props = (obj) => {
    return new ReaderT(e => 
      Object.keys(obj).reduce((acc, key) => {
        return futureAssoc(resolve(key), obj[key].run(e), acc)
      }, resolve({}))
    )
  }

  return ReaderT
}

const Fleader = transform(Future)

module.exports = Fleader
