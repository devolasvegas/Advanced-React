import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';

import Product from '../components/Product';

import { fakeItem } from '../lib/testUtils';

const product = fakeItem();

describe('<Product />', () => {
  it('renders out the price tag and title', () => {
    const { debug, container } = render(
      <MockedProvider>
        <Product product={product} />
      </MockedProvider>
    );
    const priceTag = screen.getByText('$50');
    expect(priceTag).toBeInTheDocument();
    const link = container.querySelector('a');
    // debug(link);
    expect(link).toHaveAttribute('href', `/product/${product.id}`);
    expect(link).toHaveTextContent(product.name);
  });

  it('Renders and matches the snapsot', () => {
    const { debug, container } = render(
      <MockedProvider>
        <Product product={product} />
      </MockedProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it('Renders the image properly', () => {
    const { debug, container } = render(
      <MockedProvider>
        <Product product={product} />
      </MockedProvider>
    );
    // Querying the image by the alt text
    const image = screen.getByAltText(product.name);
    expect(image).toBeInTheDocument();
  });
});
