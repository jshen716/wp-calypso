/**
 * Internal dependencies
 */
import {
	VIEWERS_REQUEST,
	VIEWERS_REQUEST_SUCCESS,
	VIEWERS_REQUEST_FAILURE,
	REMOVE_VIEWER,
	REMOVE_VIEWER_SUCCESS,
	REMOVE_VIEWER_FAILURE,
} from 'calypso/state/action-types';

import 'calypso/state/data-layer/wpcom/viewers';
import 'calypso/state/viewers/init';

export const requestViewers = ( siteId, query ) => ( {
	type: VIEWERS_REQUEST,
	siteId,
	query,
} );

export const requestViewersSuccess = ( siteId, query, data ) => ( {
	type: VIEWERS_REQUEST_SUCCESS,
	siteId,
	query,
	data,
} );

export const requestViewersFailure = ( siteId, query, error ) => ( {
	type: VIEWERS_REQUEST_FAILURE,
	siteId,
	query,
	error,
} );

export const removeViewer = ( siteId, viewerId ) => ( {
	type: REMOVE_VIEWER,
	siteId,
	viewerId,
} );

export const removeViewerSuccess = ( siteId, viewerId, data ) => ( {
	type: REMOVE_VIEWER_SUCCESS,
	siteId,
	viewerId,
	data,
} );

export const removeViewerFailure = ( siteId, viewerId, error ) => ( {
	type: REMOVE_VIEWER_FAILURE,
	siteId,
	viewerId,
	error,
} );
