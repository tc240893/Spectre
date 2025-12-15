import { getMovieById } from "./api.js";
import { getQueryParam, getPosterUrl, getDefaultPoster } from "./utils.js";

const contentEl = document.getElementById("content");

const renderRatings = (ratings) => {
  if (!ratings?.length) return "";
  
  return `
    <h3>Notes</h3>
    <div class="meta-row">
      ${ratings.map(r => `
        <div style="padding: 8px 16px; background: var(--card); border-radius: 8px;">
          <strong>${r.Source}:</strong> ${r.Value}
        </div>
      `).join("")}
    </div>
  `;
};

function renderMovieDetails(movie) {
  const poster = getPosterUrl(movie.Poster);
  const isSeries = movie.Type === "series";
  const creatorLabel = isSeries ? "Scénariste" : "Réalisateur";
  const creatorValue = isSeries ? movie.Writer : movie.Director;
  
  return `
    <div class="movie-hero">
      <img src="${poster}" alt="Affiche de ${movie.Title}" 
           onerror="this.src='${getDefaultPoster()}'">
      <div class="movie-meta">
        <h1>${movie.Title}</h1>
        
        <div class="meta-row">
          <div><strong>Année:</strong> ${movie.Year}</div>
          <div><strong>Genre:</strong> ${movie.Genre}</div>
          <div><strong>Durée:</strong> ${movie.Runtime}</div>
          ${movie.Rated !== "N/A" ? `<div><strong>Classification:</strong> ${movie.Rated}</div>` : ""}
        </div>

        ${creatorValue && creatorValue !== "N/A" ? `
          <div class="meta-row">
            <div><strong>${creatorLabel}:</strong> ${creatorValue}</div>
          </div>
        ` : ""}

        <div class="meta-row">
          <div><strong>Acteurs:</strong> ${movie.Actors}</div>
        </div>

        <h3>Synopsis</h3>
        <p>${movie.Plot}</p>

        ${renderRatings(movie.Ratings)}

        ${movie.BoxOffice && movie.BoxOffice !== "N/A" ? `
          <div class="meta-row">
            <div><strong>Box Office:</strong> ${movie.BoxOffice}</div>
          </div>
        ` : ""}

        ${movie.Awards && movie.Awards !== "N/A" ? `
          <div class="meta-row">
            <div><strong>Récompenses:</strong> ${movie.Awards}</div>
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
  
  contentEl.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 40px 0;">Chargement des détails du film...</p>';
  
  try {
    const movie = await getMovieById(movieId);
    
    if (movie.Response === "False") {
      contentEl.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 40px 0;">Film introuvable.</p>`;
      return;
    }
    
    contentEl.innerHTML = renderMovieDetails(movie);
  } catch (error) {
    console.error("Error loading movie:", error);
    contentEl.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 40px 0;">Une erreur est survenue lors du chargement.</p>';
  }
}

loadMovie();