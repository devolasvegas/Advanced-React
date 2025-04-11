import nProgress from 'nprogress';
import Router from 'next/router';
import { ApolloProvider } from '@apollo/client';

import Page from '../components/Page';

import withData from '../lib/withData';

import '../components/styles/nprogress.css';

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
  return (
    <ApolloProvider client={apollo}>
      <Page>
        <Component {...pageProps} />
      </Page>
    </ApolloProvider>
  );
}

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
