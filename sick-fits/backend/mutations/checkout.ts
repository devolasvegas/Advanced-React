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

  // 4. convert the cart items to order items
  const orderItems = cartItems.map((cartItem) => {
    const orderItem = {
      name: cartItem.product.name,
      description: cartItem.product.description,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      photo: { connect: { id: cartItem.product.photo.id } },
    };

    return orderItem;
  });

  // 5. create the order
  const order = await context.lists.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems },
      user: { connect: { id: userId } },
    },
  });

  // 6. clean up any old cart items
  const cartItemIds = cartItems.map((cartItem) => cartItem.id);
  await context.lists.CartItem.deleteMany({
    ids: cartItemIds,
  });

  // 7. return the order to the client
  return order;
}

export default checkout;
