const UNIQUE_KEY_PROP_NAME = '__unique_key_prop__'
const VALUE_PREFIX = '__uid__' + Date.now() + '_'

const defaultOptions = {
  key: UNIQUE_KEY_PROP_NAME,
  enumerable: false
}

let uid = 0

function extend (dest, src) {
  for (const key in src) {
    dest[key] = src[key]
  }
  return dest
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function objectId (obj, options) {
  if (isObject(obj)) {
    const { key, enumerable } = extend(extend({}, defaultOptions), options)
    if (obj.hasOwnProperty(key)) {
      return obj[key]
    }
    const value = VALUE_PREFIX + uid++
    Object.defineProperty(obj, key, { value, enumerable })
    return value
  }
  return obj
}

export default objectId
