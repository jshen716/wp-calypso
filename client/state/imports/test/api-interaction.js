/**
 * External dependencies
 */
import nock from 'nock';
import { createStore, combineReducers, applyMiddleware } from 'redux'; // eslint-disable-line no-restricted-imports
import thunk from 'redux-thunk';

/**
 * Internal dependencies
 */
import imports from 'calypso/state/imports/reducer';
import { fetchState } from 'calypso/state/imports/actions';
import { isImporterStatusHydrated } from 'calypso/state/imports/selectors';

const testSiteId = 'en.blog.wordpress.com';

const queuePayload = ( payload ) =>
	nock( 'https://public-api.wordpress.com:443' )
		.get( `/rest/v1.1/sites/${ testSiteId }/imports/` )
		.replyWithFile( 200, `${ __dirname }/api-payloads/${ payload }.json`, {
			'Content-Type': 'application/json',
		} );

const createReduxStore = () => {
	return createStore( combineReducers( { imports } ), applyMiddleware( thunk ) );
};

describe( 'Importer store', () => {
	describe( 'API integration', () => {
		test( 'should hydrate if the API returns a blank body', async () => {
			const store = createReduxStore();
			expect( isImporterStatusHydrated( store.getState() ) ).toBe( false );
			queuePayload( 'no-imports' );
			await store.dispatch( fetchState( testSiteId ) );
			expect( isImporterStatusHydrated( store.getState() ) ).toBe( true );
		} );

		test( 'should hydrate if the API returns a defunct importer', async () => {
			const store = createReduxStore();
			expect( isImporterStatusHydrated( store.getState() ) ).toBe( false );
			queuePayload( 'defunct-importer' );
			await store.dispatch( fetchState( testSiteId ) );
			expect( isImporterStatusHydrated( store.getState() ) ).toBe( true );
		} );
	} );
} );
