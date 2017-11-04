import { isFun, isPromise, isChainable, isArray, ifElse, first, then, apply, always, chain, cond } from "./shared"

const

    invokeNext = ( item, result ) => {
        const
            itemIsFun = () => isFun( item ),
            call = fun => arg => ifElse( isArray )( apply( fun ) )( fun )( arg ),
            thenCall = fun => apply( then( call( fun ) ) )

        return ifElse( itemIsFun )(
            cond( [
                [apply( isPromise ), thenCall( item )],
                [apply( isChainable ), apply( chain( item ) )],
                [always, call( item )]
            ] )
        )( first )( result )
    }

export default invokeNext