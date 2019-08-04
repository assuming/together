import * as d3 from 'd3';
import moment from 'moment-timezone';
import { GraphFunctionParams } from '../../drawable';
import './index.less';
import { getContributorColor } from '../../utils/colors';

let commitData: Array<{
  id: string;
  time: number;
  author: string;
  message: string;
}> = require('../../../../database/commit-record.json');
commitData = commitData.filter(d => ['say25'].includes(d.author));

export default function drawCloud({
  drawableArea,
  width,
  height
}: GraphFunctionParams) {
  const innerR = 20;
  const outterR = 160;
  const dateIndicatorR = 170;

  const graphArea = drawableArea
    .append('g')
    .attr('class', 'cloud-graph-area')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

  const dateScale = d3
    .scaleTime()
    .domain([
      new Date(d3.min(commitData.map(d => d.time * 1000))),
      new Date(d3.max(commitData.map(d => d.time * 1000)))
    ])
    .range([0, 2 * Math.PI]);

  const hourScale = d3
    .scaleLinear()
    .domain([0, 24])
    .range([innerR, outterR]);

  function drawHourIndicator(hour: number, isDashed: boolean = true) {
    const element = graphArea
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', hourScale(hour))
      .attr('fill', 'transparent')
      .attr('stroke', 'rgba(255,255,255,0.25)')
      .attr('stroke-width', 1);

    if (isDashed) {
      element.attr('stroke-dasharray', '1 5');
    }
  }
  [0, 24].forEach(hour => drawHourIndicator(hour));

  const dataIndicatorCount = 5;
  graphArea
    .selectAll('line')
    .data(dateScale.ticks(dataIndicatorCount))
    .enter()
    .append('line')
    .attr('x1', d => getX(dateScale(d.getTime()), outterR))
    .attr('y1', d => getY(dateScale(d.getTime()), outterR))
    .attr('x2', d => getX(dateScale(d.getTime()), dateIndicatorR))
    .attr('y2', d => getY(dateScale(d.getTime()), dateIndicatorR))
    .attr('stroke', 'rgba(255,255,255,0.2)')
    .attr('stroke-dasharray', '1')
    .attr('stroke-width', 0.5);
  graphArea
    .append('g')
    .selectAll('def')
    .data(dateScale.ticks(dataIndicatorCount))
    .enter()
    .append('def')
    .append('path')
    .attr('id', d => d.getTime())
    .attr('d', d => {
      const path = d3.path();
      path.moveTo(
        getX(dateScale(d.getTime()), dateIndicatorR),
        getY(dateScale(d.getTime()), dateIndicatorR)
      );
      path.lineTo(
        getX(dateScale(d.getTime()), dateIndicatorR + 100),
        getY(dateScale(d.getTime()), dateIndicatorR + 100)
      );
      return path.toString();
    });
  graphArea
    .selectAll('text')
    .data(dateScale.ticks(dataIndicatorCount))
    .enter()
    .append('text')
    .append('textPath')
    .attr('xlink:href', d => `#${d.getTime()}`)
    .attr('text-anchor', 'start')
    .attr('startOffset', 5)
    .attr('fill', 'rgba(255,255,255,0.2)')
    .attr('font-size', 7)
    .attr('alignment-baseline', 'middle')
    .text(d => moment(d.getTime()).format('YY-MM'));

  graphArea
    .selectAll('circle')
    .data(commitData)
    .enter()
    .append('circle')
    .attr('cx', d =>
      getX(
        dateScale(d.time * 1000),
        hourScale(getHour(d.time) + getSecond(d.time) / 60)
      )
    )
    .attr('cy', d =>
      getY(
        dateScale(d.time * 1000),
        hourScale(getHour(d.time) + getSecond(d.time) / 60)
      )
    )
    .attr('r', 1.8)
    .attr('fill', d => getContributorColor(d.author).color)
    .attr('fill', d => 'white')
    .attr('fill-opacity', 0.6);
}

const TIMEZONE = 'America/Los_Angeles';
// const TIMEZONE = 'Asia/Chongqing'
function getHour(unixTimestamp: number): number {
  return moment(unixTimestamp * 1000)
    .tz(TIMEZONE)
    .hour();
}
function getSecond(unixTimestamp: number): number {
  return moment(unixTimestamp * 1000)
    .tz(TIMEZONE)
    .second();
}

function getX(phi: number, r: number) {
  return r * Math.sin(phi);
}
function getY(phi: number, r: number) {
  return -r * Math.cos(phi);
}
