import React, { Component } from 'react';
import { HashRouter, Route } from 'react-router-dom';

import CommitTimeline from './graph/CommitTimeline';
import CommitPerUser from './graph/CommitPerUser';
import StructureRing from './graph/StructureRing';

const router = (
  <HashRouter>
    <Route path="/" exact component={CommitTimeline} />
    <Route path="/per-user" exact component={CommitPerUser} />
    <Route path="/structure-ring" exact component={StructureRing} />
  </HashRouter>
);

class App extends Component {
  render() {
    return <div id="app">{router}</div>;
  }
}

export default App;
