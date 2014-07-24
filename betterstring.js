/**
 * @author <a href="mailto:serdar@yuix.org">Serdar Akarca</a>
 */
'use strict';

if ('function' !== typeof Array.prototype.reduce) {
  Array.prototype.reduce = function(callback /*, initialValue*/) {
    if (null === this || 'undefined' === typeof this) {
      throw new TypeError(
         'Array.prototype.reduce called on null or undefined' );
    }
    if ('function' !== typeof callback) {
      throw new TypeError(callback + ' is not a function');
    }
    var t = Object(this), len = t.length >>> 0, k = 0, value;
    if (arguments.length >= 2) {
      value = arguments[1];
    } else {
      while (k < len && ! k in t) k++;
      if (k >= len)
        throw new TypeError('Reduce of empty array with no initial value');
      value = t[k++];
    }
    for (;k<len;k++) {
      if (k in t) {
         value = callback(value, t[k], k, t);
      }
    }
    return value;
  };
}
if ('function' !== typeof Object.prototype.keys) {
  Object.prototype.keys = (function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function () {
      var obj = this;
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}

/**
 * Pluralizes the string.
 * ex 1: 'rooms(s)(2)' => 'rooms'
 * ex 2: '2 adult(s)(2), 1 room(s)(1)' => '2 adults, 1 room'
 * ex 3: '2 is plural? (no,yes)(2)' => '2 is plural? yes'
 * ex 4: '1 is plural? (no,yes)(1)' => '1 is plural? no'
 * ex 3: '0 is plural? (no,yes)(0)' => '0 is plural? '
 * ex 5: '(0,0)(0) (child,children)(0)' => ' '
 * ex 6: '(1,1)(1) (child,children)(1)' => '1 child'
 * ex 7: '(2,2)(2) (child,children)(2)' => '2 children'
 */
String.prototype.pluralize = function() {
    return this.toString().replace(/\(([A-Za-z0-9]+)(,[A-Za-z0-9]+)?\)\(([0-9]+)\)/g, function() {
      var args = Array.prototype.slice.call(arguments).slice(1,-2),
      s = args[1] ? args[0] : '',
      p = args[1] ? args[1].slice(1) : args[0];
      if(!args[2] || args[2]<1) {
        return "";
      }
      return args[2]>1 ? p : s;
    });
};

/**
 * Renders the string with given context object.
 * ex: '{ rooms_count } rooms'.render({rooms_count:2}) => '2 rooms'
 */
String.prototype.render = function(obj) {
    return obj.keys().reduce(function(t,k) {
        return t.split(RegExp('\{\ *' + k + '\ *\}')).join(obj[k]);
    }, this.toString());
};