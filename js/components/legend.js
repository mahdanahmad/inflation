const legends 	= [{ type: 'inflate', text: '> 4.5%' }, { type: 'warning', text: '4.0% - 4.5%' }, { type: 'deflate', text: '< 2.5%' }]

const wrapwidth	= 100;

function createLegend(target) {
	return new Promise((resolve, reject) => {
		let bbox	= target.node().getBBox();

		let canvas	= target.append('g').attr('id', 'legend').attr('transform', 'translate(50,' + (bbox.height - 125) + ')');

		canvas.append('text').text('legend')
		let wrapper	= canvas.append('g').attr('transform', 'translate(0, 12)');

		let wrapped	= wrapper.selectAll('.wrapped').data(legends).enter().append('g')
			.attr('class', o => ('wrapped ' + o.type))
			// .attr('transform', (o, i) => ('translate(' + ((i * wrapwidth) + 5) + ', 5)'));

		wrapped.append('rect')
			.attr('width', 10)
			.attr('height', 10);

		wrapped.append('text')
			.attr('x', 15)
			.attr('y', 10)
			.text(o => o.text)

		let nextHead	= 10;
		wrapped.each(function(o) {
			let val		= 'translate(' + nextHead + ',5)';
			let current = d3.select(this);
			nextHead 	+= current.node().getBBox().width + 20;
			current.attr('transform', val);
		});

		wrapper.append('rect')
			.attr('width', nextHead - 10)
			.attr('height', wrapped.node().getBBox().height + 15)
			.attr('y', -5)
			.attr('rx', 10)
			.attr('ry', 10)
			.style('fill', '#CCDBDC')
			.style('opacity', .1);

		resolve();
	});
}
