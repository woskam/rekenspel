let selectedTable = null;
let questions = [];
let currentQuestionIndex = 0;
let correctCount = 0;
let incorrectCount = 0;
let gameRunning = false;

// Maak tabelkeuze buttons
function initializeTableSelector() {
    const selector = document.getElementById('tableSelector');
    for (let i = 1; i <= 20; i++) {
        const btn = document.createElement('button');
        btn.className = 'table-btn';
        btn.textContent = `${i}`;
        btn.onclick = () => startGame(i);
        selector.appendChild(btn);
    }
}

// Genereer 10 willekeurige vragen met 4 opties
function generateQuestions(table) {
    const qs = [];
    for (let i = 0; i < 10; i++) {
        const multiplier = Math.floor(Math.random() * 20) + 1;
        const correctAnswer = multiplier * table;
        
        // Genereer 3 foutieve antwoorden
        const options = [correctAnswer];
        while (options.length < 4) {
            const offset = Math.floor(Math.random() * 30) - 15; // -15 tot +15
            const wrongAnswer = correctAnswer + offset;
            if (wrongAnswer > 0 && !options.includes(wrongAnswer) && wrongAnswer !== correctAnswer) {
                options.push(wrongAnswer);
            }
        }
        
        // Shuffle de opties
        options.sort(() => Math.random() - 0.5);
        
        qs.push({
            a: multiplier,
            b: table,
            answer: correctAnswer,
            options: options
        });
    }
    return qs;
}

// Start het spel
function startGame(table) {
    selectedTable = table;
    correctCount = 0;
    incorrectCount = 0;
    currentQuestionIndex = 0;
    gameRunning = true;

    questions = generateQuestions(table);

    document.getElementById('selectionScreen').style.display = 'none';
    document.getElementById('resultsScreen').style.display = 'none';
    document.getElementById('mcGame').style.display = 'block';
    document.getElementById('selectedTable').textContent = table;

    showQuestion();
}

// Toon volgende vraag
function showQuestion() {
    const q = questions[currentQuestionIndex];
    document.getElementById('question').textContent = `${q.a} × ${q.b} =`;
    document.getElementById('question-number').textContent = currentQuestionIndex + 1;
    document.getElementById('feedback').classList.remove('show', 'correct', 'incorrect');

    const optionsGrid = document.getElementById('optionsGrid');
    optionsGrid.innerHTML = '';

    q.options.forEach((option) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.onclick = () => checkAnswer(option);
        optionsGrid.appendChild(btn);
    });
}

// Check antwoord
function checkAnswer(selectedOption) {
    if (!gameRunning) return;

    gameRunning = false;
    const q = questions[currentQuestionIndex];
    const feedback = document.getElementById('feedback');
    const buttons = document.querySelectorAll('.option-btn');

    // Disable alle knoppen
    buttons.forEach(btn => btn.disabled = true);

    // Highlight het correcte antwoord
    buttons.forEach(btn => {
        if (parseInt(btn.textContent) === q.answer) {
            btn.classList.add('correct');
        }
    });

    if (selectedOption === q.answer) {
        correctCount++;
        feedback.textContent = '✅ Correct!';
        feedback.classList.add('show', 'correct');
    } else {
        incorrectCount++;
        feedback.textContent = `❌ Fout! Het juiste antwoord is ${q.answer}`;
        feedback.classList.add('show', 'incorrect');
        
        // Highlight fout antwoord
        buttons.forEach(btn => {
            if (parseInt(btn.textContent) === selectedOption) {
                btn.classList.add('incorrect');
            }
        });
    }

    updateDisplay();

    // Ga naar volgende vraag
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex >= questions.length) {
            endGame();
        } else {
            gameRunning = true;
            showQuestion();
        }
    }, 1500);
}

// Update display
function updateDisplay() {
    document.getElementById('correct-count').textContent = correctCount;
    document.getElementById('incorrect-count').textContent = incorrectCount;
}

// Spel eindigen
function endGame() {
    gameRunning = false;
    document.getElementById('mcGame').style.display = 'none';
    document.getElementById('resultsScreen').style.display = 'block';

    const percentage = Math.round((correctCount / 10) * 100);
    document.getElementById('finalCorrect').textContent = correctCount;
    document.getElementById('finalPercentage').textContent = percentage;
}

// Reset het spel
function resetMC() {
    startGame(selectedTable);
}

// Initialiseer tabelkeuze
initializeTableSelector();
