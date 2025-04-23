/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput } from '../.keystone/schema-types';
import { Session } from '../types';
import { resolveConfig } from 'prettier';

async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  console.log('Adding to Cart!');
  // 1. Query the current user
  const sesh = context.session as Session;

  if (!sesh.itemId) {
    throw new Error('You must be logged in to do this!');
  }
  const userId = sesh.itemId;
  // 2. Query the current user's cart
  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: userId }, product: { id: productId } },
    resolveFields: ['quantity', 'id'],
  });
  const [existingCartItem] = allCartItems;

  // 3. Check if the product is already in their cart
  if (existingCartItem) {
    console.log(
      `There ${existingCartItem.quantity > 1 ? 'are' : 'is'} already ${
        existingCartItem.quantity
      } of this item in the cart. Increment by 1!`
    );
    // 4. If it is, increment by 1

    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: {
        quantity: existingCartItem.quantity + 1,
      },
    });
  }

  // 5. If it isn't, create a new cart item
  console.log('Item not already in cart. Creating a new cart item!');
  return await context.lists.CartItem.createOne({
    data: {
      user: { connect: { id: userId } },
      product: { connect: { id: productId } },
    },
  });
}

export default addToCart;
