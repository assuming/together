import React, { Component } from 'react';
import { HashRouter, Route } from 'react-router-dom';

import CommitTimeline from './graph/CommitTimeline';
import CommitPerUser from './graph/CommitPerUser';
import StructureRect from './graph/StructureRect';

const router = (
  <HashRouter>
    <Route path="/" exact component={CommitTimeline} />
    <Route path="/per-user" exact component={CommitPerUser} />
    <Route path="/structure-rect" exact component={StructureRect} />
  </HashRouter>
);

class App extends Component {
  render() {
    return <div id="app">{router}</div>;
  }
}

export default App;
