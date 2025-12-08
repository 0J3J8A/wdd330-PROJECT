// CURRENT YEAR & LAST MODIFIED
document.getElementById("currentyear").textContent = new Date().getFullYear();
document.getElementById("lastmodification").textContent = document.lastModified;

// Charge DOM
document.addEventListener('DOMContentLoaded', function () {
  // -------------------- HAMBURGER MENU --------------------
  const menu = document.getElementById('MAIN_MENU');
  const hamburger = document.getElementById('h_menu');

  hamburger.addEventListener('click', function (e) {
    e.preventDefault();
    menu.classList.toggle('menu-open');
  });
});

// -------------------- GAMEPOWER API INTEGRATION --------------------
document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('giveaways-container');
  const loading = document.getElementById('loading');
  const errorMsg = document.getElementById('error-message');
  const filterBtns = document.querySelectorAll('.filter-btn');

  let allGiveaways = [];
  let currentFilter = 'all';

  // URLs from the API (from the documentacion)
  const API_URLS = {
    all: 'https://gamerpower.com/api/giveaways',
    pc: 'https://gamerpower.com/api/giveaways?platform=pc',
    steam: 'https://gamerpower.com/api/giveaways?platform=steam',
    epic: 'https://gamerpower.com/api/giveaways?platform=epic-games-store',
    ps5: 'https://gamerpower.com/api/giveaways?platform=ps5',
    xbox: 'https://gamerpower.com/api/giveaways?platform=xbox-series-xs',
    switch: 'https://gamerpower.com/api/giveaways?platform=switch'
  };

  // Function to use proxy CORS
  async function fetchWithProxy(url) {
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const encodedUrl = encodeURIComponent(url);

    try {
      const response = await fetch(`${proxyUrl}${encodedUrl}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return JSON.parse(data.contents);
    } catch (error) {
      console.error('Error with proxy:', error);
      // Intentar fetch directo como fallback
      const directResponse = await fetch(url);
      if (!directResponse.ok) throw error;
      return await directResponse.json();
    }
  }

  // Fetch games from API
  async function fetchGiveaways(filter = 'all') {
    try {
      loading.style.display = 'block';
      container.innerHTML = '';
      errorMsg.textContent = '';

      const url = API_URLS[filter] || API_URLS.all;
      console.log('Fetching from:', url);

      const data = await fetchWithProxy(url);

      // Check if API returned error message
      if (data.error) {
        throw new Error(data.error);
      }

      if (filter === 'all') {
        allGiveaways = data;
      }

      displayGiveaways(data, filter);

    } catch (error) {
      console.error('Error fetching giveaways:', error);
      errorMsg.textContent = `Error loading games: ${error.message}. Trying alternative...`;

      await tryAlternativeMethod(filter);
    } finally {
      loading.style.display = 'none';
    }
  }


  async function tryAlternativeMethod(filter) {
    try {
      const url = API_URLS[filter] || API_URLS.all;
      const altProxy = 'https://corsproxy.io/?';
      const response = await fetch(`${altProxy}${encodeURIComponent(url)}`);

      if (response.ok) {
        const data = await response.json();
        if (filter === 'all') {
          allGiveaways = data;
        }
        displayGiveaways(data, filter);
        errorMsg.textContent = '';
      }
    } catch (altError) {
      console.error('Alternative method failed:', altError);
      errorMsg.textContent = 'Unable to load games at the moment. Please try again later.';

      // Showing sample data fuction
      showSampleData();
    }
  }

  // Display games in the grid
  function displayGiveaways(giveaways, filter) {
    if (!giveaways || giveaways.length === 0) {
      container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <p class="error">No ${filter} games available at the moment. Please check back later!</p>
                </div>
            `;
      return;
    }

    container.innerHTML = '';

    // Limited to 20 game for better performance as all the games are 107
    const gamesToShow = giveaways.slice(0, 20);

    gamesToShow.forEach(game => {
      const gameCard = createGameCard(game);
      container.appendChild(gameCard);
    });

    // Showing counter
    const counter = document.createElement('p');
    counter.style.gridColumn = '1 / -1';
    counter.style.textAlign = 'center';
    counter.style.color = 'var(--color-text-secondary)';
    counter.style.marginTop = '1rem';
    counter.textContent = `Showing ${gamesToShow.length} of ${giveaways.length} games`;
    container.appendChild(counter);
  }

  // Create individual game cards
  function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';

    let platforms = ['PC'];
    if (game.platforms) {
      platforms = game.platforms.split(',').map(p => p.trim());
    }

    const platformTags = platforms.map(platform =>
      `<span class="platform-tag">${platform}</span>`
    ).join('');

    // Determine TYPE
    const type = game.type || 'game';
    const typeClass = type.toLowerCase();

    // Format the description
    let description = game.description || 'No description available';
    description = description.replace(/<[^>]*>/g, ''); // Remover HTML
    if (description.length > 120) {
      description = description.substring(0, 120) + '...';
    }

    // Format the end date
    let endDate = 'Unknown';
    if (game.end_date && game.end_date !== 'N/A') {
      try {
        const date = new Date(game.end_date);
        if (!isNaN(date)) {
          endDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
        }
      } catch (e) {
        console.log('Date parsing error:', e);
      }
    }

    // URL of the game
    const gameUrl = game.open_giveaway_url || game.gamerpower_url || '#';

    // PRICE OF THE GAME
    const worth = game.worth ? `$${game.worth}` : 'Free';

    card.innerHTML = `
            <img src="${game.thumbnail || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=200&fit=crop'}" 
                 alt="${game.title}" 
                 class="game-image"
                 onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=200&fit=crop'">
            <div class="game-content">
                <h3 class="game-title">${game.title}</h3>
                <div class="game-platforms">${platformTags}</div>
                <span class="game-type ${typeClass}">${type.toUpperCase()}</span>
                <p class="game-description">${description}</p>
                <div class="game-info">
                    <span>Ends: ${endDate}</span>
                    <span>Value: ${worth}</span>
                </div>
                <a href="${gameUrl}" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="play-btn">
                   ${type === 'loot' ? 'GET LOOT' : 'PLAY NOW'}
                </a>
                <p style="font-size: 0.7rem; color: var(--color-text-secondary); margin-top: 0.5rem; text-align: center;">
                    Source: GamerPower.com
                </p>
            </div>
        `;

    return card;
  }

  // Showing examples if the API fails
  function showSampleData() {
    const sampleGames = [
      {
        title: "Epic Games Free Weekly Game",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=200&fit=crop",
        platforms: "PC, Epic Games Store",
        type: "game",
        description: "Check Epic Games Store for this week's free game offer.",
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        worth: "19.99",
        open_giveaway_url: "https://store.epicgames.com/en-US/free-games"
      },
      {
        title: "Steam Weekend Deal",
        thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=200&fit=crop",
        platforms: "PC, Steam",
        type: "game",
        description: "Special weekend discounts on selected Steam games.",
        worth: "Free to Try",
        open_giveaway_url: "https://store.steampowered.com"
      }
    ];

    displayGiveaways(sampleGames, 'sample');
    errorMsg.textContent = 'Showing sample data. The API might be temporarily unavailable.';
  }

  // Filter games
  function filterGames(filter) {
    currentFilter = filter;

    // Update active button
    filterBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    fetchGiveaways(filter);
  }

  // Event listeners for filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterGames(btn.dataset.filter);
    });
  });

  // Initialize
  fetchGiveaways('all');

  // Auto-refresh each 10 min
  setInterval(() => fetchGiveaways(currentFilter), 10 * 60 * 1000);
});