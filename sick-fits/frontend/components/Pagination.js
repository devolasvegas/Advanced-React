import Head from 'next/head';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

import DisplayError from './ErrorMessage';

import { perPage } from '../config';

import PaginationStyles from './styles/PaginationStyles';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    _allProductsMeta {
      count
    }
  }
`;

export default function Pagination({ page }) {
  const { data, loading, error } = useQuery(PAGINATION_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;

  const { count } = data?._allProductsMeta || { count: 0 };
  const pageCount = Math.ceil(count / perPage);

  return (
    <PaginationStyles>
      <Head>
        <title>
          Sick Fits | Page {page} of {pageCount}
        </title>
      </Head>
      <Link href={`/products/${page - 1}`}>
        <a aria-disabled={page <= 1}>← Prev</a>
      </Link>
      <p>
        Page {page} of {pageCount}
      </p>
      <p>{count} Items Total</p>
      <Link href={`/products/${page + 1}`}>
        <a aria-disabled={page >= pageCount}>Next →</a>
      </Link>
    </PaginationStyles>
  );
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
};
