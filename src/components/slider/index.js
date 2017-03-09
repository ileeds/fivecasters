// import preact
import { h, render, Component } from 'preact';
import style from './style_iphone';
import helper from '../../helpers'

export default class Slider extends Component {

	render() {
    return (
			<div id="slideContainer">
				<div id='start' class={style.now} onClick={() => helper.scrollBack()}> Now </div>
				<div id='wun' class={ style.scroll } />
			</div>
		);
  }

}
