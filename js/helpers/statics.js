const map_dest		= '#map-wrapper';
const map_id		= 'map-viz';

const word_dest		= '#wordcloud-content .horseman-content';
const word_id		= 'word-viz';

const line_id		= 'line-viz';
const selector_id	= 'selector-viz';

const def_font		= 'Poppins';
const def_duration	= 750;
const def_transtn	= d3.transition().ease(d3.easeCubicOut);

const limit_top		= 4.5;
const limit_warn	= 4.0;
const limit_btm		= 2.5;
const limit_fall	= 0;

const baseURL		= "http://inflationapi.apps.pulselabjakarta.id/";
let fetching		= false;

const limits	= [limit_top, limit_warn, limit_btm, limit_fall];
const states	= ['freefall', 'deflation', 'normal', 'warning', 'inflation']
