import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // Tell Apollow we will be handling caching manually
    read(existing = [], { args, cache }) {
      const { skip, first } = args;

      // Read the number of items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count || 0;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // Check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);

      // If
      // There are items
      // AND there arent enough items to satisfy how many were requestes
      // AND we are on the last page
      // THEN JUST SEND IT
      // if (items.length && items.length !== first && page === pages) {
      //   return items;
      // }

      // if (items.length !== first) {
      //   return false; // We don't have any items, so we need to go to the network to fetch them
      // }

      // If there are items, we return the items we have, and we don't have to go to the network
      if (items.length) {
        return items;
      }

      // Fallback to network
      return false;
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      const merged = existing ? existing.slice(0) : [];

      for (let i = skip; i < skip + incoming.length; i += 1) {
        merged[i] = incoming[i - skip];
      }

      // return merged array
      return merged;
    },
  };
}
