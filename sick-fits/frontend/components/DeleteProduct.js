import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const DELETE_PRODUCT_MUTATION = gql`
  mutation DELETE_PRODUCT_MUTATION($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`;

export default function DeleteProduct({ id, children }) {
  const [deleteProduct, { loading }] = useMutation(DELETE_PRODUCT_MUTATION, {
    variables: { id },
  });

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => {
        if (window.confirm('Are you sure you want to delete this item?')) {
          // Call the delete function with the id
          // deleteProduct(id);
          console.log(`Deleting product with id: ${id}`);
          deleteProduct().catch((err) => {
            alert(err.message);
          });
        }
      }}
    >
      {children}
    </button>
  );
}
