export interface IGithubAPI {
  [key: string]: string;
}

export const GITHUB_PATHS: IGithubAPI = {
  USER: '/users/{user}',
  USER_QUERY: '/search/users?q={query}{&page,per_page}',
  REPOS: '/users/{user}/repos',
  REPO: '/repos/{user}/{repo}/contents',
  REPO_FOLDER: '/repos/{user}/{repo}/contents/{src}',
};

export const GITHUB_ROUTES: IGithubAPI = {
  USER: `GET ${GITHUB_PATHS.USER}`,
  USER_QUERY: `GET ${GITHUB_PATHS.USER_QUERY}`,
  REPOS: `GET ${GITHUB_PATHS.REPOS}`,
  REPO: `GET ${GITHUB_PATHS.REPO}`,
  REPO_FOLDER: `GET ${GITHUB_PATHS.REPO_FOLDER}`,
};
