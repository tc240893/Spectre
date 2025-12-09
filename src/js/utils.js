export function getQueryParam(name) {
	return new URLSearchParams(location.search).get(name);
}


export function getDefaultPoster() {
	return "src/img/ico/nopicture.png";
}

export function getPosterUrl(posterUrl) {
	return posterUrl !== "N/A" ? posterUrl : getDefaultPoster();
}

export function createMovieCard(movie) {
	const card = document.createElement("a");
	card.href = `movie.html?id=${movie.imdbID}`;
	card.className = "movie-card";

	card.innerHTML = `
    <img 
      src="${getPosterUrl(movie.Poster)}" 
      alt="Affiche de ${(movie.Title)}" 
      class="movie-poster" 
      loading="lazy"
      onerror="this.src='${getDefaultPoster()}'"
    >
    <div class="movie-title">${(movie.Title)}</div>
    <div class="movie-year">${(movie.Year)}</div>
  `;

	return card;
}