import { useState, useEffect } from "react";

export default function App() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("title");
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [warning, setWarning] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
  setQuery(""); // to clear the input whenever filter changes..
}, [filter]);

const searchBooks = async (e, newPage = 1) => {
  if (e) e.preventDefault();
  if (!query.trim()) {
    setWarning("⚠️ Please enter something to search.");
    return;
  }

  setWarning("");
  setLoading(true);
  setError("");
  setBooks([]);

  try {
    let url = `https://openlibrary.org/search.json?`;

    if (filter === "year") {
  // do a broad search (e.g., by title) first
  url += `title=${encodeURIComponent(query)}&page=${newPage}`;
} 
// for handling title, author, subject, isbn, publisher
else {
  url += `${filter}=${encodeURIComponent(query)}&page=${newPage}`;
}


    const res = await fetch(url);
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();

    let results = data.docs;

    // Extra filter for year
    if (filter === "year") {
      const year = parseInt(query, 10);
      if (!isNaN(year)) {
        results = results.filter(
          (book) => book.first_publish_year === year
        );
      } else {
        results = [];
      }
    }

    if (results.length === 0) {
      setError("No results found.");
    } else {
      setBooks(results.slice(0, 12));
      setPage(newPage);
      setTotalPages(Math.ceil(data.numFound / 12));
    }
  } catch (err) {
    setError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};


  // add or remove favorites
  const toggleFavorite = (book) => {
    if (favorites.find((fav) => fav.key === book.key)) {
      setFavorites(favorites.filter((fav) => fav.key !== book.key));
    } else {
      setFavorites([...favorites, book]);
    }
  };

  const isFavorite = (book) =>
    favorites.some((fav) => fav.key === book.key);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col items-center p-6">
      {/* Header */}
{/* Header / Navbar */}
<header className="w-full bg-gray-900 text-white shadow-md">
  <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
    
    {/* Title as Home link */}
    <button
      onClick={() => {
        setActiveTab("home");
        setQuery("");
        setBooks([]);
        setPage(1);
      }}
      className="text-3xl font-extrabold tracking-wide"
    >
      <span className="text-red-500">Book</span><span className="text-green-500">Finder</span>  
    </button>

    {/* Right side nav buttons */}
    <div className="flex gap-4">
      <button
        onClick={() => setActiveTab("home")}
        className={`px-4 py-2 rounded-lg font-medium transition ${
          activeTab === "home"
            ? "bg-orange-500 text-white"
            : "hover:text-orange-400"
        }`}
      >
        🏠 Home
      </button>
      <button
        onClick={() => setActiveTab("search")}
        className={`px-4 py-2 rounded-lg font-medium transition ${
          activeTab === "search"
            ? "bg-red-600 text-white"
            : "hover:text-red-400"
        }`}
      >
        🔍 Search
      </button>
      <button
        onClick={() => setActiveTab("favorites")}
        className={`px-4 py-2 rounded-lg font-medium transition ${
          activeTab === "favorites"
            ? "bg-yellow-500 text-white"
            : "hover:text-yellow-400"
        }`}
      >
        ⭐ Favorites ({favorites.length})
      </button>
    </div>
  </div>
</header>

{/* Home Page / Hero Section */}
{activeTab === "home" && (
  <section
    className="relative w-full h-screen flex items-center justify-center text-center text-white"
    style={{
      backgroundImage:
  "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')",
  backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {/* Transparent overlay */}
    <div className="absolute inset-0 bg-black bg-opacity-60"></div>

    {/* Content */}
    <div className="relative z-10 max-w-3xl mx-auto px-4">
      <h2 className="text-4xl md:text-4xl font-extrabold mb-6">
        FIND A BOOK OF YOUR CHOICE... 
      </h2>
      <p className="text-lg md:text-2xl text-gray-200 mb-8 leading-relaxed">
        Search for books by <span className="font-semibold text-red-600">Title</span>,{" "}
        <span className="font-semibold text-purple-500">Author</span>,{" "}
        <span className="font-semibold text-pink-500">Genre</span>,{" "}
        <span className="font-semibold text-yellow-500">Year</span>,{" "}
        <span className="font-semibold text-green-500">Publisher</span> or{" "}
        <span className="font-semibold text-rose-600">ISBN</span>{"."} Save your favorites to
        revisit later.
      </p>
      <button
        onClick={() => setActiveTab("search")}
        className="bg-red-600 text-white px-8 py-4 rounded-full hover:bg-blue-700 shadow-lg transition transform hover:scale-105 text-lg"
      >
        Start Searching
      </button>
    </div>
  </section>
)}









      {/* Search Tab */}
      {activeTab === "search" && (
        <>
          {/* Search Form */}
          <form
            onSubmit={searchBooks}
            className="w-full max-w-3xl flex items-center gap-2 mb-10 bg-transparent p-4 rounded-full shadow-lg mx-auto"
          >
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-3 border border-brown-200 rounded-full bg-brown-50 text-brown-700 focus:outline-none focus:ring-2 focus:ring-brown-400"
            >
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="subject">Subject / Genre</option>
              <option value="isbn">ISBN</option>
              <option value="publisher">Publisher</option>
              <option value="year">Year</option>
            </select>

            {/* If Language filter is selected → show dropdown */}
            {filter === "language" ? (
              <select
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-2 rounded-r-full outline-none border">
                <option value="">Select a language...</option>
                <option value="eng">English</option>
                <option value="fre">French</option>
                <option value="ger">German</option>
                <option value="spa">Spanish</option>
                <option value="hin">Hindi</option>
                <option value="ara">Arabic</option>
                <option value="chi">Chinese</option>
                <option value="jpn">Japanese</option>
                </select>
                ) : (
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Search books by ${filter}...`}
                  className="flex-1 px-4 py-2 rounded-r-full outline-none"
                />
              )
            }


            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 shadow-md transition text-lg"
            >
              Search
            </button>
          </form>

          {warning && <p className="text-red-600 text-center mb-4">{warning}</p>}

          {/* Loading / Error */}
          {loading && <p className="text-gray-600 animate-pulse text-center">Searching books...</p>}
          {error && <p className="text-red-600 text-center">{error}</p>}

          {/* Empty State */}
          {!loading && books.length === 0 && !error && (
            <p className="text-gray-500 italic text-center">🔍 Start by searching for a book above.</p>
          )}

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto mb-12">
            {books.map((book) => (
              <div
                key={book.key}
                className="bg-white p-4 rounded-2xl shadow hover:shadow-xl transition transform hover:-translate-y-1"
              >
                {book.cover_i ? (
                  <img
                    src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                    alt={book.title}
                    className="w-full h-56 object-cover rounded-xl mb-3"
                  />
                ) : (
                  <div className="w-full h-56 flex items-center justify-center bg-gray-200 text-gray-500 rounded-xl mb-3">
                    No Cover
                  </div>
                )}
                <h2 className="text-lg font-bold text-gray-800">{book.title}</h2>
                <p className="text-sm text-gray-600 mb-1">
                  {book.author_name ? book.author_name.join(", ") : "Unknown Author"}
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  {book.first_publish_year ? `First published: ${book.first_publish_year}` : ""}
                </p>
                <button
                  onClick={() => toggleFavorite(book)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    isFavorite(book)
                      ? "bg-yellow-400 text-white hover:bg-yellow-500"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {isFavorite(book) ? "★ Remove Favorite" : "☆ Add Favorite"}
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
{books.length > 0 && (
  <div className="flex items-center justify-center gap-3 mt-6">
    {/* Jump to First */}
    <button
      onClick={() => searchBooks(null, 1)}
      disabled={page === 1}
      className={`px-3 py-2 rounded-lg ${
        page === 1
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
    >
      ⏮️
    </button>

    {/* Prev */}
    <button
      onClick={() => searchBooks(null, page - 1)}
      disabled={page === 1}
      className={`px-3 py-2 rounded-lg ${
        page === 1
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
    >
      ⬅️
    </button>

    {/* Page number */}
    <span className="text-lg font-semibold text-gray-700">
      {page} / {totalPages}
    </span>

    {/* Next */}
    <button
      onClick={() => searchBooks(null, page + 1)}
      disabled={page === totalPages}
      className={`px-3 py-2 rounded-lg ${
        page === totalPages
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
    >
      ➡️
    </button>

    {/* Jump to Last */}
    <button
      onClick={() => searchBooks(null, totalPages)}
      disabled={page === totalPages}
      className={`px-3 py-2 rounded-lg ${
        page === totalPages
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
    >
      ⏭️
    </button>
  </div>
)}



        </>
      )}

      {/* Favorites Tab */}
      {activeTab === "favorites" && (
        <div className="w-full max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">⭐ Your Favorite Books</h2>
          {favorites.length === 0 ? (
            <p className="text-gray-500 italic text-center">No favorites yet. Add some books first!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {favorites.map((book) => (
                <div
                  key={book.key}
                  className="bg-yellow-50 p-4 rounded-2xl shadow-md border border-yellow-200"
                >
                  <h3 className="font-semibold">{book.title}</h3>
                  <p className="text-sm text-gray-600">
                    {book.author_name ? book.author_name.join(", ") : "Unknown Author"}
                  </p>
                  <button
                    onClick={() => toggleFavorite(book)}
                    className="mt-2 text-red-600 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
