let score = 0;
let questionCount = 0;
let correctCount = 0;
let incorrectCount = 0;
let currentA, currentB, currentAnswer;
let gameActive = true;

// Genereert verschillende rekenstrategieën
function generateStrategies(a, b) {
    const strategies = [];
    
    const tens1 = Math.floor(a / 10) * 10;
    const ones1 = a % 10;
    const tens2 = Math.floor(b / 10) * 10;
    const ones2 = b % 10;
    
    // Strategie 1: Simpele splitsen van het tweede getal (vooral 11-19)
    if (ones2 > 0 && tens2 > 0) {
        strategies.push({
            title: `Splitsen: ${a} × (${tens2} + ${ones2})`,
            steps: [
                `${a} × ${tens2} = ${a * tens2}`,
                `${a} × ${ones2} = ${a * ones2}`,
                `${a * tens2} + ${a * ones2} = ?`
            ]
        });
    }
    
    // Strategie 2: Halvering/Verdubbeling (als een getal even is)
    if (a % 2 === 0) {
        const halfA = a / 2;
        const doubleB = b * 2;
        strategies.push({
            title: 'Halvering/Verdubbeling',
            steps: [
                `${a} × ${b} = ${halfA} × ${doubleB}`,
                `${halfA} × ${doubleB} = ?`
            ]
        });
    } else if (b % 2 === 0) {
        const halfB = b / 2;
        const doubleA = a * 2;
        strategies.push({
            title: 'Halvering/Verdubbeling',
            steps: [
                `${a} × ${b} = ${doubleA} × ${halfB}`,
                `${doubleA} × ${halfB} = ?`
            ]
        });
    }
    
    // Strategie 3: Vierkanten methode (ankergetallen)
    if (Math.abs(a - b) <= 5 && a > 10) {
        const min = Math.min(a, b);
        const max = Math.max(a, b);
        const diff = max - min;
        const square = max * max;
        const product = diff * max;
        strategies.push({
            title: `Via vierkant van ${max}`,
            steps: [
                `${a} × ${b} = ${max}² - (${max} × ${diff})`,
                `${max}² = ${square}`,
                `${max} × ${diff} = ${product}`,
                `${square} - ${product} = ?`
            ]
        });
    }
    
    // Strategie 4: Volledig splitsen
    if (ones1 > 0 && ones2 > 0 && ones1 !== a % 10) {
        strategies.push({
            title: 'Splitsen: (tiental + eenheid) × (tiental + eenheid)',
            steps: [
                `${a} × ${b} = (${tens1} + ${ones1}) × (${tens2} + ${ones2})`,
                `${tens1} × ${tens2} = ${tens1 * tens2}`,
                `${tens1} × ${ones2} = ${tens1 * ones2}`,
                `${ones1} × ${tens2} = ${ones1 * tens2}`,
                `${ones1} × ${ones2} = ${ones1 * ones2}`,
                `${tens1 * tens2} + ${tens1 * ones2} + ${ones1 * tens2} + ${ones1 * ones2} = ?`
            ]
        });
    }
    
    // Strategie 5: Afronden naar makkelijk getal
    if (b % 10 !== 0) {
        const roundedB = Math.ceil(b / 10) * 10;
        const difference = roundedB - b;
        strategies.push({
            title: `Afronden naar ${roundedB}`,
            steps: [
                `${a} × ${roundedB} = ${a * roundedB}`,
                `${a} × ${difference} = ${a * difference}`,
                `${a * roundedB} - ${a * difference} = ?`
            ]
        });
    }
    
    return strategies.slice(0, 3); // Max 3 strategieën
}

function displayStrategies(a, b) {
    const strategies = generateStrategies(a, b);
    const strategiesDiv = document.getElementById('strategies');
    strategiesDiv.innerHTML = '';
    
    strategies.forEach((strategy, index) => {
        // Verberg het eindantwoord (laatste stap)
        const stepsToShow = strategy.steps.slice(0, -1);
        const strategyHTML = `
            <div class="strategy">
                <strong>Manier ${index + 1}: ${strategy.title}</strong>
                <div class="strategy-steps">
                    ${stepsToShow.map(step => `<div class="step">→ ${step}</div>`).join('')}
                    <div class="step-hidden">→ ... = ?</div>
                </div>
            </div>
        `;
        strategiesDiv.innerHTML += strategyHTML;
    });
}

function generateQuestion() {
    currentA = Math.floor(Math.random() * 15) + 11; // 11-25
    currentB = Math.floor(Math.random() * 15) + 11; // 11-25
    currentAnswer = currentA * currentB;
    
    document.getElementById('question').textContent = `${currentA} × ${currentB} =`;
    document.getElementById('answer-input').value = '';
    document.getElementById('answer-input').focus();
    document.getElementById('feedback').classList.remove('show', 'correct', 'incorrect');
    
    // Toon rekenstrategieën
    displayStrategies(currentA, currentB);
}

function checkAnswer() {
    if (!gameActive) return;

    const userAnswer = parseInt(document.getElementById('answer-input').value);
    const feedback = document.getElementById('feedback');
    const submitBtn = document.getElementById('submit-btn');

    if (isNaN(userAnswer)) {
        feedback.textContent = '⚠️ Voer een getal in!';
        feedback.classList.add('show', 'incorrect');
        return;
    }

    gameActive = false;
    submitBtn.disabled = true;

    questionCount++;

    if (userAnswer === currentAnswer) {
        score += 10;
        correctCount++;
        feedback.textContent = '✅ Correct! +10 punten!';
        feedback.classList.add('show', 'correct');
    } else {
        incorrectCount++;
        feedback.textContent = `❌ Fout! Het antwoord is ${currentAnswer}`;
        feedback.classList.add('show', 'incorrect');
    }

    updateDisplay();

    setTimeout(() => {
        gameActive = true;
        submitBtn.disabled = false;
        generateQuestion();
    }, 1500);
}

function updateDisplay() {
    document.getElementById('score').textContent = score;
    document.getElementById('question-number').textContent = questionCount;
    document.getElementById('correct-count').textContent = correctCount;
    document.getElementById('incorrect-count').textContent = incorrectCount;
}

function resetGame() {
    score = 0;
    questionCount = 0;
    correctCount = 0;
    incorrectCount = 0;
    gameActive = true;
    document.getElementById('submit-btn').disabled = false;
    updateDisplay();
    generateQuestion();
}

// Enter-toets ondersteuning
document.getElementById('answer-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && gameActive) {
        checkAnswer();
    }
});

// Start het spel
generateQuestion();