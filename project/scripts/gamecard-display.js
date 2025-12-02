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

    // Funtion to DOWNLOAD the card as an image
    function downloadCard() {
        const cardElement = document.querySelector('.gamer-card');
        
        // SHOWING A TEXT indicating the process
        const downloadBtn = document.getElementById('downloadCard');
        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = 'Processing...';
        downloadBtn.disabled = true;
        
        // Waiting to charge the iamges completely
        function waitForImages() {
            const images = document.querySelectorAll('img');
            const promises = Array.from(images).map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => {
                    img.onload = resolve;
                    img.onerror = resolve;
                });
            });
            return Promise.all(promises);
        }
        
        waitForImages().then(() => {
            // use the html2canvas  library
            return html2canvas(cardElement, {
                scale: 2, // Quality 2x
                useCORS: true, 
                allowTaint: false, 
                backgroundColor: null, // NO background
                logging: false 
            });
        }).then(canvas => {
            const link = document.createElement('a');
            
            // Create the name of the file, using the Name of the form
            const fileName = `GamerCard_${cardData.firstName}_${cardData.character}.png`;
            
            link.download = fileName;
            link.href = canvas.toDataURL('image/png');
            
            // Using the click statement
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            downloadBtn.textContent = originalText;
            downloadBtn.disabled = false;
            
            // Showing a success message
            alert('Card downloaded successfully!');
            
        }).catch(error => {
            console.error('Error generating card:', error);
            
            // Restart button
            downloadBtn.textContent = 'Download Card';
            downloadBtn.disabled = false;
            
            // Just in case, an error msg
            alert('Error downloading card. Please try again.');
        });
    }
});