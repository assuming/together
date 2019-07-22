import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import moment from 'moment';
import { getContributorColor } from '../../utils/colors';
import './index.less';

let commitData: any[] = require('../../../../database-secure/project-commit-record.json');

export default class CommitTimeline extends Component {
  padding: number = 50;
  // canvas real size
  WIDTH: number = 0;
  HEIGHT: number = 0;
  // canvas drawable size
  width: number = 0;
  height: number = 0;

  componentDidMount() {
    const canvas = d3.select('#commit-timeline');
    this.WIDTH = parseInt(canvas.style('width'));
    this.HEIGHT = parseInt(canvas.style('height'));
    this.width = this.WIDTH - 2 * this.padding;
    this.height = this.HEIGHT - 2 * this.padding;

    // create a drawable area inside the canvas for paddings (axes)
    const drawableArea = canvas
      .append('g')
      .attr('transform', `translate(${this.padding}, ${this.padding})`);
    // also create a several areas holding the content
    const timeAxisArea = drawableArea
      .append('g')
      .attr('class', 'axis time-axis')
      .attr('transform', `translate(${-5}, ${0})`);
    const dateAxisArea = drawableArea
      .append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(${0}, ${this.height})`);
    const graphArea = drawableArea.append('g').attr('class', 'graph-area');

    // create the axis
    const timeScale = d3
      .scaleTime()
      .domain([
        new Date(d3.min(commitData.map(d => d.time * 1000))),
        new Date(d3.max(commitData.map(d => d.time * 1000)))
      ])
      .range([0, this.width]);
    const dateAxis = d3
      .axisBottom(timeScale)
      .ticks(d3.timeMonth)
      .tickSize(3)
      .tickSizeOuter(0);
    dateAxisArea.call(dateAxis);

    const hourScale = d3
      .scaleLinear()
      .domain([24, 0])
      .range([0, this.height]);
    const timeAxis = d3
      .axisLeft(hourScale)
      .ticks(6)
      .tickSize(-this.width)
      .tickSizeOuter(0);
    timeAxisArea.call(timeAxis);

    // create the graph
    const commitIndicatorLength = 3;
    const commitIndicatorHeight = 3;
    graphArea
      .selectAll('rect')
      .data(commitData)
      .enter()
      .append('rect')
      .attr('x', d => timeScale(d.time * 1000) - commitIndicatorLength / 2)
      .attr('y', d =>
        hourScale(
          moment(d.time * 1000).hour() + moment(d.time * 1000).second() / 60
        )
      )
      .attr('width', commitIndicatorLength)
      .attr('height', commitIndicatorHeight)
      .attr('rx', 1.5)
      .attr('fill', d => getContributorColor(d.author).color)
      .attr('fill-opacity', d => getContributorColor(d.author).opacity);
  }

  render() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'black'
        }}
      >
        <svg id="commit-timeline" width="100%" height="100%" />
      </div>
    );
  }
}
