import React, { useCallback } from 'react';
import { useGithubApi } from '../../shared/hooks';
import { GITHUB_PATHS } from '../../shared/constants';
import { useHistory } from 'react-router-dom';
import { FileDirectoryIcon, FileIcon } from '@primer/octicons-react';
import './styles.scss';
import classnames from 'classnames';
import { File } from '../../shared/interfaces';

const FILE_TYPES = {
  DIR: 'dir',
};

const Repo = () => {
  const history = useHistory();
  const [
    ,
    userName,
    repoName,
    ...restFolders
  ] = history.location.pathname.split('/');

  const [{ data: files, error }] = useGithubApi(
    restFolders.length ? GITHUB_PATHS.REPO_FOLDER : GITHUB_PATHS.REPO,
    {
      user: userName,
      repo: repoName,
      ...(restFolders.length ? { src: restFolders.join('/') } : {}),
    }
  );

  const goBack = useCallback(() => {
    const {
      location: { pathname },
      push,
    } = history;

    push(pathname.split('/').slice(0, -1).join('/'));
  }, [history]);

  const goToDirectory = useCallback(
    (dir: string) => {
      history.push(`${history.location.pathname}/${dir}`);
    },
    [history]
  );

  return (
    <>
      <button className="btn m-2" onClick={goBack}>
        Go Back
      </button>
      {error && <div className="flash mt-3 flash-error">{error}</div>}
      {files && files.length && (
        <ul className="repo Box Box--overlay overflow-scroll m-3 p-1">
          {files
            .sort(({ type }: File) => (type === FILE_TYPES.DIR ? -1 : 1))
            .map((file: File) => (
              <li
                onClick={() =>
                  file.type === FILE_TYPES.DIR ? goToDirectory(file.name) : null
                }
                className={classnames('border m-1 p-1', {
                  'cur-pointer': file.type === FILE_TYPES.DIR,
                })}
                key={file.sha}
              >
                {file.type === FILE_TYPES.DIR ? (
                  <FileDirectoryIcon />
                ) : (
                  <FileIcon />
                )}
                <span className="ml-2">{file.name}</span>
              </li>
            ))}
        </ul>
      )}
    </>
  );
};

export default Repo;
