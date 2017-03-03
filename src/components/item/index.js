// import preact
import {h, render, Component} from 'preact';
import style from './style_iphone';
import itemIcon from '../../assets/icons/itemIconWhite.png';

//google maps search by current location and selected place
function search(name, x, y) {
	name = "http://maps.google.com/?ll=" + x + ',' + y + "&q=" + name;
	window.open(name);
}

function site(url, name) {
	if (url != null) {
		window.open(url);
	} else {
		window.open("https://www.google.co.uk/search?q="+name);
	}
}

export default class Item extends Component {

	render() {
		return (
			<div id='item' class={ style.item }>
					<div onClick={() => site(this.props.place.site, this.props.place.name)}>
						<div class={style.imgContainer}>
							<img src={this.props.place.photo} alt="some_text"></img>
						</div>
						<div>
							<span class={style.blueBox}>{this.props.place.hours}</span>
						</div>
						<div class={style.titleDiv}>
							<h1>{this.props.place.name}</h1>
							<p>{this.props.place.keyword}</p>
							<span>&pound;  {this.props.place.price}</span>
						</div>
					</div>
					<p class={style.address}
					   onClick={() => search(this.props.place.name, this.props.place.x, this.props.place.y)}>{this.props.place.address} {this.props.place.distance}</p>
			</div>
		);
	}

}
