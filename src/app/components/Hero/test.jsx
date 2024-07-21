// components/Search.js
import { useState } from 'react';

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query); // Call the onSearch function with the current query
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by title..."
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default Search;

// utils/fetchFromAPIs.js
const fetchFromAPIs = async (title) => {
    const apis = [
      'https://api1.example.com/products',
      'https://api2.example.com/products',
      'https://api3.example.com/products',
    ];
  
    const fetchPromises = apis.map(api => fetch(api).then(res => res.json()));
  
    const results = await Promise.all(fetchPromises);
  
    // Flatten the array of results and filter based on the title
    const filteredResults = results.flat().filter(product =>
      product.title.toLowerCase().includes(title.toLowerCase())
    );
  
    return filteredResults;
  };

// pages/index.js
import { useState } from 'react';
import Search from '../components/Search'; 
import { fetchFromAPIs } from '../utils/fetchFromAPIs';

const Home = () => {
  const [results, setResults] = useState([]);

  const handleSearch = async (title) => {
    const data = await fetchFromAPIs(title); // Fetch data from APIs using the title
    setResults(data); // Update the results state with the filtered data
  };

  return (
    <div>
      <Search onSearch={handleSearch} /> {/* Pass the handleSearch function to the Search component */}
      <div>
        {results.length > 0 ? (
          results.map((product, index) => (
            <div key={index}>
              <h3>{product.title}</h3>
              <p>{product.content}</p>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

// export default Home;

