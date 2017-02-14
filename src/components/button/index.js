// import preact
import { h, render, Component } from 'preact';
// import jquery for API calls
import $ from 'jquery';
import style from './style_iphone';

function parseResponse (parsed_json) {
	var location = parsed_json['observation_location']['city'];
	var temp_c = parsed_json['temp_c'];
	var conditions = parsed_json['weather'];
	var elem = document.getElementById('wun');
	elem.innerHTML = "Location: "+location+" Temp: "+temp_c+" Conditions: "+conditions;
}

export default class Button extends Component {

	// rendering a function when the button is clicked
	render() {
    return (
			<div id='wun'>
				Loading, please wait...
			</div>
		);
  }

	// a call to fetch weather data via wunderground
	componentDidMount() {
		var Wunderground = require('wunderground-api');
		var client = new Wunderground(process.env.WUNDERGROUND, 'London', 'UK');
		var weather=null;
		client.conditions('', function(err, data) {
		  if (err) throw err;
		  else weather = parseResponse(data);
		});
	}

}
