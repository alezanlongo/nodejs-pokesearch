import React from 'react';
import debounced from 'lodash.debounce';

export default class SearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.emitChangeDebounced = debounced(this.emitChange, 200)
    }

    componentWillUnmount() {
        this.emitChangeDebounced.cancel();
    }


    handleChange(e) {
        this.emitChangeDebounced(e.target.value);
    }

    emitChange(value) {
        this.props.handleQuery(value)
    }

    render() {
        return (
            <input placeholder="Pokemon..." type="input" onChange={this.handleChange} defaultValue={this.props.value} />
        )
    }
}

