import { useState } from "react";

export default function Search({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm); // Memanggil onSearch dengan searchTerm
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div className="flex gap-2">
          <input
            type="text"
            name="search"
            placeholder="Input pencarian"
            className="text-black font-outfit w-[555px] py-3 rounded-lg px-2 border border-3 border-gray-300"
            value={searchTerm} // Menghubungkan input dengan searchTerm
            onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm saat user mengetik
          />
          <button
            type="submit"
            className="bg-BiruPekat font-mono text-white w-[100px] font-semibold text-[18px] py-3 px-2 rounded-lg"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
