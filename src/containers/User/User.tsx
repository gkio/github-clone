import React, { useCallback } from 'react';
import { useGithubApi } from '../../shared/hooks';
import { useHistory } from 'react-router-dom';
import { GITHUB_PATHS } from '../../shared/constants';
import { Profile, Repos } from './components';
import './styles.scss';

const User = () => {
  const history = useHistory();
  const {
    location: { pathname },
  } = history;
  const userName = pathname.replace('/', '');
  const [{ data: user, error }] = useGithubApi(GITHUB_PATHS.USER, {
    user: userName,
  });
  const [{ data: repos }] = useGithubApi(GITHUB_PATHS.REPOS, {
    user: userName,
  });

  const gotoRepo = useCallback(
    (repo: string) => {
      history.push(`/${userName}/${repo}`);
    },
    [userName, history]
  );

  const gotoHomePage = useCallback(() => {
    history.push('/');
  }, [history]);

  return (
    <div className="width-full d-flex flex-items-center flex-column mt-6">
      <button className="btn m-2" onClick={gotoHomePage}>
        Go To Home Page
      </button>
      {error && <div className="flash mt-3 flash-error">User: {error}</div>}
      {user && <Profile user={user} />}
      {repos && Boolean(repos.length) && (
        <>
          <h3 className="mt-5">Public Repos:</h3>
          <Repos repos={repos} gotoRepo={gotoRepo} />
        </>
      )}
    </div>
  );
};

export default User;
