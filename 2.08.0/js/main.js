/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.8 - Activity: Your first visualization!
*/

const svg = d3.select('#chart-area')
.append("svg").attr('width',500).attr('height',500)


d3.json('data/buildings.json')
.then(data => {
    data.forEach(d => {
        d.height = Number(d.height)
    })
const xNames = data.map(d => d.name)
const x = d3.scaleBand()
.domain(xNames)
.range([0,500])
.paddingInner(0.2)
.paddingOuter(0.2)

const y = d3.scaleLinear()
.domain([0,887])
.range([0,500])

const bars = svg
.selectAll('rect')
.data(data)

bars.enter().append('rect')
.attr('x',(d)=> x(d.name))
.attr('y',0)
.attr('width',x.bandwidth)
.attr('height',d=>y(d.height))
.attr('fill','grey')
})


