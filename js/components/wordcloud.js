let width, height, word_canvas;

function initWordcloud() {
	return new Promise((resolve, reject) => {
		d3.selectAll(word_dest).selectAll('svg').remove();

		let canvasWidth		= $(word_dest).outerWidth(true);
		let canvasHeight	= $(word_dest).outerHeight(true);

		let margin 			= { top: 0, right: 10, bottom: 10, left: 10 };
		width				= canvasWidth - margin.right - margin.left;
		height				= canvasHeight - margin.top - margin.bottom;

		word_canvas	= _.chain(types).map((o) => ([_.kebabCase(o), d3.select('#' + _.kebabCase(o) + ' .horseman-content').append('svg').attr('class', word_id).attr('width', canvasWidth).attr('height', canvasHeight).append('g').attr('transform', 'translate(' + (margin.left + (width / 2)) + ',' + (margin.top + (height / 2)) + ')')])).fromPairs().value();

		resolve();
	});
}

function updateWordcloud(result) {
	d3.selectAll(word_dest + ' > svg').selectAll('text').remove();

	let words	= _.chain(result).mapKeys((value, key) => (_.kebabCase(key))).mapValues((o) => (_.map(o, (value, key) => ({ key, value })))).value();

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
					.attr('class', 'cursor-pointer')
					.style('font-family', def_font)
					.attr('font-size', 1)
					.attr('text-anchor', 'middle')
					.text((o) => (o.key))
					.on('click', (o) => { toggleNews(o.key); });

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
	if ($(' #wordcloud-wrapper ').hasClass('opened')) { toggleNews(); }
}

function toggleNews(text) {
	if (text) {
		$(' #wordcloud-news span > b ').text(text);

		$(' #wordcloud-content ').addClass('hidden');
		$(' #wordcloud-news ').removeClass('hidden');
	} else {

		$(' #wordcloud-content ').removeClass('hidden');
		$(' #wordcloud-news ').addClass('hidden');
	}
}
