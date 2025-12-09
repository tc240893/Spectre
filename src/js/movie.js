import {
	getMovieById
} from "./api.js";
import {
	escapeHtml,
	getQueryParam,
	getPosterUrl,
	getDefaultPoster
} from "./utils.js";

const contentEl = document.getElementById("content");

function formatDVD(dateStr) {
	if (!dateStr || dateStr === "N/A") return "N/A";
	const date = new Date(dateStr);
	if (isNaN(date)) return dateStr;

	return date.toLocaleDateString("fr-FR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric"
	});
}

function renderMetaRow(items) {
	return items.filter(Boolean).join("");
}

function renderRatings(ratings) {
	if (!ratings?.length) return "";

	return `
    <h3>Notes</h3>
    <div class="meta-row">
      ${ratings.map(r => `
        <div style="padding: 8px 16px; background: var(--card); border-radius: 8px;">
          <strong>${escapeHtml(r.Source)} :</strong> ${escapeHtml(r.Value)}
        </div>
      `).join("")}
    </div>
  `;
}

function renderMovieDetails(movie) {
	const poster = getPosterUrl(movie.Poster);

	return `
    <div class="movie-hero">
      <img src="${poster}" alt="Affiche de ${escapeHtml(movie.Title)}" 
           onerror="this.src='${getDefaultPoster()}'">
      <div class="movie-meta">
        <h1>${escapeHtml(movie.Title)}</h1>
        
        <div class="meta-row">
          <div><strong>Année :</strong> ${escapeHtml(movie.Year)}</div>
          <div><strong>Genre :</strong> ${escapeHtml(movie.Genre)}</div>
          <div><strong>Durée :</strong> ${escapeHtml(movie.Runtime)}</div>
          ${movie.Rated !== "N/A" ? `<div><strong>Classification :</strong> ${escapeHtml(movie.Rated)}</div>` : ""}
        </div>

        <div class="meta-row">
          <div><strong>Réalisateur :</strong> ${escapeHtml(movie.Director)}</div>
        </div>

        <div class="meta-row">
          <div><strong>Acteurs :</strong> ${escapeHtml(movie.Actors)}</div>
        </div>

        <h3>Synopsis</h3>
        <p>${escapeHtml(movie.Plot)}</p>

        ${renderRatings(movie.Ratings)}

        ${movie.DVD && movie.DVD !== "N/A" ? `
          <div class="meta-row" style="margin-top: 16px;">
            <div><strong>Sortie DVD :</strong> ${formatDVD(movie.DVD)}</div>
          </div>
        ` : ""}

        ${movie.BoxOffice && movie.BoxOffice !== "N/A" ? `
          <div class="meta-row">
            <div><strong>Box Office :</strong> ${escapeHtml(movie.BoxOffice)}</div>
          </div>
        ` : ""}

        ${movie.Awards && movie.Awards !== "N/A" ? `
          <div class="meta-row">
            <div><strong>Récompenses :</strong> ${escapeHtml(movie.Awards)}</div>
          </div>
        ` : ""}
      </div>
    </div>
  `;
}

async function loadMovie() {
	const movieId = getQueryParam("id");

	if (!movieId) {
		contentEl.innerHTML = "<p>ID du film manquant.</p>";
		return;
	}

	contentEl.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 40px 0;">Chargement des détails du film...</p>';

	try {
		const movie = await getMovieById(movieId);

		if (movie.Response === "False") {
			contentEl.innerHTML = `<p style="text-align: center; color: var(--muted); padding: 40px 0;">Film introuvable.</p>`;
			return;
		}

		contentEl.innerHTML = renderMovieDetails(movie);
	} catch (error) {
		console.error("Error loading movie:", error);
		contentEl.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 40px 0;">Une erreur est survenue lors du chargement.</p>';
	}
}

loadMovie();