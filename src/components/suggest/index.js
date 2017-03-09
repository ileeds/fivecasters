// import preact
import {h, render, Component} from 'preact';
import style from './style_iphone';
import Item from '../item/index.js';
import helper from '../../helpers';

export default class Suggest extends Component {

	render() {
		//load until state retrieved
		if (this.state.items === undefined) return <div /> ;
		if (this.state.items === 1) return <div class={style.noResults}>No Results for this Hour :(</div> ;
		return (
			<div id = "cont" class = {style.container} >
				<div id = 'results' class = {style.scroll} >
				{this.state.items.map(function(item) {
					return <Item place = {item}/>;
				})}
				</div>
			</div>
		);
	}

	//gets current location, will lead to hitting foursquare api
	componentDidMount() {
		//indoor or outdoor seating depends on rain and temp
		let inOut = "outdoor";
		let rain = "";
		//chance of rain
		if (this.props.rain.charAt(0) === 'x') {
			if (parseInt(this.props.rain.substring(1), 10) >= 20 || parseInt(this.props.temp, 10) < 15) {
				inOut = "indoor";
			}
			//amount of rain
		} else if (parseInt(this.props.rain, 10) > 0 || parseInt(this.props.temp, 10) < 15) {
			inOut = "indoor";
		}
		let type = "";
		let time = this.props.time;
		if (4 < time && time < 12) {
			type += "breakfast ";
		}
		if (10 < time && time < 18) {
			type += "lunch ";
		}
		if (16 < time && time < 24) {
			type += "dinner ";
		}
		if (20 < time && time < 25 || -1 < time && time < 6) {
			type += "late night ";
		}
		const foursquare = (require('foursquarevenues'))('HJTXFPU0B2WFEZZTCN4223VERJBRELYL53TLIV2OEAIXMJBT', '23T2KUXPDQAYVKRG5JZILOHMBIWGOVKXNEIN0RGNXVUCR3VB');
		//outdoor seating close to current location
		const params = {
			"ll": this.props.loc.coords.latitude + "," + this.props.loc.coords.longitude,
			"query": type + inOut + " seating",
			"venuePhotos": 1,
			"section": "food",
			"radius": 1609.344
		};
		let itemsArray = [];
		const self = this;
		foursquare.exploreVenues(params, function(error, venues) {
			if (!error) {
				let count = 0;
				//fill div with results
				venues.response.groups[0].items.forEach(function(place) {
					if (place.venue.location.distance === undefined || place.venue.categories[0].name === undefined || place.venue.price === undefined || place.venue.photos.groups[0] === undefined || place.venue.location.city === undefined || place.venue.location.address === undefined) {
						return;
					}
					let hourSt = helper.fakeTime(place, 0, 5);
					let hourE = helper.fakeTime(place, 1, 17);
					if (hourE > 23) {
						hourE -= 24;
						if (time < hourSt && time >= hourE) {
							return;
						}
					} else if (time >= hourE || time < hourSt) {
						return;
					}
					const toPush = {
						name: place.venue.name,
						photo: place.venue.photos.groups[0].items[0].prefix + place.venue.photos.groups[0].items[0].width + "x" + place.venue.photos.groups[0].items[0].height + place.venue.photos.groups[0].items[0].suffix,
						keyword: place.venue.categories[0].name,
						price: place.venue.price.message,
						hourStart: hourSt,
						hourEnd: hourE,
						address: place.venue.location.address + ", " + place.venue.location.city,
						distance: Math.round(0.000621371 * parseInt(place.venue.location.distance, 10) * 10) / 10 + "Miles",
						site: place.venue.url,
						x: self.props.loc.coords.latitude,
						y: self.props.loc.coords.longitude,
						temp: self.props.temp,
						con: self.props.con
					};
					itemsArray.push(toPush);
					count++;
				});
				if (count > 0) {
					self.setState({
						items: itemsArray
					});
				} else {
					self.setState({
						items: 1
					});
				}
				self.forceUpdate();
			}
		});
	}
}
