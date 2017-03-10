//individual restaurants rendered based on data from suggest parent component

// import preact, style, itemIcon, and helper methods
import {h, render, Component} from 'preact';
import style from './style_iphone';
import itemIcon from '../../assets/icons/itemIconWhite.png';
import helper from '../../helpers'


export default class Item extends Component {

	render() {
		//style data for this item component passed from suggest
		return (
			<div id='item' class={ style.item }>
				{/*search for restaurant's website when clicked*/}
				<div onClick={() => helper.site(this.props.place.site, this.props.place.name)}>
					<div class={style.imgContainer}>
						<img src={this.props.place.photo} alt="some_text"></img>
					</div>
					<div class={style.blueBox}>
						<ul>

							<li><p>{this.props.place.temp}&deg;C {this.props.place.con.toLowerCase()}</p></li>
							<li><p class={style.timing}>{this.props.place.hourStart}:00 - {this.props.place.hourEnd}:00</p></li>
						</ul>
					</div>
					<div class={style.titleDiv}>
						<h1>{this.props.place.name}</h1>
						<p>{this.props.place.keyword}</p>
						<p class={style.pricing}>&pound;  {this.props.place.price}</p>
					</div>
				</div>
				{/*search for location of restaurant from current location on google maps when clicked*/}
				<div onClick={() => helper.search(this.props.place.name, this.props.place.x, this.props.place.y)}>
					<p class={style.address}>
						{this.props.place.address}
					</p>
					<p class={style.distance}>
						{this.props.place.distance}
					</p>
				</div>
			</div>
		);
	}

}
