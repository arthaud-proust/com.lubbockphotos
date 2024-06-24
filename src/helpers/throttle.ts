import { useMemo } from 'react'

type FunctionToThrottle = (...args: any) => any
type ThrottleInterval = number
type ThrottledFunction = (...args: any) => any

export const throttled = (fn: FunctionToThrottle, interval: ThrottleInterval): ThrottledFunction => {
  let fnCalledInInterval = false

  const resetInterval = () => (fnCalledInInterval = false)

  setInterval(resetInterval, interval)

  const throttledFunction = function (...args: any) {
    if (fnCalledInInterval) {
      return
    }

    fn.apply(this, args)
    fnCalledInInterval = true
  }

  return throttledFunction
}

export const useThrottled = (fn: FunctionToThrottle, interval: ThrottleInterval = 200) =>
  useMemo(() => throttled(fn, interval), [fn, interval])
