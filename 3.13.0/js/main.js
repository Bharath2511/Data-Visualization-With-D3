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
        flag = !flag;
        const newData = flag ? data : data.slice(1)
        update(newData)
    },1000)

    const update = (data) => {

        const value = flag ? 'profit' : 'revenue'
        const t = d3.transition().duration(750)
        const labelT = d3.transition().duration(400)
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
    .transition(t)
    .call(xAxisCall)
    .selectAll('text')
    .attr('transform','rotate(-40)')
    .attr('y','15')
    .attr('x','-5')
    .attr('text-anchor','middle')

    const yAxisCall = d3.axisLeft(y)
    .tickFormat(d => '$'+d)

    yAxisGroup.transition(t)
    .call(yAxisCall)

    yAxisLabel
    .attr('x',-(HEIGHT/2))
    .attr('y',-60)
    .attr('text-anchor','middle')
    .text(value)
    .attr('transform','rotate(0)')
    .transition(labelT)
    .attr('transform','rotate(-90)')


    //JOIN new data with old elements
    const rects = g.selectAll('rect').data(data,d => d.month);

    //exit old elements which are not present in new data
    rects.exit()
    .attr('fill','red')
    .transition(t)
    .attr('height',0)
    .attr('y',y(0))
    .remove()

    //update old elements present in new data
    // rects.transition(t)
    // .attr('x',(d)=>x(d.month))
    // .attr('y',d=>y(d[value]))
    // .attr('width',x.bandwidth)
    // .attr('height',d => HEIGHT - y(d[value]))

    // //enter new elements present in new data
    // rects.enter().append('rect')
    // .attr('x',(d)=>x(d.month))
    // .attr('width',x.bandwidth)
    // .attr('fill','grey')
    // .attr('y',y(0)).
    // attr('height',0)
    // .transition(t)
    // .attr('y',d=>y(d[value]))
    // .attr('height',d => HEIGHT - y(d[value]))

    // .attr('fill','grey')

    rects.enter().append('rect')
    .attr('y',y(0))
    .attr('height',0)
    .attr('fill','grey')
    .merge(rects)
    .transition(t)
    .attr('x',(d)=>x(d.month))
    .attr('y',d=>y(d[value]))
    .attr('width',x.bandwidth)
    .attr('height',d => HEIGHT - y(d[value]))
    
    const texts = g.selectAll('.text').data(data,d => d.month)
    texts.exit()
    .attr('fill','red')
    // .transition(t)
    .remove()


    texts.enter().append('text')
    .attr('class','text')
    .attr('fill','steelblue')
    .attr('font-size','14px')
    .attr('text-anchor','start')
    .attr('x',d => x(d.month))
    .attr('y',y(0))
    .merge(texts)
    .transition(t)
    .attr('x',d => x(d.month)+8)
    .attr('y',d => y(d[value])-5)
    .text(d => d[value])
    }
    update(data)

})

