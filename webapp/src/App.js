import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      ssid: '',
      pw: ''
    }
  }
  handleChange = (e) => {
    const target = e.target;
    const name = target.name
    const value = target.type === 'checkbox'
        ? target.checked
        : target.value
    this.setState({ [name]: value });
  }

  handleSubmit = (e) => {
    console.log('SSID: ' + this.state.ssid);
    console.log('PW: ' + this.state.pw);
    e.preventDefault();
    // fetch(url, {
    //   method: "POST",
    //   body: JSON.stringify(data),
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   credentials: "same-origin"
    // }).then((response) => {
    //   response.status     //=> number 100–599
    //   response.statusText //=> String
    //   response.headers    //=> Headers
    //   response.url        //=> String
    //
    //   return response.text()
    // }, (error) => {
    //   error.message //=> String
    // })
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <form onSubmit={this.handleSubmit}>
            <label>SSID:
              <input type="text" name="ssid" value={this.state.ssid} onChange={this.handleChange}/>
            </label>
            <br />
            <label>PW:
              <input type="text" name="pw" value={this.state.pw} onChange={this.handleChange}/>
            </label>
            <br />
            <input type="submit" value="Submit" />
          </form>
        </header>
      </div>
    );
  }
}

export default App;
