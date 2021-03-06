/**
 * External dependencies
 */

import { current as currentPage } from 'page';

/**
 * Internal dependencies
 */
import {
	addPlanToCart,
	createAccount,
	createSite,
	createWpForTeamsSite,
	createSiteOrDomain,
	createSiteWithCart,
	setThemeOnSite,
	addDomainToCart,
	launchSiteApi,
	isPlanFulfilled,
	isFreePlansDomainUpsellFulfilled,
	addDomainUpsellToCart,
	isDomainFulfilled,
	isSiteTypeFulfilled,
	isSiteTopicFulfilled,
	maybeRemoveStepForUserlessCheckout,
} from 'calypso/lib/signup/step-actions';
import { generateSteps } from './steps-pure';

export default generateSteps( {
	addPlanToCart,
	createAccount,
	createSite,
	createWpForTeamsSite,
	createSiteOrDomain,
	createSiteWithCart,
	currentPage,
	setThemeOnSite,
	addDomainToCart,
	launchSiteApi,
	isPlanFulfilled,
	isFreePlansDomainUpsellFulfilled,
	addDomainUpsellToCart,
	isDomainFulfilled,
	isSiteTypeFulfilled,
	isSiteTopicFulfilled,
	maybeRemoveStepForUserlessCheckout,
} );

export function isDomainStepSkippable( flowName ) {
	return flowName === 'test-fse';
}
