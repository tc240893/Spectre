import {
	searchMovies
} from "./api.js";
import {
	createMovieCard
} from "./utils.js";

const overlay = document.getElementById("searchOverlay");
const searchBtn = document.getElementById("searchBtn");
const closeBtn = document.getElementById("closeSearch");
const searchInput = document.getElementById("overlaySearch");
const resultsContainer = document.getElementById("overlayResults");

let searchTimeout = null;
let currentQuery = "";

function openOverlay() {
	overlay.classList.add("active");
	document.body.style.overflow = "hidden";
	setTimeout(() => searchInput.focus(), 100);
}

function closeOverlay() {
	overlay.classList.remove("active");
	document.body.style.overflow = "";
	searchInput.value = "";
	resultsContainer.innerHTML = "";
	currentQuery = "";
}

async function performSearch(query) {
	if (!query || query.length < 2) {
		resultsContainer.innerHTML = "";
		return;
	}

	currentQuery = query;
	resultsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--muted);">Recherche en cours...</p>';

	try {
		const result = await searchMovies(query, 1);

		if (query !== currentQuery) return;

		resultsContainer.innerHTML = "";

		if (result.Response === "True" && result.Search) {
			result.Search.forEach(movie => {
				const card = createMovieCard(movie);
				resultsContainer.appendChild(card);
			});
		} else {
			resultsContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--muted);">Aucun résultat pour "${(query)}"</p>`;
		}
	} catch (error) {
		console.error("Search error:", error);
		resultsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--muted);">Une erreur est survenue</p>';
	}
}

if (searchBtn) {
	searchBtn.addEventListener("click", openOverlay);
}

if (closeBtn) {
	closeBtn.addEventListener("click", closeOverlay);
}

overlay.addEventListener("click", (e) => {
	if (e.target === overlay) {
		closeOverlay();
	}
});

document.addEventListener("keydown", (e) => {
	if (e.key === "Escape" && overlay.classList.contains("active")) {
		closeOverlay();
	}
});

searchInput.addEventListener("input", (e) => {
	const query = e.target.value.trim();

	if (searchTimeout) {
		clearTimeout(searchTimeout);
	}

	if (!query) {
		resultsContainer.innerHTML = "";
		return;
	}

	searchTimeout = setTimeout(() => {
		performSearch(query);
	}, 300);
});