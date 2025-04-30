import Head from 'next/head';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

import styled from 'styled-components';
import DisplayError from '../components/ErrorMessage';
import OrderItemStyles from '../components/styles/OrderItemStyles';

import formatMoney from '../lib/formatMoney';

const USER_ORDERS_QUERY = gql`
  query userOrders {
    allOrders {
      id
      total
      charge
      user {
        id
      }
      items {
        id
        name
        description
        price
        quantity
        photo {
          id
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`;

const OrderUl = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-gap: 4rem;
`;

function countItemsInOrder(order) {
  return order.items.reduce((tally, item) => tally + item.quantity, 0);
}

export default function OrdersPage() {
  const { data, loading, error } = useQuery(USER_ORDERS_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;

  const { allOrders } = data;

  return (
    <div>
      <Head>
        <title>Sick Fits | Your Orders</title>
      </Head>
      <h2>
        You Have {allOrders.length} Order{allOrders.length > 1 ? 's' : ''}!
      </h2>
      <OrderUl>
        {allOrders.map((order) => {
          const orderItemsCount = countItemsInOrder(order);
          return (
            <OrderItemStyles key={order.id}>
              <Link href={`/order/${order.id}`}>
                <a>
                  <div className="order-meta">
                    <p>
                      {orderItemsCount} Item{orderItemsCount > 1 ? 's' : ''}
                    </p>
                    <p>
                      {order.items.length} Product
                      {order.items.length > 1 ? 's' : ''}
                    </p>
                    <p>{formatMoney(order.total)}</p>
                  </div>
                  <div className="images">
                    {order.items.map((item) => (
                      <img
                        key={`item-image-${item.id}`}
                        src={item.photo.image.publicUrlTransformed}
                        alt={item.name}
                      />
                    ))}
                  </div>
                </a>
              </Link>
            </OrderItemStyles>
          );
        })}
      </OrderUl>
    </div>
  );
}
