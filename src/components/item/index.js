// import preact
import {h, render, Component} from 'preact';
import style from './style_iphone';
import itemIcon from '../../assets/icons/itemIconWhite.png';

export default class Item extends Component {

	render() {
		return (
			<div id='item' class={ style.item }>
				<div class={style.imgContainer}>
					<img src={this.props.place.photo} alt="some_text" ></img>
				</div>
				<div class={style.blueBox}>
					<ul>
						<li><img src={itemIcon} alt="weather of area"/></li>
						<li><p>10 clear</p></li>
						<li><p>{this.props.place.hours}</p></li>
					</ul>
				</div>
				<div class={style.titleDiv}>
					<h1>{this.props.place.name}</h1>
					<p>{this.props.place.keyword}</p>
					<span>{this.props.place.price}</span>
				</div>
				<p className="address">{this.props.place.address}</p>

			</div>
		);
	}

}
