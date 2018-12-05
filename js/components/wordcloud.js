const loremipsum	= 'Flannel organic culpa, consectetur lyft lorem velit ennui magna brooklyn chambray. Street art cupidatat chicharrones echo park, cardigan reprehenderit vegan enim. Irure ut pork belly humblebrag, minim disrupt aliqua. Affogato echo park typewriter quis, selfies pickled proident sartorial shoreditch organic raclette vexillologist. Godard iPhone ea succulents semiotics voluptate pop-up. Venmo sustainable letterpress wayfarers, cupidatat nostrud irure tacos cliche.';

let width, height, word_canvas;

function initWordcloud() {
	return new Promise((resolve, reject) => {
		d3.selectAll(word_dest).selectAll('svg').remove();

		let canvasWidth		= $(word_dest).outerWidth(true);
		let canvasHeight	= $(word_dest).outerHeight(true);

		let margin 			= { top: 10, right: 10, bottom: 10, left: 10 };
		width				= canvasWidth - margin.right - margin.left;
		height				= canvasHeight - margin.top - margin.bottom;

		word_canvas	= _.chain(types).map((o) => ([_.kebabCase(o), d3.select('#' + _.kebabCase(o) + ' .horseman-content').append('svg').attr('class', word_id).attr('width', canvasWidth).attr('height', canvasHeight).append('g').attr('transform', 'translate(' + (margin.left + (width / 2)) + ',' + (margin.top + (height / 2)) + ')')])).fromPairs().value();

		let preachs	= _.chain(types).map((o) => ([_.kebabCase(o), _.chain(loremipsum).split(/[ '\-\(\)\*":;\[\]|{},.!?]+/).reject(_.isEmpty).sampleSize(25).map((key) => ({ key, value: _.random(5, 20) })).value()])).fromPairs().value();

		updateWordcloud(preachs);

		resolve();
	});
}

function updateWordcloud(words) {
	d3.selectAll(word_dest + ' > svg').selectAll('text').remove();

	_.forEach(words, (value, key) => {
		let fontScale	= d3.scaleLinear().domain([d3.min(value, (o) => (o.value)), d3.max(value, (o) => (o.value))]).range([10,60]);

		d3.layout.cloud().size([width, height])
			.words(value)
			.padding(2)
			.fontSize((o) => (fontScale(+o.value)))
			.text((o) => (o.key))
			.rotate(() => (0))
			.font(def_font)
			.on('end', (words) => {
				word_canvas[key].selectAll('text').data(words, (o) => (o.key)).enter().append('text')
					.style('font-family', def_font)
					.attr('font-size', 1)
					.attr('text-anchor', 'middle')
					.text((o) => (o.key));

				word_canvas[key].selectAll('text').transition(def_transtn).duration(def_duration)
					.style('font-size', (o) => (fontScale(o.value) + 'px'))
					.attr('transform', (o) => ('translate(' + [o.x, o.y] + ')rotate(' + o.rotate + ')'))
					.style('fill-opacity', 1);
			})
			.start();
	});
}

function onclickWordcloud() {
	$(' #wordcloud-title > span.typcn, #overlay ').toggleClass('hidden');
	$(' #wordcloud-wrapper ').toggleClass('opened');
}
