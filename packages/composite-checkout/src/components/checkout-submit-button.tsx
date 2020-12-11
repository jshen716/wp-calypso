/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import joinClasses from '../lib/join-classes';
import { usePaymentMethod, useCreatePaymentProcessorOnClick } from '../public-api';

export default function CheckoutSubmitButton( {
	className,
	disabled,
}: {
	className?: string;
	disabled?: boolean;
} ): JSX.Element | null {
	const onClick = useCreatePaymentProcessorOnClick();

	const paymentMethod = usePaymentMethod();
	if ( ! paymentMethod ) {
		return null;
	}
	const { submitButton } = paymentMethod;
	if ( ! submitButton ) {
		return null;
	}

	// We clone the element to add props
	const clonedSubmitButton = React.cloneElement( submitButton, { disabled, onClick } );
	return (
		<div className={ joinClasses( [ className, 'checkout-submit-button' ] ) }>
			{ clonedSubmitButton }
		</div>
	);
}
