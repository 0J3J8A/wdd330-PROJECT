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

  // -------------------- FORM HANDLING --------------------
  const form = document.getElementById('gamingNewsletter');
  const formMessage = document.getElementById('formMessage');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const wantsUpdates = document.getElementById('updates').checked;

    const subscriber = {
      name: name,
      email: email,
      wantsUpdates: wantsUpdates,
      subscriptionDate: new Date().toLocaleDateString()
    };

    saveSubscriber(subscriber);

    showMessage(`Thanks ${name}! ${wantsUpdates ? 'You will receive updates.' : 'Thanks for registering.'}`);

    form.reset();
  });

  function saveSubscriber(subscriber) {
    const subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];
    subscribers.push(subscriber);
    localStorage.setItem('subscribers', JSON.stringify(subscribers));
  }

  function showMessage(message) {
    formMessage.className = '';
    formMessage.textContent = '';
    if (formMessage.timeout) clearTimeout(formMessage.timeout);

    formMessage.textContent = message;
    formMessage.classList.add('success', 'show');

    formMessage.timeout = setTimeout(() => {
      formMessage.classList.remove('show');
      setTimeout(() => {
        formMessage.className = '';
        formMessage.textContent = '';
      }, 500);
    }, 5000);
  }

  // -------------------- DYNAMIC GAME CARDS --------------------
  fetch('data/siteplan_games.json')
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

  // -------------------- GAME DIALOG FUNCTION --------------------
  function showGameDialog(game) {
    
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';


    const dialog = document.createElement('div');
    dialog.className = 'game-dialog';

    //background video|
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-container';

    const video = document.createElement('video');
    video.className = 'bg-video';
    video.src = game.backgroundVideo;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;

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
        <a href="${game.amazonLink}" target="_blank" class="buy-button">Buy on Amazon</a>
      </div>
    `;
 
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-dialog';
    closeBtn.innerText = '✕ Close';
    closeBtn.addEventListener('click', closeDialog);


    dialog.appendChild(content);
    dialog.appendChild(closeBtn);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);


    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        closeDialog();
      }
    });

    // USE ESC
    function escClose(e) {
      if (e.key === 'Escape') {
        closeDialog();
        document.removeEventListener('keydown', escClose);
      }
    }
    document.addEventListener('keydown', escClose);

    function closeDialog() {
      video.pause();
      video.removeAttribute('src');
      overlay.remove();
    }
  }
});
