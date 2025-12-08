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

// -------------------- SIDEBAR APIS --------------------
document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const hackerToggle = document.getElementById('hacker-news-toggle');
    const jokesToggle = document.getElementById('jokes-toggle');
    const hackerPanel = document.getElementById('hacker-news-panel');
    const jokesPanel = document.getElementById('jokes-panel');
    const closeButtons = document.querySelectorAll('.close-panel');
    let activePanel = null;

    // Toggle panels
    hackerToggle.addEventListener('click', () => togglePanel(hackerPanel));
    jokesToggle.addEventListener('click', () => togglePanel(jokesPanel));

    // Close panels
    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllPanels();
        });
    });

    // Close panels when clicking outside
    document.addEventListener('click', (e) => {
        if (activePanel && !activePanel.contains(e.target) && 
            !hackerToggle.contains(e.target) && !jokesToggle.contains(e.target)) {
            closeAllPanels();
        }
    });

    function togglePanel(panel) {
        if (panel.classList.contains('active')) {
            panel.classList.remove('active');
            activePanel = null;
        } else {
            closeAllPanels();
            panel.classList.add('active');
            activePanel = panel;
            
            // Load data when panel opens
            if (panel === hackerPanel) {
                loadHackerNews('top');
            } else if (panel === jokesPanel) {
                loadRandomJoke('Any');
            }
        }
    }

    function closeAllPanels() {
        hackerPanel.classList.remove('active');
        jokesPanel.classList.remove('active');
        activePanel = null;
    }

    // -------------------- HACKER NEWS API --------------------
    const hackerContent = document.getElementById('hacker-news-content');
    const hackerLoading = document.getElementById('hacker-news-loading');
    const hackerError = document.getElementById('hacker-news-error');
    const hackerFilterBtns = document.querySelectorAll('#hacker-news-panel .api-filter-btn');

    // Hacker News API URLs
    const HN_API = {
        top: 'https://hacker-news.firebaseio.com/v0/topstories.json',
        new: 'https://hacker-news.firebaseio.com/v0/newstories.json',
        best: 'https://hacker-news.firebaseio.com/v0/beststories.json',
        ask: 'https://hacker-news.firebaseio.com/v0/askstories.json'
    };

    async function loadHackerNews(type = 'top') {
        try {
            hackerLoading.style.display = 'block';
            hackerContent.innerHTML = '';
            hackerError.textContent = '';

            // Update active filter button
            hackerFilterBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.type === type);
            });

            // Fetch story IDs
            const response = await fetch(HN_API[type]);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const storyIds = await response.json();
            const topStories = storyIds.slice(0, 10); // Get top 10 stories

            // Fetch story details
            const stories = await Promise.all(
                topStories.map(id => 
                    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
                        .then(res => res.json())
                )
            );

            displayHackerNews(stories);

        } catch (error) {
            console.error('Error loading Hacker News:', error);
            hackerError.textContent = 'Error loading news. Please try again later.';
        } finally {
            hackerLoading.style.display = 'none';
        }
    }

    function displayHackerNews(stories) {
        hackerContent.innerHTML = stories.map(story => `
            <div class="hn-story" data-id="${story.id}">
                <div class="hn-story-title">
                    ${story.url ? 
                        `<a href="${story.url}" target="_blank" rel="noopener noreferrer">${story.title}</a>` : 
                        story.title
                    }
                </div>
                <div class="hn-story-meta">
                    <span class="hn-story-points">▲ ${story.score || 0} points</span>
                    <span class="hn-story-comments">💬 ${story.descendants || 0} comments</span>
                    <span class="hn-story-author">👤 ${story.by || 'unknown'}</span>
                </div>
                ${story.url ? `<div class="hn-story-url">${new URL(story.url).hostname}</div>` : ''}
            </div>
        `).join('');
    }

    // Filter button events for Hacker News
    hackerFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            loadHackerNews(btn.dataset.type);
        });
    });

    // -------------------- JOKES API --------------------
    const jokesContent = document.getElementById('jokes-content');
    const jokesLoading = document.getElementById('jokes-loading');
    const jokesError = document.getElementById('jokes-error');
    const jokesFilterBtns = document.querySelectorAll('#jokes-panel .api-filter-btn');
    const newJokeBtn = document.getElementById('new-joke-btn');
    const safeModeCheckbox = document.getElementById('safe-mode');

    async function loadRandomJoke(category = 'Any') {
        try {
            jokesLoading.style.display = 'block';
            jokesContent.innerHTML = '';
            jokesError.textContent = '';

            // Update active filter button
            jokesFilterBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.category === category);
            });

            // Build API URL
            const safeMode = safeModeCheckbox.checked;
            let apiUrl = `https://v2.jokeapi.dev/joke/${category}?type=twopart`;
            
            if (safeMode) {
                apiUrl += '&safe-mode';
            }

            // Add language preference (English)
            apiUrl += '&lang=en';

            // Fetch joke
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const jokeData = await response.json();

            if (jokeData.error) {
                throw new Error(jokeData.message);
            }

            displayJoke(jokeData);

        } catch (error) {
            console.error('Error loading joke:', error);
            jokesError.textContent = 'Error loading joke. Please try again.';
        } finally {
            jokesLoading.style.display = 'none';
        }
    }

    function displayJoke(joke) {
        let jokeHtml = '';
        
        if (joke.type === 'twopart') {
            jokeHtml = `
                <div class="joke-container">
                    <div class="joke-setup">${joke.setup}</div>
                    <div class="joke-delivery">${joke.delivery}</div>
                    <div class="joke-meta">
                        <span class="joke-category">${joke.category}</span>
                        <span class="joke-type">Two-part</span>
                        <span class="joke-language">${joke.lang.toUpperCase()}</span>
                    </div>
                </div>
            `;
        } else {
            jokeHtml = `
                <div class="joke-container">
                    <div class="joke-single">${joke.joke}</div>
                    <div class="joke-meta">
                        <span class="joke-category">${joke.category}</span>
                        <span class="joke-type">Single</span>
                        <span class="joke-language">${joke.lang.toUpperCase()}</span>
                    </div>
                </div>
            `;
        }

        jokesContent.innerHTML = jokeHtml;
    }

    // Event listeners for Jokes
    jokesFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            loadRandomJoke(btn.dataset.category);
        });
    });

    newJokeBtn.addEventListener('click', () => {
        const activeCategory = document.querySelector('#jokes-panel .api-filter-btn.active').dataset.category;
        loadRandomJoke(activeCategory);
    });

    safeModeCheckbox.addEventListener('change', () => {
        const activeCategory = document.querySelector('#jokes-panel .api-filter-btn.active').dataset.category;
        loadRandomJoke(activeCategory);
    });

    // Initialize jokes with default category
    loadRandomJoke('Any');
});