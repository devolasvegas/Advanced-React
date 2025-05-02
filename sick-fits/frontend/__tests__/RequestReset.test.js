import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';

import RequestReset, {
  REQUEST_RESET_MUTATION,
} from '../components/RequestReset';

import { fakeUser } from '../lib/testUtils';

const user = fakeUser();

const mocks = [
  {
    request: {
      query: REQUEST_RESET_MUTATION,
      variables: { email: user.email },
    },
    result: { data: { sendUserPasswordResetLink: null } },
  },
];

describe('<RequestReset />', () => {
  it('renders and matches snapshot', () => {
    const { container } = render(
      <MockedProvider>
        <RequestReset />
      </MockedProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it('calls the mutation when submitted', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <RequestReset />
      </MockedProvider>
    );

    // Type into the email input
    userEvent.type(screen.getByPlaceholderText(/email/i), user.email);

    // Submit the form
    userEvent.click(screen.getByText(/request reset/i));

    // Wait for success message
    const success = await screen.findByText(/success/i);
    expect(success).toBeInTheDocument();
  });
});
