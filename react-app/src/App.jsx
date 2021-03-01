import './App.css';
import SeachInput from './components/SearchInput/SearchInput';
import ResultSearchInput from './components/ResultSearchInput/ResultSearchInput';
import { Component } from 'react';

export default class App extends Component {


  constructor(props) {
    super(props)
    this.state = {
      searchQuery: ''
    }
  }

  handleSearchQuery(kwd) {
    this.setState({ searchQuery: kwd })
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <nav><SeachInput handleQuery={this.handleSearchQuery.bind(this)} /></nav>
        </header>
          <ResultSearchInput searchQuery={this.state.searchQuery} />
      </div>
    )
  };
}


