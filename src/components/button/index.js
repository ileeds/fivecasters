// import preact
import { h, render, Component } from 'preact';
// import jquery for API calls
import $ from 'jquery';
import style from './style_iphone';
import style2 from '../iphone/style';
import style3 from '../suggest/style_iphone';
import Suggest from '../suggest/index';


function timeClick(clicked, self, hours, now) {
	var d = new Date();
	var n = d.getHours();
	var time = parseInt(clicked.currentTarget.innerHTML);
	if (isNaN(time)){
		time=n;
	}
	var focus = document.getElementsByClassName(style.hour);
	for (var i=0; i<focus.length; i++) {
		focus[i].style.borderBottom = "";
	}

	var unfocus = document.getElementById('start');
	unfocus.style.borderBottom = "2.5pt solid  #000000";

	clicked.currentTarget.style.borderBottom = "2.5pt solid  #4A90E2";
	var hourDoc = document.getElementById('wrap');
	var diff = parseInt(clicked.target.innerHTML)-n-1;
	if (diff<0) {
		diff+=24;
	}
	var forState;
	if (isNaN(diff)){
		hourDoc.replaceChild(now, hourDoc.childNodes[0]);
		forState = now;
	} else {
		hourDoc.replaceChild(hours[diff], hourDoc.childNodes[0]);
		forState = hours[diff];
	}
	var replace = render(<Suggest temp = {forState.childNodes[2].innerHTML.slice(0,-2)} rain = {forState.value} loc = {self.state.loc} time = {time}/>);
	var parent = document.getElementById("cont");
	parent.replaceChild(replace, parent.childNodes[0]);
	picReplace(forState.querySelector("h3").innerHTML);
}

//updates weather picture when new time is selected
function picReplace(con) {
	var img = document.getElementById('weatherPic');
	if (con.includes("Cloud")){
		img.src = "../../assets/icons/cloudy-01.png";
	} else if (con.includes("Fog")) {
		img.src = "../../assets/icons/fog-01.png";
	} else if (con.includes("Rain")) {
		img.src = "../../assets/icons/rain-01.png";
	} else if (con.includes("Sleet")) {
		img.src = "../../assets/icons/sleet.png";
	} else if (con.includes("Thunder")) {
		img.src = "../../assets/icons/thunderstorm.png";
	} else {
		img.src = "../../assets/icons/sunny.png";
	}
}

//daily data returned to component
function conditions (parsed_json) {
	var toReturn = {
		loc: parsed_json['current_observation']['display_location']['city'],
		temp: Math.round(parsed_json['current_observation']['temp_c']),
		con: parsed_json['current_observation']['weather'],
		prec: parsed_json['current_observation']['precip_1hr_in']
	}
	return toReturn;
}

//hourly data passed to callback function
function hourly (parsed_json, callback) {
	var toReturn = {};
	for (var i=0; i<23; i++){
		var temp_c = Math.round(parsed_json['hourly_forecast'][i]['temp']['metric']);
		var conditions = parsed_json['hourly_forecast'][i]['wx'];
		var hour = document.createElement('div');
		hour.value = parsed_json['hourly_forecast'][i]['pop'];
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

				<div class={style.topBar}>
					<p class={style.day}>Today</p>
					<p class={style.week}>Week</p>
					<a href="#" class={style.settings} />
				</div>
				<div style ="margin-top: 75px;">
					<div id="main" class={style.mainWeatherContainer}>
						<img id="weatherPic" class={ style.image } alt="No Image Available"/>
						<div class={style.weatherContainer}>
							<div id="wrap" style="overflow: hidden; height: 300px; width: 20000px;">
								<div id='now' class={ style.weather }>
									Loading, please wait...
								</div>
							</div>
						</div>
					</div>
					<div id="slideContainer" class={style.slideContainer}>
						<div id='start' class={style.now}> Now </div>
						<div id='wun' class={ style.scroll } />
					</div>
				</div>
				<div id="cont" class= { style3.container }>
					<Suggest temp = {this.state.temp} rain = {this.state.rain} loc = {this.state.loc} time = {this.state.time}/>
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
				var d = new Date();
				self.setState({rain:now.prec});
				self.setState({temp:now.temp});
				self.setState({loc:location});
				self.setState({time:d.getHours()});
				//render page after getting state
				self.forceUpdate();
				//conditionally render weather image based on conditions
				var img = document.getElementById('weatherPic');
				if (now.con.includes("Cloud")){
					img.src = "../../assets/icons/cloudy-01.png";
				} else if (now.con.includes("Fog")) {
					img.src = "../../assets/icons/fog-01.png";
				} else if (now.con.includes("Rain")) {
					img.src = "../../assets/icons/rain-01.png";
				} else if (now.con.includes("Sleet")) {
					img.src = "../../assets/icons/sleet.png";
				} else if (now.con.includes("Thunder")) {
					img.src = "../../assets/icons/thunderstorm.png";
				} else {
					img.src = "../../assets/icons/sunny.png";
				}

				var nowDoc = document.getElementById('now');
				nowDoc.className += ' nowWeather';
				nowDoc.innerHTML = "<h1>"+now.loc+"</h1><br/><h2>"+now.temp+"\xB0C</h2><br/><h3>"+now.con+"</h3>";
				for (var div in hours) {
					hours[div].innerHTML="<h1>"+now.loc+"</h1><br/>"+hours[div].innerHTML;
				}
				var hourDoc = document.getElementById('wrap');
				hourDoc.appendChild(hours[0]);
				//form array of times from now through 24 hours
				var n = d.getHours()+1;
				var j = n+23;
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
					timeClick(e, self, hours, nowDoc);
				}
				for (var hour in times) {
					var single = document.createElement('div');
					single.className = style.hour;
					single.innerHTML = times[hour]+":00";
					single.onclick = function(e) {
						timeClick(e, self, hours, nowDoc);
					}
					slide.appendChild(single);
				}
				self.alerts(wunderground, query);
			}
		});
	}

	alerts(wunderground, query) {
		wunderground.alerts(query, function(err, data) {
			if (err) {
				throw err;
			} else {
				if (data['alerts'].length > 0) {
					var d = new Date();
					var dd = new Date(data['alerts'][0]['expires']);
					if (dd>d){
						window.alert(data['alerts'][0]['description']);
					}
				}
			}
		});
	}

}
