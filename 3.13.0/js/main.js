/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

const MARGIN = {
    LEFT:100,
    RIGHT:10,
    TOP:25,
    BOTTOM: 100
}

const WIDTH = 600-MARGIN.LEFT-MARGIN.RIGHT;
const HEIGHT = 400-MARGIN.TOP-MARGIN.BOTTOM;

let flag = true;

const svg = d3.select('#chart-area')
.append('svg')
.attr('width',WIDTH+MARGIN.LEFT+MARGIN.RIGHT)
.attr('height',HEIGHT+MARGIN.TOP+MARGIN.BOTTOM)

const g = svg.append('g')
.attr('transform',`translate(${MARGIN.LEFT},${MARGIN.TOP})`)



const getData = async() => {
    const response = await d3.csv('data/revenues.csv');
    const data = response.map(r => ({...r,revenue:Number(r.revenue),profit:Number(r.profit)}));
    return data;
}

const data = getData();
data.then(data=>{

    const xAxisGroup = g.append('g')
        .attr('class','x axis')
        .attr('transform',`translate(0,${HEIGHT})`)

    const yAxisGroup = g.append('g')
        .attr('class','y axis')

    // adding labels
    g.append('text')
    .attr('class','x axis label')
    .attr('x',WIDTH/2)
    .attr('y',HEIGHT+50)
    .attr('text-anchor','middle')
    .text('Month')

    const yAxisLabel = 
    g.append('text')
    .attr('class','y axis label')


    d3.interval(()=>{
        update(data)
        flag = !flag;
    },1000)

    const update = (data) => {

        const value = flag ? 'profit' : 'revenue'

        const x = d3.scaleBand()
        .domain(data.map(d => d.month))
        .range([0,WIDTH])
        .paddingInner(0.2)
        .paddingOuter(0.2)
    
    const y = d3.scaleLinear()
    .domain([0,d3.max(data,d => d[value])])
    .range([HEIGHT,0])

    // adding scales
    const xAxisCall = d3.axisBottom(x)

    xAxisGroup
    .call(xAxisCall)
    .selectAll('text')
    .attr('text-anchor','middle')

    const yAxisCall = d3.axisLeft(y)
    .tickFormat(d => '$'+d)

    yAxisGroup
    .call(yAxisCall)

    yAxisLabel
    .attr('transform','rotate(-90)')
    .attr('x',-(HEIGHT/2))
    .attr('y',-60)
    .attr('text-anchor','middle')
    .text(value)


    //JOIN new data with old elements
    const rects = g.selectAll('rect').data(data);

    //exit old elements which are not present in new data
    rects.exit().remove()

    //update old elements present in new data
    rects
    .attr('x',(d)=>x(d.month))
    .attr('y',d=>y(d[value]))
    .attr('width',x.bandwidth)
    .attr('height',d => HEIGHT - y(d[value]))

    //enter new elements present in new data
    rects.enter().append('rect')
    .attr('x',(d)=>x(d.month))
    .attr('y',d=>y(d[value]))
    .attr('width',x.bandwidth)
    .attr('height',d => HEIGHT - y(d[value]))
    .attr('fill',d => d[value] <= 20000 ? 'grey' : 'orangered')
    // .attr('fill','grey')

    // rects.enter().append('text')
    // .attr('x',d => x(d.month)+8)
    // .attr('y',d => y(d.revenue)-5)
    // .attr('fill','steelblue')
    // .attr('font-size','14px')
    // .attr('text-anchor','start')
    // .text(d => d.revenue)

    }
    update(data)

})

