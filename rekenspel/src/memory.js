let selectedTable = null;
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let attempts = 0;
let gameRunning = false;

// Maak tabelkeuze buttons
function initializeTableSelector() {
    const selector = document.getElementById('tableSelector');
    for (let i = 1; i <= 20; i++) {
        const btn = document.createElement('button');
        btn.className = 'table-btn';
        btn.textContent = `${i}`;
        btn.onclick = () => startMemory(i);
        selector.appendChild(btn);
    }
}

// Genereer kaarten voor memory
function generateCards(table) {
    const cardPairs = [];
    
    // Maak 10 paren: som en antwoord
    for (let i = 1; i <= 10; i++) {
        const multiplier = Math.floor(Math.random() * 20) + 1;
        const sum = `${multiplier}×${table}`;
        const answer = multiplier * table;
        
        cardPairs.push({
            content: sum,
            type: 'sum',
            value: answer
        });
        cardPairs.push({
            content: answer,
            type: 'answer',
            value: answer
        });
    }
    
    // Shuffle de kaarten
    return cardPairs.sort(() => Math.random() - 0.5);
}

// Start het memory spel
function startMemory(table) {
    selectedTable = table;
    matchedPairs = 0;
    attempts = 0;
    flippedCards = [];
    gameRunning = true;

    cards = generateCards(table);

    document.getElementById('selectionScreen').style.display = 'none';
    document.getElementById('resultsScreen').style.display = 'none';
    document.getElementById('memoryGame').style.display = 'block';
    document.getElementById('selectedTable').textContent = table;

    renderGrid();
}

// Render het memory grid
function renderGrid() {
    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = '';

    cards.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'memory-card';
        cardEl.textContent = '?';
        cardEl.dataset.index = index;
        cardEl.onclick = () => flipCard(index, cardEl);
        grid.appendChild(cardEl);
    });
}

// Flip een kaart
function flipCard(index, cardEl) {
    if (!gameRunning) return;
    if (flippedCards.length >= 2) return;
    if (cardEl.classList.contains('flipped')) return;
    if (cardEl.classList.contains('matched')) return;

    // Flip de kaart
    cardEl.classList.add('flipped');
    cardEl.textContent = cards[index].content;
    flippedCards.push({ index, element: cardEl });

    // Als 2 kaarten zijn omgekeerd, check of ze matchen
    if (flippedCards.length === 2) {
        attempts++;
        document.getElementById('attempts').textContent = attempts;
        checkMatch();
    }
}

// Check of twee kaarten een match zijn
function checkMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = cards[card1.index].value === cards[card2.index].value;

    if (isMatch) {
        // Match gevonden!
        setTimeout(() => {
            card1.element.classList.add('matched');
            card2.element.classList.add('matched');
            matchedPairs++;
            document.getElementById('pairs-found').textContent = matchedPairs;

            flippedCards = [];

            // Check of spel voorbij is
            if (matchedPairs === 10) {
                endGame();
            }
        }, 500);
    } else {
        // Geen match, flip terug
        setTimeout(() => {
            card1.element.classList.remove('flipped');
            card1.element.textContent = '?';
            card2.element.classList.remove('flipped');
            card2.element.textContent = '?';
            flippedCards = [];
        }, 800);
    }
}

// Spel eindigen
function endGame() {
    gameRunning = false;
    setTimeout(() => {
        document.getElementById('memoryGame').style.display = 'none';
        document.getElementById('resultsScreen').style.display = 'block';
        document.getElementById('finalAttempts').textContent = attempts;
    }, 500);
}

// Reset het spel
function resetMemory() {
    startMemory(selectedTable);
}

// Initialiseer tabelkeuze
initializeTableSelector();
