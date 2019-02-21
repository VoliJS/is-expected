import { is } from './index'

describe( 'type asserts', ()=>{
    it( 'check boolean', () => {
        is( true ).boolean;
        expect( () => is( 1 ).boolean ).toThrow();
    });

    it( 'check string', () => {
        is( 's' ).string;
        expect( () => is( 1 ).string ).toThrow();
    });

    it( 'check number', () => {
        is( 1 ).number;
        expect( () => is( 'fe' ).number ).toThrow();
    });

    it( 'check undefined', () => {
        is( void 0 ).undefined;
        expect( () => is( null ).undefined ).toThrow();
    });

    it( 'check function', () => {
        is( () => void 0 ).function;
        expect( () => is( 'fe' ).function ).toThrow();
    });

    it( 'check array', () => {
        is( [] ).array;
        expect( () => is( null ).array ).toThrow();
    });

    it( 'check object', () => {
        is( {} ).object;
        expect( () => is( null ).object ).toThrow();
    });

    it( 'dsds', () =>{
        const res = [];

        is( res ).arrayHaving([ 1, 2, 3 ])
        is( res )
            .oneOf([
                is.empty,
                is.objectLike({ length : is.ge( 2 ).le( 6 ) })
                    .arrayWithPairs(
                        ( a, b ) => a <= b
                    ),
                
            ])
            
    });
})

