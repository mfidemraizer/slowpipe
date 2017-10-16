import { nil, interceptors } from "./symbols"
import { isFun, isPromise, isArray, ifElse, first, then, apply } from "./shared"

const
    interceptEnter = (pipeInterceptors, funOrValue, args) => typeof pipeInterceptors == "undefined" ? nil :
        pipeInterceptors.reduce((previous, next) => {
            if (!next.hasOwnProperty("enter"))
                return { funOrValue, args }

            if (previous == nil)
                return next.enter(funOrValue, args)
            else {
                const { funOrValue, args } = previous

                return next.enter(funOrValue, args)
            }
        }, nil),

    interceptExit = (pipeInterceptors, funOrValue, args, result) => typeof pipeInterceptors == "undefined" ? nil :
        pipeInterceptors.reduce((previous, next) => {
            if (!next.hasOwnProperty("exit"))
                return { funOrValue, args, result }

            if (previous == nil)
                return next.exit(funOrValue, args, result)
            else {
                const { funOrValue, arg, result } = previous

                return next.exit(funOrValue, arg, result)
            }
        }, nil),

    invokeNext = (item, result) => {
        const
            itemIsFun = () => isFun(item),
            resultIsPromise = apply(isPromise),
            call = fun => arg => ifElse(isArray)(apply(fun))(fun)(arg),
            thenCall = fun => apply(then(call(fun)))


        return ifElse(itemIsFun)(
            ifElse(resultIsPromise)(thenCall(item))(call(item))
        )(first)(result)
    },

    /**
     * Pipes many functions. That is, the result of a function is/are the input parameter(s) on the next one.
     * 
     * @param {*} gen A generator function containing the function sequence
     * @export default
     * @example 
     * const sum = (x, y) => x + y
     * const pow2 = x => x * x
     * const divideBy3 = x => x / 3
     * 
     * const calc = pipe(function *() {
     *      yield sum,
     *      yield pow2
     *      yield divideBy3
     *      yield console.log
     * })
     * 
     * calc(3, 2) // outs '8.34'
     */
    pipe = gen => (...args) => {
        let result = undefined,
            isFirst = true

        for (let funOrValue of gen()) {
            result = isFirst ? args : [result]

            const interceptEnterResult = interceptEnter(pipe[interceptors], funOrValue, result)

            if (interceptEnterResult != nil) {
                funOrValue = interceptEnterResult.funOrValue
                result = interceptEnterResult.args
            }

            const oldResult = result
            debugger
            result = invokeNext(funOrValue, result)

            const interceptExitResult = interceptExit(pipe[interceptors], funOrValue, oldResult, result)

            if (interceptExitResult != nil)
                result = interceptExitResult

            isFirst = false
        }

        return result
    }

export default pipe