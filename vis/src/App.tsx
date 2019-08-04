import React, { Component } from 'react';
import { HashRouter, Route } from 'react-router-dom';
import drawable from './drawable';

// electron cloud
import drawCloud from './graph/Cloud';
const CloudGraph = drawable(drawCloud, {});

import StructureRect from './graph/StructureRect';

const router = (
  <HashRouter>
    <Route path="/cloud" exact component={CloudGraph} />
    <Route path="/structure-rect" exact component={StructureRect} />
  </HashRouter>
);

class App extends Component {
  render() {
    return <div id="app">{router}</div>;
  }
}

export default App;
