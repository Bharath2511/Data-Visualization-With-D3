/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

const MARGIN = {
    LEFT:100,
    RIGHT:10,
    TOP:10,
    BOTTOM: 100
}

const WIDTH = 600-MARGIN.LEFT-MARGIN.RIGHT;
const HEIGHT = 400-MARGIN.TOP-MARGIN.BOTTOM;

const svg = d3.select('#chart-area')
.append('svg')
.attr('width',WIDTH+MARGIN.LEFT+MARGIN.RIGHT)
.attr('height',HEIGHT+MARGIN.TOP+MARGIN.BOTTOM)

const g = svg.append('g')
.attr('transform',`translate(${MARGIN.LEFT},${MARGIN.TOP})`)

const getData = async() => {
    const response = await d3.csv('data/revenues.csv');
    const data = response.map(r => ({...r,revenue:r.revenue}));
    return data;
}

const data = getData();
data.then(data=>{
    // adding x and y axis with bands
    const x = d3.scaleBand()
        .domain(data.map(d => d.month))
        .range([0,WIDTH])
        .paddingInner(0.2)
        .paddingOuter(0.2)
    
    const y = d3.scaleLinear()
    .domain([0,d3.max(data,d => d.revenue)])
    .range([HEIGHT,0])

    // adding scales
    const xAxisCall = d3.axisBottom(x)

    g.append('g')
    .attr('transform',`translate(0,${HEIGHT})`)
    .attr('class','x axis')
    .call(xAxisCall)
    .selectAll('text')
    .attr('text-anchor','middle')

    const yAxisCall = d3.axisLeft(y)
    .tickFormat(d => '$'+d)

    g.append('g')
    .attr('class','y axis')
    .call(yAxisCall)

    // adding labels
    g.append('text')
    .attr('class','x axis label')
    .attr('x',WIDTH/2)
    .attr('y',HEIGHT+50)
    .attr('text-anchor','middle')
    .text('Month')

    g.append('text')
    .attr('class','y axis label')
    .attr('transform','rotate(-90)')
    .attr('x',-(HEIGHT/2))
    .attr('y',-60)
    .attr('text-anchor','middle')
    .text('Revenue')

    const rects = g.selectAll('rect').data(data);

    rects.enter().append('rect')
    .attr('x',(d)=>x(d.month))
    .attr('y',d=>y(d.revenue))
    .attr('width',x.bandwidth)
    .attr('height',d => HEIGHT - y(d.revenue))
    .attr('fill',"grey")
})