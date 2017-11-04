import { nil, interceptors } from "./symbols"
import interceptEnter from "./interceptEnter"
import interceptExit from "./interceptExit"
import invokeNext from "./invokeNext"

const

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
    pipe = gen => ( ...args ) => {
        let result = undefined,
            isFirst = true

        for ( let funOrValue of gen() ) {
            result = isFirst ? args : [result]

            const interceptEnterResult = interceptEnter( pipe[interceptors], funOrValue, result )

            if ( interceptEnterResult != nil ) {
                funOrValue = interceptEnterResult.funOrValue
                result = interceptEnterResult.args
            }

            const oldResult = result
            result = invokeNext( funOrValue, result )

            const interceptExitResult = interceptExit( pipe[interceptors], funOrValue, oldResult, result )

            if ( interceptExitResult != nil )
                result = interceptExitResult

            isFirst = false
        }

        return result
    }

export default pipe