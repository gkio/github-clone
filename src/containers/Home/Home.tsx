import React, { useEffect, useState } from 'react';
import { useGithubApi, useDebounce } from '../../shared/hooks';
import { useHistory } from 'react-router-dom';
import { Logo } from '../../shared/components';
import { GITHUB_ROUTES } from '../../shared/constants';
import { LogoGithubIcon } from '@primer/octicons-react';

const Home = () => {
  const history = useHistory();
  const [users, getUsers] = useGithubApi(GITHUB_ROUTES.USER_QUERY);
  const [value, setValue] = useState<string>('');
  const searchQuery = useDebounce<string>(value, 500);
  const onInputChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setValue(value);
  };

  useEffect(() => {
    if (searchQuery) {
      getUsers({
        query: searchQuery,
        page: 1,
        per_page: 10,
      });
    }
  }, [searchQuery, getUsers]);

  const goToUser = (user: string) => {
    history.push(user);
  };

  return (
    <>
      <Logo height={100} classNames="m-4" />
      <div className="mb-4">
        <LogoGithubIcon />
      </div>
      <div className="position-relative">
        <input
          onChange={onInputChange}
          className="form-control input-block"
          type="text"
          aria-label="Search by user"
          placeholder="Search by user"
        />
        {value && users.data && (
          <ul className="autocomplete-results">
            {users.data.items.map((user: any) => (
              <li
                key={user.login}
                onClick={() => goToUser(user.login)}
                className="autocomplete-item"
              >
                <img
                  src={user.avatar_url}
                  width="20"
                  className="avatar mr-1"
                  alt="user avatar"
                />
                <span className="text-normal">@{user.login}</span>
              </li>
            ))}
          </ul>
        )}
        {users.data && users.data.items && users.data.items.length === 0 && (
            <div className="text-center m-2">No match found</div>
        )}
      </div>
    </>
  );
};

export default Home;
