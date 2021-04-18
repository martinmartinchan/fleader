const Future = require('fluture')

function transform (M) {
  class ReaderT {
    constructor (f) {
      this.f = f
    }

    run (env) {
      return this.f(env)
    }

    map (g) {
      const reader = this
      return new ReaderT(e =>
        this.run(e)['fantasy-land/map'](a => g(a)))
    }

    chain (g) {
      const reader = this
      return new ReaderT(e =>
        this.run(e)['fantasy-land/chain'](a => g(a).run(e)))
    }
  }

  ReaderT.of = (a) => new ReaderT(e => M['fantasy-land/of'](a))

  ReaderT.ask = new ReaderT(e => M['fantasy-land/of'](e))

  ReaderT.lift = (m) => new ReaderT(b => m)

  return ReaderT
}

const Fleader = transform(Future)

module.exports = Fleader