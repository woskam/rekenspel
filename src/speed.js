let selectedTable = null;
let questions = [];
let currentQuestionIndex = 0;
let correctCount = 0;
let incorrectCount = 0;
let timeLeft = 60;
let gameRunning = false;
let timerInterval = null;

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

// Genereer random vragen voor gekozen tafel
function generateQuestions(table) {
    const qs = [];
    for (let i = 1; i <= 20; i++) {
        qs.push({
            a: i,
            b: table,
            answer: i * table
        });
    }
    // Shuffle array
    return qs.sort(() => Math.random() - 0.5);
}

// Start het spel
function startGame(table) {
    selectedTable = table;
    correctCount = 0;
    incorrectCount = 0;
    timeLeft = 60;
    currentQuestionIndex = 0;
    gameRunning = true;

    questions = generateQuestions(table);

    document.getElementById('selectionScreen').style.display = 'none';
    document.getElementById('resultsScreen').style.display = 'none';
    document.getElementById('speedGame').style.display = 'block';
    document.getElementById('selectedTable').textContent = table;

    showQuestion();
    startTimer();

    document.getElementById('answer-input').focus();
}

// Toon volgende vraag
function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        // Herhaal vragen als allemaal gesteld zijn
        currentQuestionIndex = 0;
        questions.sort(() => Math.random() - 0.5); // Reshuffle
    }

    const q = questions[currentQuestionIndex];
    document.getElementById('question').textContent = `${q.a} × ${q.b} =`;
    document.getElementById('answer-input').value = '';
    document.getElementById('feedback').classList.remove('show', 'correct', 'incorrect');
    document.getElementById('answer-input').focus();
}

// Check antwoord
function submitAnswer() {
    if (!gameRunning) return;

    const userAnswer = parseInt(document.getElementById('answer-input').value);
    const feedback = document.getElementById('feedback');
    const q = questions[currentQuestionIndex];

    if (isNaN(userAnswer)) {
        feedback.textContent = '⚠️ Voer een getal in!';
        feedback.classList.add('show', 'incorrect');
        return;
    }

    if (userAnswer === q.answer) {
        correctCount++;
        feedback.textContent = '✅ Goed!';
        feedback.classList.add('show', 'correct');
    } else {
        incorrectCount++;
        feedback.textContent = '❌ Fout!';
        feedback.classList.add('show', 'incorrect');
    }

    updateDisplay();

    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 400);
}

// Update score display
function updateDisplay() {
    document.getElementById('correct-count').textContent = correctCount;
    document.getElementById('incorrect-count').textContent = incorrectCount;
}

// Timer
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        const timerEl = document.getElementById('timer');
        timerEl.textContent = timeLeft;

        if (timeLeft <= 10) {
            timerEl.classList.add('warning');
        }

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// Spel eindigen
function endGame() {
    gameRunning = false;
    clearInterval(timerInterval);

    document.getElementById('speedGame').style.display = 'none';
    document.getElementById('resultsScreen').style.display = 'block';

    const total = correctCount + incorrectCount;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    document.getElementById('finalCorrect').textContent = correctCount;
    document.getElementById('finalIncorrect').textContent = incorrectCount;
    document.getElementById('finalTotal').textContent = total;
    document.getElementById('finalPercentage').textContent = percentage;
}

// Enter-toets ondersteuning
document.getElementById('answer-input')?.addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && gameRunning) {
        submitAnswer();
    }
});

// Initialiseer tabelkeuze
initializeTableSelector();
