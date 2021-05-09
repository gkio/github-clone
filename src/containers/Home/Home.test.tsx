import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Home from './Home';
import { setupServer } from 'msw/node';
import { act } from 'react-dom/test-utils';
import { rest } from 'msw';
import { GITHUB_PATHS } from '../../shared/constants';

const apiResponse = {
  items: [
    {
      login: 'test 1',
      avatar_url: 'https://dumpurl.com',
    },
    {
      login: 'test 2',
      avatar_url: 'https://dumpurl.com',
    },
  ],
};

const server = setupServer(
  rest.get('https://api.github.com/search/users*', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(apiResponse));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders Github Logo and have height 100 px', () => {
  const { container } = render(<Home />);
  const githubLogo = container.querySelector('svg') as SVGElement;
  expect(githubLogo).toBeInTheDocument();
  expect(githubLogo).toHaveAttribute('height', '100');
});

test('renders search input', () => {
  render(<Home />);
  const searchInput = screen.getByPlaceholderText('Search by user');
  expect(searchInput).toBeInTheDocument();
});

test('should render users', async () => {
  jest.clearAllTimers();
  render(<Home />);
  const searchInput = screen.getByPlaceholderText(
    'Search by user'
  ) as HTMLInputElement;

  fireEvent.change(searchInput, { target: { value: 'test' } });
  expect(searchInput.value).toBe('test');

  const ul = await screen.findByRole('list');
  expect(ul).toBeInTheDocument();

  const li = await screen.findAllByRole('listitem');
  expect(li).toHaveLength(2);

  fireEvent.change(searchInput, { target: { value: '' } });
  const notExistingUl = screen.queryByRole('list');
  expect(notExistingUl).not.toBeInTheDocument();
});

test('should not render users', async () => {
  server.use(
    rest.get('https://api.github.com/search/users*', (req, res, ctx) => {
      return res(ctx.status(404), ctx.json({ message: 'Not Found' }));
    })
  );
  render(<Home />);
  const searchInput = screen.getByPlaceholderText(
    'Search by user'
  ) as HTMLInputElement;
  fireEvent.change(searchInput, { target: { value: 'test' } });
  const notExistingUl = screen.queryByRole('list');
  expect(notExistingUl).not.toBeInTheDocument();

  server.use(
    rest.get('https://api.github.com/search/users*', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ items: [] }));
    })
  );

  fireEvent.change(searchInput, { target: { value: 'test' } });
  const _notExistingUl = screen.queryByRole('list');
  expect(_notExistingUl).not.toBeInTheDocument();
});
