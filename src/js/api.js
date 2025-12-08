const API_KEY = "4befacf7";
const BASE = "https://www.omdbapi.com/";

export async function searchMovies(s, page = 1) {
	if (!s) return {
		Response: "False",
		Error: "Empty query"
	};
	const url = `${BASE}?apikey=${API_KEY}&s=${encodeURIComponent(s)}&page=${page}`;
	const res = await fetch(url);
	return res.json();
}

export async function getMovieById(id) {
	const url = `${BASE}?apikey=${API_KEY}&i=${encodeURIComponent(id)}&plot=full`;
	const res = await fetch(url);
	return res.json();
}