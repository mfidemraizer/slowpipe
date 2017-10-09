import { nil, interceptors } from "./symbols"
import { whenFun } from "./shared"

const
    interceptEnter = (pipeInterceptors, funOrValue, args) => typeof pipeInterceptors == "undefined" ? nil :
        pipeInterceptors.reduce((previous, next) => {
            if (!next.hasOwnProperty("enter"))
                return { funOrValue, args }

            if (previous === nil)
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

            if (previous === nil)
                return next.exit(funOrValue, args, result)
            else {
                const { funOrValue, arg, result } = previous

                return next.exit(funOrValue, arg, result)
            }
        }, nil),

    invokeNext = (fun, result) => whenFun(fun, () => fun(result)) || result,

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
        const
            pipeInterceptors = pipe[interceptors],
            iterator = gen()

        let funOrValue = iterator.next().value

        const interceptEnterResult = interceptEnter(pipeInterceptors, funOrValue, args)

        let result = undefined

        if (interceptEnterResult != nil) {
            funOrValue = interceptEnterResult.funOrValue
            args = interceptEnterResult.args
        }

        if (funOrValue instanceof Function)
            result = funOrValue(...args)
        else
            result = args

        const interceptExitResult = interceptExit(pipeInterceptors, funOrValue, args, result)

        if (interceptExitResult != nil)
            result = interceptExitResult

        for (funOrValue of iterator) {
            const interceptEnterResult = interceptEnter(pipeInterceptors, funOrValue, [result])

            if (interceptEnterResult != nil) {
                funOrValue = interceptEnterResult.funOrValue
                [result] = interceptEnterResult.args
            }

            const oldResult = result
            result = invokeNext(funOrValue, result)

            const interceptExitResult = interceptExit(pipeInterceptors, funOrValue, [oldResult], result)
            debugger
            if (interceptExitResult != nil)
                result = interceptExitResult
        }

        return result
    }

export default pipe