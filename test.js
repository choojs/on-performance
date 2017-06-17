var nanotiming = require('nanotiming')
var tape = require('tape')

var onPerformance = require('./')

tape('should flush already buffered events', function (assert) {
  assert.plan(3) // bundle.js, bundle.css and start event
  var i = 0
  var stop = onPerformance(function (entry) {
    assert.ok(entry, 'entry passed')
    if (i++ === 2) stop()
  })
})

tape('should capture performance measures', function (assert) {
  assert.plan(2)

  var startLength = window.performance.getEntries().length
  var firstIgnored = false

  var stop = onPerformance(function (entry) {
    if (!firstIgnored) {
      firstIgnored = true
      return
    }
    var newLength = window.performance.getEntries().length
    assert.equal(startLength, newLength, 'entries are cleared')
    assert.equal(entry.entryType, 'measure')
    stop()
  })

  nanotiming('test')()
})
