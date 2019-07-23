import React, { Component } from 'react';
import * as d3 from 'd3';
import moment from 'moment';
import { getContributorColor } from '../../utils/colors';
import './index.less';

// const usernameArray = ['马东升', 'madongsheng'];
// const usernameArray = ['刘彤阳', 'liutongyang'];
// const usernameArray = ['王明晓', 'ohmyxm'];
// const usernameArray = ['陈思宇', 'Siyu Chen'];
const usernameArray = ['陆爱松', 'luaisong'];
// const usernameArray = ['王贺', 'wanghe.ustc'];
// const usernameArray = ['李旸根本没有'];
// const usernameArray = ['majunchen'];
// const usernameArray = ['liyubei'];
// const usernameArray = ['程亦直', 'chengyizhi'];
let commitData: any[] = require('../../../../database-secure/project-commit-record.json');
commitData = commitData.filter(item => usernameArray.includes(item.author));
const commitTimeMap = {};
commitData.forEach(item => {
  const hour = moment(item.time * 1000).hour();
  if (commitTimeMap[hour]) {
    commitTimeMap[hour] += 1;
  } else {
    commitTimeMap[hour] = 1;
  }
});
const commitTimeArray = Object.keys(commitTimeMap).map(key => ({
  hour: key,
  count: commitTimeMap[key],
  author: usernameArray[0]
}));

export default class CommitPerUser extends Component {
  padding: number = 50;
  // canvas real size
  WIDTH: number = 0;
  HEIGHT: number = 0;
  // canvas drawable size
  width: number = 0;
  height: number = 0;

  componentDidMount() {
    const canvas = d3.select('#commit-per-user');
    this.WIDTH = parseInt(canvas.style('width'));
    this.HEIGHT = parseInt(canvas.style('height'));
    this.width = this.WIDTH - 2 * this.padding;
    this.height = this.HEIGHT - 2 * this.padding;

    // create a drawable area inside the canvas for paddings (axes)
    const drawableArea = canvas
      .append('g')
      .attr('transform', `translate(${this.padding}, ${this.padding})`);
    // also create a several areas holding the content
    const countAxisArea = drawableArea
      .append('g')
      .attr('class', 'axis count-axis')
      .attr('transform', `translate(${-5}, ${0})`);
    const timeAxisArea = drawableArea
      .append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(${0}, ${this.height})`);
    const graphArea = drawableArea.append('g').attr('class', 'graph-area');

    // create the axis
    const timeScale = d3
      .scaleLinear()
      .domain([0, 24])
      .range([0, this.width]);
    const timeAxis = d3
      .axisBottom(timeScale)
      .ticks(12)
      .tickSize(0)
      .tickPadding(15)
      .tickSizeOuter(0);
    timeAxisArea.call(timeAxis);

    const countScale = d3
      .scaleLinear()
      .domain([
        d3.max(commitTimeArray.map(d => d.count)),
        d3.min(commitTimeArray.map(d => d.count))
      ])
      .range([0, this.height]);
    const countAxis = d3
      .axisLeft(countScale)
      .ticks(2)
      .tickPadding(10)
      .tickSize(-this.width)
      .tickSizeOuter(0);
    countAxisArea.call(countAxis);

    // create the graph
    const size = 20;
    graphArea
      .selectAll('rect')
      .data(commitTimeArray)
      .enter()
      .append('rect')
      .attr('x', d => timeScale(parseInt(d.hour)) - size / 2)
      .attr('y', d => countScale(d.count))
      .attr('width', size)
      .attr('height', d => this.height - countScale(d.count))
      .attr('fill', d => getContributorColor(d.author).color)
      .attr('stroke', d => getContributorColor(d.author).color)
      .attr('stroke-width', 1.1)
      .attr('fill-opacity', 0.25);
  }

  render() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'white'
        }}
      >
        <svg id="commit-per-user" width="100%" height="100%" />
      </div>
    );
  }
}
