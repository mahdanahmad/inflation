function refreshValues(id) {
	if (year.classed('selected')) {
		d3.json(baseURL + 'inflation' + (id ? '/' + id : '')).then((result) => { updateLine(result); });
		d3.json(baseURL + 'wordcloud' + (id ? '/' + id : '')).then((result) => { updateWordcloud(result); });
	} else {
		d3.json(baseURL + 'monthly' + (id ? '/' + id : '')).then((result) => { updateLine(result); });
		d3.json(baseURL + 'wordcloud' + (id ? '/' + id : '')).then((result) => { updateWordcloud(result); });
	}

}
