export const
    whenFun = (value, doStuff) => value instanceof Function ? doStuff(value) : false,

    invokeNextPromise = (promise, fun) => whenFun(fun, () => promise.then((...args) => fun(args[0]))) || promise