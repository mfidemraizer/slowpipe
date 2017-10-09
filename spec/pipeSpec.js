import pipe from "../src/pipe"
import pipeP from "../src/pipeP"
import { interceptors } from "../src/symbols"

describe("Synchronous piping with 'pipe'", () => {
    it("calculation should return 10", () => {
        const sum = (x, y) => x + y,
            divideBy2 = x => x / 2,
            multiplyBy2 = x => x * 4,

            calc = pipe(function* () {
                yield sum
                yield divideBy2
                yield multiplyBy2
            }),

            result = calc(3, 2)

        expect(result).toBe(10)
    })

    it("can do calculation with subpiping and return 1000", () => {
        const sum = (x, y) => x + y,
            divideBy2 = x => x / 2,
            multiplyBy2 = x => x * 4,
            multiplyBy10 = x => x * 10,

            calc = pipe(function* () {
                yield sum
                yield (
                    yield divideBy2,
                    yield multiplyBy2,
                    yield (
                        yield multiplyBy10,
                        yield multiplyBy10
                    )
                )
            }),

            result = calc(3, 2)

        expect(result).toBe(1000)
    })

    it("can intercept", () => {
        let interceptEnter = false,
            interceptExit = false

        pipe[interceptors] = [{
            enter: (funOrValue, args) => {
                interceptEnter = true

                return { funOrValue, args }
            },
            exit: (funOrValue, args, result) => {
                interceptExit = true

                return result
            }
        }]

        const sum = (x, y) => x + y,
            divideBy2 = x => x / 2,
            multiplyBy2 = x => x * 4,

            calc = pipe(function* () {
                yield sum
                yield divideBy2
                yield multiplyBy2
            }),

            result = calc(3, 2)

        expect(result).toBe(10)
        expect(interceptEnter).toBe(true)
        expect(interceptExit).toBe(true)
    })
})

describe("Asynchronous piping with 'pipeP'", () => {
    it("calculation should return 10", done => {
        const sumAsync = (x, y) => Promise.resolve(x + y),
            divideBy2Async = x => Promise.resolve(x / 2),
            multiplyBy2Async = x => Promise.resolve(x * 4),
            multiplyBy10Async = x => Promise.resolve(x * 10),

            calcAsync = pipeP(function* () {
                yield sumAsync
                yield (
                    yield divideBy2Async,
                    yield multiplyBy2Async,
                    yield (
                        yield multiplyBy10Async,
                        yield multiplyBy10Async
                    )
                )
            })

        calcAsync(3, 2).then(result => {
            expect(result).toBe(1000)
            done()
        })
    })

    it("can do calculation with subpiping and return 1000", done => {
        const sumAsync = (x, y) => Promise.resolve(x + y),
            divideBy2Async = x => Promise.resolve(x / 2),
            multiplyBy2Async = x => Promise.resolve(x * 4),

            calcAsync = pipeP(function* () {
                yield sumAsync
                yield divideBy2Async
                yield multiplyBy2Async
            })

        calcAsync(3, 2).then(result => {
            expect(result).toBe(10)
            done()
        })
    })
})