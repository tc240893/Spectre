import {
	getMovieById
} from "./api.js";

function qs(name) {
	return new URLSearchParams(location.search).get(name);
}

function escapeHtml(s) {
	return String(s || "")
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

function formatDVD(dateStr) {
	if (!dateStr || dateStr === "N/A") return "N/A";
	const d = new Date(dateStr);
	if (isNaN(d)) return dateStr;
	const dd = String(d.getDate()).padStart(2, "0");
	const mm = String(d.getMonth() + 1).padStart(2, "0");
	const yy = d.getFullYear();
	return `${dd}/${mm}/${yy}`;
}

async function load() {
	const id = qs("id");
	const contentEl = document.getElementById("content");

	if (!id) {
		contentEl.innerHTML = "<p>ID du film manquant.</p>";
		return;
	}

	contentEl.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 40px 0;">Chargement des détails du film...</p>';

	try {
		const m = await getMovieById(id);

		if (m.Response === "False") {
			contentEl.innerHTML = `<p style="text-align: center; color: var(--muted); padding: 40px 0;">Film introuvable.</p>`;
			return;
		}

		const poster = m.Poster !== "N/A" ? m.Poster : "src/img/ico/nopicture.png";

		contentEl.innerHTML = `
      <div class="movie-hero">
        <img src="${poster}" alt="Affiche de ${escapeHtml(m.Title)}" onerror="this.src='src/img/ico/nopicture.png'">
        <div class="movie-meta">
          <h1>${escapeHtml(m.Title)}</h1>
          
          <div class="meta-row">
            <div><strong>Année :</strong> ${escapeHtml(m.Year)}</div>
            <div><strong>Genre :</strong> ${escapeHtml(m.Genre)}</div>
            <div><strong>Durée :</strong> ${escapeHtml(m.Runtime)}</div>
            ${m.Rated !== "N/A" ? `<div><strong>Classification :</strong> ${escapeHtml(m.Rated)}</div>` : ""}
          </div>

          <div class="meta-row">
            <div><strong>Réalisateur :</strong> ${escapeHtml(m.Director)}</div>
          </div>

          <div class="meta-row">
            <div><strong>Acteurs :</strong> ${escapeHtml(m.Actors)}</div>
          </div>

          <h3>Synopsis</h3>
          <p>${escapeHtml(m.Plot)}</p>

          ${m.Ratings && m.Ratings.length > 0 ? `
            <h3>Notes</h3>
            <div class="meta-row">
              ${m.Ratings.map(r => `
                <div style="padding: 8px 16px; background: var(--card); border-radius: 8px;">
                  <strong>${escapeHtml(r.Source)} :</strong> ${escapeHtml(r.Value)}
                </div>
              `).join("")}
            </div>
          ` : ""}

          ${m.DVD && m.DVD !== "N/A" ? `
            <div class="meta-row" style="margin-top: 16px;">
              <div><strong>Sortie DVD :</strong> ${formatDVD(m.DVD)}</div>
            </div>
          ` : ""}

          ${m.BoxOffice && m.BoxOffice !== "N/A" ? `
            <div class="meta-row">
              <div><strong>Box Office :</strong> ${escapeHtml(m.BoxOffice)}</div>
            </div>
          ` : ""}

          ${m.Awards && m.Awards !== "N/A" ? `
            <div class="meta-row">
              <div><strong>Récompenses :</strong> ${escapeHtml(m.Awards)}</div>
            </div>
          ` : ""}
        </div>
      </div>
    `;
	} catch (error) {
		console.error("Error loading movie:", error);
		contentEl.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 40px 0;">Une erreur est survenue lors du chargement.</p>';
	}
}

load();