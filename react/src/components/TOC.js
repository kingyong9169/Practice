import React, { Component } from 'react'
class TOC extends Component {
    shouldComponentUpdate(newProps, newState) {
        if (this.props.data === newProps.data)
            return false;
        return true;
    }
    render() {
        console.log('TOC', this.props.data);
        var lists = [];
        var i = 0;
        var data = this.props.data;
        while (i < data.length) {
            lists.push(
                <li key={data[i].id}>
                    <a
                        href={"/Content" + data[i].id}
                        data-id={data[i].id}
                        onClick={function (e) {
                            e.preventDefault();
                            this.props.onChangePage(e.target.dataset.id);
                        }.bind(this)}>{data[i].title}</a>
                </li>);
            i++;
        }
        return (
            <nav>
                <ul>
                    {lists}
                </ul>
            </nav>
        );
    }
}

export default TOC;