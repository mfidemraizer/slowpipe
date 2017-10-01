import { invokeNext } from "./shared"
 
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
const pipe = gen => (...args) => {
    let result = args
    
    for (let fun of gen())
        result = invokeNext(fun, result)

    return result
}

export default pipe