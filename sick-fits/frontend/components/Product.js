import Link from 'next/link';
import PropTypes from 'prop-types';

import DeleteProduct from './DeleteProduct';
import AddToCart from './AddToCart';

import ItemStyles from './styles/ItemStyles';
import Title from './styles/Title';
import PriceTag from './styles/PriceTag';

import formatMoney from '../lib/formatMoney';

export default function Product({ product }) {
  return (
    <ItemStyles>
      <img
        src={product?.photo?.image?.publicUrlTransformed}
        alt={product.photo.altText}
      />
      <Title>
        <Link href={`/product/${product.id}`}>{product.name}</Link>
      </Title>
      <PriceTag>{formatMoney(product.price)}</PriceTag>
      <p>{product.description}</p>
      <div className="buttonList">
        <Link href={{ pathname: '/update', query: { id: product.id } }}>
          Edit ✏️
        </Link>
        <AddToCart id={product.id}>Add to Cart</AddToCart>
        <DeleteProduct id={product.id}>Delete this item</DeleteProduct>
      </div>
    </ItemStyles>
  );
}

Product.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    photo: PropTypes.shape({
      image: PropTypes.shape({
        publicUrlTransformed: PropTypes.string,
      }),
      altText: PropTypes.string,
    }),
  }).isRequired,
};
