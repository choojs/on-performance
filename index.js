var assert = require('assert')

var entryTypes = [
  'node',
  'mark',
  'measure',
  'gc',
  'function'
]

module.exports = onPerformance

function onPerformance (cb) {
  if (typeof window !== 'undefined') return require('./browser.js')(cb) // electron support

  assert.equal(typeof cb, 'function', 'on-performance: cb should be type function')

  var PerformanceObserver
  var performance
  try {
    PerformanceObserver = require('perf_hooks').PerformanceObserver
    performance = require('perf_hooks').performance
  } catch (e) {
    return cb(new Error('on-performance: PerformanceObserver is unavailable. Use Node v8.5.0 or higher.'))
  }

  // Enable singleton.
  if (global._onperformance) {
    global._onperformance.push(cb)
    return stop
  }

  global._onperformance = [cb]
  var observer = new PerformanceObserver(parseEntries)
  setTimeout(function () {
    parseEntries(performance)
    observer.observe({ entryTypes: entryTypes })
  }, 0)

  return stop

  function stop () {
    global._onperformance.splice(global._onperformance.indexOf(cb), 1)
  }

  function parseEntries (list) {
    list.getEntries().forEach(function (entry) {
      clear(entry)
      global._onperformance.forEach(function (cb) {
        cb(entry)
      })
    })
  }

  function clear (entry) {
    var type = entry.entryType
    if (type === 'measure') performance.clearMeasures(entry.name)
    else if (type === 'mark') performance.clearMarks(entry.name)
    else if (type === 'function') performance.clearFunctions(entry.name)
  }
}
