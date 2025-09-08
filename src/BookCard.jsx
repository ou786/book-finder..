export default function BookCard({ book, isFavorite, toggleFavorite }) {
  return (
    <div
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
  );
}
