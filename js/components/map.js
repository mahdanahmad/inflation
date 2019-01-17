let path, projection, centered, canvas, back;

let mappedGeo	= {};
let scale		= 1;

function initMap() {
	return new Promise(async (resolve, reject) => {
		d3.select(map_dest).selectAll('svg').remove();

		let canvasWidth		= $(map_dest).outerWidth(true);
		let canvasHeight	= $(map_dest).outerHeight(true);

		let margin 			= { top: 0, right: 0, bottom: 0, left: 0 };
		let width			= canvasWidth - margin.right - margin.left;
		let height			= canvasHeight - margin.top - margin.bottom;

		projection			= d3.geoMercator()
			.scale(width * 1.15)
			.center([118, -1.85])
			.translate([width / 2, height / 1.9]);

		path	= d3.geoPath().projection(projection);

		let svg = d3.select(map_dest).append('svg')
			.attr('id', map_id)
			.attr('width', canvasWidth)
			.attr('height', canvasHeight)

		canvas	= svg.append('g')
			.attr('id', 'canvas')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		canvas.append('rect')
			.attr('id', 'background')
			.attr('width', width)
			.attr('height', height)
			.on('click', () => { if (centered) { zoom(null) }});

		back	= svg.append('text')
			.attr('id', 'back-button')
			.attr('class', 'cursor-pointer hidden')
			.attr('x', canvasWidth - 75)
			.attr('y', canvasHeight * .2 + 20)
			.attr('alignment-baseline', 'hanging')
			.attr('text-anchor', 'end')
			.text('Back to National')
			.on('click', () => { if (centered) { zoom(null) }});

		await drawGeoJson('indonesia');
		await initLine(svg);
		await initSelector(svg);
		await createLegend(svg);

		resolve();
	});
}

function drawGeoJson(filename) {
	return new Promise(async (resolve, reject) => {
		let raw		= await d3.json('public/geojson/' + filename + '.json');
		let topo	= topojson.feature(raw, raw.objects.map);

		mappedGeo	= _.chain(topo).get('features', []).keyBy('properties.id_provinsi').mapValues((o) => ({ centroid: path.centroid(o), bounds: path.bounds(o) })).value();

		let provElem	= canvas.append('g').attr('id', 'geojson-wrapper')
			.selectAll('g.province').data(topo.features).enter().append('g')
				.attr('id', o => 'prov-' + o.properties.id_provinsi)
				.attr('class', 'province cursor-pointer');

		provElem.append('path')
			.attr('d', path)
			.attr('class', '')
			.attr('vector-effect', 'non-scaling-stroke')
			.style('stroke-width', '.5px');

		provElem.append('text')
			.attr('x', (o) => (mappedGeo[o.properties.id_provinsi].centroid[0]))
			.attr('y', (o) => (mappedGeo[o.properties.id_provinsi].centroid[1]))
			.attr('class', 'hidden')
			.style('font-size', 11 + 'px')
			.text((o) => (o.properties.nm_provinsi));

		provElem
			.on("mousemove", function(o) {
				if (!centered) {
					let mouse = d3.mouse(canvas.node()).map( (o) => (parseInt(o)));

					let tooltip		= d3.select("#map-tooltip");
					tooltip.classed("hidden", false);
					tooltip.text(o.properties.nm_provinsi);

					let bbox		= tooltip.node().getBoundingClientRect();

					let xPosition	= mouse[0] - (bbox.width / 2);
					let yPosition	= mouse[1] - bbox.height - 5;

					tooltip
						.style("left", xPosition + "px")
						.style("top", yPosition + "px")

				}
			})
			.on("mouseout", () => { d3.select("#map-tooltip").classed("hidden", true); })
			.on('click', (o) => (zoom(o.properties.id_provinsi, o.properties.nm_provinsi)))

		resolve();
	});
}

function zoom(id, name) {
	if (path && canvas.node()) {
		let x, y;
		let node	= canvas.node().getBBox();

		d3.select("#map-tooltip").classed("hidden", true);

		if (mappedGeo[id] && (centered !== id)) {
			x = mappedGeo[id].centroid[0];
			y = mappedGeo[id].centroid[1];

			dx = mappedGeo[id].bounds[1][0] - mappedGeo[id].bounds[0][0],
      		dy = mappedGeo[id].bounds[1][1] - mappedGeo[id].bounds[0][1],

			scale = dx > dy ? node.width * .35 / dx : node.height * .7 / dy;

			centered = id;

			d3.selectAll('g.province:not(#prov-' + id + ')').classed('unintended', true);
			d3.selectAll('g#prov-' + id).classed('unintended', false);
		} else {
			x = node.width / 2;
			y = node.height / 2;
			scale = 1;

			centered = null;

			d3.selectAll('g.province').classed('unintended', false);
		}
		back.classed('hidden', !id);
		refreshValues(id);

		let transform	= 'translate(' + node.width / 2 + ',' + node.height / 2 + ')scale(' + scale + ')translate(' + -x + ',' + -y + ')';
		canvas.transition(def_transtn)
			.duration(def_duration)
			.attr('transform', transform);

		$('span#title-region').text(name || 'National')
	}
}
