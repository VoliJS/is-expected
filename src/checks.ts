export const unary = {
    number : ( x : any ) => typeof x === 'number',
    integer : ( x : any ) => typeof x === 'number' && ( x | 0 ) === x,
    boolean : ( x : any ) => typeof x === 'boolean',
    string : ( x : any ) => typeof x === 'string',
    'undefined' : ( x : any ) => typeof x === 'undefined',
    'function' : ( x : any ) => typeof x === 'function',
    symbol : ( x : any ) => typeof x === 'symbol',
    object : ( x : any ) => typeof x === 'object',
    array : ( x : any ) => Array.isArray( x ),
    plainObject : ( x : any ) => x && Object.getPrototypeOf( x ) === Object.prototype,
    empty : ( x : any ) => x == null,
    falsy : ( x : any ) => !x,
    truthy : ( x : any ) => Boolean( x )
}

export const binary = {
    eq : ( x : any, a : any ) => x === a,
    le : ( x, a ) => x <= a,
    ge : ( x, a ) => x >= a,
    lt : ( x, a ) => x < a,
    gt : ( x, a ) => x > a,
    instanceOf : ( x, C : Function ) => x == null || x instanceof C,
    stringLike : ( x : string, a : RegExp ) => unary.string( x ) && a.test( x ),
    arrayOf : ( x : any[] , predicate : ( x : any, ix? : number ) => boolean ) => unary.array( x ) && x.every( predicate ),

    // RENAME:
    arrayHaving : ( x : any[] , predicate : ( x : any, ix? : number ) => boolean ) => unary.array( x ) && x.some( predicate ),
    
    // RENAME:
    arrayWithPairs : ( arr : any[], predicate : ( prev : any, next : any ) => boolean ) => {
        if( !unary.array( arr ) ) return false;
        
        for( let i = 1; i < arr.length; i++ ){
            if( !predicate( arr[ i - 1 ], arr[ i ] ) ) return false;
        }
    
        return true;
    },

    //
    oneOf: ( x : any, elements : any[] ) => {
        for( let el of elements ){
            if( typeof el === 'function' ){
                if( el( x ) ) return true;
            }
            else if( el === x ) return true;
        }

        return false;
    },

    objectOf : ( x : object , predicate : ( x : any, key? : string ) => boolean ) => {
        if( !unary.object( x ) ) return false;

        for( let key of Object.keys( x ) ){
            if( !predicate( x[ key ], key ) ) return false;
        }

        return true;
    },
    objectLike : hasShape
}

export const combinators = {
    either( x : any, predicates : ( ( x : any ) => boolean )[] ){
        for( let p of predicates ){
            if( !p( x ) ) return true;
        }

        false;
    }
}

export type ObjectPropChecker = ( x : any, key? : string ) => any
export interface ObjectShape {
    _? : ObjectPropChecker
    [ propName : string ] : ObjectPropChecker | any
}

// Check if object has the given shape. shape is a key-value haash with checkers.
export function hasShape( obj : object, shape : ObjectShape ) : boolean {
    if( typeof obj !== 'object' || !obj ) return false;

    // Check strict conditions
    for( let key in shape ){
        if( key === '_' ) continue;

        const shapeEl = shape[ key ],
            objEl = obj[ key ];

        if( typeof shapeEl === 'function' ){
            if( !shapeEl.call( obj, objEl ) ) return false;
        }
        else if( shapeEl !== objEl ) return false;    
    }    

    // Check _ pattern skipping other shape elements.
    const _ = shape[ '_' ];
    if( _ ){
        for( let key in obj ){
            if( obj.hasOwnProperty( key ) && !shape[ key ] ){
                if( _ && !_.call( obj, obj[ key ] ) ) return false;
            }
        }        
    }

    return true;
}