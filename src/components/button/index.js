// import preact
import { h, render, Component } from 'preact';
// import jquery for API calls
import $ from 'jquery';
import style from './style_iphone';

function conditions (parsed_json) {
	var location = parsed_json['current_observation']['display_location']['city'];
	var temp_c = parsed_json['current_observation']['temp_c'];
	var conditions = parsed_json['current_observation']['weather'];
	var elem = document.getElementById('now');
	elem.innerHTML = location+"<br />"+temp_c+"\xB0C<br />"+conditions;
}

function hourly (parsed_json) {
	var elem = document.getElementById('wun');
	elem.innerHTML = null;
	for (var i=0; i<24; i++){
		var time = parsed_json['hourly_forecast'][i]['FCTTIME']['civil'];
		var temp_c = parsed_json['hourly_forecast'][i]['temp']['metric'];
		var conditions = parsed_json['hourly_forecast'][i]['wx'];
		var hour = document.createElement('div');
		hour.className = style.hour;
		hour.innerHTML = time+"<br />"+temp_c+"\xB0C<br />"+conditions;
		elem.appendChild(hour);
	}
}

export default class Button extends Component {

	// rendering a function when the button is clicked
	render() {
    return (
			<div>
				<div id="this" class={ style.image } />
				<div id='now' class={ style.container }>
					Loading, please wait...
				</div>
				<div id='wun' class={ style.scroll }>
					Loading, please wait...
				</div>
			</div>
		);
  }

	// a call to fetch weather data via wunderground
	componentDidMount() {
		navigator.geolocation.getCurrentPosition(function(location) {
			var wunderground = require('wunderground')(""+process.env.WUNDERGROUND);
			var query = {
		    lat  : ''+location.coords.latitude,
		    lng : ''+location.coords.longitude
			};
			wunderground.conditions(query, function(err, data) {
				if (err) throw err;
			  else conditions(data);
			});
			wunderground.hourly(query, function(err, data) {
				if (err) throw err;
			  else hourly(data);
			});
		});
	}

}
