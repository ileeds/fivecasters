// import preact
import { h, render, Component } from 'preact';
import style from './style_iphone';


export default class Header extends Component {

	render() {
    return (
			<div style="z-index: 5; background: white; position:fixed; height:50px; width:100%" onClick={() => window.scrollTo(0, 0)}>
				<p class={style.settings}>Sun<b>Diner</b></p>
			</div>
		);
  }

}
