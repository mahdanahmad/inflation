let month, year;

function initSelector(target) {
	return new Promise(async (resolve, reject) => {
		let bbox			= target.node().getBBox();

		let canvasWidth		= bbox.width * .5;
		let canvasHeight	= bbox.height * .2;

		let canvas			= target.append('g').attr('id', selector_id).attr('transform', 'translate(0,0)');

		year	= canvas.append('g').attr('id', 'year').attr('class', 'cursor-pointer selection').attr('transform', 'translate(' + (canvasWidth / 10 * 2)  + ',' + (canvasHeight / 2) + ')');
		month	= canvas.append('g').attr('id', 'month').attr('class', 'cursor-pointer selection').attr('transform', 'translate(' + (canvasWidth / 10 * 2 + 180)  + ',' + (canvasHeight / 2) + ')');

		year.append('rect').attr('width', 160).attr('height', 80).attr('x', -80).attr('y', -45).style('fill', 'transparent');
		month.append('rect').attr('width', 160).attr('height', 80).attr('x', -80).attr('y', -45).style('fill', 'transparent');

		year.append('text').attr('alignment-baseline', 'middle').attr('text-anchor', 'middle').html('Y<tspan> on </tspan>Y');
		month.append('text').attr('alignment-baseline', 'middle').attr('text-anchor', 'middle').html('M<tspan> to </tspan>M');

		year.classed('selected', true);

		year.on('click', onClick);
		month.on('click', onClick);

		resolve();
	});
}

function onClick() {
	let current	= d3.select(this);
	if (d3.select('.selection.selected').attr('id') !== current.attr('id') && !fetching) {
		d3.select('.selection.selected').classed('selected', false);
		current.classed('selected', true);

		if (current.attr('id') == 'year') {
			d3.json(baseURL + 'colors').then((result) => { _.chain(result).toPairs().groupBy((o) => (o[1])).mapValues((o) => _.map(o, (d) => (d[0]))).forEach((value, key) => (d3.selectAll(value.map((o) => ('#prov-' + o)).join(', ')).classed(key, true))).value(); })
		} else {
			d3.selectAll('.province').classed('inflation warning deflation', false);
		}

		refreshValues();
	}
}
