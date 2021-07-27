/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.8 - Activity: Your first visualization!
*/

const MARGIN = {
    LEFT:100,RIGHT:10,TOP:10,BOTTOM:130
}
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM;



const svg = d3.select('#chart-area')
.append("svg")
.attr('width',WIDTH+MARGIN.LEFT+MARGIN.RIGHT)
.attr('height',HEIGHT+MARGIN.TOP+MARGIN.BOTTOM);


const g = svg.append('g')
.attr('transform',`translate(${MARGIN.LEFT},${MARGIN.TOP})`)

g.append('text')
.attr('class','y axis-label')
.attr('x',-(HEIGHT/2))
.attr('y',-60)
.attr('text-anchor','middle')
.attr('transform','rotate(-90)')
.text('Height (m)')

g.append('text')
.attr('class','x axis-label')
.attr('x',WIDTH/2)
.attr('y',HEIGHT+120)
.attr('text-anchor','middle')
.attr('font-size','20px')
.text("The world's tallest buildings")


d3.json('data/buildings.json')
.then(data => {
    data.forEach(d => {
        d.height = Number(d.height)
    })
const xNames = data.map(d => d.name)
const x = d3.scaleBand()
.domain(xNames)
.range([0,WIDTH])
.paddingInner(0.2)
.paddingOuter(0.2)

const y = d3.scaleLinear()
.domain([0,d3.max(data,d => d.height)])
// .domain(d3.extent(data,d=>d.height))
.range([HEIGHT,0])

const xAxisCall = d3.axisBottom(x)
g.append('g')
.attr('class','x axis')
.attr('transform',`translate(0,${HEIGHT})`)
.call(xAxisCall)
.selectAll('text')
.attr('text-anchor','end')
.attr('transform','rotate(-40)')
const yAxisCall = d3.axisLeft(y)
.tickFormat(d => d+"m")
g.append('g')
.attr("class",'y axis')
.call(yAxisCall)

const bars = g
.selectAll('rect')
.data(data)

bars.enter().append('rect')
.attr('x',(d)=> x(d.name))
.attr('y',d => y(d.height))
.attr('width',x.bandwidth)
.attr('height',d=>HEIGHT - y(d.height))
.attr('fill','grey')

})


