function refreshValues() {
	let preachs	= _.chain(loremipsum).split(/[ '\-\(\)\*":;\[\]|{},.!?]+/).reject(_.isEmpty).map((key) => ({ key, value: _.random(5, 20) })).value();

	let mocked	= { month: moment().startOf('month').toDate(), inf: 0 };
	switch (true) {
		case _.includes(inf_ids, centered): mocked.inf = _.chain(1).random(1.5, true).round(2).value(); break;
		case _.includes(warn_ids, centered): mocked.inf = _.chain(0.75).random(1, true).round(2).value(); break;
		case _.includes(def_ids, centered): mocked.inf = _.chain(-1.5).random(-1, true).round(2).value(); break;
		default: mocked.inf = _.chain(-1).random(1, true).round(2).value();
	}

	let datline	= _.chain(11).range().map((o) => ({ month: moment().subtract(o + 1, 'months').startOf('month').toDate(), inf: _.chain(-1).random(1, true).round(2).value() })).concat([mocked]).value();

	updateLine(datline);
	updateWordcloud(preachs);
}
