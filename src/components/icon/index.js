// import preact
import { h, render, Component } from 'preact';
import style from './style_iphone';


export default class Icon extends Component {

	render() {
		return (
			<img id="weatherPic" class={ style.image } alt="No Image Available"/>
		);
  }

}
