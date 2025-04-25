/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';

import { OrderCreateInput } from '../.keystone/schema-types';

import stripeConfig from '../lib/stripe';

const graphql = String.raw;

async function checkout(
  root: any,
  { token }: { token: string },
  context: KeystoneContext
): Promise<OrderCreateInput> {
  // 1. Query the current user and make sure they are signed in
  const userId = context.session.itemId;

  if (!userId) {
    throw new Error('You must be logged in to create an order!');
  }

  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: graphql`
    id
    name
    email
    cart {
      id
      quantity
      product {
        id
        name
        price
        description
        photo {
          id
          image {
            id
            publicUrlTransformed
          }
        }
      }
    }
    `,
  });

  // 2. calc total price for their order
  const cartItems = user.cart.filter((cartItem) => cartItem.product);

  // Setting cartItem type to any to avoid TS errors caused by Keystone missing genterated types
  const amount = cartItems.reduce(function (tally: number, cartItem: any) {
    return tally + cartItem.quantity * cartItem.product.price;
  }, 0);

  console.log('Total amount: ', amount);

  // 3. create the charge with the stripe library
  const charge = await stripeConfig.paymentIntents
    .create({
      amount,
      currency: 'USD',
      confirm: true,
      payment_method: token,
    })
    .catch((err) => {
      console.log('Error creating charge: ', err);
      throw new Error(err.message);
    });

  console.log('Charge: ', charge);

  // 4. convert the cart items to order items
  // 5. create the order and return it
}

export default checkout;
