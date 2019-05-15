async function refreshValues(id) {
	fetching = true;
	if (year.classed('selected')) {
		d3.select('g#legend').classed('hidden', false);

		await d3.json(baseURL + 'inflation' + (id ? '/' + id : '')).then((result) => { updateLine(result); });
		await d3.json(baseURL + 'wordcloud' + (id ? '/' + id : '')).then((result) => { updateWordcloud(result); });
	} else {
		d3.select('g#legend').classed('hidden', true);

		await d3.json(baseURL + 'monthly' + (id ? '/' + id : '')).then((result) => { updateLine(result); });
		await d3.json(baseURL + 'wordcloud' + (id ? '/' + id : '')).then((result) => { updateWordcloud(result); });
	}

	setTimeout(() => { fetching = false; }, def_duration + 50);
}
