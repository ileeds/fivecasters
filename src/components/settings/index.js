// import preact
import {h, render, Component} from 'preact';
import style from './style_iphone';
import itemIcon from '../../assets/icons/itemIconWhite.png';

export default class Item extends Component {

	render() {
		return (
			<div id='back' class={ style.back }>
				Settings
				<button id="settings" onclick={() => {this.settings()}} type="button">Back</button>
			</div>
		);
	}

	settings() {
		this.props.onChange(false);
	}

}
