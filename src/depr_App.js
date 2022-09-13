import React from 'react';
import { Switch, Route } from 'react-router';
import { Link, Router } from "react-router-dom";
import Nav from './nav';
import Page1 from './page1';
import Page2 from './page2';
import Page3 from './page3';

export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Router>
          ABC
          <div>
            <Nav />
            <Switch>
              <Route exactly component={Page1} pattern="/path1" />
              <Route exactly component={Page2} pattern="/path2" />
              <Route exactly component={Page3} pattern="/path3" />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}
