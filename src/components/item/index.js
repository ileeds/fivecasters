// import preact
import {h, render, Component} from 'preact';
import style from './style_iphone';
import itemIcon from '../../assets/icons/itemIconWhite.png';

export default class Item extends Component {

	render() {
		return (
			<div id='item' class={ style.item }>
				<div className={style.imgContainer}>
					<img src={this.props.place.photo} alt="some_text" ></img>
				</div>
				<div className="blueBox">
					<ul>
						<li><img src={itemIcon} alt="weather of area"/></li>
						<li>10 clear</li>
						<li>{this.props.place.hours}</li>
					</ul>
				</div>
				<div className="titleDiv">
					<h1>{this.props.place.name}</h1>
					<p>{this.props.place.keyword}</p>
					<span>{this.props.place.price}</span>
				</div>
				<p className="address">{this.props.place.address}</p>

			</div>
		);
	}

}
