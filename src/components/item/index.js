// import preact
import { h, render, Component } from 'preact';
import style from './style_iphone';

export default class Item extends Component {

  render() {
    return (
			<div id='item' class={ style.item }>
        {JSON.stringify(this.props.place)}
			</div>
		);
  }

}
