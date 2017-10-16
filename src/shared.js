export const
    isFun = value => value instanceof Function,
    isPromise = value => value instanceof Promise,
    isArray = Array.isArray,
    ifElse = cond => onTrue => onFalse => value => cond(value) ? onTrue(value) : onFalse(value),
    then = doStuff => promise => promise.then(doStuff),
    apply = fun => args => fun.apply(null, args),
    first = arr => arr[0]