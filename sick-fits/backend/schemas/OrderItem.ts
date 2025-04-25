import { integer, relationship, text } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';

export const OrderItem = list({
  // access:
  fields: {
    name: text({ isRequired: true }),
    description: text({ ui: { displayMode: 'textarea' } }),
    photo: relationship({
      ref: 'ProductImage',
      ui: {
        displayMode: 'cards',
        cardFields: ['image', 'altText'],
        inlineCreate: { fields: ['image', 'altText'] },
        inlineEdit: { fields: ['image', 'altText'] },
        inlineConnect: true,
      },
    }),
    price: integer({ label: 'Price (in cents)' }),
    quantity: integer({ label: 'Quantity' }),
    order: relationship({
      ref: 'Order.items',
    }),
  },
});
