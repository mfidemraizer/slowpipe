export const
    isFun = value => value instanceof Function,
    isPromise = value => value instanceof Promise,
    isChainable = value => typeof value == "object" || typeof value == "function" && "fantasy-land/chain" in value,
    isNotNil = value => typeof value != "undefined" && value != null,
    isArray = Array.isArray,
    ifElse = cond => onTrue => onFalse => value => cond( value ) ? onTrue( value ) : onFalse( value ),
    when = cond => doStuff => value => cond( value ) ? doStuff( value ) : value,
    then = doStuff => promise => promise.then( doStuff ),
    apply = fun => args => fun.apply( null, args ),
    first = arr => arr[0],
    always = () => true,
    chain = fun => value => value["fantasy-land/chain"]( fun ),
    cond = condMaps => value => when( isNotNil )( ( [, fun] ) => fun( value ) )( condMaps.find( ( [cond,] ) => cond( value ) ) )