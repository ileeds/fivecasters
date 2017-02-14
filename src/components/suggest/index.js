// import preact
import { h, render, Component } from 'preact';
import style from './style_iphone';

//google maps search by current location and selected place
function search(name, x, y) {
	name="http://maps.google.com/?ll="+x+','+y+"&q="+name;
	window.open(name);
}

export default class Suggest extends Component {

  render() {
    return (
			<div id='results' class={ style.scroll }>
				Loading, please wait...
			</div>
		);
  }

	//gets current location, will lead to hitting foursquare api
	componentDidMount() {
		navigator.geolocation.getCurrentPosition(function(location) {
			var foursquare = (require('foursquarevenues'))('HJTXFPU0B2WFEZZTCN4223VERJBRELYL53TLIV2OEAIXMJBT', '23T2KUXPDQAYVKRG5JZILOHMBIWGOVKXNEIN0RGNXVUCR3VB');
			//outdoor seating close to current location
			var params = {
				"ll": location.coords.latitude+","+location.coords.longitude,
				"query": "outdoor seating"
			};
			foursquare.exploreVenues(params, function(error, venues) {
					if (!error) {
						var elem = document.getElementById('results');
						elem.innerHTML = null;
						//fill div with results
						venues.response.groups[0].items.forEach( function (place) {
							var sug = document.createElement('div');
							sug.innerHTML = place.venue.name;
							sug.onclick = function() {
								search(place.venue.name, location.coords.latitude, location.coords.longitude);
							}
							elem.appendChild(sug);
						});
					}
			});
		});
  }
}
