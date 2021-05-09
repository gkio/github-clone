import React from 'react';
import {
  EyeIcon,
  GitForkIcon,
  RepoIcon,
  StarIcon,
} from '@primer/octicons-react';

interface IRepo {
  id: number;
  name: string;
  forks_count: number;
  watchers_count: number;
  stargazers_count: number;
}

interface IReposProps {
  repos: IRepo[];
  gotoRepo: Function;
}

const Repos = ({ repos, gotoRepo }: IReposProps) => {
  return (
    <div className="d-flex flex-column repos">
      <ul className="Box Box--overlay overflow-scroll m-3 p-1">
        {repos.map((repo: any) => (
          <li
            onClick={() => gotoRepo(repo.name)}
            className="d-flex flex-justify-between border p-2 m-2 cur-pointer"
            key={repo.id}
          >
            <div className="d-flex flex-items-center">
              <RepoIcon />
              <span className="ml-2">{repo.name}</span>
            </div>
            <div className="d-flex flex-items-center">
              <div className="m-2 color-text-link">
                <GitForkIcon />
                <span className="ml-1">{repo.forks_count}</span>
              </div>
              <div className="mr-2 color-text-success ">
                <StarIcon />
                <span className="ml-1">{repo.stargazers_count}</span>
              </div>
              <div className="mr-2 color-text-warning">
                <EyeIcon />
                <span className="ml-1">{repo.watchers_count}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Repos;
