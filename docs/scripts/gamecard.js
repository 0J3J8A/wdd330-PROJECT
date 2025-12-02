document.addEventListener('DOMContentLoaded', function() {
  const consoleSelect = document.getElementById('console');
  const gameSelect = document.getElementById('game');
  const characterSelect = document.getElementById('character');
  const characterImageInput = document.getElementById('characterImage');
  const backgroundImageInput = document.getElementById('backgroundImage');
  
  // Load games based on console selection
  consoleSelect.addEventListener('change', function() {
    const selectedConsole = this.value;
    
    if (!selectedConsole) {
      gameSelect.disabled = true;
      gameSelect.innerHTML = '<option value="">-- Select a Console First --</option>';
      characterSelect.disabled = true;
      characterSelect.innerHTML = '<option value="">-- Select a Game First --</option>';
      return;
    }
    
    // Load the appropriate JSON file
    fetch(`data/${selectedConsole}_games.json`)
      .then(response => response.json())
      .then(data => {
        gameSelect.disabled = false;
        gameSelect.innerHTML = '<option value="">-- Select Game --</option>';
        
        data.games.forEach(game => {
          const option = document.createElement('option');
          option.value = game.title;
          option.textContent = game.title;
          option.dataset.background = game.image;
          option.dataset.characters = JSON.stringify(game.characters);
          gameSelect.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Error loading games:', error);
        gameSelect.disabled = true;
        gameSelect.innerHTML = '<option value="">Error loading games</option>';
      });
  });
  
  // Load characters based on game selection
  gameSelect.addEventListener('change', function() {
    const selectedOption = this.options[this.selectedIndex];
    
    if (!this.value) {
      characterSelect.disabled = true;
      characterSelect.innerHTML = '<option value="">-- Select a Game First --</option>';
      return;
    }
    
    // Set the background image in the hidden input
    backgroundImageInput.value = selectedOption.dataset.background;
    
    const characters = JSON.parse(selectedOption.dataset.characters);
    
    characterSelect.disabled = false;
    characterSelect.innerHTML = '<option value="">-- Select Character --</option>';
    
    characters.forEach(character => {
      const option = document.createElement('option');
      option.value = character.name;
      option.textContent = character.name;
      option.dataset.image = character.image;
      characterSelect.appendChild(option);
    });
  });
  
  // Update character image when character is selected
  characterSelect.addEventListener('change', function() {
    const selectedOption = this.options[this.selectedIndex];
    if (selectedOption.dataset.image) {
      characterImageInput.value = selectedOption.dataset.image;
    }
  });
});