import {expect} from 'chai'
import 'mocha'

import makeRecordFactory, {Record} from './src'

interface Foo {
    x: number
    y: boolean
}

interface Bar {
    a: string
    b: number
    c: Record<Foo>
}

const Foo = makeRecordFactory<Foo>({x: 1, y: true}, 'Foo')
const Bar = makeRecordFactory<Bar>({a: 'boop', b: 0, c: new Foo()})

describe('Record', () => {
    it('respects default values', () => {
        const foo = new Foo()

        expect(foo.x).to.equal(1)
        expect(foo.y).to.equal(true)
    })

    it('respects overridden values', () => {
        const foo = new Foo({y: false})

        expect(foo.x).to.equal(1)
        expect(foo.y).to.equal(false)
    })

    it('provides .size', () => {
        const foo = new Foo()
        const bar = new Bar({c: foo})

        expect(foo.size).to.equal(2)
        expect(bar.size).to.equal(3)
    })

    it('tests equality', () => {
        const a = new Foo()
        const b = new Foo({y: true})
        const c = new Foo({y: false})

        expect(a.equals(b)).to.be.true
        expect(a.equals(c)).to.be.false
    })

    it('exposes get', () => {
        const a = new Foo({y: true})
        const b = new Foo({y: false})

        expect(a.get('x')).to.equal(1)
        expect(a.get('y')).to.equal(true)
        expect(b.get('y')).to.equal(false)
    })

    it('exposes getIn', () => {
        const bar = new Bar()

        expect(bar.getIn(['a'])).to.equal('boop')
        expect(bar.getIn(['c', 'x'])).to.equal(1)
    })

    it('exposes set', () => {
        const foo = new Foo()
        const fooPrime = foo.set('x', 0)

        expect(foo).to.not.equal(fooPrime)
        expect(fooPrime.x).to.equal(0)
    })

    it('exposes setIn', () => {
        const bar = new Bar()
        const barPrime = bar.setIn(['c', 'x'], 0)

        expect(bar).to.not.equal(barPrime)
        expect(barPrime.c.x).to.equal(0)
    })

    it('exposes merge', () => {
        const foo = new Foo()
        const fooPrime = foo.merge({x: 0})
        const fooPrimePrime = foo.merge({x: -1, y: false})

        expect(foo).to.not.equal(fooPrime)
        expect(fooPrime).to.not.equal(fooPrimePrime)
        expect(fooPrime.x).to.equal(0)
        expect(fooPrimePrime.x).to.equal(-1)
        expect(fooPrimePrime.y).to.equal(false)
    })

    it('exposes mergeWith', () => expect(new Foo().mergeWith).to.be.a('function'))
    it('exposes mergeDeep', () => expect(new Foo().mergeDeep).to.be.a('function'))
    it('exposes mergeDeepWith', () => expect(new Foo().mergeDeepWith).to.be.a('function'))

    it('exposes update', () => {
        const foo = new Foo({y: false})
        const fooReplaced = foo.update((r) => new Foo({x: -1, y: r.y}))
        const fooIncremented = foo.update('x', (x) => x + 1)

        expect(fooReplaced.x).to.equal(-1)
        expect(fooReplaced.y).to.equal(false)
        expect(fooIncremented.x).to.equal(2)
    })

    it('exposes updateIn', () => {
        const bar = new Bar()
        const barPrime = bar.updateIn(['c', 'x'], (x: number) => x + 1)

        expect(barPrime.c.x).to.equal(2)
    })

    it('exposes delete', () => {
        const foo = new Foo({x: 0})
        expect(foo.delete('x').x).to.equal(1)
        expect(foo.remove('x').x).to.equal(1)
    })

    it('exposes deleteIn', () => {
        const bar = new Bar({c: new Foo({x: 0})})
        expect(bar.deleteIn(['c', 'x']).c.x).to.equal(1)
        expect(bar.removeIn(['c', 'x']).c.x).to.equal(1)
    })

    it('exposes clear', () => {
        const foo = new Foo({x: 0, y: false})
        expect(foo.clear().x).to.equal(1)
        expect(foo.clear().y).to.equal(true)
    })

    it('exposes withMutations', () => {
        const foo = new Foo()
        const fooPrime = foo.withMutations((foo) => {
            foo.x = 0
            foo.set('y', false)

            expect(foo.wasAltered()).to.be.true
        })

        expect(foo).to.not.equal(fooPrime)
        expect(foo.x).to.equal(1)
        expect(fooPrime.x).to.equal(0)
        expect(fooPrime.get('x')).to.equal(0)
        expect(fooPrime.y).to.be.equal(false)
    })

    it('exposes asMutable', () => expect(new Foo().asMutable).to.be.a('function'))
    it('exposes asImmutable', () => expect(new Foo().asImmutable).to.be.a('function'))

    it('exposes toJS', () => {
        const foo = new Foo({x: 0})
        const fooBare = foo.toJS()

        expect(fooBare).to.eql({x: 0, y: true})
    })

    it('exposes toObject', () => {
        const foo = new Foo({x: 0})
        const fooBare = foo.toObject()

        expect(fooBare).to.eql({x: 0, y: true})
    })

    it('exposes toMap', () => {
        const foo = new Foo({x: 0})
        const fooMap = foo.toMap()

        expect(fooMap.get('x')).to.equal(0)
        expect(fooMap.get('y')).to.equal(true)
    })

    it('exposes toSeq', () => expect(new Foo().toSeq).to.be.a('function'))
    it('exposes toKeyedSeq', () => expect(new Foo().toKeyedSeq).to.be.a('function'))
    it('exposes toIndexedSeq', () => expect(new Foo().toIndexedSeq).to.be.a('function'))
    it('exposes toSetSeq', () => expect(new Foo().toSetSeq).to.be.a('function'))

    it('exposes toString', () => {
        expect(new Foo().toString()).to.equal('Foo { "x": 1, "y": true }')
    })
})
