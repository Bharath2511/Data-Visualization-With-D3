
const MARGIN = {
	LEFT:100,
	RIGHT:10,
	TOP:10,
	BOTTOM:100
}

const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM

const svg = d3.select('#chart-area')
.append('svg')
.attr('width',WIDTH+MARGIN.LEFT+MARGIN.RIGHT)
.attr('height',HEIGHT+MARGIN.TOP+MARGIN.BOTTOM)

const g = svg.append('g')
.attr('transform',`translate(${MARGIN.LEFT},${MARGIN.TOP})`)

let time = 0;

const tip = d3.tip()
.attr('class','d3-tip')
.html(d=> {
	let text = `<strong>Country:</strong> <span style='color:red;text-transform:capitalize'>${d.country}</span><br>`
	text+=`<strong>Continent:</strong> <span style='color:red;text-transform:capitalize'>${d.continent}</span><br>`
	text+=`<strong>Life Expectany:</strong> <span style='color:red'>${d3.format('.2f')(d.life_exp)}</span><br>`
	text+=`<strong>GDP Per Capita:</strong> <span style='color:red'>${d3.format('$,.0f')(d.income)}</span><br>`
	text+=`<strong>Population:</strong> <span style='color:red'>${d3.format(',.0f')(d.population)}</span><br>`
	return text
})
g.call(tip)

const x = d3.scaleLog()
.base(10)
.range([0,WIDTH])
.domain([142,150000])

const y = d3.scaleLinear()
.range([HEIGHT,0])
.domain([0,90])

const area = d3.scaleLinear()
.range([25*Math.PI,1500*Math.PI])
.domain([2000,1400000000])

const continentColor = d3.scaleOrdinal(d3.schemePastel1)

const lt = d3.transition().duration(500);


const xAxisCall = d3.axisBottom(x)
.tickValues([400,4000,40000])
.tickFormat(d3.format('$'))

g.append('g')
.attr('class','x axis')
.attr('transform',`translate(0,${HEIGHT})`)
.transition(lt)
.call(xAxisCall)


const yAxisCall = d3.axisLeft(y)

g.append('g')
.attr('class','y axis')
.transition(lt)
.call(yAxisCall)

const continents = ['europe','asia','americas','africa']

const legend = g.append('g')
.attr('transform',`translate(${WIDTH-10},${HEIGHT-125})`)

continents.map((continent,i)=>{
	const legendRow = legend.append('g')
	.attr('transform',`translate(0,${i*20})`)

	legendRow.append('rect')
	.attr('width',10)
	.attr('height',10)
	.attr('fill',continentColor(continent))

	legendRow.append('text')
	.attr('x',-10)
	.attr('y',10)
	.attr('text-anchor','end')
	.style('text-transform','capitalize')
	.attr('fill',continentColor(continent))
	.attr('font-weight','bold')
	.text(continent)
})

const xAxisLabel = g.append('text')
.attr('x',0)
.attr('y',HEIGHT+50)
.transition(lt)
.attr('x',WIDTH/2)
.attr('y',HEIGHT + 50)
.attr('text-anchor','middle')
.text("GDP Per Capita ($)")

const yAxisLabel = g.append('text')
.attr('x',-300)
.attr('y',-40)
.attr('transform','rotate(-90)')
.transition(lt)
.attr('x',-170)
.attr('y',-40)
.attr('text-anchor','middle')
.text('Life Expectency(Years)')

const year = g.append('text')
.attr('transform',`translate(${WIDTH-22},${HEIGHT-10})`)
.attr('text-anchor','middle')
.style('opacity',0.4)
.style('font-weight','bold')
.style('font-size',"24px")
.text('1800')

d3.json('data/data.json').then(data => {
	const formattedData = data.map(d => d.countries)
	const filteredCountries = formattedData.map(fd => {
		const countries = fd.filter(d => {
			if(d.income === null || d.life_exp === null) {
				return false
			}
			return true
		})
		return countries.map(country=> {
			country.income = Number(country.income);
			country.life_exp = Number(country.life_exp);
			return country
		})
	})
	d3.interval(()=>{
		time = time < 214 ? time+1 : 0
		update(filteredCountries[time])
	},500)
	update(filteredCountries[0])

	function update(data)  {
		const t = d3.transition().duration(700);

		const circles = g.selectAll('circle').data(data,d=>d.country)

		circles.exit().remove()

		circles.enter().append('circle')
		.attr("fill",d => continentColor(d.continent))
		.attr('cx',0)
		.attr('cy',HEIGHT)
		.on('mouseover',tip.show)
		.on('mouseout',tip.hide)
		.merge(circles)
		.transition(t)
		.attr('cx',d=>x(d.income))
		.attr('cy',d=>y(d.life_exp))
		.attr('r',d=>Math.sqrt(area(d.population)/Math.PI))

		year.text(String(1800 + time))
	}
})