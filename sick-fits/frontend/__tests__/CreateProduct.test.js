import { MockedProvider } from '@apollo/react-testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Router from 'next/router'; // We will MOCK THIS
import wait from 'waait';
import CreateProduct, {
  CREATE_PRODUCT_MUTATION,
} from '../components/CreateProduct';
import { fakeItem } from '../lib/testUtils';
import { ALL_PRODUCTS_QUERY } from '../components/Products';

const item = fakeItem();

jest.mock('next/router', () => ({ push: jest.fn() }));

describe('<CreateProduct/>', () => {
  it('renders and matches snapshot', () => {
    const { container } = render(
      <MockedProvider>
        <CreateProduct />
      </MockedProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('handles the updating', () => {
    // 1. render the form out
    render(
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

    // 3.  check that those boxes are populated!
    expect(screen.getByDisplayValue(item.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(item.price)).toBeInTheDocument();
    expect(screen.getByDisplayValue(item.description)).toBeInTheDocument();
  });

  it('creates the items when the form is submitted', async () => {
    // New mocks for this one
    const createItemMocks = [
      {
        request: {
          query: CREATE_PRODUCT_MUTATION,
          variables: {
            name: item.name,
            description: item.description,
            image: '',
            price: item.price,
          },
        },
        result: {
          data: {
            createProduct: {
              ...item,
              id: 'abc123',
              __typename: 'Item',
            },
          },
        },
      },
      {
        request: {
          query: ALL_PRODUCTS_QUERY,
          variables: { skip: 0, first: 2 },
        },
        result: {
          data: {
            allProducts: [item],
          },
        },
      },
    ];

    // 1. render the form out
    render(
      <MockedProvider mocks={createItemMocks}>
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

    // Submit the form and see if the page change has been called
    userEvent.click(screen.getByText(/Add Product/i));

    await waitFor(() => wait(0));

    expect(Router.push).toHaveBeenCalled();
  });
});
