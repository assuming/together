import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import './index.less';

let commitData: any[] = require('../../../database/project-commit-record.json');
commitData = commitData.reverse();

export default class CommitTimeline extends Component {
  WIDTH = 800;
  HEIGHT = 500;
  margin = 40;
  width = this.WIDTH - 2 * this.margin;
  height = this.HEIGHT - 2 * this.margin;

  timelineGraphHeight = 200;

  componentDidMount() {
    const canvas = d3.select('#commit-timeline');
    const container = canvas
      .append('g')
      .attr('transform', `translate(${this.margin}, ${this.margin})`);
    const timelineGraph = container
      .append('g')
      .attr('transform', `translate(0, ${this.timelineGraphHeight})`);

    const startTimestamp = commitData[0].time;
    const endTimestamp = commitData[commitData.length - 1].time;

    const timeScale = d3
      .scaleTime()
      .domain([new Date(startTimestamp * 1000), new Date(endTimestamp * 1000)])
      .range([0, this.width]);

    const xAxis = d3
      .axisBottom(timeScale)
      .ticks(d3.timeYear)
      .tickSize(4)
      .tickSizeOuter(0);

    container
      .append('g')
      .attr('transform', `translate(0, 200)`)
      .attr('class', 'h-axis')
      .call(xAxis);

    // d3.select('#commit-timeline')
    //   .selectAll('div')
    //   .data(this.data)
    //   .enter()
    //   .append('div')
    //   .style('background-color', 'red')
    //   .style('width', d => this.getX(d) + 'px')
    //   .text(d => d);
  }

  handleClick = () => {
    // const bars = d3
    //   .select('#commit-timeline')
    //   .selectAll('div')
    //   .data(this.dataNew);
    // bars
    //   .enter()
    //   .append('div')
    //   .merge(bars as any)
    //   .transition()
    //   .duration(500)
    //   .style('background-color', 'red')
    //   .style('width', d => this.getX(d) + 'px')
    //   .text(d => d);
  };

  render() {
    return (
      <Fragment>
        <div style={{ backgroundColor: 'black' }}>
          <svg id="commit-timeline" width={this.WIDTH} height={this.HEIGHT} />
        </div>
      </Fragment>
    );
  }
}
