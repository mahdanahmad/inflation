const loremipsum	= 'Flannel organic culpa, consectetur lyft lorem velit ennui magna brooklyn chambray. Street art cupidatat chicharrones echo park, cardigan reprehenderit vegan enim. Irure ut pork belly humblebrag, minim disrupt aliqua. Affogato echo park typewriter quis, selfies pickled proident sartorial shoreditch organic raclette vexillologist. Godard iPhone ea succulents semiotics voluptate pop-up. Venmo sustainable letterpress wayfarers, cupidatat nostrud irure tacos cliche.';

let width, height;

function initWordcloud() {
	return new Promise((resolve, reject) => {
		d3.select(word_dest).selectAll('svg').remove();

		let canvasWidth		= $(word_dest).outerWidth(true);
		let canvasHeight	= $(word_dest).outerHeight(true);

		let margin 			= { top: 10, right: 10, bottom: 10, left: 10 };
		width				= canvasWidth - margin.right - margin.left;
		height				= canvasHeight - margin.top - margin.bottom;

		let svg = d3.select(word_dest).append('svg')
		.attr('id', word_id)
		.attr('width', canvasWidth)
		.attr('height', canvasHeight)
		.append('g')
		.attr('transform', 'translate(' + (margin.left + (width / 2)) + ',' + (margin.top + (height / 2)) + ')');

		let preachs	= _.chain(loremipsum).split(/[ '\-\(\)\*":;\[\]|{},.!?]+/).reject(_.isEmpty).map((key) => ({ key, value: _.random(5, 20) })).value();
		updateWordcloud(preachs, svg);

		resolve();
	});
}

function updateWordcloud(words, canvas) {
	let fontScale	= d3.scaleLinear().domain([d3.min(words, (o) => (o.value)), d3.max(words, (o) => (o.value))]).range([10,60]);

	canvas.selectAll('text').remove();

	d3.layout.cloud().size([width, height])
		.words(words)
		.padding(2)
		.fontSize((o) => (fontScale(+o.value)))
		.text((o) => (o.key))
		.rotate(() => (0))
		.font(def_font)
		.on('end', (words) => {
			canvas.selectAll('text').data(words, (o) => (o.key)).enter().append('text')
				.style('font-family', def_font)
				.attr('font-size', 1)
				.attr('text-anchor', 'middle')
				.text((o) => (o.key));

			canvas.selectAll('text').transition(def_transtn).duration(def_duration)
				.style('font-size', (o) => (fontScale(o.value) + 'px'))
				.attr('transform', (o) => ('translate(' + [o.x, o.y] + ')rotate(' + o.rotate + ')'))
				.style('fill-opacity', 1);
		})
		.start();
}

function onclickWordcloud() {
	$(' #wordcloud-title > span.typcn, #overlay ').toggleClass('hidden');
	$(' #wordcloud-wrapper ').toggleClass('opened');
}
