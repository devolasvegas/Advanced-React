import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';

import Nav from '../components/Nav';

import { CartStateProvider } from '../lib/cartState';
import { fakeUser, fakeCartItem } from '../lib/testUtils';

import { CURRENT_USER_QUERY } from '../components/User';

const notSignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { authenticatedItem: null } },
  },
];
const signedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { authenticatedItem: fakeUser() } },
  },
];
const signedInMocksWithCartItems = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        authenticatedItem: fakeUser({
          cart: [fakeCartItem()],
        }),
      },
    },
  },
];

describe('<Nav />', () => {
  it('renders a minimal nav when signed out', () => {
    const { container } = render(
      <CartStateProvider>
        <MockedProvider mocks={notSignedInMocks}>
          <Nav />
        </MockedProvider>
      </CartStateProvider>
    );

    expect(container).toHaveTextContent('Sign In');
    expect(container).toMatchSnapshot();

    // Sign In Link
    const link = screen.getByText('Sign In');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/signin');

    // Products Link
    const productsLink = screen.getByText('Products');
    expect(productsLink).toBeInTheDocument();
    expect(productsLink).toHaveAttribute('href', '/products');
  });

  it('renders a full nav when signed in', async () => {
    const { container } = render(
      <CartStateProvider>
        <MockedProvider mocks={signedInMocks}>
          <Nav />
        </MockedProvider>
      </CartStateProvider>
    );

    await screen.findByText('Account');

    expect(container).toMatchSnapshot();
    expect(container).toHaveTextContent('Sign Out');
    expect(container).toHaveTextContent('My Cart');
  });

  it('renders the amount of items in the cart', async () => {
    render(
      <CartStateProvider>
        <MockedProvider mocks={signedInMocksWithCartItems}>
          <Nav />
        </MockedProvider>
      </CartStateProvider>
    );

    await screen.findByText('Account');

    // Our mocked cart has three items, so let's look for it.
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
