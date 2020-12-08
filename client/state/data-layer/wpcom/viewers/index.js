/**
 * Internal dependencies
 */
import { registerHandlers } from 'calypso/state/data-layer/handler-registry';
import { dispatchRequest } from 'calypso/state/data-layer/wpcom-http/utils';
import { http } from 'calypso/state/data-layer/wpcom-http/actions';
import { VIEWERS_REQUEST } from 'calypso/state/action-types';
import { requestViewersFailure, requestViewersSuccess } from 'calypso/state/viewers/actions';

const fetchViewers = ( action ) => {
	const { siteId, query } = action;

	return [
		http(
			{
				method: 'GET',
				path: `/sites/${ siteId }/viewers`,
				apiVersion: '1.1',
				query,
			},
			action
		),
	];
};
const fetchViewersSuccess = ( { siteId, query }, data ) => {
	return [ requestViewersSuccess( siteId, query, data ) ];
};
const fetchViewersFailure = ( { siteId, query }, error ) => [
	requestViewersFailure( siteId, query, error ),
];

registerHandlers( 'state/data-layer/wpcom/viewers/index.js', {
	[ VIEWERS_REQUEST ]: [
		dispatchRequest( {
			fetch: fetchViewers,
			onSuccess: fetchViewersSuccess,
			onError: fetchViewersFailure,
		} ),
	],
} );
