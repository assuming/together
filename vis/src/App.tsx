import React, { Component } from 'react';
import styled from 'styled-components';
import { HashRouter, Route } from 'react-router-dom';

import CommitTimeline from './graph/CommitTimeline';

const router = (
  <HashRouter>
    <Route path="/" exact component={CommitTimeline} />
  </HashRouter>
);

class App extends Component {
  render() {
    return <div id="app">{router}</div>;
  }
}

export default App;
