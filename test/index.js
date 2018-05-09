var nanotiming = require('nanotiming')
var tape = require('tape')

var onPerformance = require('../')

tape('should capture performance measures', function (assert) {
  assert.plan(1)

  var stop = onPerformance(function (entry) {
    if (entry.entryType !== 'measure') return

    assert.ok(entry, 'entry was passed')
    stop()
  })

  nanotiming('test')()
})
