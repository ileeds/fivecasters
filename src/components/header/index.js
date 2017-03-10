//header component with app name

// import preact and style
import { h, render, Component } from 'preact';
import style from './style_iphone';


export default class Header extends Component {

	render() {
		//when clicked, scroll window to top
    return (
			<div class={style.container} onClick={() => window.scrollTo(0, 0)}>
				<p class={style.settings}>Sun<b>Diner</b></p>
			</div>
		);
  }

}
