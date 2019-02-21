## Asserts

Assert must start with `is(x)` followed by the sequence of checks. First failed assert in sequence will throw an exception.

    is(x).check1.check2...

## Checks

Check is a function taking the value and returning boolean. Checks can be created with the same sequence of checks starting with `is`.

    const { check } = is.check1.check2...

### Simple type checks

- `is.undefined`
- `is.integer`
- `is.number`
- `is.string`
- `is.boolean`
- `is.symbol`
- `is.function`
- `is.object`
- `is.array`
- `is.plainObject`
- `is.instanceOf( T )`

### Simple comparisons

- `is.empty` - x is null or undefined.
- `is.falsy` - !x.
- `is.truthy` - !!x.
- `is.eq( y )`
- `is.le( y )`
- `is.lt`
- `is.ge`
- `is.gt`
- `is.stringLike( /regexp/ )`

### Deep object checks

- `is.arrayOf( check )`
- `is.objectOf( check )`
- `is.shape( { a : check, b : value, ... } )`

### Combinators

-  `is.either( is.string, is.number, ... )`