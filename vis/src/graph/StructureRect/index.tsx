import React, { Component } from 'react';
import * as d3 from 'd3';
import { getContributorColor } from '../../utils/colors';
import './index.less';

const structureData: any[] = require('../../../../database/structure.json');
const fileData = structureData[340];
const commitRecord: any[] = fileData.commitRecord;
const contributorInfo: any[] = fileData.contributorInfo;

export default class StructureRect extends Component {
  padding: number = 40;
  // canvas real size
  WIDTH: number = 0;
  HEIGHT: number = 0;
  // canvas drawable size
  width: number = 0;
  height: number = 0;

  rectHeight: number = 20;

  componentDidMount() {
    const canvas = d3.select('#structure-rect');
    this.WIDTH = parseInt(canvas.style('width'));
    this.HEIGHT = parseInt(canvas.style('height'));
    this.width = this.WIDTH - 2 * this.padding;
    this.height = this.HEIGHT - 2 * this.padding;

    // create a drawable area inside the canvas for paddings (axes)
    const drawableArea = canvas
      .append('g')
      .attr('transform', `translate(${this.padding}, ${this.padding})`);
    const commitGraphArea = drawableArea.append('g');
    const fileRectGraphArea = drawableArea.append('g');
    const fileNameArea = drawableArea.append('g');

    // create the commit graph
    const commitTimeScale = d3
      .scaleTime()
      .domain([
        d3.min(commitRecord, d => d.time * 1000),
        d3.max(commitRecord, d => d.time * 1000)
      ])
      .range([0, this.width]);
    const commitAxis = d3
      .axisTop(commitTimeScale)
      .ticks(3)
      .tickSize(-18)
      .tickPadding(10)
      .tickSizeOuter(0);
    commitGraphArea
      .append('g')
      .attr('class', 'commit-graph-axis')
      .attr('transform', `translate(${0}, ${-10})`)
      .call(commitAxis);
    commitGraphArea
      .append('g')
      .selectAll('circle')
      .data(commitRecord as any[])
      .enter()
      .append('circle')
      .attr('cx', d => commitTimeScale(new Date(d.time * 1000)))
      .attr('cy', 0)
      .attr('r', 2)
      .attr('fill', 'white')
      .attr('fill-opacity', 0.1)
      .attr('stroke', 'white')
      .attr('stroke-width', 0.8);

    // create the file rect graph
    const fileRectScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([0, this.width]);
    fileRectGraphArea
      .append('g')
      .attr('transform', `translate(${0}, ${15})`)
      .selectAll('rect')
      .data(contributorInfo)
      .enter()
      .append('rect')
      .attr('x', (d, i) => {
        let x = 0;
        contributorInfo.forEach((item, index) => {
          if (index < i) {
            x += item.percent;
          }
        });
        return fileRectScale(x);
      })
      .attr('y', 0)
      .attr('width', d => fileRectScale(d.percent))
      .attr('height', this.rectHeight)
      .attr('fill', d => getContributorColor(d.author).color)
      .attr('fill-opacity', d => getContributorColor(d.author).opacity);
    // .attr('stroke-width', 0.8);

    const locScale = d3
      .scaleLinear()
      .clamp(true)
      .domain([0, 1000])
      .range([0, this.width]);
    fileRectGraphArea
      .append('g')
      .attr('transform', `translate(${0}, ${25 + this.rectHeight})`)
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', locScale(fileData.loc))
      .attr('height', 6)
      .attr('fill', '#fff')
      .attr('fill-opacity', 1);

    fileRectGraphArea
      .append('g')
      .attr('transform', `translate(${0}, ${25 + this.rectHeight})`)
      .append('text')
      .attr('class', 'loc-text')
      .attr('x', locScale(fileData.loc) + 5)
      .attr('y', 6)
      .text(`${fileData.loc} lines`);

    fileNameArea
      .append('g')
      .attr('transform', `translate(${0}, ${65 + this.rectHeight})`)
      .append('text')
      .attr('class', 'filename-text')
      .attr('x', 0)
      .attr('y', 0)
      .text(`${fileData.name}`);
    fileNameArea
      .append('g')
      .attr('transform', `translate(${0}, ${78 + this.rectHeight})`)
      .append('text')
      .attr('class', 'filepath-text')
      .attr('x', 0)
      .attr('y', 0)
      .text(
        fileData.path
          .split('/')
          .slice(5)
          .join('/')
      );
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
        <svg id="structure-rect" width="100%" height="100%" />
      </div>
    );
  }
}
