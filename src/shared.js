export const
    echo = value => () => value,
    isFun = value => value instanceof Function,
    isPromise = value => value instanceof Promise,
    isUndefined = value => typeof value == "undefined",
    isFalse = value => value === false,
    isArray = Array.isArray,
    when = cond => doStuff => value => cond(value) ? doStuff(value) : false,
    then = doStuff => promise => promise.then(doStuff),
    callUnary = fun => (...args) => fun(args[0]),
    apply = fun => args => fun.apply(null, args),
    first = arr => arr[0]