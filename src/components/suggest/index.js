// import preact
import { h, render, Component } from 'preact';
import style from './style_iphone';
import Button from '../button/index.js'

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
		//indoor or outdoor seating depends on rain
		var inOut = "outdoor";
		if (parseInt(this.props.rain)>0){
			inOut = "indoor";
		}
		var foursquare = (require('foursquarevenues'))('HJTXFPU0B2WFEZZTCN4223VERJBRELYL53TLIV2OEAIXMJBT', '23T2KUXPDQAYVKRG5JZILOHMBIWGOVKXNEIN0RGNXVUCR3VB');
		//outdoor seating close to current location
		var params = {
			"ll": this.props.loc.coords.latitude+","+this.props.loc.coords.longitude,
			"query": inOut+" seating"
		};
		foursquare.exploreVenues(params, function(error, venues) {
				if (!error) {
					var elem = document.getElementById('results');
					elem.innerHTML = null;
					//fill div with results
					venues.response.groups[0].items.forEach( function (place) {
						var sug = document.createElement('div');
						sug.className = style.each;
						sug.innerHTML = place.venue.name;
						var self = this;
						sug.onclick = function() {
							search(place.venue.name, self.props.loc.coords.latitude, self.props.loc.coords.longitude);
						}
						elem.appendChild(sug);
					});
				}
		});
  }
}
