import {
	searchMovies
} from "./api.js";

const continueEl = document.getElementById("continueWatching");
const moviesEl = document.getElementById("movies");
const seriesEl = document.getElementById("series");
const loadMoreMoviesBtn = document.getElementById("loadMoreMovies");
const loadMoreSeriesBtn = document.getElementById("loadMoreSeries");
const heroSearchBtn = document.getElementById("heroSearchBtn");

const popularMovieKeywords = [
	"Inception", "Interstellar", "Dark Knight", "Avengers", "Guardians Galaxy",
	"Matrix", "Pulp Fiction", "Forrest Gump", "Shawshank Redemption", "Godfather",
	"Fight Club", "Lord Rings", "Star Wars", "Gladiator", "Titanic",
	"Avatar", "Joker", "Parasite", "Oppenheimer", "Dune"
];

const popularSeriesKeywords = [
	"Breaking Bad", "Game Thrones", "Stranger Things", "Friends", "Office",
	"Crown", "Mandalorian", "Witcher", "Vikings", "Peaky Blinders",
	"Sopranos", "Wire", "True Detective", "Westworld", "House Cards"
];

const continueWatchingKeywords = [
	"Spider-Man", "Batman Begins", "Iron Man"
];

const shownMovies = new Set();
const shownSeries = new Set();

function getRandomUnusedItems(arr, count, usedSet) {
	const available = arr.filter(item => !usedSet.has(item));
	if (available.length === 0) {
		usedSet.clear();
		return arr.slice(0, count);
	}
	const shuffled = [...available].sort(() => Math.random() - 0.5);
	return shuffled.slice(0, Math.min(count, shuffled.length));
}

async function fetchFirstResult(keyword) {
	const res = await searchMovies(keyword, 1);
	if (res.Response === "True" && res.Search && res.Search[0]) {
		return res.Search[0];
	}
	return null;
}

function renderMovieCard(movie, container) {
	const card = document.createElement("a");
	card.href = `movie.html?id=${movie.imdbID}`;
	card.className = "movie-card";

	const poster = movie.Poster !== "N/A" ? movie.Poster : "src/img/ico/nopicture.png";

	card.innerHTML = `
    <img 
      src="${poster}" 
      alt="Affiche de ${escapeHtml(movie.Title)}" 
      class="movie-poster" 
      loading="lazy"
      onerror="this.src='src/img/ico/nopicture.png'"
    >
    <div class="movie-title">${escapeHtml(movie.Title)}</div>
    <div class="movie-year">${escapeHtml(movie.Year)}</div>
  `;

	container.appendChild(card);
}

async function loadMovies() {
	loadMoreMoviesBtn.disabled = true;
	loadMoreMoviesBtn.textContent = "Chargement...";

	const keywords = getRandomUnusedItems(popularMovieKeywords, 12, shownMovies);
	keywords.forEach(k => shownMovies.add(k));

	const promises = keywords.map(keyword => fetchFirstResult(keyword));
	const results = await Promise.all(promises);

	const movies = results.filter(m => m !== null && m.Type === "movie");

	movies.forEach(movie => renderMovieCard(movie, moviesEl));

	loadMoreMoviesBtn.disabled = false;
	loadMoreMoviesBtn.textContent = "Charger plus de films";
}

async function loadSeries() {
	loadMoreSeriesBtn.disabled = true;
	loadMoreSeriesBtn.textContent = "Chargement...";

	const keywords = getRandomUnusedItems(popularSeriesKeywords, 12, shownSeries);
	keywords.forEach(k => shownSeries.add(k));

	const promises = keywords.map(keyword => fetchFirstResult(keyword));
	const results = await Promise.all(promises);

	const series = results.filter(s => s !== null && s.Type === "series");

	series.forEach(show => renderMovieCard(show, seriesEl));

	loadMoreSeriesBtn.disabled = false;
	loadMoreSeriesBtn.textContent = "Charger plus de séries";
}

async function loadContinueWatching() {
	const promises = continueWatchingKeywords.map(keyword => fetchFirstResult(keyword));
	const results = await Promise.all(promises);

	const movies = results.filter(m => m !== null);

	movies.forEach(movie => renderMovieCard(movie, continueEl));
}

function escapeHtml(str) {
	return String(str || "")
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

loadMoreMoviesBtn.addEventListener("click", loadMovies);
loadMoreSeriesBtn.addEventListener("click", loadSeries);

if (heroSearchBtn) {
	heroSearchBtn.addEventListener("click", () => {
		document.getElementById("searchOverlay").classList.add("active");
		document.getElementById("overlaySearch").focus();
	});
}

(async () => {
	await Promise.all([
		loadContinueWatching(),
		loadMovies(),
		loadSeries()
	]);
})();