var Variables = require('./variables')

describe('Variables', function() {
  var v
  beforeEach(function() {
    v = Variables()
  })

  it('lets you declare a variable', function() {
    v.declare('foo')
    expect(v.read('foo')).toBe('')
  })

  it('lets you set a declared variable', function() {
    v.declare('foo')
    v.set('foo', 'hello')
    expect(v.read('foo')).toBe('hello')
  })

  it('throws an error if you read an undeclared variable', function() {
    v.declare('foo')
    expect(function() {
      v.read('yikes')
    }).toThrow()
  })

  it('throws an error if you set an undeclared variable', function() {
    v.declare('foo')
    expect(function() {
      v.set('yikes')
    }).toThrow()
  })

  it('throws an error if you declare a variable twice', function() {
    v.declare('foo')
    expect(function() {
      v.declare('foo')
    }).toThrow()
  })

  it('expands subscripts in square brackets', function() {
    v.declare('i')
    v.set('i', 1)
    v.declare('foo[i]')
    v.set('foo[i]', 'one')
    v.set('i', 2)
    v.declare('foo[i]')
    v.set('foo[i]', 'two')
    v.set('i', 1)
    expect(v.read('foo[i]')).toBe('one')
    v.set('i', 2)
    expect(v.read('foo[i]')).toBe('two')
  })

  it('deletes a variable', function() {
    v.declare('foo')
    v.del('foo')
    expect(function() {
      v.read('foo')
    }).toThrow()
  })

  it('throws an error if you delete a variable twice', function() {
    v.declare('foo')
    v.del('foo')
    expect(function() {
      v.del('foo')
    }).toThrow()
  })

  it('expands subscripts when deleting variables', function() {
    v.declare('i')
    v.set('i', 1)
    v.declare('foo[i]')
    v.del('foo[i]') // doesn't throw
  })

  it('lets you push and pop stack frames', function() {
    v.declare('i')
    v.set('i', 1)
    v.push()
    v.declare('i')
    v.set('i', 2)
    expect(v.read('i')).toBe(2)
    v.pop()
    expect(v.read('i')).toBe(1)
  })

  it('lets you read a variable from a higher stack frame', function() {
    v.declare('i')
    v.set('i', 1)
    v.push()
    expect(v.read('i')).toBe(1)
  })

  it('lets you write a variable in a higher stack frame', function() {
    v.declare('i')
    v.set('i', 1)
    v.push()
    v.set('i', 2)
    v.pop()
    expect(v.read('i')).toBe(2)
  })

  it('throws an error if you delete a variable from a higher stack frame', function() {
    v.declare('i')
    v.set('i', 1)
    v.push()
    expect(function() { v.del('i') }).toThrow()
  })

  it('increments a variable', function() {
    v.declare('i')
    v.set('i', 1)
    v.incr('i', 2)
    expect(v.read('i')).toBe(3)
  })

  it('converts string variables to ints before incrementing', function() {
    v.declare('foo')
    v.set('foo', '012')
    v.incr('foo', 2)
    expect(v.read('foo')).toBe(14)
  })

  it('throws an error if you increment a non-numeric variable', function() {
    v.declare('i')
    v.set('i', ' 1')
    expect(function() { v.incr('i', 1) }).toThrow()
  })
})

describe('expandName', function() {
  it('returns names without square brackets unchanged', function() {
    expect(Variables.expandSubscripts('foo')).toBe('foo')
  })

  it('expands names with a subscript', function() {
    var v = Variables()
    v.declare('i')
    v.set('i', 'hello')

    expect(Variables.expandSubscripts('foo[i]', v))
      .toBe('foo 5:hello')
  })

  it('expands names with multiple subscripts', function() {
    var v = Variables()
    v.declare('i')
    v.declare('k')
    v.set('i', 'hello')
    v.set('k', 'wow')

    expect(Variables.expandSubscripts('foo[i][k]', v))
      .toBe('foo 5:hello3:wow')
  })
})
