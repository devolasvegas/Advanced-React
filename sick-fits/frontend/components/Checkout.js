import { useState, useCallback } from 'react';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import styled from 'styled-components';
import nProgress from 'nprogress';

import SickButton from './styles/SickButton';

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function CheckoutForm() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  // Using useCallback to memoize the function
  // and prevent unnecessary re-renders
  const handleSubmit = useCallback(
    async (e) => {
      // 1. Stop the form from submitting and turn the loader on
      e.preventDefault();

      setLoading(true);

      // 2. Start the page transition
      nProgress.start();

      // 3. Create the payment method via Stripe (token returned here if successful)
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      // 4. Handle any errors from Stripe
      if (error) {
        setError(error);
        setLoading(false);
        nProgress.done();
      }
      // 5. Send the token to Keystone server (via a GraphQL mutation)
      // 6. Change the page to view the order
      // 7. Close the cart
      // 8. Turn the loader off
      setLoading(false);
      nProgress.done();
    },
    [stripe, elements]
  );

  return (
    <CheckoutFormStyles onSubmit={handleSubmit}>
      {error && (
        <p style={{ fontSize: '1.5rem', color: 'red' }}>{error.message}</p>
      )}
      <CardElement />
      <SickButton type="submit">Check Out Now</SickButton>
    </CheckoutFormStyles>
  );
}

function Checkout() {
  return (
    <Elements stripe={stripeLib}>
      <CheckoutForm />
    </Elements>
  );
}

export { Checkout };
