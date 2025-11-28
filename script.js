// Typing Test Application
class TypingTestApp {
    constructor() {
        this.userName = '';
        this.currentDifficulty = '';
        this.currentTest = null;
        this.history = this.loadHistory();
        
        this.sentences = {
            Easy: [
                "The cat sat on the mat.",
                "I love to code every day.",
                "The sun is shining bright.",
                "She reads books at night.",
                "We play games on weekends."
            ],
            Medium: [
                "Programming requires logical thinking and problem solving skills.",
                "The quick brown fox jumps over the lazy sleeping dog.",
                "Technology advances rapidly in the modern digital world.",
                "Practice makes perfect when learning new programming languages.",
                "Artificial intelligence is transforming industries worldwide."
            ],
            Hard: [
                "Object-oriented programming encompasses encapsulation, inheritance, and polymorphism fundamentals.",
                "Sophisticated algorithms optimize computational efficiency through strategic data structure implementation.",
                "Comprehensive understanding requires diligent practice, analytical thinking, and continuous improvement.",
                "The exponential growth of technological innovation necessitates perpetual adaptation and learning.",
                "Efficient memory management and algorithmic complexity analysis are crucial for scalable applications."
            ]
        };

        this.currentSentenceIndex = 0;
        this.startTime = null;
        this.testInterval = null;
        this.elapsedTime = 0;
        this.isTestActive = false;
        this.originalText = '';
        this.typedText = '';
        this.currentSentence = '';

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Welcome screen
        const startBtn = document.getElementById('startBtn');
        if (startBtn) {
            startBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleStart();
            });
        }
        const userNameInput = document.getElementById('userNameInput');
        if (userNameInput) {
            userNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleStart();
                }
            });
        }

        // Menu screen
        document.getElementById('newTestBtn').addEventListener('click', () => this.showDifficultyScreen());
        document.getElementById('myHistoryBtn').addEventListener('click', () => this.showHistory(true));
        document.getElementById('allHistoryBtn').addEventListener('click', () => this.showHistory(false));
        document.getElementById('exitBtn').addEventListener('click', () => this.handleExit());

        // Difficulty screen
        document.querySelectorAll('.btn-difficulty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const difficulty = e.currentTarget.dataset.difficulty;
                this.startTest(difficulty);
            });
        });
        document.getElementById('backToMenuBtn').addEventListener('click', () => this.showMenuScreen());

        // Test screen
        const typingInput = document.getElementById('typingInput');
        if (typingInput) {
            typingInput.addEventListener('input', (e) => this.handleTyping(e));
            typingInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleNextSentence();
                }
            });
        }
        const resetTestBtn = document.getElementById('resetTestBtn');
        if (resetTestBtn) {
            resetTestBtn.addEventListener('click', () => this.resetTest());
        }
        const finishTestBtn = document.getElementById('finishTestBtn');
        if (finishTestBtn) {
            finishTestBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.finishTest();
            });
        }

        // Results screen
        document.getElementById('newTestFromResultsBtn').addEventListener('click', () => this.showDifficultyScreen());
        document.getElementById('menuFromResultsBtn').addEventListener('click', () => this.showMenuScreen());

        // History screen
        document.getElementById('backFromHistoryBtn').addEventListener('click', () => this.showMenuScreen());
    }

    handleStart() {
        const nameInput = document.getElementById('userNameInput');
        if (!nameInput) {
            console.error('User name input not found');
            return;
        }
        const name = nameInput.value.trim();
        if (!name) {
            alert('Please enter your name!');
            nameInput.focus();
            return;
        }
        this.userName = name;
        this.showMenuScreen();
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('active');
        } else {
            console.error(`Screen with id "${screenId}" not found`);
        }
    }

    showMenuScreen() {
        document.getElementById('userNameDisplay').textContent = this.userName;
        this.showScreen('menuScreen');
    }

    showDifficultyScreen() {
        this.showScreen('difficultyScreen');
    }

    startTest(difficulty) {
        this.currentDifficulty = difficulty;
        this.currentSentenceIndex = 0;
        this.originalText = '';
        this.typedText = '';
        this.elapsedTime = 0;
        this.isTestActive = false;

        // Build original text
        this.sentences[difficulty].forEach(sentence => {
            this.originalText += sentence + ' ';
        });
        this.originalText = this.originalText.trim();

        this.showScreen('testScreen');
        this.displayCurrentSentence();
        
        // Enable finish button
        const finishBtn = document.getElementById('finishTestBtn');
        if (finishBtn) {
            finishBtn.disabled = false;
        }
        
        // Enable input after a short delay
        setTimeout(() => {
            document.getElementById('typingInput').disabled = false;
            document.getElementById('typingInput').focus();
        }, 100);
    }

    displayCurrentSentence() {
        const sentences = this.sentences[this.currentDifficulty];
        this.currentSentence = sentences[this.currentSentenceIndex];
        
        document.getElementById('sentenceCounter').textContent = 
            `Sentence ${this.currentSentenceIndex + 1} of ${sentences.length}`;
        
        document.getElementById('textDisplay').textContent = this.currentSentence;
        document.getElementById('typingInput').value = '';
        
        // Reset stats display
        this.updateStats(0, 0, 100, 0);
    }

    handleTyping(e) {
        if (!this.isTestActive) {
            this.isTestActive = true;
            this.startTime = Date.now();
            this.startTimer();
        }

        const typed = e.target.value;
        this.updateTextDisplay(typed);
        this.updateRealTimeStats();
    }

    updateTextDisplay(typed) {
        const display = document.getElementById('textDisplay');
        const original = this.currentSentence;
        let html = '';

        for (let i = 0; i < Math.max(original.length, typed.length); i++) {
            if (i < typed.length && i < original.length) {
                if (typed[i] === original[i]) {
                    html += `<span class="correct">${this.escapeHtml(typed[i])}</span>`;
                } else {
                    html += `<span class="incorrect">${this.escapeHtml(typed[i] || '')}</span>`;
                }
            } else if (i < original.length) {
                html += `<span class="current">${this.escapeHtml(original[i])}</span>`;
            } else if (i < typed.length) {
                html += `<span class="incorrect">${this.escapeHtml(typed[i])}</span>`;
            }
        }

        display.innerHTML = html;
    }

    handleNextSentence() {
        const sentences = this.sentences[this.currentDifficulty];
        const typed = document.getElementById('typingInput').value;
        
        this.typedText += typed + ' ';
        
        if (this.currentSentenceIndex < sentences.length - 1) {
            this.currentSentenceIndex++;
            this.displayCurrentSentence();
        } else {
            this.finishTest();
        }
    }

    startTimer() {
        this.testInterval = setInterval(() => {
            this.elapsedTime = (Date.now() - this.startTime) / 1000;
            this.updateRealTimeStats();
        }, 100);
    }

    stopTimer() {
        if (this.testInterval) {
            clearInterval(this.testInterval);
            this.testInterval = null;
        }
    }

    updateRealTimeStats() {
        if (!this.isTestActive || this.elapsedTime === 0) {
            this.updateStats(0, 0, 100, 0);
            return;
        }

        const typed = document.getElementById('typingInput').value;
        const allTypedSoFar = this.typedText + typed;
        const timeMinutes = this.elapsedTime / 60;

        // Calculate WPM
        const wordsTyped = this.countWords(allTypedSoFar);
        const wpm = Math.round(wordsTyped / timeMinutes);

        // Calculate SPM
        const sentencesCompleted = this.currentSentenceIndex;
        const spm = Math.round(sentencesCompleted / timeMinutes);

        // Calculate Accuracy
        const accuracy = this.calculateAccuracy(this.currentSentence, typed);

        this.updateStats(wpm, spm, accuracy, Math.round(this.elapsedTime));
    }

    updateStats(wpm, spm, accuracy, time) {
        document.getElementById('wpmDisplay').textContent = wpm;
        document.getElementById('spmDisplay').textContent = spm;
        document.getElementById('accuracyDisplay').textContent = accuracy.toFixed(1) + '%';
        document.getElementById('timeDisplay').textContent = time + 's';
    }

    finishTest() {
        // Collect current sentence if not already collected
        const typingInput = document.getElementById('typingInput');
        if (typingInput) {
            const typed = typingInput.value;
            if (typed.trim()) {
                this.typedText += typed + ' ';
            }
        }
        
        // Collect any remaining sentences that haven't been typed
        const sentences = this.sentences[this.currentDifficulty];
        for (let i = this.currentSentenceIndex + 1; i < sentences.length; i++) {
            // Add empty string for untyped sentences to maintain accuracy calculation
            this.typedText += ' ';
        }
        
        this.typedText = this.typedText.trim();
        
        this.stopTimer();
        
        // Ensure we have some time elapsed
        if (!this.isTestActive || this.elapsedTime === 0) {
            this.elapsedTime = 0.01; // Minimum time to avoid division by zero
        }
        
        const timeMinutes = this.elapsedTime / 60 || 0.01;
        
        // Calculate final metrics based on what was actually typed
        const wordsTyped = this.countWords(this.typedText);
        const wpm = Math.round(wordsTyped / timeMinutes);
        
        // Count sentences that were at least partially completed
        const sentencesCompleted = this.currentSentenceIndex + 1;
        const spm = Math.round(sentencesCompleted / timeMinutes);
        
        // Calculate accuracy based on all original text vs all typed text
        const accuracy = this.calculateAccuracy(this.originalText, this.typedText);
        
        // Create test result
        const testResult = {
            userName: this.userName,
            difficulty: this.currentDifficulty,
            language: 'English',
            wpm: wpm,
            spm: spm,
            accuracy: accuracy,
            dateTime: new Date().toLocaleString()
        };
        
        this.currentTest = testResult;
        this.saveTest(testResult);
        this.showResults(testResult);
    }

    resetTest() {
        this.stopTimer();
        this.startTest(this.currentDifficulty);
    }

    calculateAccuracy(original, typed) {
        if (original.length === 0) return 100;
        
        const maxLen = Math.max(original.length, typed.length);
        const distance = this.levenshteinDistance(original, typed);
        const accuracy = ((maxLen - distance) / maxLen) * 100;
        return Math.max(0, Math.min(100, accuracy));
    }

    levenshteinDistance(s1, s2) {
        const m = s1.length;
        const n = s2.length;
        const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (s1[i - 1] === s2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
                }
            }
        }

        return dp[m][n];
    }

    countWords(text) {
        if (!text.trim()) return 0;
        return text.trim().split(/\s+/).length;
    }

    showResults(testResult) {
        document.getElementById('resultUserName').textContent = testResult.userName;
        document.getElementById('resultDifficulty').textContent = testResult.difficulty;
        document.getElementById('resultWPM').textContent = testResult.wpm + ' words/minute';
        document.getElementById('resultSPM').textContent = testResult.spm + ' sentences/minute';
        document.getElementById('resultAccuracy').textContent = testResult.accuracy.toFixed(2) + '%';
        document.getElementById('resultDateTime').textContent = testResult.dateTime;

        // Motivational message
        const messageEl = document.getElementById('motivationalMessage');
        let message = `Great job ${testResult.userName}! Your accuracy is ${testResult.accuracy.toFixed(2)}%! `;
        
        if (testResult.accuracy >= 90) {
            message += '🌟 Outstanding performance! You\'re a typing master!';
        } else if (testResult.accuracy >= 75) {
            message += '💪 Excellent work! Keep practicing to improve further!';
        } else if (testResult.accuracy >= 60) {
            message += '👍 Good effort! A bit more practice and you\'ll excel!';
        } else {
            message += '🚀 Keep practicing! Every expert was once a beginner!';
        }
        
        messageEl.textContent = message;

        this.showScreen('resultsScreen');
    }

    showHistory(userOnly = false) {
        const historyList = document.getElementById('historyList');
        const historyTitle = document.getElementById('historyTitle');
        
        if (userOnly) {
            historyTitle.textContent = `Test History for ${this.userName}`;
        } else {
            historyTitle.textContent = 'All Test History';
        }

        let filteredHistory = userOnly 
            ? this.history.filter(test => test.userName === this.userName)
            : this.history;

        if (filteredHistory.length === 0) {
            historyList.innerHTML = '<div class="empty-history">No test history found. Take a test to start building your history!</div>';
        } else {
            historyList.innerHTML = filteredHistory.map(test => `
                <div class="history-item">
                    <div class="history-item-header">
                        <span class="history-item-user">${this.escapeHtml(test.userName)}</span>
                        <span class="history-item-date">${this.escapeHtml(test.dateTime)}</span>
                    </div>
                    <div class="history-item-details">
                        <div class="history-detail">
                            <span class="history-detail-label">Difficulty</span>
                            <span class="history-detail-value">${this.escapeHtml(test.difficulty)}</span>
                        </div>
                        <div class="history-detail">
                            <span class="history-detail-label">WPM</span>
                            <span class="history-detail-value">${test.wpm}</span>
                        </div>
                        <div class="history-detail">
                            <span class="history-detail-label">SPM</span>
                            <span class="history-detail-value">${test.spm}</span>
                        </div>
                        <div class="history-detail">
                            <span class="history-detail-label">Accuracy</span>
                            <span class="history-detail-value">${test.accuracy.toFixed(2)}%</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        this.showScreen('historyScreen');
    }

    saveTest(testResult) {
        this.history.unshift(testResult); // Add to beginning
        // Keep only last 100 tests
        if (this.history.length > 100) {
            this.history = this.history.slice(0, 100);
        }
        localStorage.setItem('typingTestHistory', JSON.stringify(this.history));
    }

    loadHistory() {
        const stored = localStorage.getItem('typingTestHistory');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                return [];
            }
        }
        return [];
    }

    handleExit() {
        if (confirm('Are you sure you want to exit?')) {
            this.showScreen('welcomeScreen');
            document.getElementById('userNameInput').value = '';
            this.userName = '';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TypingTestApp();
});

