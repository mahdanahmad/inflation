function refreshValues(id) {
	console.log(id);
	d3.json(baseURL + 'inflation' + (id ? '/' + id : '')).then((result) => { updateLine(result); });
	d3.json(baseURL + 'wordcloud' + (id ? '/' + id : '')).then((result) => { updateWordcloud(result); });
}
