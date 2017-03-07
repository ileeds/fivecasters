// import preact
import { h, render, Component } from 'preact';
import style from './style_iphone';
import Item from '../item/index.js';

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
		//indoor or outdoor seating depends on rain and temp
		var inOut = "outdoor";
		if (parseInt(this.props.rain)>0 || parseInt(this.props.temp)<8){
			inOut = "indoor";
		}
		var type = "";
		if (4<this.props.time && this.props.time<12){
			type += "breakfast ";
		}
		if (10<this.props.time && this.props.time<18) {
			type += "lunch ";
		}
		if (16<this.props.time && this.props.time<24) {
			type += "dinner ";
		}
		if (20<this.props.time && this.props.time<25 || -1<this.props.time && this.props.time<6) {
			type += "late night ";
		}
		var foursquare = (require('foursquarevenues'))('HJTXFPU0B2WFEZZTCN4223VERJBRELYL53TLIV2OEAIXMJBT', '23T2KUXPDQAYVKRG5JZILOHMBIWGOVKXNEIN0RGNXVUCR3VB');
		//outdoor seating close to current location
		var params = {
			"ll": this.props.loc.coords.latitude+","+this.props.loc.coords.longitude,
			"query": type+inOut+" seating",
			"venuePhotos": 1,
			"section": "food",
      "limit": 15
		};
		var items = [];
		var self = this;
		foursquare.exploreVenues(params, function(error, venues) {
				if (!error) {
					//fill div with results
					venues.response.groups[0].items.forEach( function (place) {
						if (place.venue.location.distance == undefined || place.venue.categories[0].name == undefined || place.venue.price == undefined || place.venue.photos.groups[0] == undefined || place.venue.location.city == undefined || place.venue.location.address == undefined){
							return;
						}
						var name = place.venue.name;
						var photo = place.venue.photos.groups[0].items[0].prefix+place.venue.photos.groups[0].items[0].width+"x"+place.venue.photos.groups[0].items[0].height+place.venue.photos.groups[0].items[0].suffix;
						var keyword = place.venue.categories[0].name;
						var price = place.venue.price.message;
						//var hours = place.venue.hours.status;
						var address = place.venue.location.address+", "+place.venue.location.city;
						var distance = Math.round(0.000621371*parseInt(place.venue.location.distance) * 10) / 10 +"Miles";
						var site = place.venue.url;
						var x = self.props.loc.coords.latitude;
						var y = self.props.loc.coords.longitude;
						var toPush = {
							name: name,
							photo: photo,
							keyword: keyword,
							price: price,
							//hours: hours,
							address: address,
							distance: distance,
							site: site,
							x: x,
							y: y
						};
						items.push(toPush);
					});
					self.setState({items:items});
					self.forceUpdate();
				}
		});
  }
}
