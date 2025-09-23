import React, { useState } from "react";

function SearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchClick = () => {
        if (onSearch) {
            onSearch(searchTerm);
        }
    };

    return (
        <div>
            <input 
                type="text" 
                value={searchTerm} 
                onChange={handleInputChange}
                placeholder="Search for songs..."
            />
            <button type="button" onClick={handleSearchClick}>
                Search
            </button>
        </div>
    );
}

export default SearchBar;