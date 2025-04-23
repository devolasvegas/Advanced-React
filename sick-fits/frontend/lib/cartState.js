import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

function CartStateProvider({ children }) {
  // This is our own custom state provider. We will store data (state) and functionality (setters and getters) here and anyone can access it via the consumer!
  const [cartOpen, setCartOpen] = useState(false);

  function toggleCart() {
    setCartOpen((prev) => !prev);
  }
  function closeCart() {
    setCartOpen(false);
  }
  function openCart() {
    setCartOpen(true);
  }

  return (
    <LocalStateProvider
      value={{ cartOpen, setCartOpen, toggleCart, closeCart, openCart }}
    >
      {children}
    </LocalStateProvider>
  );
}

function useCart() {
  const all = useContext(LocalStateContext);
  return all;
}

export { CartStateProvider, useCart };

CartStateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
