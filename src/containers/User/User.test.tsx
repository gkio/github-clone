import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import User from './User';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const apiUserResponse = {
  avatar_url: String(),
  login: 'login name',
  name: String(),
  bio: String(),
  followers: Number(),
  following: Number(),
  public_repos: Number(),
};

const apiReposResponse = Array.from({ length: 5 }).fill({
  id: Number(),
  name: String(),
  forks_count: Number(),
  watchers_count: Number(),
  stargazers_count: Number(),
});

const server = setupServer(
  rest.get('https://api.github.com/users/user', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(apiUserResponse));
  }),
  rest.get('https://api.github.com/users/user/repos', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(apiReposResponse));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

const location = {
  pathname: '/user',
  search: '',
  hash: '',
  state: null,
  key: '5nvxpbdafa',
};

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn().mockReturnValue(location),
  useHistory: () => ({
    location,
    push: jest.fn(),
  }),
}));

test('renders back to Home btn', async () => {
  render(<User />);
  const button = await screen.getByText('Go To Home Page');
  expect(button).toBeInTheDocument();
});

test('renders User', async () => {
  render(<User />);
  const avatar = await screen.findByRole('img');
  expect(avatar).toBeInTheDocument();

  const userName = await screen.findByText('@login name');
  expect(userName).toBeInTheDocument();

  expect(screen.queryByText(/User :/g)).not.toBeInTheDocument();
});

test('renders repos', async () => {
  render(<User />);
  const ul = await screen.findByRole('list');
  expect(ul).toBeInTheDocument();

  const li = await screen.findAllByRole('listitem');
  expect(li).toHaveLength(5);
});

test('renders error', async () => {
  server.use(
    rest.get('https://api.github.com/users/user', (req, res, ctx) => {
      return res(ctx.status(404), ctx.json({ message: 'Not Found' }));
    })
  );
  render(<User />);
  expect(await screen.queryByRole('img')).not.toBeInTheDocument();
  expect(await screen.queryByText('@login name')).not.toBeInTheDocument();

  expect(await screen.findByText('User: Not Found')).toBeInTheDocument();
});
