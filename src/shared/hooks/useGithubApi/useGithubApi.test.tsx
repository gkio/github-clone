import React from 'react';
import { render, screen } from '@testing-library/react';
import { useGithubApi } from './useGithubApi';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { GITHUB_PATHS } from '../../constants';

interface IComponentProps {
  type: string;
  payload: {
    [key: string]: string;
  };
}

const apiResponse = {
  login: 'github-its-for-jest',
};

const server = setupServer(
  rest.get('https://api.github.com/users/*', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(apiResponse));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
function Component({ type, payload }: IComponentProps) {
  const [response] = useGithubApi(type, payload);
  return (
    <div>
      <div>{response.data ? `data:${response.data.login}` : null}</div>
      <div>{response.error ? `error:${response.error}` : null}</div>
    </div>
  );
}

describe('useGithubApi', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should display user info', async () => {
    render(
      <Component
        type={GITHUB_PATHS.USER}
        payload={{ user: 'github-its-for-jest' }}
      />
    );
    await screen.findByText('data:github-its-for-jest');
  });

  it('should display error', async () => {
    server.use(
      rest.get('https://api.github.com/users/*', (req, res, ctx) => {
        return res(ctx.status(404), ctx.json({ message: 'Not Found' }));
      })
    );
    render(<Component type={GITHUB_PATHS.USER} payload={{ user: String() }} />);
    await screen.findByText('error:Not Found');
  });
});
