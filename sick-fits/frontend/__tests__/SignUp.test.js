import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';

import SignUp, { SIGN_UP_MUTATION } from '../components/SignUp';
import { CURRENT_USER_QUERY } from '../components/User';

import { fakeUser } from '../lib/testUtils';

const me = fakeUser();
const password = 'password';

const mocks = [
  // Mutation (new user) mock
  {
    request: {
      query: SIGN_UP_MUTATION,
      variables: {
        name: me.name,
        email: me.email,
        password,
      },
    },
    result: {
      data: {
        createUser: {
          __typename: 'User',
          id: 'abc123',
          email: me.email,
          name: me.name,
        },
      },
    },
  },
  // Current user mock
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { authenticatedItem: me } },
  },
];

describe('<Signup />', () => {
  it('renders and matches snapshot', () => {
    const { container } = render(
      <MockedProvider>
        <SignUp />
      </MockedProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it('calls the mutation properly', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <SignUp />
      </MockedProvider>
    );

    // Type into the boxes
    userEvent.type(screen.getByPlaceholderText(/name/i), me.name);
    userEvent.type(screen.getByPlaceholderText(/email/i), me.email);
    userEvent.type(screen.getByPlaceholderText(/password/i), password);

    // Submit the form
    userEvent.click(screen.getByText(/sign up !/i));

    // Check to make sure the component transitions to the signed up state
    await screen.findByText(/signed up with/i);
    debug();
  });
});
