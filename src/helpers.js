// import preact
import { h, render, Component } from 'preact';
import style from './components/weather/style_iphone';
import Suggest from './components/suggest/index';

export default {
  timeClick(clicked, self, hours, now) {
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
  	var rain;
  	if (isNaN(diff)){
  		hourDoc.replaceChild(now, hourDoc.childNodes[0]);
  		forState = now;
  		rain = forState.value;

  	} else {
  		hourDoc.replaceChild(hours[diff], hourDoc.childNodes[0]);
  		forState = hours[diff];
  		rain = "x"+forState.value;
  	}
  	var replace = render(<Suggest temp = {forState.childNodes[2].innerHTML.slice(0,-2)} con = {forState.childNodes[4].innerHTML.slice(0)} rain = {rain} loc = {self.state.loc} time = {time}/>);
  	var parent = document.getElementById("cont");
  	parent.replaceChild(replace, parent.childNodes[0]);
  	this.picReplace(forState.querySelector("h3").innerHTML);
  },

  //updates weather picture when new time is selected
  picReplace(con) {
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
  },

  //daily data returned to component
  conditions (parsed_json) {
  	var toReturn = {
  		loc: parsed_json['current_observation']['display_location']['city'],
  		temp: Math.round(parsed_json['current_observation']['temp_c']),
  		con: parsed_json['current_observation']['weather'],
  		prec: parsed_json['current_observation']['precip_1hr_in']
  	}
  	return toReturn;
  },

  //hourly data passed to callback function
  hourly (parsed_json, callback) {
  	var toReturn = {};
  	for (var i=0; i<23; i++){
  		var temp_c = Math.round(parsed_json['hourly_forecast'][i]['temp']['metric']);
  		var conditions = parsed_json['hourly_forecast'][i]['wx'];
  		var hour = document.createElement('div');
  		hour.value = parsed_json['hourly_forecast'][i]['pop'];
  		hour.className = style.weather;
  		hour.innerHTML = "<h2>"+temp_c+"\xB0C</h2><br/><h3>"+conditions+"</h3><br/><h4>"+hour.value+"</h4>";
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
  }

}
