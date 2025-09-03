import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app without crashing', () => {
  render(<App />);
  // App should render without errors
  expect(document.body).toBeInTheDocument();
});

test('shows loading state initially', () => {
  render(<App />);
  const loadingElement = screen.getByText(/Loading server data.../i);
  expect(loadingElement).toBeInTheDocument();
});
