/**
 * Internal dependencies
 */
import { isGSuiteOrExtraLicenseOrGoogleWorkspaceProductSlug } from 'calypso/lib/gsuite';
import { assertValidProduct } from 'calypso/lib/products-values/utils/assert-valid-product';
import { formatProduct } from 'calypso/lib/products-values/format-product';

export function isGoogleApps( product ) {
	product = formatProduct( product );
	assertValidProduct( product );

	return isGSuiteOrExtraLicenseOrGoogleWorkspaceProductSlug( product.product_slug );
}
