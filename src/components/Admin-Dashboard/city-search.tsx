import { useState } from "react";
import axios from "axios";

interface CityData {
    name: string;
    lat: number;
    lng: number;
  }

const CitySearch = ({ onCitySelect }: { onCitySelect: (city: CityData) => void }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      try {
        const apiKey = "4a1c979b832d4e7a91939042039acd2b";
        const response = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
            value
          )}&key=${apiKey}&limit=5`
        );

        setSuggestions(
          response.data.results.map((result: any) => ({
            name: result.formatted,
            lat: result.geometry.lat,
            lng: result.geometry.lng,
          }))
        );
      } catch (error) {
        console.error("Error fetching city suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: CityData) => {
    setQuery(suggestion.name);
    setSuggestions([]);
    onCitySelect(suggestion);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Enter city name"
        className="border px-2 py-1 rounded-md w-full"
      />
      {suggestions.length > 0 && (
        <ul className="border rounded-md bg-white shadow-md mt-2">
          {suggestions.map((suggestion: CityData, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="cursor-pointer px-4 py-2 hover:bg-gray-200"
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CitySearch;
