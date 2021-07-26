/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.8 - Activity: Your first visualization!
*/

const svg = d3.select('#chart-area')
.append("svg").attr('width',500).attr('height',500)


d3.json('data/buildings.json')
.then(data => {
    let gap = 10;
    data.forEach(d => {
        d.height = Number(d.height)
    })
const y = d3.scaleLinear()
.domain([0,887])
.range([0,500])

const bars = svg
.selectAll('rect')
.data(data)

bars.enter().append('rect')
.attr('x',(d,i)=> (i*60))
.attr('y',0)
.attr('width',40)
.attr('height',(d,i)=>y(d.height))
.attr('fill','grey')
})


