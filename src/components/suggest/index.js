//component that wraps child item components, feeding data based on results from foursquare api

//import preact, style, item component, and helper methods
import {h, render, Component} from 'preact';
import style from './style_iphone';
import Item from '../item/index.js';
import helper from '../../helpers';

export default class Suggest extends Component {

	render() {
		//load until data retrieved
		if (this.state.items === undefined) return <div /> ;
		//if api call does not yield results, tell user
		if (this.state.items === 1) return <div class={style.noResults}>No Results for this Hour :(</div> ;
		return (
			<div id = "cont" class = {style.container} >
				<div id = 'results' class = {style.scroll} >
				{/*render items from data in this.state.items array*/}
				{this.state.items.map(function(item) {
					return <Item place = {item}/>;
				})}
				</div>
			</div>
		);
	}

	//get data from foursquare api
	componentDidMount() {
		//indoor or outdoor seating depends on rain and temp (temp<15, then indoor ... rain depends)
		let inOut = "outdoor";
		//chance of rain, if greater than 20 indoor
		if (this.props.rain.charAt(0) === 'x') {
			if (parseInt(this.props.rain.substring(1), 10) >= 20 || parseInt(this.props.temp, 10) < 15) {
				inOut = "indoor";
			}
		//amount of rain, if raining at all indoor
		} else if (parseInt(this.props.rain, 10) > 0 || parseInt(this.props.temp, 10) < 15) {
			inOut = "indoor";
		}
		//based on time, generate query for meal at that time of day
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
		//query based on location, meal, seating, within 1 mile
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
				//keep track of total results, in case none found
				let count = 0;
				//fill div with results
				venues.response.groups[0].items.forEach(function(place) {
					//skip restaurants that do not meet certain data requirements
					if (place.venue.location.distance === undefined || place.venue.categories[0].name === undefined || place.venue.price === undefined || place.venue.photos.groups[0] === undefined || place.venue.location.city === undefined || place.venue.location.address === undefined) {
						return;
					}
					//fake start and end times based on name of restaurant
					//foursquare does not allow to search for restaurants based on time
					let hourSt = helper.fakeTime(place, 0, 5);
					let hourE = helper.fakeTime(place, 1, 17);
					//check if restaurant open during selected time
					if (hourE > 23) {
						hourE -= 24;
						if (time < hourSt && time >= hourE) {
							return;
						}
					} else if (time >= hourE || time < hourSt) {
						return;
					}
					//push data to itemsArray
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
					//increment count if found restaurant
					count++;
				});
				//conditionally render results if results obtained
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
