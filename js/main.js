moment.locale('id');

const provinces	= [{id: "11", name: "Aceh"},{id: "51", name: "Bali"},{id: "19", name: "Bangka Belitung"},{id: "36", name: "Banten"},{id: "17", name: "Bengkulu"},{id: "75", name: "Gorontalo"},{id: "31", name: "Jakarta Raya"},{id: "15", name: "Jambi"},{id: "32", name: "Jawa Barat"},{id: "33", name: "Jawa Tengah"},{id: "35", name: "Jawa Timur"},{id: "61", name: "Kalimantan Barat"},{id: "63", name: "Kalimantan Selatan"},{id: "62", name: "Kalimantan Tengah"},{id: "64", name: "Kalimantan Timur"},{id: "21", name: "Kepulauan Riau"},{id: "18", name: "Lampung"},{id: "81", name: "Maluku"},{id: "82", name: "Maluku Utara"},{id: "52", name: "Nusa Tenggara Barat"},{id: "53", name: "Nusa Tenggara Timur"},{id: "94", name: "Papua"},{id: "91", name: "Papua Barat"},{id: "14", name: "Riau"},{id: "76", name: "Sulawesi Barat"},{id: "73", name: "Sulawesi Selatan"},{id: "72", name: "Sulawesi Tengah"},{id: "74", name: "Sulawesi Tenggara"},{id: "71", name: "Sulawesi Utara"},{id: "13", name: "Sumatera Barat"},{id: "16", name: "Sumatera Selatan"},{id: "12", name: "Sumatera Utara"},{id: "34", name: "Yogyakarta"}];

let inf_ids, def_ids, warn_ids;

let types	= ['Keterjangkauan Harga', 'Ketersediaan Pasokan', 'Kelancaran Distribusi', 'Komunikasi/Koordinasi'];

$( document ).ready(async function() {
	$(' #wordcloud-content ').html(types.map(o => ('<div id="' + _.kebabCase(o) + '" class="horseman"><div class="horseman-title">' + o + '</div><div class="horseman-content"></div></div>')).join(''))
	await initMap();
	await initWordcloud();

	inf_ids		= _.chain(provinces).sampleSize(3).map('id').value();
	def_ids		= _.chain(provinces).reject((o) => (_.includes(inf_ids, o.id))).sampleSize(3).map('id').value();
	warn_ids	= _.chain(provinces).reject((o) => (_.includes(inf_ids, o.id))).reject((o) => (_.includes(def_ids, o.id))).sampleSize(3).map('id').value();

	d3.selectAll(inf_ids.map((o) => ('#prov-' + o )).join(', ')).classed('inflate', true);
	d3.selectAll(def_ids.map((o) => ('#prov-' + o )).join(', ')).classed('deflate', true);
	d3.selectAll(warn_ids.map((o) => ('#prov-' + o )).join(', ')).classed('warning', true);
});
