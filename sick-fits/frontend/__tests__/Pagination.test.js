import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';

import Pagination from '../components/Pagination';

import { makePaginationMocksFor } from '../lib/testUtils';

describe('<Pagination />', () => {
  it('displays a loading message', () => {
    const { container } = render(
      <MockedProvider mocks={makePaginationMocksFor(1)}>
        <Pagination page={1} />
      </MockedProvider>
    );

    expect(container).toHaveTextContent('Loading...');
  });
  it('renders pagination for 18 items', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={makePaginationMocksFor(18)}>
        <Pagination page={1} />
      </MockedProvider>
    );

    await screen.findByTestId('pagination');

    const pageCountSpan = screen.getByTestId('page-count');

    // Page count based on 18 items at 4 per page
    expect(container).toHaveTextContent('Page 1 of 5');
    expect(pageCountSpan).toHaveTextContent('5');
    expect(container).toMatchSnapshot();
  });

  it('disables the prev page button on the first page', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={makePaginationMocksFor(18)}>
        <Pagination page={1} />
      </MockedProvider>
    );

    await screen.findByTestId('pagination');

    const prevButton = screen.getByText(/Prev/);
    const nextButton = screen.getByText(/Next/);

    expect(prevButton).toHaveAttribute('aria-disabled', 'true');
    expect(nextButton).toHaveAttribute('aria-disabled', 'false');
  });
  it('disables the next page button on the last page', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={makePaginationMocksFor(18)}>
        <Pagination page={5} />
      </MockedProvider>
    );

    await screen.findByTestId('pagination');

    const prevButton = screen.getByText(/Prev/);
    const nextButton = screen.getByText(/Next/);

    expect(prevButton).toHaveAttribute('aria-disabled', 'false');
    expect(nextButton).toHaveAttribute('aria-disabled', 'true');
  });
  it('enables both buttons on the inner pages', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={makePaginationMocksFor(18)}>
        <Pagination page={3} />
      </MockedProvider>
    );

    await screen.findByTestId('pagination');

    const prevButton = screen.getByText(/Prev/);
    const nextButton = screen.getByText(/Next/);

    expect(prevButton).toHaveAttribute('aria-disabled', 'false');
    expect(nextButton).toHaveAttribute('aria-disabled', 'false');
  });
});
