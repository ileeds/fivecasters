// import preact
import { h, render, Component } from 'preact';
import style from './style_iphone';

export default class Item extends Component {

  render() {
    return (
			<div id='item' class={ style.item }>
        <img src={this.props.place.photo} alt="some_text" style="width:100%;height:150px;"></img>
        {JSON.stringify(this.props.place)}
			</div>
		);
  }

}
