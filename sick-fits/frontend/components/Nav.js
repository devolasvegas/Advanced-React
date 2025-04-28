import Link from 'next/link';

import SignOut from './SignOut';
import CartCount from './CartCount';

import { useUser } from './User';
import { useCart } from '../lib/cartState';

import NavStyles from './styles/NavStyles';

export default function Nav() {
  const user = useUser();
  const { openCart } = useCart();

  const count = user?.cart.reduce(
    (tally, cartItem) => tally + (cartItem.product ? cartItem.quantity : 0),
    0
  );

  return (
    <NavStyles>
      <Link href="/products">Products</Link>
      {user && (
        <>
          <Link href="/sell">Sell</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/account">Account</Link>
          <SignOut />
          <button type="button" onClick={openCart}>
            My Cart
            <CartCount count={count} />
          </button>
        </>
      )}
      {!user && <Link href="/signin">Sign In</Link>}
    </NavStyles>
  );
}
