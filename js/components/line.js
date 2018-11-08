let roam, xScale, yScale, line, detail;

const pathWidth	= .725;

const ceil_size		= 75;
const floor_size	= 12;

function initLine(target) {
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

	roam.append('g')
		.attr('id', 'dot-wrapper')
		.selectAll('.dot').data(data).enter().append('circle')
			// .attr('id', (o) => (moment(o.month).format('MMMM-YYYY').toLowerCase()))
			.attr('class', 'dot')
			.attr('cx', (o) => (xScale(o.month)))
			.attr('cy', (o) => (yScale(o.inf)))
			.attr('r', 5);

	detail	= roam.append('g')
		.attr('id', 'detail-wrapper');

	detail.append('text')
		.attr('id', 'ceil')
		.attr('font-size', ceil_size + 'px')
		.attr('alignment-baseline', 'hanging')
		.text('0');

	detail.append('text')
		.attr('id', 'floor')
		.attr('font-size', floor_size + 'px')
		.attr('alignment-baseline', 'hanging')
		.attr('text-anchor', 'end')
		.attr('y', ceil_size)
		.text(moment().format('MMMM YYYY'));

	detail.attr('transform', 'translate(' + (canvasWidth * (pathWidth)) + ',' + (yScale(_.chain(data).maxBy('month').get('inf').value()) - detail.node().getBBox().height / 2) + ')')
	detail.select('text#floor').attr('x', detail.node().getBBox().width);

	updateLine(_.chain(12).range().map((o) => ({ month: moment().subtract(o, 'months').startOf('month').toDate(), inf: _.chain(-1).random(1, true).round(2).value() })).value())
}

function updateLine(data) {
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

	roam.select('text#ceil').text(_.chain(data).maxBy('month').get('inf').value());
	roam.select('text#floor').text('').attr('x', detail.node().getBBox().width).text(moment().format('MMMM YYYY'));

	let transform	= detail.attr('transform').split(',')[0] + ',' + (yScale(_.chain(data).maxBy('month').get('inf').value()) - detail.node().getBBox().height / 2) + ')';
	selector.select('g#detail-wrapper').attr('transform', transform);
}
