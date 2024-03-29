import './SearchBar.css';
import React from 'react';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }
    search(term) {
        this.props.onSearch(term);
    }
    handleTermChange(e) {
        this.search(e.target.value);
    }
    render() {
        return (
            <div className="SearchBar">
                <input placeholder="Enter A Song, Album, or Artist"
                       onChange={this.handleTermChange} />
                <button className="SearchButton">SEARCH</button>
            </div>

        );
    }
}

export default SearchBar;