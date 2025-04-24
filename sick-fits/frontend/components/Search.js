/* eslint-disable react/jsx-props-no-spreading */
import { useRouter } from 'next/router';
import { useLazyQuery } from '@apollo/client';
import { resetIdCounter, useCombobox } from 'downshift';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';

import { useMemo } from 'react';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_PRODUCTS_QUERY = gql`
  query searchProducts($searchTerm: String!) {
    searchResults: allProducts(
      where: {
        OR: [
          { name_contains_i: $searchTerm }
          { description_contains_i: $searchTerm }
        ]
      }
    ) {
      id
      name
      photo {
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

export default function Search() {
  // Avoid SSR props mismatch

  const router = useRouter();

  // Our Apollo query to searcy the products
  const [findItems, { loading, data, error }] = useLazyQuery(
    SEARCH_PRODUCTS_QUERY,
    {
      fetchPolicy: 'no-cache',
    }
  );

  const items = data?.searchResults || [];

  // useMemo to memoize the debounced function, otherwise it will be recreated on every render
  const findItemsButChill = useMemo(
    () => debounce(findItems, 350),
    [findItems]
  );
  resetIdCounter();

  // Our Downshift combobox setup
  const {
    isOpen,
    inputValue,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
    highlightedIndex,
  } = useCombobox({
    items,
    onInputValueChange() {
      findItemsButChill({
        variables: {
          searchTerm: inputValue,
        },
      });
    },
    onSelectedItemChange({ selectedItem }) {
      // Route to the item page
      router.push({
        pathname: `/product/[id]`,
        query: { id: selectedItem.id },
      });
    },
    itemToString: (item) => item?.name || '',
  });

  return (
    <SearchStyles>
      <div {...getComboboxProps()}>
        <input
          {...getInputProps({
            type: 'search',
            placeholder: 'Search for an item',
            id: 'search',
            className: loading ? 'loading' : '',
          })}
        />
      </div>
      <DropDown {...getMenuProps()}>
        {isOpen &&
          items.map((item, index) => (
            <DropDownItem
              {...getItemProps({ item, index })}
              key={item.id}
              highlighted={index === highlightedIndex}
            >
              <img
                src={item.photo.image.publicUrlTransformed}
                alt={item.name}
                width="50"
              />
              {item.name}
            </DropDownItem>
          ))}
        {/* {isOpen && !items.length && !loading && (
          <DropDownItem>
            Sorry, no items found for <strong>{inputValue}</strong>
          </DropDownItem>
        )} */}
      </DropDown>
    </SearchStyles>
  );
}
