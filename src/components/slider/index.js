//slider component that allows user to select hour

// import preact, style, and helper functions
import { h, render, Component } from 'preact';
import style from './style_iphone';
import helper from '../../helpers'

export default class Slider extends Component {

	render() {
		//scrolls back to start when "now" clicked
    return (
			<div id="slideContainer">
				<div id='start' class={style.now} onClick={() => helper.scrollBack()}> Now </div>
				<div id='wun' class={ style.scroll } />
			</div>
		);
  }

}
