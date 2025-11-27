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
    const urlParams = new URLSearchParams(window.location.search);
    // GET THE DATA OF THE FORM
    const cardData = {
        firstName: urlParams.get('firstName'),
        lastName: urlParams.get('lastName'),
        age: urlParams.get('age'),
        country: urlParams.get('country'),
        console: urlParams.get('console'),
        game: urlParams.get('game'),
        character: urlParams.get('character'),
        characterImage: urlParams.get('characterImage'),
        backgroundImage: urlParams.get('backgroundImage'),
        gamerText: urlParams.get('gamerText')
    };

    if (!cardData.firstName) {
        window.location.href = 'siteplan.html';
        return;
    }

    // DISPLAY THE GAME CARD
    document.getElementById('gamerName').textContent = `${cardData.firstName} ${cardData.lastName}`;
    document.getElementById('gamerAge').textContent = cardData.age;
    document.getElementById('gamerCountry').textContent = cardData.country;
    document.getElementById('gamerConsole').textContent = getConsoleName(cardData.console);
    document.getElementById('gamerGame').textContent = cardData.game;
    document.getElementById('gamerCharacter').textContent = cardData.character;
    document.getElementById('gamerText').textContent = cardData.gamerText;

    document.querySelector('.card-background').src = cardData.backgroundImage;
    document.querySelector('.character-image').src = cardData.characterImage;

    createConsoleBadge(cardData.console);

    document.getElementById('downloadCard').addEventListener('click', downloadCard);
    document.getElementById('createNewCard').addEventListener('click', () => {
        window.location.href = 'siteplan.html';
    });

    function getConsoleName(consoleType) {
        const consoles = {
            playstation: 'PlayStation',
            xbox: 'Xbox Series X|S',
            switch: 'Nintendo Switch'
        };
        return consoles[consoleType] || consoleType;
    }

    function createConsoleBadge(consoleType) {
        const badge = document.createElement('div');
        badge.className = `console-badge ${consoleType}`;

        switch (consoleType) {
            case 'playstation':
                badge.textContent = 'PS';
                break;
            case 'xbox':
                badge.textContent = 'XB';
                break;
            case 'switch':
                badge.textContent = 'SW';
                break;
            default:
                badge.textContent = 'GN';
        }

        document.querySelector('.gamer-card').prepend(badge);
    }

    function downloadCard() {
        alert('Card download functionality would be implemented here with html2canvas library');
        
    }
});