import Axios from 'axios';
import React from 'react';
export default class ResultSearchInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = { results: [] };
        this.searchQueryLast = '';
    }

    componentDidUpdate() {
        if (this.props.searchQuery === this.searchQueryLast) {
            return;
        }
        this.searchQueryLast = this.props.searchQuery
        this.requestApiResults(this.props.searchQuery)
    }



    /**
     * Create list view
     * @param {array|false} data 
     */
    buildView = (data) => {
        if (data === false) {
            return <li key="-1"><p>no results</p></li>
        }
        let results = data.results;
        return results.filter(r => { return r === null ? false : true }).map((r) => <li key={r.id}><div className="img-container"><img src={r.image} alt={r.name} /></div><p>{r.name}</p></li>);
    }

    /**
     * Retrieve Pokemon list by keyword from NodeJs middleware
     * @param {string} searchQuery 
     */
    requestApiResults(searchQuery) {
        if (searchQuery === '' || searchQuery.length <= 2) {
            this.setState({ results: this.buildView(false) })
            return false;
        }
        Axios.post('http://0.0.0.0:8080/search', { kwd: searchQuery }).then(r => {
            this.setState({ results: this.buildView((r.data.results.length > 0 ? r.data : false)) })
        }).catch(e => { console.log(e) })
    }


    render() {
        const { results } = this.state
        return (<div className='results'>
            <ul>{results}</ul></div>)
    }

}

