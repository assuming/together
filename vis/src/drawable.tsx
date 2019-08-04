import React, { Component } from 'react';
import * as d3 from 'd3';

export interface GraphFunctionParams {
  drawableArea: d3.Selection<SVGElement, unknown, HTMLElement, any>;
  WIDTH: number;
  HEIGHT: number;
  width: number;
  height: number;
}
export type GraphFunctionType = (options: GraphFunctionParams) => any;

interface DrawableOptions {
  backgroundColor?: string;
  padding?: number;
}
const defaultOptions: DrawableOptions = {
  backgroundColor: 'black',
  padding: 50
};

export default function drawable(
  graphFunction: GraphFunctionType,
  options: DrawableOptions
) {
  return class extends Component {
    options: DrawableOptions = {
      ...defaultOptions,
      ...options
    };

    componentDidMount() {
      const canvas = d3.select('#drawable-svg-canvas');
      const WIDTH = parseInt(canvas.style('width'));
      const HEIGHT = parseInt(canvas.style('height'));
      const width = WIDTH - 2 * this.options.padding;
      const height = HEIGHT - 2 * this.options.padding;

      // create a drawable area inside the canvas for paddings (axes)
      const drawableArea = canvas
        .append('g')
        .attr(
          'transform',
          `translate(${this.options.padding}, ${this.options.padding})`
        );

      graphFunction({ drawableArea, WIDTH, HEIGHT, width, height });
    }

    render() {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: this.options.backgroundColor
          }}
        >
          <svg id="drawable-svg-canvas" width="100%" height="100%" />
        </div>
      );
    }
  };
}
