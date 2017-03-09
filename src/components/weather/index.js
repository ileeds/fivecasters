// import preact
import { h, render, Component } from 'preact';
import style from './style_iphone';
import Suggest from '../suggest/index';
import Header from '../header/index';
import Icon from '../icon/index';
import Slider from '../slider/index';
import helper from '../../helpers'


export default class Weather extends Component {

	getInitialState() {
    return {
      rain: "none"
    };
  }

	render() {
		//load until state retrieved
		if (this.state.rain === undefined) return <div />;
    return (
			<div class={style.container}>
				<Header />
				<div style ="margin-top: 75px;">
					<div id="main" class={style.mainWeatherContainer}>
						<Icon />
						<div class={style.weatherContainer}>
							<div id="wrap" style="overflow: hidden; height: 300px; width: 20000px;">
								<div id='now' class={ style.weather }>
									Loading, please wait...
								</div>
							</div>
						</div>
					</div>
					<Slider />
				</div>
				<Suggest temp = {this.state.temp} con = {this.state.con} rain = {this.state.rain} loc = {this.state.loc} time = {this.state.time}/>
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
					helper.hourly(data, function(toReturn) {
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
				now = helper.conditions(data);
				var d = new Date();
				self.setState({rain:now.prec});
				self.setState({temp:now.temp});
				self.setState({con:now.con});
				self.setState({loc:location});
				self.setState({time:d.getHours()});
				//render page after getting state
				self.forceUpdate();

				//conditionally render weather image based on conditions
				helper.picReplace(now.con);

				var nowDoc = document.getElementById('now');
				nowDoc.value = now.prec;
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
					helper.timeClick(e, self, hours, nowDoc);
				}
				for (var hour in times) {
					var single = document.createElement('div');
					single.className = style.hour;
					single.innerHTML = times[hour]+":00";
					single.onclick = function(e) {
						helper.timeClick(e, self, hours, nowDoc);
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
