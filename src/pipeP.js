import { invokeNextPromise } from "./shared"
 
/**
 * Pipes many functions. That is, the result of a function is/are the input parameter(s) on the next one.
 * 
 * @param {*} gen A generator function containing the function sequence
 * @export default
 * @example 
 * const sumAsync = (x, y) => Promise.resolve(x + y)
 * const pow2Async = x => Promise.resolve(x * x)
 * const divideBy3Async = x => Promise.resolve(x / 3)
 * 
 * const calc = pipe(function *() {
 *      yield sumAsync,
 *      yield pow2Async
 *      yield divideBy3Async
 * })
 * 
 * calc(3, 2).then(console.log) // outs '8.34'
 */
const pipeP = gen => (...args) => new Promise(resolve => {
    const iterator = gen()
    let fun = iterator.next().value
    let promise = fun(...args)

    for (fun of iterator)
        promise = invokeNextPromise(promise, fun)

    promise.then(resolve)
})

export default pipeP