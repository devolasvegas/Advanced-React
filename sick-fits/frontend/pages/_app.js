import nProgress from 'nprogress';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { ApolloProvider } from '@apollo/client';

import Page from '../components/Page';

import withData from '../lib/withData';

import '../components/styles/nprogress.css';
import { CartStateProvider } from '../lib/cartState';

// Listen to route changes and start nProgress (our progress bar)
Router.events.on('routeChangeStart', () => {
  nProgress.start();
});
Router.events.on('routeChangeComplete', () => {
  nProgress.done();
});
Router.events.on('routeChangeError', () => {
  nProgress.done();
});

function MyApp({ Component, pageProps, apollo }) {
  console.log('NODE_ENV:', process.env.NODE_ENV);

  return (
    <ApolloProvider client={apollo}>
      <CartStateProvider>
        <Page>
          {/* eslint-disable-next-line */}
          <Component {...pageProps} />
        </Page>
      </CartStateProvider>
    </ApolloProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
  apollo: PropTypes.object.isRequired,
};

MyApp.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  // This exposes the query to the user
  pageProps.query = ctx.query;
  return { pageProps };
};

export default withData(MyApp);
