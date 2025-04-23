import styled from 'styled-components';
import PropTypes from 'prop-types';

import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';

import { useUser } from './User';

import formatMoney from '../lib/formatMoney';
import calcTotalPrice from '../lib/calcTotalPrice';
import { useCart } from '../lib/cartState';

const CartItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid var(--lightGrey);
  display: grid;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 1rem;
  }
  h4,
  p {
    margin: 0;
  }
`;

function CartItem({ cartItem }) {
  const { product } = cartItem;

  return (
    <CartItemStyles>
      <img
        src={product.photo.image.publicUrlTransformed}
        alt={product.photo.altText ?? product.name ?? ''}
        width="100"
      />
      <div>
        <h3>{product.name}</h3>
        <p>
          {formatMoney(product.price * cartItem.quantity)} –{' '}
          <em>
            {cartItem.quantity} &times; {formatMoney(product.price)} each
          </em>
        </p>
      </div>
    </CartItemStyles>
  );
}

CartItem.propTypes = {
  cartItem: PropTypes.shape({
    id: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    product: PropTypes.shape({
      id: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      photo: PropTypes.shape({
        image: PropTypes.shape({
          publicUrlTransformed: PropTypes.string.isRequired,
        }).isRequired,
        altText: PropTypes.string,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default function Cart() {
  const me = useUser();
  const data = useCart();
  const { cartOpen, closeCart } = data;

  if (!me) return null;

  return (
    <CartStyles open={cartOpen}>
      <header>
        <Supreme>{me.name}'s Cart</Supreme>
        <CloseButton type="button" onClick={closeCart} title="Close Cart">
          &times;
        </CloseButton>
      </header>
      <ul>
        {me.cart.map((cartItem) => (
          <CartItem key={cartItem.id} cartItem={cartItem} />
        ))}
      </ul>
      <footer>
        <p>{formatMoney(calcTotalPrice(me.cart))}</p>
      </footer>
    </CartStyles>
  );
}
