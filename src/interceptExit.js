import { nil } from "./symbols"

const interceptExit = ( pipeInterceptors, funOrValue, args, result ) => typeof pipeInterceptors == "undefined" ? nil :
    pipeInterceptors.reduce( ( previous, next ) => {
        if ( !next.hasOwnProperty( "exit" ) )
            return { funOrValue, args, result }

        if ( previous == nil )
            return next.exit( funOrValue, args, result )
        else {
            const { funOrValue, arg, result } = previous

            return next.exit( funOrValue, arg, result )
        }
    }, nil )

export default interceptExit