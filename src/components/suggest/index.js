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
			{this.state.items.map(function(item) {
				return <Item place={item} />;
			})}
			</div>
		);
  }

	//gets current location, will lead to hitting foursquare api
	componentDidMount() {
		//indoor or outdoor seating depends on rain and temp
		var inOut = "outdoor";
    var rain = "";
    //chance of rain
    if (this.props.rain.charAt(0) == 'x') {
      if (parseInt(this.props.rain.substring(1))>=20 || parseInt(this.props.temp)<15){
  			inOut = "indoor";
  		}
    //amount of rain
    } else {
      if (parseInt(this.props.rain)>0 || parseInt(this.props.temp)<15){
  			inOut = "indoor";
  		}
    }
		var type = "";
    var time = this.props.time;
		if (4<time && time<12){
			type += "breakfast ";
		}
		if (10<time && time<18) {
			type += "lunch ";
		}
		if (16<time && time<24) {
			type += "dinner ";
		}
		if (20<time && time<25 || -1<time && time<6) {
			type += "late night ";
		}
		var foursquare = (require('foursquarevenues'))('HJTXFPU0B2WFEZZTCN4223VERJBRELYL53TLIV2OEAIXMJBT', '23T2KUXPDQAYVKRG5JZILOHMBIWGOVKXNEIN0RGNXVUCR3VB');
		//outdoor seating close to current location
		var params = {
			"ll": this.props.loc.coords.latitude+","+this.props.loc.coords.longitude,
			"query": type+inOut+" seating",
			"venuePhotos": 1,
			"section": "food",
      "radius": 1609.344
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

						var hourStart = place.venue.name.toUpperCase().charCodeAt(0)-67;
            if (hourStart < 0) {
              hourStart+=10;
            }
            if (time < hourStart) {
              return;
            }
            var hourEnd = place.venue.name.toUpperCase().charCodeAt(1)-67;
            if (hourEnd < 0) {
              hourEnd+=20;
            }
            if (time >= hourEnd) {
              return;
            }

						var address = place.venue.location.address+", "+place.venue.location.city;
						var distance = Math.round(0.000621371*parseInt(place.venue.location.distance) * 10) / 10 +"Miles";
						var site = place.venue.url;
						var x = self.props.loc.coords.latitude;
						var y = self.props.loc.coords.longitude;
            var temp = self.props.temp;
            var con = self.props.con;
						var toPush = {
							name: name,
							photo: photo,
							keyword: keyword,
							price: price,
							hourStart: hourStart,
              hourEnd: hourEnd,
							address: address,
							distance: distance,
							site: site,
							x: x,
							y: y,
              temp: temp,
              con: con
						};
						items.push(toPush);
					});
					self.setState({items:items});
					self.forceUpdate();
				}
		});
  }
}
