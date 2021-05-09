import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ROUTE_PATHS } from '../../shared/constants';
import { Home } from '../Home';
import { Repo } from '../Repo';
import './styles.scss';
import { User } from '../User';

const App = () => {
  return (
    <div className="app-container d-flex flex-items-center flex-column">
      <Switch>
        <Route exact path={ROUTE_PATHS.HOME} component={Home} />
        <Route exact path={ROUTE_PATHS.USER} component={User} />
        <Route path={ROUTE_PATHS.REPO} component={Repo} />
      </Switch>
    </div>
  );
};

export default App;
