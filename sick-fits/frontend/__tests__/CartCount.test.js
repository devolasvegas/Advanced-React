import { render } from '@testing-library/react';
import wait from 'waait';

import CartCount from '../components/CartCount';

describe('<CartCount />', () => {
  it('Renders', () => {
    render(<CartCount count={10} />);
  });
  it('Matches snapshot', () => {
    const { container } = render(<CartCount count={11} />);
    expect(container).toMatchSnapshot();
  });
  it('updates via props', async () => {
    const { container, rerender } = render(<CartCount count={11} />);

    // Initial render with existing value
    expect(container.textContent).toBe('11');

    // Update the props
    rerender(<CartCount count={12} />);

    // Check the component transitions from one value to the next
    expect(container.textContent).toBe('1211');

    // Wait for transition to complete
    await wait(400);

    // Check for new value
    expect(container.textContent).toBe('12');
    expect(container).toMatchSnapshot();
  });
});
