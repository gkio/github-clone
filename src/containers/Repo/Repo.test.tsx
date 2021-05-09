import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Repo from './Repo';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
const getRandomHash = () => Math.random().toString(36).substring(7);
const apiResponse = [
  {
    name: getRandomHash(),
    sha: getRandomHash(),
    type: 'dir',
  },
  {
    name: getRandomHash(),
    sha: getRandomHash(),
    type: 'dir',
  },
  {
    name: getRandomHash(),
    sha: getRandomHash(),
    type: 'dir',
  },
];

const server = setupServer(
  rest.get('https://api.github.com/repos/*', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(apiResponse));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

const location = {
  pathname: '/user/repo',
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
test('renders Back button', async () => {
  render(<Repo />);
  const backButton = await screen.getByText('Go Back');
  expect(backButton).toBeInTheDocument();
});

test('should render files', async () => {
  render(<Repo />);
  const ul = await screen.findByRole('list');
  expect(ul).toBeInTheDocument();
  const li = await screen.findAllByRole('listitem');
  expect(li).toHaveLength(3);
  expect(screen.queryByText('Not Found')).not.toBeInTheDocument();
});

test('should render not found', async () => {
  server.use(
    rest.get('https://api.github.com/repos/*', (req, res, ctx) => {
      return res(ctx.status(404), ctx.json({ message: 'Not Found' }));
    })
  );
  render(<Repo />);
  const errorFlash = await screen.findByText('Not Found');
  expect(errorFlash).toBeInTheDocument();
  expect(screen.queryByRole('list')).not.toBeInTheDocument();
});
