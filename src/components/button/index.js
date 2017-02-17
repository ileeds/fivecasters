// import preact
import { h, render, Component } from 'preact';
// import jquery for API calls
import $ from 'jquery';
import style from './style_iphone';
import style2 from '../iphone/style';
import style3 from '../suggest/style_iphone';
import Suggest from '../suggest/index';
import Slider from 'react-slick';

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
	for (var i=0; i<24; i++){
		var time = parsed_json['hourly_forecast'][i]['FCTTIME']['civil'];
		var temp_c = parsed_json['hourly_forecast'][i]['temp']['metric'];
		var conditions = parsed_json['hourly_forecast'][i]['wx'];
		var hour = document.createElement('div');
		hour.className = style.hour;
		hour.innerHTML = time+"<br />"+temp_c+"\xB0C<br />"+conditions;
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
		var times = Array.from(new Array(24),(val,index)=>index+1);
		var d = new Date();
		var n = d.getHours();
		var settings = {
			slidesToShow: 6,
			focusOnSelect: true,
			draggable: true,
			swipeToSlide: true,
			infinite: false,
			initialSlide: n-1
		};
    return (
			<div class={style2.container}>
				<div>
					<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
					<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
					<div class={ style.image } />
					<div id='now' class={ style.container }>
						Loading, please wait...
					</div>
					<div id='wun' class={ style.scroll }>
						Loading, please wait...
					</div>
				</div>
	      <Slider {...settings} class={style.slide}>
					{times.map(function(i){
						return <div><h3>{i}</h3></div>;
					})}
	      </Slider>
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
				nowDoc.innerHTML = now.loc+"<br />"+now.temp+"\xB0C<br />"+now.con;
				var hourDoc = document.getElementById('wun');
				hourDoc.innerHTML = null;
				for (var div in hours) {
					hourDoc.appendChild(hours[div]);
				}
			}
		});
	}

}
