// import preact
import {h, render, Component} from 'preact';
import style from './components/weather/style_iphone';
import Suggest from './components/suggest/index';

export default {
	timeClick(clicked, self, hours, now) {
		var d = new Date();
		var n = d.getHours();
		var time = parseInt(clicked.currentTarget.innerHTML);
		if (isNaN(time)) {
			time = n;
		}
		var focus = document.getElementsByClassName(style.hour);
		for (var i = 0; i < focus.length; i++) {
			focus[i].style.borderBottom = "";
		}

		var unfocus = document.getElementById('start');
		unfocus.style.borderBottom = "2.5pt solid  #000000";

		clicked.currentTarget.style.borderBottom = "2.5pt solid  #4A90E2";
		var hourDoc = document.getElementById('wrap');
		var diff = parseInt(clicked.target.innerHTML) - n - 1;
		if (diff < 0) {
			diff += 24;
		}
		var forState;
		var rain;
		if (isNaN(diff)) {
			hourDoc.replaceChild(now, hourDoc.childNodes[0]);
			forState = now;
			rain = forState.value;

		} else {
			hourDoc.replaceChild(hours[diff], hourDoc.childNodes[0]);
			forState = hours[diff];
			rain = "x" + forState.value;
		}
		var replace = render( < Suggest temp = {
					forState.childNodes[2].innerHTML.slice(0, -2)
				}
				con = {
					forState.childNodes[4].innerHTML.slice(0)
				}
				rain = {
					rain
				}
				loc = {
					self.state.loc
				}
				time = {
					time
				}
				/>);
				var parent = document.getElementById("cont");
				parent.replaceChild(replace, parent.childNodes[0]);
				this.picReplace(forState.querySelector("h3").innerHTML);
			},

			//updates weather picture when new time is selected
			picReplace(con) {
				var img = document.getElementById('weatherPic');
				if (con.includes("Partly Cloudy")){
					img.src = "../../assets/icons/Partly-cloudy-01.jpg";
				} else if (con.includes("Sun")){
					img.src = "../../assets/icons/Sunny-01.jpg";
				} else if (con.includes("Mostly Cloudy")){
					img.src = "../../assets/icons/Mostly-cloudy-01.jpg";
				} else if (con.includes("Scattered Clouds")){
					img.src = "../../assets/icons/Scattered-cloud-01.jpg";
				} else if (con.includes("Cloud")){
					img.src = "../../assets/icons/Cloudy-01.jpg";
				} else if (con.includes("Fog")) {
					img.src = "../../assets/icons/Fog-01.jpg";
				} else if (con.includes("Rain Mist")){
					img.src = "../../assets/icons/Rain-mist-01.jpg";
				} else if (con.includes("Rain Showers")){
					img.src = "../../assets/icons/Rain-shower-2nd-01.jpg";
				} else if (con.includes("Hail")){
					img.src = "../../assets/icons/Hail-shower-01.jpg";
				} else if (con.includes("Rain")) {
					img.src = "../../assets/icons/Rain-01.jpg";
				} else if (con.includes("Sleet")) {
					img.src = "../../assets/icons/Sleet-01.jpg";
				} else if (con.includes("Thunderstorms and Rain")) {
					img.src = "../../assets/icons/Thunderstorm-and-rain-01.jpg";
				} else if (con.includes("Thunderstorms and Snow")) {
					img.src = "../../assets/icons/Thunderstorm-and-snow-01-01.jpg";
				} else if (con.includes("Thunderstorms and Ice Pellets")) {
					img.src = "../../assets/icons/Thunderstorm-and-ice-pellets-01.jpg";
				} else if (con.includes("Thunderstorms with")) {
					img.src = "../../assets/icons/Thunderstorm-and-hail-01.jpg";
				} else if (con.includes("Thunder")) {
					img.src = "../../assets/icons/Thunderstorm-01.jpg";
				} else if (con.includes("Drizzle")){
					img.src = "../../assets/icons/Drizzle-01.jpg";
				} else if (con.includes("Snow Shower")){
					img.src = "../../assets/icons/Snow-shower-01-01.jpg";
				} else if (con.includes("Snow Grains")){
					img.src = "../../assets/icons/Snow-grain-01.jpg";
				} else if (con.includes("Snow")){
					img.src = "../../assets/icons/Snow-01.jpg";
				} else if (con.includes("Ice")){
					img.src = "../../assets/icons/Snow-01.jpg";
				} else if (con.includes("Hail")){
					img.src = "../../assets/icons/Hail-shower-01.jpg";
				} else if (con.includes("Spray")){
					img.src = "../../assets/icons/Spray-01.jpg";
				} else if (con.includes("Overcast")){
					img.src = "../../assets/icons/Overcast-01.jpg";
				} else if (con.includes("Clear")){
					img.src = "../../assets/icons/Clear0-1.jpg";
				} else {
					img.src = "../../assets/icons/Haze-01.jpg";
				}
			},

			//daily data returned to component
			conditions(parsed_json) {
				var toReturn = {
					loc: parsed_json['current_observation']['display_location']['city'],
					temp: Math.round(parsed_json['current_observation']['temp_c']),
					con: parsed_json['current_observation']['weather'],
					prec: parsed_json['current_observation']['precip_1hr_in']
				}
				return toReturn;
			},

			//hourly data passed to callback function
			hourly(parsed_json, callback) {
				var toReturn = {};
				for (var i = 0; i < 23; i++) {
					var temp_c = Math.round(parsed_json['hourly_forecast'][i]['temp']['metric']);
					var conditions = parsed_json['hourly_forecast'][i]['wx'];
					var hour = document.createElement('div');
					hour.value = parsed_json['hourly_forecast'][i]['pop'];
					hour.className = style.weatherLater;
					hour.innerHTML = "<h2>" + temp_c + "\xB0C</h2><br/><h3>" + conditions + "</h3><br/><h4>Chance of rain: " + hour.value + "&#37;</h4>";
					toReturn[i] = hour;
				}
				callback(toReturn);
			},

			//google maps search by current location and selected place
			search(name, x, y) {
				name = "http://maps.google.com/?ll=" + x + ',' + y + "&q=" + name;
				window.open(name);
			},

			site(url, name) {
				if (url != null) {
					window.open(url);
				} else {
					window.open("https://www.google.co.uk/search?q=" + name);
				}
			},

			scrollBack() {
				var scroll = document.getElementById('wun');
				scroll.scrollLeft = 0;
			}

	}
