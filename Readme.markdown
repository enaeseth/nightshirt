nightshirt
==========


[![build status](https://img.shields.io/travis/enaeseth/nightshirt.svg)](https://travis-ci.org/enaeseth/nightshirt)
[![npm version](https://img.shields.io/npm/v/nightshirt.svg)](https://www.npmjs.com/package/nightshirt)
[![MIT-licensed](https://img.shields.io/npm/l/nightshirt.svg)](https://github.com/enaeseth/nightshirt/blob/master/License.markdown)

nightshirt lets you define strongly-typed [Immutable.js][immutable] [Records][record] in [TypeScript][ts].

**nightshirt requires [TypeScript 2.1][ts21], as it uses `keyof` and lookup types.**

## Installation

nightshirt is available via NPM:

```sh
npm install --save nightshirt
```

## Usage

Immutable.js provides a `Record` function for creating record classes, and nightshirt works similarly. Define an interface with your record's properties, and then call `makeRecordFactory<T>` to create your record class.

Records are of type `Record<T>`, which makes all properties on `T` into `readonly` versions of those properties, and mixes in the methods available on Immutable.js records: `get`, `set`, `merge`, etc.

```ts
import makeRecordFactory, {Record} from 'nightshirt'

interface Contact {
    name: string
    email: string
    private: boolean
}

const Contact = makeRecordFactory<Contact>({
    name: '',
    email: '',
    private: false
})

let c: Record<Contact> = new Contact()
c = c.set('private', true)
// c.private = false         // error: 'private' is a read-only property
// c = c.set('private', 2)   // error: `2` is not a boolean (Contact['private'])
// c = c.set('phone', '...') // error: `'phone'` is not 'name' | 'email' | 'private'

c = c.withMutations((c) => {
    c.name = 'Bugs Bunny'
    e.email = 'bugs@example.com'
})
c = c.merge({
    email: 'bugs.bunny@example.com',
    private: false
})
```

[immutable]: https://facebook.github.io/immutable-js/
[record]: https://facebook.github.io/immutable-js/docs/#/Record
[ts]: https://www.typescriptlang.org/
[ts21]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html