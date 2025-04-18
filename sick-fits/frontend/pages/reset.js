import PropTypes from 'prop-types';
import RequestReset from '../components/RequestReset';
import Reset from '../components/Reset';

export default function ResetPage({ query }) {
  const { token } = query;

  if (!token) {
    return <RequestReset />;
  }

  return (
    <div>
      <Reset token={token} />
    </div>
  );
}

ResetPage.propTypes = {
  query: PropTypes.shape({
    token: PropTypes.string,
  }),
};
