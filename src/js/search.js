import {
	searchMovies
} from "./api.js";

const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("searchResults");
const loadMoreBtn = document.getElementById("loadMore");

let currentQuery = "";
let currentPage = 1;
let searchTimeout = null;

function escapeHtml(str) {
	return String(str || "")
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

function renderMovieCard(movie) {
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

	return card;
}

function clearResults() {
	resultsContainer.innerHTML = "";
	currentPage = 1;
	loadMoreBtn.style.display = "none";
}

async function performSearch(query, page = 1) {
	if (!query || query.length < 2) {
		if (page === 1) {
			resultsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">Entrez au moins 2 caractères pour rechercher</p>';
		}
		loadMoreBtn.style.display = "none";
		return;
	}

	if (page === 1) {
		resultsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">Recherche en cours...</p>';
	}

	loadMoreBtn.disabled = true;
	loadMoreBtn.textContent = "Chargement...";

	try {
		const result = await searchMovies(query, page);

		if (page === 1) {
			resultsContainer.innerHTML = "";
		}

		if (result.Response === "True" && result.Search) {
			result.Search.forEach(movie => {
				const card = renderMovieCard(movie);
				resultsContainer.appendChild(card);
			});

			const totalResults = parseInt(result.totalResults);
			const currentCount = page * 10;

			if (currentCount < totalResults) {
				loadMoreBtn.style.display = "block";
				loadMoreBtn.disabled = false;
				loadMoreBtn.textContent = "Charger plus de résultats";
			} else {
				loadMoreBtn.style.display = "none";
			}
		} else {
			if (page === 1) {
				resultsContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">Aucun résultat pour "${escapeHtml(query)}"</p>`;
			}
			loadMoreBtn.style.display = "none";
		}
	} catch (error) {
		console.error("Search error:", error);
		if (page === 1) {
			resultsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">Une erreur est survenue</p>';
		}
		loadMoreBtn.style.display = "none";
	}
}

searchInput.addEventListener("input", (e) => {
	const query = e.target.value.trim();
	currentQuery = query;

	if (searchTimeout) {
		clearTimeout(searchTimeout);
	}

	if (!query) {
		clearResults();
		resultsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">Commencez à taper pour rechercher des films</p>';
		return;
	}

	searchTimeout = setTimeout(() => {
		currentPage = 1;
		performSearch(query, 1);
	}, 300);
});

loadMoreBtn.addEventListener("click", () => {
	currentPage++;
	performSearch(currentQuery, currentPage);
});

resultsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">Commencez à taper pour rechercher des films</p>';