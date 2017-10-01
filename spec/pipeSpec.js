import pipe from "../src/pipe"
import pipeP from "../src/pipeP"

describe("Synchronous piping with 'pipe'", () => {
    it("calculation should return 10", () => {
        const sum = (x, y) => x + y,
            divideBy2 = x => x / 2,
            multiplyBy2 = x => x * 4,

            calc = pipe(function* () {
                yield sum
                yield divideBy2
                yield multiplyBy2
            })

        expect(calc(3, 2)).toBe(10)
    })
})

describe("Asynchronous piping with 'pipeP'", () => {
    it("calculation should return 10", done => {
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