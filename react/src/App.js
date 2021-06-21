import React, { Component } from 'react';
import TOC from "./components/TOC"
import ReadContent from "./components/ReadContent"
import CreateContent from "./components/CreateContent"
import UpdateContent from "./components/UpdateContent"
import Subject from "./components/Subject"
import Control from './components/Control';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.max_content_id = 3;
    this.state = {
      mode: 'read',
      selected_content_id: 2,
      Subject: { title: 'WEB', sub: 'world wide web' },
      welcome: { title: 'welcome', desc: 'Hello, React!!' },
      Content: [
        { id: 1, title: 'HTML', desc: 'HTML is for information' },
        { id: 2, title: 'CSS', desc: 'CSS is for design' },
        { id: 3, title: 'JavaScript', desc: 'JavaScript is for interactive' }
      ]
    }
  }
  getReadContent() {
    var i = 0;
    while (i < this.state.Content.length) {
      var data = this.state.Content[i];
      if (data.id === this.state.selected_content_id) {
        return data;
      }
      i++;
    }
  }
  getContent() {
    var _title, _desc, _article = null;
    if (this.state.mode === 'welcome') {
      _title = this.state.welcome.title;
      _desc = this.state.welcome.desc;
      _article = <ReadContent title={_title} desc={_desc}></ReadContent>
    }
    else if (this.state.mode === 'read') {
      var _content = this.getReadContent();
      _article = <ReadContent title={_content.title} desc={_content.desc}></ReadContent>
    }
    else if (this.state.mode === 'create') {
      _article = <CreateContent onSubmit={function (_title, _desc) {
        this.max_content_id++;
        // this.state.Content.push(
        //   { id: this.max_content_id, title: _title, desc: _desc }
        // );
        var _contents = Array.from(this.state.Content);
        _contents.push({ id: this.max_content_id, title: _title, desc: _desc })
        // var _contents = this.state.Content.concat(
        //   { id: this.max_content_id, title: _title, desc: _desc }
        // )
        // console.log('prev', this.state.Content);
        this.setState({
          Content: _contents,
          mode: 'read',
          selected_content_id: this.max_content_id
        });
      }.bind(this)}></CreateContent>
    }
    else if (this.state.mode === 'update') {
      _content = this.getReadContent();
      _article = <UpdateContent data={_content} onSubmit={
        function (_id, _title, _desc) {
          var _content = Array.from(this.state.Content);
          var i = 0;
          while (i < _content.length) {
            if (_content[i].id === _id) {
              _content[i] = { id: _id, title: _title, desc: _desc }
              break;
            }
            i++;
          }
          this.setState({
            Content: _content,
            mode: 'read'
          });
        }.bind(this)}></UpdateContent>
    }
    return _article;
  }

  render() {
    return (
      <div className="App">
        <Subject title={this.state.Subject.title}
          sub={this.state.Subject.sub}
          onChangePage={function () {
            this.setState({
              mode: 'welcome'
            });
          }.bind(this)}></Subject>
        <TOC onChangePage={function (id) {
          this.setState({
            mode: 'read',
            selected_content_id: Number(id)
          })
        }.bind(this)}
          data={this.state.Content}></TOC>
        {this.getContent()}
        <Control onChangeMode={function (_mode) {
          if (_mode === 'delete') {
            if (window.confirm('really?')) {
              var _contents = Array.from(this.state.Content);
              var i = 0;
              while (i < this.state.Content.length) {
                if (_contents[i].id === this.selected_content_id) {
                  _contents.splice(i, 1);
                  break;
                }
                i++;
              }
              this.setState({
                mode: 'welcome',
                Content: _contents
              })
              alert('deleted');
            }
          } else {
            this.setState({
              mode: _mode
            })
          }
        }.bind(this)}></Control>
      </div>

    );
  }
}

export default App;