import { unary, binary } from './checks'

type SecondArg<T> = T extends (arg1: any, arg2: infer U, ...args: any[]) => any ? U : any;

type UnaryExpectChecks<R> = {[ K in keyof typeof unary ] : R }
type BinaryExpectChecks<R> = {[ K in keyof typeof binary ] : ( a : SecondArg<( typeof binary )[K]> ) => R }

interface LazyExpect extends UnaryExpectChecks<LazyExpect>, BinaryExpectChecks<LazyExpect> {
    check( value : any ) : boolean
}

interface Expect extends UnaryExpectChecks<Expect>, BinaryExpectChecks<Expect> {
}

class Expect {
    constructor(
        private value : any
    ){}
}

class LazyExpect {
    constructor(
        public check : ( x : any ) => boolean
    ){}
}

export const is : Is = (( value : any ) => {
    return new Expect( value );
}) as any;

for( let name in unary ){
    Object.defineProperty( Expect.prototype, name, {
        get(){
            if( !unary[ name ]( this.value ) ) throw new Error();
            return this;
        }
    });

    Object.defineProperty( LazyExpect.prototype, name, {
        get(){
            const { prev } = this;
            return new LazyExpect( ( x : any ) => prev( x ) && unary[ name ]( x ) );
        }
    });

    Object.defineProperty( is, name, {
        get(){
            return new LazyExpect( ( x : any ) => unary[ name ]( x ) );
        }
    });
}

for( let name in binary ){
    Expect.prototype[ name ] = function( a ){
        if( !binary[ name ]( this.value, a ) ) throw new Error();
        return this;
    }

    LazyExpect.prototype[ name ] = function( a ){
        const { prev } = this;
        return new LazyExpect( ( x : any ) => prev( x ) && binary[ name ]( x, a ) )
    }

    is[ name ] = function( a : any ){
        return new LazyExpect( ( x : any ) => binary[ name ]( x, a ) );
    }
}

export interface Is extends LazyExpect {
    ( value : any ) : Expect
}
