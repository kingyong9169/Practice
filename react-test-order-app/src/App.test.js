import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
  const lintTest = screen.getByRole('button', () => {
    'lintTest';
  });
  // eslint-disable-next-line jest/valid-expect
  expect(lintTest.textContent);
});
