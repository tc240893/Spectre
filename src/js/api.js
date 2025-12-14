const API_KEY = "c896fdae";
const BASE_URL = "https://www.omdbapi.com/";

async function apiRequest(params) {
	const url = new URL(BASE_URL);
	url.searchParams.set("apikey", API_KEY);

	Object.entries(params).forEach(([key, value]) => {
		url.searchParams.set(key, value);
	});

	const response = await fetch(url);
	return response.json();
}

export function searchMovies(query, page = 1) {
	if (!query) {
		return Promise.resolve({
			Response: "False",
			Error: "Empty query"
		});
	}
	return apiRequest({
		s: query,
		page
	});
}

export function getMovieById(id) {
	return apiRequest({
		i: id,
		plot: "full"
	});
}