import test from 'ava'
import objectId from './index.js'

test('primitive value', t => {
  let val = objectId(1)
  t.is(val, 1)
  val = objectId('s')
  t.is(val, 's')
  val = objectId(true)
  t.is(val, true)
  val = objectId(null)
  t.is(val, null)
  val = objectId(undefined)
  t.is(val, undefined)
})

test('default options', t => {
  const obj = {}
  const id = objectId(obj)
  t.is(id, objectId(obj))
  // non-enumerable
  t.is(Object.keys(obj).map(k => obj[k]).indexOf(id), -1)
})

test('option key', t => {
  const obj = {}
  const id = objectId(obj, { key: '_id' })
  t.is(id, obj._id)
  // non-enumerable
  t.is(Object.keys(obj).indexOf('_id'), -1)
})

test('option enumerable', t => {
  const obj = {}
  const id = objectId(obj, { key: '_id' , enumerable: true })
  t.is(id, obj._id)
  // enumerable
  t.true(Object.keys(obj).indexOf('_id') > -1)
})
