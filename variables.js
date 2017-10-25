function Variables() {
  var declarations = {}
  var self

  return self = {
    declare: declare,
    read: read,
    set: set,
    del: del,
    push: push,
    pop: pop,
    incr: incr,
    _expandSubscripts: _expandSubscripts
  }

  function declare(name) {
    name = _expandSubscripts(name)
    if (!isInCurrentFrame(name)) {
      declarations[name] = ''
    } else {
      throw 'Tried to redeclare a variable'
    }
  }

  function read(name) {
    name = _expandSubscripts(name)
    if (isInScope(name)) {
      return declarations[name]
    } else {
      throw 'Tried to read an undeclared variable'
    }
  }

  function set(name, value) {
    name = _expandSubscripts(name)
    if (isInScope(name)) {
      /* go up the stack until we find where the variable
       * is declared */
      var scope = declarations
      while (scope && !has(scope, name)) scope = scope.__proto__
      scope[name] = value
    } else {
      throw 'Tried to set an undeclared variable'
    }
  }

  function del(name) {
    name = _expandSubscripts(name)
    if (isInCurrentFrame(name)) {
      delete declarations[name]
    } else {
      throw 'Tried to delete an undeclared variable'
    }
  }

  function push() {
    declarations = Object.create(declarations)
  }

  function pop() {
    declarations = declarations.__proto__
  }

  function incr(name, amount) {
    var currentVal = declarations[name]
    if (isNumeric(currentVal)) {
      declarations[name] = +currentVal + amount
    } else {
      throw 'Tried to increment non-numeric variable'
    }
  }

  function _expandSubscripts(name) {
    if (name.indexOf('[') === -1) {
      return name
    }

    var parts = name.split('[')

    return parts[0] + ' ' + parts.slice(1).map(function(part) {
      var subscript = part.slice(0, part.length - 1)
      var subscriptValue = self.read(subscript)
      return subscriptValue.length + ':' + subscriptValue
    }).join('')
  }

  function isInScope(name) {
    return name in declarations
  }

  function isInCurrentFrame(name) {
    return has(declarations, name)
  }
}

function has(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

function isNumeric(a) {
  return typeof a === 'number' || a.match(/^[0-9]+$/)
}

module.exports = Variables
