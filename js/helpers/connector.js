async function refreshValues(id) {
	fetching = true;
	if (year.classed('selected')) {
		await d3.json(baseURL + 'inflation' + (id ? '/' + id : '')).then((result) => { updateLine(result); });
		await d3.json(baseURL + 'wordcloud' + (id ? '/' + id : '')).then((result) => { updateWordcloud(result); });
	} else {
		await d3.json(baseURL + 'monthly' + (id ? '/' + id : '')).then((result) => { updateLine(result); });
		await d3.json(baseURL + 'wordcloud' + (id ? '/' + id : '')).then((result) => { updateWordcloud(result); });
	}

	setTimeout(() => { fetching = false; }, def_duration + 50);
}
