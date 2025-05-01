import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';

import SingleProduct, {
  SINGLE_PRODUCT_QUERY,
} from '../components/SingleProduct';

import { fakeItem } from '../lib/testUtils';

const product = fakeItem();

const mocks = [
  {
    request: {
      query: SINGLE_PRODUCT_QUERY,
      variables: { id: 'abc123' },
    },
    result: {
      data: {
        Product: product,
      },
    },
  },
];

describe('<SingleProduct />', () => {
  it('renders with proper data', async () => {
    // We need some fake data
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <SingleProduct id="abc123" />
      </MockedProvider>
    );

    await screen.findByTestId('singleProduct');
    expect(container).toMatchSnapshot();
    // screen.debug();
    // screen.logTestingPlaygroundURL();
  });

  it('Displays error when an item is not found', async () => {
    const errorMocks = [
      {
        request: {
          query: SINGLE_PRODUCT_QUERY,
          variables: { id: 'abc123' },
        },
        result: {
          errors: [{ message: 'Item not found!' }],
        },
      },
    ];

    const { container, debug } = render(
      <MockedProvider mocks={errorMocks}>
        <SingleProduct id="abc123" />
      </MockedProvider>
    );

    await screen.findByTestId('graphql-error');

    expect(container).toHaveTextContent('Shoot!');
    expect(container).toHaveTextContent('Item not found!');
  });
});
