import { useState, useCallback } from 'react';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
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

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    checkout(token: $token) {
      id
      charge
      total
      items {
        id
        name
      }
    }
  }
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function CheckoutForm() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const [checkout, { error: graphQlError }] = useMutation(
    CREATE_ORDER_MUTATION
  );

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

      console.log('Payment Method:', paymentMethod);

      // 4. Handle any errors from Stripe
      if (error) {
        setError(error);
        setLoading(false);
        nProgress.done();
        return;
      }
      // 5. Send the token to Keystone server (via a GraphQL mutation)
      const order = await checkout({
        variables: {
          token: paymentMethod.id,
        },
      });

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
      {graphQlError && (
        <p style={{ fontSize: '1.5rem', color: 'red' }}>
          {graphQlError.message}
        </p>
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
