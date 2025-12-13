import { searchMovies } from "./api.js";
import { getPosterUrl, getDefaultPoster } from "./utils.js";

const elements = {
  continueWatching: document.getElementById("continueWatching"),
  movies: document.getElementById("movies"),
  series: document.getElementById("series"),
  loadMoreMovies: document.getElementById("loadMoreMovies"),
  loadMoreSeries: document.getElementById("loadMoreSeries")
};

let keywords = null;
const usedKeywords = { movies: new Set(), series: new Set() };

const DEFAULT_KEYWORDS = {
  movies: [
    "Inception", "Interstellar", "Dark Knight", "Avengers", "Guardians Galaxy",
    "Matrix", "Pulp Fiction", "Forrest Gump", "Shawshank Redemption", "Godfather",
    "Fight Club", "Lord Rings", "Star Wars", "Gladiator", "Titanic",
    "Avatar", "Joker", "Parasite", "Oppenheimer", "Dune"
  ],
  series: [
    "Pluribus", "Better Call Saul", "Breaking Bad", "Friends", "Office",
    "House", "Mandalorian", "Witcher", "Vikings", "Peaky Blinders",
    "Sopranos", "Wire", "True Detective", "Westworld", "House Cards"
  ],
  continueWatching: ["Pluribus", "House", "Batman Begins"]
};

async function loadKeywords() {
  try {
    const response = await fetch('src/data/keywords.json');
    keywords = await response.json();
  } catch (error) {
    console.error('Failed to load keywords, using defaults:', error);
    keywords = DEFAULT_KEYWORDS;
  }
}

function getRandomUnusedKeywords(type, count) {
  const available = keywords[type].filter(k => !usedKeywords[type].has(k));
  
  if (available.length === 0) {
    usedKeywords[type].clear();
    return keywords[type].slice(0, count);
  }
  
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));
  selected.forEach(k => usedKeywords[type].add(k));
  
  return selected;
}

async function fetchFirstResult(keyword) {
  const result = await searchMovies(keyword, 1);
  return result.Response === "True" && result.Search?.[0] ? result.Search[0] : null;
}

function createMovieCard(movie) {
  const card = document.createElement("a");
  card.href = `movie.html?id=${movie.imdbID}`;
  card.className = "movie-card";
  card.innerHTML = `
    <img 
      src="${getPosterUrl(movie.Poster)}" 
      alt="Affiche de ${movie.Title}" 
      class="movie-poster" 
      loading="lazy"
      onerror="this.src='${getDefaultPoster()}'"
    >
    <div class="movie-title">${movie.Title}</div>
    <div class="movie-year">${movie.Year}</div>
  `;
  return card;
}

async function loadContent(type, container, button, filterType, count = 12) {
  button.disabled = true;
  button.textContent = "Chargement...";
  
  const selectedKeywords = getRandomUnusedKeywords(type, count);
  const results = await Promise.all(selectedKeywords.map(fetchFirstResult));
  const filtered = results.filter(m => m && (!filterType || m.Type === filterType));
  
  filtered.forEach(movie => container.appendChild(createMovieCard(movie)));
  
  button.disabled = false;
  button.textContent = `Charger plus de ${type === 'movies' ? 'films' : 'séries'}`;
}

async function loadContinueWatching() {
  const results = await Promise.all(keywords.continueWatching.map(fetchFirstResult));
  results.filter(Boolean).forEach(movie => 
    elements.continueWatching.appendChild(createMovieCard(movie))
  );
}

async function init() {
  await loadKeywords();
  
  elements.loadMoreMovies.addEventListener("click", () =>
    loadContent("movies", elements.movies, elements.loadMoreMovies, "movie")
  );
  
  elements.loadMoreSeries.addEventListener("click", () =>
    loadContent("series", elements.series, elements.loadMoreSeries, "series")
  );
  
  await Promise.all([
    loadContinueWatching(),
    loadContent("movies", elements.movies, elements.loadMoreMovies, "movie"),
    loadContent("series", elements.series, elements.loadMoreSeries, "series")
  ]);
}

init();