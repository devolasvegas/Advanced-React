import Router from 'next/router';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';

import CreateProduct, {
  CREATE_PRODUCT_MUTATION,
} from '../components/CreateProduct';
import { ALL_PRODUCTS_QUERY } from '../components/Products';

import { fakeItem, makePaginationMocksFor } from '../lib/testUtils';

const item = fakeItem();

describe('<CreateProduct />', () => {
  it('renders and matches snapshot', () => {
    const { container } = render(
      <MockedProvider>
        <CreateProduct />
      </MockedProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it('handles the updating', async () => {
    // 1. render the form out
    const { container, debug } = render(
      <MockedProvider>
        <CreateProduct />
      </MockedProvider>
    );

    // 2. type into the boxes
    userEvent.type(screen.getByPlaceholderText(/Name/i), item.name);
    userEvent.type(
      screen.getByPlaceholderText(/Price/i),
      item.price.toString()
    );
    userEvent.type(
      screen.getByPlaceholderText(/Description/i),
      item.description
    );

    const priceInput = await screen.findByDisplayValue(item.price.toString());

    debug(priceInput);

    // 3.  check that those boxes are populated!
    // expect(screen.getByDisplayValue(item.name)).toBeInTheDocument();
    // expect(screen.getByDisplayValue(item.price)).toBeInTheDocument();
    // expect(screen.getByDisplayValue(item.description)).toBeInTheDocument();
  });
});
