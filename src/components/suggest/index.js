// import preact
import { h, render, Component } from 'preact';
import style from './style_iphone';
import Item from '../item/index.js'

//google maps search by current location and selected place
function search(name, x, y) {
	name="http://maps.google.com/?ll="+x+','+y+"&q="+name;
	window.open(name);
}

export default class Suggest extends Component {

  render() {
		//load until state retrieved
		if (this.state.items === undefined) return <div />;
    return (
			<div id='results' class={ style.scroll }>
			{this.state.items.map(function(item){
				return <Item place={item} />;
			})}
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
			"query": inOut+" seating",
			"openNow": 1,
			"venuePhotos": 1,
			"section": "food"
		};
		var items = [];
		var self = this;
		foursquare.exploreVenues(params, function(error, venues) {
				if (!error) {
					//fill div with results
					venues.response.groups[0].items.forEach( function (place) {
						var name = place.venue.name;
						var photo = place.venue.photos.groups[0].items[0].prefix+place.venue.photos.groups[0].items[0].width+"x"+place.venue.photos.groups[0].items[0].height+place.venue.photos.groups[0].items[0].suffix;
						var keyword = place.venue.categories[0].name;
						var price = place.venue.price.message;
						if (place.venue.hours == undefined){
							return;
						}
						var hours = place.venue.hours.status;
						var address = place.venue.location.address+", "+place.venue.location.city;
						var phone = place.venue.contact.formattedPhone;
						var distance = place.venue.location.distance+" meters";
						var rating = place.venue.rating;
						var site = place.venue.url;
						var toPush = {
							name: name,
							photo: photo,
							keyword: keyword,
							price: price,
							hours: hours,
							address: address,
							phone: phone,
							distance: distance,
							rating: rating,
							site: site
						};
						items.push(toPush);
						//sug.onclick = function() {
							//search(place.venue.name, self.props.loc.coords.latitude, self.props.loc.coords.longitude);
						//}
					});
					self.setState({items:items});
					self.forceUpdate();
				}
		});
  }
}
