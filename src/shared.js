export const invokeNext = (current, result) => Array.isArray(result) ? current(...result) : current(result)
export const invokeNextPromise = (promise, fun) => promise.then((...args) => fun(...args))