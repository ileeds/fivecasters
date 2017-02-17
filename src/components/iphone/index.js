// import preact
import { h, render, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';
import style_iphone from '../button/style_iphone';
import style_iphone_two from '../suggest/style_iphone';
// import the Button component
import Button from '../button';
import Suggest from '../suggest';

export default class Iphone extends Component {
	// the main render method for the iphone component
	render() {
		// display all weather data
		return (
			<div class= { style_iphone.container }>
				<Button class={ style_iphone.button } />
			</div>
		);
	}

}
