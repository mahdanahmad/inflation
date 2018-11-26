let roam, xScale, yScale, line, detail, tooltip;

const pathWidth	= .675;

const ceil_size		= 75;
const floor_size	= 12;

function initLine(target) {
	return new Promise((resolve, reject) => {
		let bbox			= target.node().getBBox();

		let canvasWidth		= bbox.width * .5;
		let canvasHeight	= bbox.height * .2;

		let margin 			= { top: 50, right: (canvasWidth * (1 - pathWidth)), bottom: 50, left: 20 };
		let width			= canvasWidth - margin.right - margin.left;
		let height			= canvasHeight - margin.top - margin.bottom;

		roam 				= target.append('g').attr('id', line_id).attr('transform', 'translate(' + ((bbox.width - canvasWidth) + margin.left) + ',' + margin.top + ')');

		let data			= _.chain(12).range().map((o) => ({ month: moment().subtract(o, 'months').startOf('month').toDate(), inf: 0 })).value();

		xScale				= d3.scaleTime().domain([d3.min(data, (o) => (o.month)), d3.max(data, (o) => (o.month))]).range([0, width]);
		yScale				= d3.scaleLinear().domain([_.floor(d3.min(data, (o) => (o.inf))), _.ceil(d3.max(data, (o) => (o.inf)))]).range([height, 0]);

		line				= d3.line().x((o) => (xScale(o.month))).y((o) => (yScale(o.inf))).curve(d3.curveCatmullRom);

		roam.append('rect')
			.attr('id', 'line-back')
			.attr('width', canvasWidth)
			.attr('height', canvasHeight)
			.attr('transform', 'translate(' + -margin.left + ',' + -margin.top + ')');

		roam.append('path')
			.attr('id', 'line')
			.attr('d', line(data));

		tooltip	= roam.append('g')
			.attr('id', 'tooltip-wrapper')
			.attr('class', 'hidden');

		tooltip.append('text')
			.attr('text-anchor', 'middle');

		tooltip.append('rect')
			.attr('rx', '5')
			.attr('ry', '5');

		roam.append('g')
			.attr('id', 'dot-wrapper')
			.selectAll('.dot').data(data).enter().append('circle')
				.attr('class', 'dot')
				.attr('cx', (o) => (xScale(o.month)))
				.attr('cy', (o) => (yScale(o.inf)))
				.attr('r', 5);

		detail	= roam.append('g')
			.attr('id', 'detail-wrapper');

		detail.append('text')
			.attr('id', 'ceil')
			.attr('font-size', ceil_size + 'px')
			.attr('y', ceil_size)
			// .attr('alignment-baseline', 'hanging')
			.text('0');

		detail.append('text')
			.attr('id', 'floor')
			.attr('font-size', floor_size + 'px')
			// .attr('alignment-baseline', 'hanging')
			.attr('text-anchor', 'end')
			.attr('y', ceil_size + floor_size + 10)
			.text(moment().format('MMMM YYYY'));

		detail.attr('transform', 'translate(' + (canvasWidth * (pathWidth)) + ',' + (yScale(_.chain(data).maxBy('month').get('inf').value()) - detail.node().getBBox().height / 2) + ')')
		detail.select('text#floor').attr('x', detail.node().getBBox().width);

		resolve();

		updateLine(_.chain(12).range().map((o) => ({ month: moment().subtract(o, 'months').startOf('month').toDate(), inf: _.chain(-1).random(1, true).round(2).value() })).value());
	});
}

function updateLine(data) {
	data	= _.orderBy(data, 'month', 'desc');

	xScale.domain([d3.min(data, (o) => (o.month)), d3.max(data, (o) => (o.month))]);
	yScale.domain([_.floor(d3.min(data, (o) => (o.inf))), _.ceil(d3.max(data, (o) => (o.inf)))]);

	let selector	= roam.transition(def_transtn).duration(def_duration);

	selector.select('path#line')
		.attr('d', line(data));

	let circles	= roam.select('g#dot-wrapper').selectAll('.dot').data(data);

	circles.exit().remove();
	circles.enter().append('circle')
		.attr('class', 'dot')
		.attr('cx', (o) => (xScale(o.month)))
		.attr('r', 5);

	circles.transition(def_transtn).duration(def_duration)
		.attr('cy', (o) => (yScale(o.inf)));

	circles
		.on('mouseover', onMouseOver)
		.on('mouseout', onMouseOut);

	let inf_value	= _.chain(data).maxBy('month').get('inf').value();
	detail.select('text#ceil').text(inf_value);
	detail.select('text#floor').text('').attr('x', detail.node().getBBox().width).text('Prediction for ' + moment().format('MMMM YYYY'));

	detail.classed('warning', inf_value > limit_warn && inf_value < limit_top);
	detail.classed('inflate', inf_value > limit_top);
	detail.classed('deflate', inf_value < limit_btm);

	let transform	= detail.attr('transform').split(',')[0] + ',' + (yScale(_.chain(data).maxBy('month').get('inf').value()) - detail.node().getBBox().height / 2) + ')';
	selector.select('g#detail-wrapper').attr('transform', transform);
}

function onMouseOver(o) {
	let text	= tooltip.select('text');
	let rect	= tooltip.select('rect');

	text.text(moment(o.month).format('MMMM YYYY') + ': ' + o.inf);

	let rectWidth	= text.node().getBBox().width + 25;
	let rectHeight	= text.node().getBBox().height + 10;

	rect
		.attr('width', rectWidth)
		.attr('height', rectHeight)
		.attr('x', -(rectWidth / 2))
		.attr('y', -(rectHeight - 9));

	tooltip.attr('transform', 'translate(' + xScale(o.month) + ',' + (yScale(o.inf) - rectHeight + 5) + ')');

	tooltip.classed('hidden', false);
}

function onMouseOut() {
	tooltip.classed('hidden', true);
}
