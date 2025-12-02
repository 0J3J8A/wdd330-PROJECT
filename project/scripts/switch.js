// Current Year
const currentYear = new Date().getFullYear();
document.getElementById("currentyear").textContent = currentYear;

const lastModified = document.lastModified;
document.getElementById("lastmodification").textContent = lastModified;

// HAMBURGER MENU
document.addEventListener('DOMContentLoaded', function () {
  const menu = document.getElementById('MAIN_MENU');
  const hamburger = document.getElementById('h_menu');

  hamburger.addEventListener('click', function (e) {
    e.preventDefault();
    menu.classList.toggle('menu-open');
  });
});

document.addEventListener('DOMContentLoaded', function () {
  fetch('data/switch_games.json')
    .then(response => response.json())
    .then(data => {
      const cards = document.querySelectorAll('.card');

      cards.forEach((card, index) => {
        const game = data.games[index];
        if (game) {
          card.addEventListener('click', () => {
            showGameDialog(game);
          });
        }
      });
    });

  // LIST GOTY GAMES SWITCH PAGE
  const gotyGames = {
    "THE LEGEND OF ZELDA: TEARS OF THE KINGDOM": "2023"
  };

  // DISPLAY THE DIALOG
  function showGameDialog(game) {
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    document.body.appendChild(overlay);

    const dialog = document.createElement('div');
    dialog.className = 'game-dialog';

    // Video background
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-container';

    const video = document.createElement('video');
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.src = game.backgroundVideo;
    video.className = 'bg-video';

    videoContainer.appendChild(video);
    dialog.appendChild(videoContainer);

    const content = document.createElement('div');
    content.className = 'dialog-content';

    content.innerHTML = `
            <h2>${game.title}</h2>
            <div class="game-info">
                <p><strong>Developer:</strong> ${game.developer}</p>
                <p><strong>Release Year:</strong> ${game.year}</p>
                <p><strong>Rating:</strong> ${game.rating}</p>
                <div class="button-container">
                    <a href="${game.amazonLink}" target="_blank" class="buy-button">Buy on Amazon</a>
                    <button class="learn-more-button">Learn More</button>
                </div>
            </div>
            <button class="close-dialog">✕ Close</button>
        `;

    dialog.appendChild(content);
    document.body.appendChild(dialog);

    // Event listener for the Learn More button
    const learnMoreBtn = dialog.querySelector('.learn-more-button');
    learnMoreBtn.addEventListener('click', () => {
      closeDialog();
      showDetailedDialog(game);
    });

    const closeBtn = dialog.querySelector('.close-dialog');
    closeBtn.addEventListener('click', closeDialog);

    overlay.addEventListener('click', closeDialog);

    function closeDialog() {
      video.pause();
      video.removeAttribute('src');
      document.body.removeChild(dialog);
      document.body.removeChild(overlay);
    }

    // USE ESC
    document.addEventListener('keydown', function escClose(e) {
      if (e.key === 'Escape') {
        closeDialog();
        document.removeEventListener('keydown', escClose);
      }
    });
  }

  // SHOW THE SECOND DIALOG
  function showDetailedDialog(game) {
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    document.body.appendChild(overlay);

    const dialog = document.createElement('div');
    dialog.className = 'game-dialog detailed-dialog';

    // DUPLICATE THE Video background
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-container';

    const video = document.createElement('video');
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.src = game.backgroundVideo;
    video.className = 'bg-video';

    videoContainer.appendChild(video);
    dialog.appendChild(videoContainer);

    const content = document.createElement('div');
    content.className = 'dialog-content detailed-content';

    // Function to verify if the game is in the GOTY list
    const gotyInfo = gotyGames[game.title] ? 
      `<p><strong class="goty">GOTY Winner:</strong> ${gotyGames[game.title]}</p>` : 
      '';

    content.innerHTML = `
            <h2>${game.title}</h2>
            <div class="detailed-game-info">
                <p><strong>Developer:</strong> ${game.developer}</p>
                <p><strong>Release Year:</strong> ${game.year}</p>
                <p><strong>Rating:</strong> ${game.rating}</p>
                <p><strong>Genre:</strong> ${game.genre}</p>
                <p><strong>Summary:</strong> ${game.h_sumary}</p>
                <p><strong>Multiplayer:</strong> ${game.multiplayer}</p>
                <p><strong>Play Time:</strong> ${game.playtime}</p>
                <p><strong>Metacritic Score:</strong> ${game.score}/100</p>
                ${gotyInfo}
                <div class="button-container">
                    <a href="${game.amazonLink}" target="_blank" class="buy-button">Buy on Amazon</a>
                </div>
            </div>
            <button class="close-dialog">✕ Close</button>
        `;

    dialog.appendChild(content);
    document.body.appendChild(dialog);

    const closeBtn = dialog.querySelector('.close-dialog');
    closeBtn.addEventListener('click', closeDialog);

    overlay.addEventListener('click', closeDialog);

    function closeDialog() {
      video.pause();
      video.removeAttribute('src');
      document.body.removeChild(dialog);
      document.body.removeChild(overlay);
    }

    // USE ESC
    document.addEventListener('keydown', function escClose(e) {
      if (e.key === 'Escape') {
        closeDialog();
        document.removeEventListener('keydown', escClose);
      }
    });
  }
});