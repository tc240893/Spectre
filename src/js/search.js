import { searchMovies } from "./api.js";
import { createMovieCard } from "./utils.js";

const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("searchResults");
const loadMoreBtn = document.getElementById("loadMore");

let currentQuery = "";
let currentPage = 1;
let searchTimeout = null;

const clearResults = () => {
  resultsContainer.innerHTML = "";
  currentPage = 1;
  loadMoreBtn.style.display = "none";
};

const showMessage = (message) => {
  resultsContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">${message}</p>`;
};

async function performSearch(query, page = 1) {
  if (!query || query.length < 2) {
    if (page === 1) showMessage("Entrez au moins 2 caractères pour rechercher");
    loadMoreBtn.style.display = "none";
    return;
  }
  
  if (page === 1) showMessage("Recherche en cours...");
  
  loadMoreBtn.disabled = true;
  loadMoreBtn.textContent = "Chargement...";
  
  try {
    const result = await searchMovies(query, page);
    
    if (page === 1) resultsContainer.innerHTML = "";
    
    if (result.Response === "True" && result.Search) {
      result.Search.forEach(movie => resultsContainer.appendChild(createMovieCard(movie)));
      
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
      if (page === 1) showMessage(`Aucun résultat pour "${query}"`);
      loadMoreBtn.style.display = "none";
    }
  } catch (error) {
    console.error("Search error:", error);
    if (page === 1) showMessage("Une erreur est survenue");
    loadMoreBtn.style.display = "none";
  }
}

searchInput.addEventListener("input", (e) => {
  const query = e.target.value.trim();
  currentQuery = query;
  
  clearTimeout(searchTimeout);
  
  if (!query) {
    clearResults();
    showMessage("Commencez à taper pour rechercher des films");
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

showMessage("Commencez à taper pour rechercher des films");