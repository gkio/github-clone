import React, { useCallback, useMemo } from 'react';
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

  const repoFiles = useMemo(
    () =>
      (files || []).sort(({ type }: File) =>
        type === FILE_TYPES.DIR ? -1 : 1
      ),
    [files]
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

  const isDirectory = (type: string) => type === FILE_TYPES.DIR;

  return (
    <>
      <button className="btn m-2" onClick={goBack}>
        Go Back
      </button>
      {error && <div className="flash mt-3 flash-error">{error}</div>}
      {repoFiles && repoFiles.length && (
        <ul className="repo Box Box--overlay overflow-scroll m-3 p-1">
          {repoFiles.map((file: File) => (
            <li
              onClick={() =>
                isDirectory(file.type) ? goToDirectory(file.name) : null
              }
              className={classnames('border m-1 p-1', {
                'cur-pointer': isDirectory(file.type),
              })}
              key={file.name}
            >
              {isDirectory(file.type) ? <FileDirectoryIcon className="color-icon-info" /> : <FileIcon />}
              <span className="ml-2">{file.name}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Repo;
