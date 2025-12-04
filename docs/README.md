Overview

Gaming Hub is a web application designed to provide gamers with an informative platform to compare prices, games, and specifications of the latest console games for Nintendo Switch, PlayStation, and Xbox. The website allows users to explore detailed information about different games, consoles, and characters while also providing additional features such as game news, gaming jokes, and retro game collections.

This project began as a simple idea but has since evolved as new features and knowledge have been gained. The goal of Gaming Hub is to help gamers make informed decisions about their consoles and game choices.

Motivation

The original motivation for creating this website was to provide an easy comparison platform for gamers to explore the specifications and games available on various consoles. As I learned more about web development, I recognized new opportunities to expand the site with features like gaming news, retro games, jokes, and more.

Problem Being Solved

Gaming Hub addresses the problem of information overload and confusion regarding game and console specifications. Many gamers do not fully understand the capabilities of their consoles or the range of games available to them. This website aims to educate and guide users in making more informed decisions about their gaming purchases.

Target Audience

Primary Audience: Video game enthusiasts and console gamers worldwide.

Secondary Audience: Individuals who want to stay updated on gaming news, enjoy gaming-related humor, and explore classic retro games.

Major Features
Current Features:

showGameDialog: Displays a modal dialog with detailed game information, including background video and purchase links.

getConsoleName: Converts console codes into readable names.

createConsoleBadge: Displays a badge to identify each console.

downloadCard: Enables the user to download a gamer card with personalized data.

saveSubscriber: Saves subscriber information to localStorage.

showMessage: Displays feedback messages for the user.

closeDialog: Closes modal dialogs and cleans up resources.

escClose: Closes dialogs with the ESC key.

loadGamesByConsole: Dynamically loads games based on the selected console.

loadCharactersByGame: Loads characters available for the selected game.

updateCharacterImage: Updates character images when a selection is made.

toggleMenu: Toggles the hamburger menu visibility.

handleFormSubmit: Processes the newsletter form submission.

initializeDynamicCards: Initializes clickable game cards.

initializeCurrentYear: Displays the current year in footer elements.

initializeLastModified: Shows the last document modification date.

Planned Features:

fetchGamingNews: Fetches and displays the latest gaming news from an external API.

fetchRandomGamingJoke: Retrieves and displays random gaming-related jokes.

loadRetroGamesCatalog: Loads and displays classic retro games.

animateHamburgerMenu: Adds smooth animations to the hamburger menu icon.

Wireframes / Moqups links (WIREFRAMES)
    
    DESKOPT - https://app.moqups.com/Seo8LBdEXoEC3CQ3IbC5ZtAFrkPd1Vwi/view/page/ad64222d5
    
    MOBILE - https://app.moqups.com/O5WwD7aMUeK7P9FCzbA4kaZxIwEZmEqV/view/page/ad64222d5

External Data

The following external APIs will be used to fetch data for the application:

News API - Fetches the latest gaming news and headlines.

JokeAPI - Retrieves random jokes related to gaming.

Game-API - Embeds arcade-style games like Pong, Tetris, or Snake into the website.

Modules

The application will consist of the following major components:

NewsAPI/Module - Fetches and displays gaming news.

JokesAPI/Module - Retrieves and displays gaming-related jokes.

RetroGames/Module - Manages retro games catalog.

Animations/Module - Handles animations for UI components (e.g., hamburger menu).

CSS - Custom styles for all pages (5 total).

JSON - Updates game information in JSON files.

HTML - Adds new pages for retro games.

Graphic Identity

Favicon: A brand icon from "Republic of Gamers".

Color Scheme: https://coolors.co/000000-ff2d2d-0078ff-00ff64-ffffff-783cff 
    
    Black (background)
    Vermilion (Switch Section)
    Blue(Crayola) (Play station Section)
    Spring Green (Xbox Section)
    White / Electric Violet (Words / Effects)

Typography:

Titles: Orbitron

Body Text: Rajdhani

Timeline

Work is planned over the next 3 weeks as follows:

Week 5: Initial setup of features, wireframes, and core modules.

Week 6: Implement new features such as fetchGamingNews, fetchRandomGamingJoke, and retro games catalog.

Week 7: Test and refine responsiveness across all sections, finalize design elements, and fix any bugs.

For more detailed scheduling, check the Trello Boar: https://trello.com/b/HJaSXGhZ/gaming-hub-part-3
