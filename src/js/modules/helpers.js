// Avoid `console` errors in browsers that lack a console.
;(() => {
  let method
  const noop = () => {}
  const methods = [
    'assert',
    'clear',
    'count',
    'debug',
    'dir',
    'dirxml',
    'error',
    'exception',
    'group',
    'groupCollapsed',
    'groupEnd',
    'info',
    'log',
    'markTimeline',
    'profile',
    'profileEnd',
    'table',
    'time',
    'timeEnd',
    'timeline',
    'timelineEnd',
    'timeStamp',
    'trace',
    'warn',
  ]
  let { length } = methods
  // eslint-disable-next-line no-multi-assign
  const console = (window.console = window.console || {})

  // eslint-disable-next-line no-plusplus
  while (length--) {
    method = methods[length]

    // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop
    }
  }
})()