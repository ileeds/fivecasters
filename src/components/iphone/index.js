// import preact and style
import { h, render, Component } from 'preact';
import style_iphone from '../weather/style_iphone';
// import the Weather component
import Weather from '../weather';

export default class Iphone extends Component {
	// the main render method for the iphone component
	render() {
		// display all weather data
		return (
			<div class= { style_iphone.container }>
				<Weather class={ style_iphone.weather } />
			</div>
		);
	}

}
