/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.5 - Activity: Adding SVGs to the screen
*/

const svg = d3.select('#chart-area').append('svg')
.attr('width',500).attr('height',400);

svg.append('rect')
.attr('x',10)
.attr('y',20)
.attr('width',200)
.attr('height',50)
.attr('fill',"blue")

svg.append('circle')
.attr('cx',90).attr('cy',125).attr('r',50).attr("fill",'blue')

svg.append('ellipse')
.attr('cx',90).attr('cy',210).attr('rx',15).attr('ry',25).attr('fill','orange')

svg.append('line')
.attr('x1',10)
.attr('y1',270)
.attr('x2',300)
.attr('y2',300)
.attr('stroke','orange')
.attr('stroke-width',1)
