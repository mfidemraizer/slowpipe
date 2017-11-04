import { nil } from "./symbols"

const interceptEnter = ( pipeInterceptors, funOrValue, args ) => typeof pipeInterceptors == "undefined" ? nil :
    pipeInterceptors.reduce( ( previous, next ) => {
        if ( !next.hasOwnProperty( "enter" ) )
            return { funOrValue, args }

        if ( previous == nil )
            return next.enter( funOrValue, args )
        else {
            const { funOrValue, args } = previous

            return next.enter( funOrValue, args )
        }
    }, nil )

export default interceptEnter