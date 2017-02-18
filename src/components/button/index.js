// import preact
import { h, render, Component } from 'preact';
// import jquery for API calls
import $ from 'jquery';
import style from './style_iphone';
import style2 from '../iphone/style';
import style3 from '../suggest/style_iphone';
import Suggest from '../suggest/index';

function timeClick(clicked) {
	var d = new Date();
	var n = d.getHours();
	var time = parseInt(clicked.currentTarget.innerHTML);
	if (isNaN(time)){
		time=n;
	}
	var focus = document.getElementsByClassName(style.hour);
	for (var i=0; i<focus.length; i++) {
		focus[i].style.textDecoration = "";
	}
	clicked.currentTarget.style.textDecoration = "underline";
	var shift = document.getElementsByClassName(style.weather);
	for (var i=0; i<shift.length; i++) {
		var toShift = (time-n);
		if (toShift<0){
			toShift+=24;
		}
  	shift[i].style.right = toShift*200+"px";
  }
}

//daily data returned to component
function conditions (parsed_json) {
	var toReturn = {
		loc: parsed_json['current_observation']['display_location']['city'],
		temp: parsed_json['current_observation']['temp_c'],
		con: parsed_json['current_observation']['weather'],
		prec: parsed_json['current_observation']['precip_1hr_in']
	}
	return toReturn;
}

//hourly data passed to callback function
function hourly (parsed_json, callback) {
	var toReturn = {};
	for (var i=0; i<23; i++){
		var temp_c = parsed_json['hourly_forecast'][i]['temp']['metric'];
		var conditions = parsed_json['hourly_forecast'][i]['wx'];
		var hour = document.createElement('div');
		hour.className = style.weather;
		hour.innerHTML = "<h2>"+temp_c+"\xB0C</h2><br/><h3>"+conditions+"</h3>";
		toReturn[i] = hour;
	}
	callback(toReturn);
}

export default class Button extends Component {

	getInitialState() {
    return {
      rain: "none"
    };
  }

	// rendering a function when the button is clicked
	render() {
		//load until state retrieved
		if (this.state.rain === undefined) return <div />;
    return (
			<div class={style2.container}>
				<div>
					<div id="main" class={style.mainWeatherContainer}>
						<div class={ style.image } />
						<div class={style.weatherContainer}>
							<div id="wrap" style="overflow: hidden; height: 300px; width: 20000px;">
								<div id='now' class={ style.weather }>
									Loading, please wait...
								</div>
							</div>
						</div>
					</div>
					<div id="slideContainer">
						<div id='start' class={style.now}> Now </div>
						<div id='wun' class={ style.scroll } />
					</div>
				</div>
				<div class= { style3.container }>
					<Suggest rain = {this.state.rain} loc = {this.state.loc}/>
				</div>
			</div>
		);
  }

	// a call to fetch weather data via wunderground
	componentDidMount() {
		var now = null;
		var hours = {};
		var self = this;
		navigator.geolocation.getCurrentPosition(function(location) {
			var wunderground = require('wunderground')(""+process.env.WUNDERGROUND);
			var query = {
		    lat  : ''+location.coords.latitude,
		    lng : ''+location.coords.longitude
			};
			//retrieves hourly data
			wunderground.hourly(query, function(err, data) {
				if (err) {
					throw err;
				} else {
					//callback function to wait for async to finish
					hourly(data, function(toReturn) {
						hours = toReturn;
					});
					self.current(wunderground, query, now, self, location, hours);
				}
			});
		});
	}

	//retrieves current data
	current(wunderground, query, now, self, location, hours) {
		wunderground.conditions(query, function(err, data) {
			if (err) {
				throw err;
			} else {
				now = conditions(data);
				self.setState({rain:now.prec});
				self.setState({loc:location});
				//render page after getting state
				self.forceUpdate();
				var nowDoc = document.getElementById('now');
				nowDoc.innerHTML = "<h1>"+now.loc+"</h1><br/><h2>"+now.temp+"\xB0C</h2><br/><h3>"+now.con+"</h3>";
				var hourDoc = document.getElementById('wrap');
				for (var div in hours) {
					hours[div].innerHTML="<h1>"+now.loc+"</h1><br/>"+hours[div].innerHTML;
					hourDoc.appendChild(hours[div]);
				}
				//form array of times from now through 24 hours
				var d = new Date();
				var n = d.getHours()+1;
				var j = n+24;
				var times = [];
				for (var i=n; i<j; i++){
					if (i>23){
						i=0;
						j=n-1;
					}
					times.push(i);
				}
				var slide = document.getElementById('wun');
				document.getElementById('start').onclick = function(e) {
					var d = new Date();
					var n = d.getHours();
					timeClick(e);
				}
				for (var hour in times) {
					var single = document.createElement('div');
					single.className = style.hour;
					single.innerHTML = times[hour];
					single.onclick = function(e) {
						timeClick(e);
					}
					slide.appendChild(single);
				}
			}
		});
	}

}
