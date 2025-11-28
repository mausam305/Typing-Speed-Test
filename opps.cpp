#include <iostream>
#include <string>
#include <vector>
#include <chrono>
#include <fstream>
#include <ctime>
#include <iomanip>
#include <algorithm>
#include <sstream>

using namespace std;
using namespace chrono;


class User {
private:
    string name;

public:

    User() : name("") {}
    
    User(const string& userName) : name(userName) {}

    
    string getName() const {
        return name;
    }

    
    void setName(const string& userName) {
        name = userName;
    }
};


class Test {
private:
    string difficulty;
    string language;
    int wpm;
    int spm;
    double accuracy;
    string dateTime;
    string userName;

public:
    
    Test() : difficulty(""), language("English"), wpm(0), spm(0), accuracy(0.0), dateTime(""), userName("") {}

    Test(const string& diff, const string& lang, int wordsPerMin, int sentencesPerMin, 
         double acc, const string& dt, const string& user)
        : difficulty(diff), language(lang), wpm(wordsPerMin), spm(sentencesPerMin), 
          accuracy(acc), dateTime(dt), userName(user) {}

    
    string getDifficulty() const { return difficulty; }
    string getLanguage() const { return language; }
    int getWPM() const { return wpm; }
    int getSPM() const { return spm; }
    double getAccuracy() const { return accuracy; }
    string getDateTime() const { return dateTime; }
    string getUserName() const { return userName; }


    void setDifficulty(const string& diff) { difficulty = diff; }
    void setLanguage(const string& lang) { language = lang; }
    void setWPM(int w) { wpm = w; }
    void setSPM(int s) { spm = s; }
    void setAccuracy(double acc) { accuracy = acc; }
    void setDateTime(const string& dt) { dateTime = dt; }
    void setUserName(const string& user) { userName = user; }

    
    void displaySummary() const {
        cout << "\n========================================\n";
        cout << "         TEST SUMMARY\n";
        cout << "========================================\n";
        cout << "User Name:      " << userName << endl;
        cout << "Difficulty:     " << difficulty << endl;
        cout << "Language:       " << language << endl;
        cout << "WPM:            " << wpm << " words/minute" << endl;
        cout << "SPM:            " << spm << " sentences/minute" << endl;
        cout << "Accuracy:       " << fixed << setprecision(2) << accuracy << "%" << endl;
        cout << "Date & Time:    " << dateTime << endl;
        cout << "========================================\n";
        
        
        cout << "\nGreat job " << userName << "! Your accuracy is " 
             << fixed << setprecision(2) << accuracy << "%!" << endl;
        
        if (accuracy >= 90) {
            cout << "Outstanding performance! You're a typing master! 🌟" << endl;
        } else if (accuracy >= 75) {
            cout << "Excellent work! Keep practicing to improve further! 💪" << endl;
        } else if (accuracy >= 60) {
            cout << "Good effort! A bit more practice and you'll excel! 👍" << endl;
        } else {
            cout << "Keep practicing! Every expert was once a beginner! 🚀" << endl;
        }
    }


    string toString() const {
        stringstream ss;
        ss << userName << "|" << difficulty << "|" << language << "|" 
           << wpm << "|" << spm << "|" << fixed << setprecision(2) << accuracy 
           << "|" << dateTime;
        return ss.str();
    }

    
    static Test fromString(const string& line) {
        Test test;
        stringstream ss(line);
        string temp;
        
        getline(ss, temp, '|');
        test.setUserName(temp);
        
        getline(ss, temp, '|');
        test.setDifficulty(temp);
        
        getline(ss, temp, '|');
        test.setLanguage(temp);
        
        getline(ss, temp, '|');
        test.setWPM(stoi(temp));
        
        getline(ss, temp, '|');
        test.setSPM(stoi(temp));
        
        getline(ss, temp, '|');
        test.setAccuracy(stod(temp));
        
        getline(ss, temp, '|');
        test.setDateTime(temp);
        
        return test;
    }
};


class HistoryManager {
private:
    string filename;
    vector<Test> history;

public:
    
    HistoryManager(const string& file = "typing_history.txt") : filename(file) {
        loadHistory();
    }

    
    ~HistoryManager() {
        
    }

    void saveTest(const Test& test) {
        history.push_back(test);
        
        
        ofstream file(filename, ios::app);
        if (file.is_open()) {
            file << test.toString() << endl;
            file.close();
        } else {
            cerr << "Error: Unable to save test to history file!" << endl;
        }
    }

    
    void loadHistory() {
        history.clear();
        ifstream file(filename);
        
        if (file.is_open()) {
            string line;
            while (getline(file, line)) {
                if (!line.empty()) {
                    history.push_back(Test::fromString(line));
                }
            }
            file.close();
        }
    }

    
    void displayHistory() const {
        if (history.empty()) {
            cout << "\nNo test history found. Take a test to start building your history!\n";
            return;
        }

        cout << "\n========================================\n";
        cout << "         TEST HISTORY\n";
        cout << "========================================\n";
        cout << left << setw(15) << "User" << setw(12) << "Difficulty" 
             << setw(8) << "WPM" << setw(8) << "SPM" 
             << setw(10) << "Accuracy" << "Date & Time" << endl;
        cout << "----------------------------------------\n";

        for (const auto& test : history) {
            cout << left << setw(15) << test.getUserName() 
                 << setw(12) << test.getDifficulty()
                 << setw(8) << test.getWPM() 
                 << setw(8) << test.getSPM()
                 << setw(10) << fixed << setprecision(2) << test.getAccuracy() << "%" 
                 << test.getDateTime() << endl;
        }
        cout << "========================================\n";
    }

    
    void displayUserHistory(const string& userName) const {
        vector<Test> userTests;
        
        for (const auto& test : history) {
            if (test.getUserName() == userName) {
                userTests.push_back(test);
            }
        }

        if (userTests.empty()) {
            cout << "\nNo test history found for user: " << userName << endl;
            return;
        }

        cout << "\n========================================\n";
        cout << "    TEST HISTORY FOR: " << userName << "\n";
        cout << "========================================\n";
        cout << left << setw(12) << "Difficulty" << setw(8) << "WPM" 
             << setw(8) << "SPM" << setw(10) << "Accuracy" << "Date & Time" << endl;
        cout << "----------------------------------------\n";

        for (const auto& test : userTests) {
            cout << left << setw(12) << test.getDifficulty()
                 << setw(8) << test.getWPM() 
                 << setw(8) << test.getSPM()
                 << setw(10) << fixed << setprecision(2) << test.getAccuracy() << "%" 
                 << test.getDateTime() << endl;
        }
        cout << "========================================\n";
    }
};


class TypingTestGame {
private:
    User user;
    Test currentTest;
    HistoryManager historyManager;
    
    
    vector<string> easySentences = {
        "The cat sat on the mat.",
        "I love to code every day.",
        "The sun is shining bright.",
        "She reads books at night.",
        "We play games on weekends."
    };

    vector<string> mediumSentences = {
        "Programming requires logical thinking and problem solving skills.",
        "The quick brown fox jumps over the lazy sleeping dog.",
        "Technology advances rapidly in the modern digital world.",
        "Practice makes perfect when learning new programming languages.",
        "Artificial intelligence is transforming industries worldwide."
    };

    vector<string> hardSentences = {
        "Object-oriented programming encompasses encapsulation, inheritance, and polymorphism fundamentals.",
        "Sophisticated algorithms optimize computational efficiency through strategic data structure implementation.",
        "Comprehensive understanding requires diligent practice, analytical thinking, and continuous improvement.",
        "The exponential growth of technological innovation necessitates perpetual adaptation and learning.",
        "Efficient memory management and algorithmic complexity analysis are crucial for scalable applications."
    };

    
    string getCurrentDateTime() const {
        time_t now = time(0);
        char buffer[80];
        struct tm* timeinfo = localtime(&now);
        strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", timeinfo);
        return string(buffer);
    }

    
    int levenshteinDistance(const string& s1, const string& s2) const {
        int m = s1.length();
        int n = s2.length();
        vector<vector<int>> dp(m + 1, vector<int>(n + 1));

        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (s1[i - 1] == s2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]});
                }
            }
        }
        return dp[m][n];
    }

    
    double calculateAccuracy(const string& original, const string& typed) const {
        int maxLen = max(original.length(), typed.length());
        if (maxLen == 0) return 100.0;
        
        int distance = levenshteinDistance(original, typed);
        double accuracy = ((double)(maxLen - distance) / maxLen) * 100.0;
        return max(0.0, accuracy);
    }

    
    int countWords(const string& text) const {
        int count = 0;
        bool inWord = false;
        
        for (char c : text) {
            if (isspace(c)) {
                inWord = false;
            } else if (!inWord) {
                inWord = true;
                count++;
            }
        }
        return count;
    }

public:
    
    TypingTestGame() {}

    
    ~TypingTestGame() {}

    
    void start() {
        displayWelcome();
        getUserName();
        
        bool continueGame = true;
        while (continueGame) {
            showMenu();
            int choice;
            cin >> choice;
            cin.ignore();

            switch (choice) {
                case 1:
                    runTest();
                    break;
                case 2:
                    historyManager.displayUserHistory(user.getName());
                    break;
                case 3:
                    historyManager.displayHistory();
                    break;
                case 4:
                    cout << "\nThank you for using Typing Speed Test! Goodbye " 
                         << user.getName() << "! 👋\n";
                    continueGame = false;
                    break;
                default:
                    cout << "\nInvalid choice! Please try again.\n";
            }
        }
    }

private:
    
    void displayWelcome() const {
        cout << "\n================================================\n";
        cout << "    WELCOME TO TYPING SPEED TEST SYSTEM\n";
        cout << "================================================\n";
        cout << "Test your typing speed and accuracy!\n";
        cout << "================================================\n";
    }

    
    void getUserName() {
        string name;
        cout << "\nPlease enter your name: ";
        getline(cin, name);
        user.setName(name);
        cout << "\nHello " << name << "! Let's test your typing skills! 🚀\n";
    }

    
    void showMenu() const {
        cout << "\n========================================\n";
        cout << "            MAIN MENU\n";
        cout << "========================================\n";
        cout << "1. Start New Test\n";
        cout << "2. View My History\n";
        cout << "3. View All History\n";
        cout << "4. Exit\n";
        cout << "========================================\n";
        cout << "Enter your choice: ";
    }

    
    void runTest() {
        
        string difficulty = chooseDifficulty();
        currentTest.setDifficulty(difficulty);
        currentTest.setLanguage("English");
        currentTest.setUserName(user.getName());
        
        
        vector<string> sentences;
        if (difficulty == "Easy") {
            sentences = easySentences;
        } else if (difficulty == "Medium") {
            sentences = mediumSentences;
        } else {
            sentences = hardSentences;
        }

        cout << "\n========================================\n";
        cout << "Get ready! Type the following sentences:\n";
        cout << "========================================\n";
        cout << "\nPress Enter when you're ready to start...\n";
        cin.get();

        
        auto startTime = high_resolution_clock::now();

        string allOriginal = "";
        string allTyped = "";
        int sentenceCount = sentences.size();

        
        for (int i = 0; i < sentenceCount; i++) {
            cout << "\nSentence " << (i + 1) << " of " << sentenceCount << ":\n";
            cout << sentences[i] << "\n\n";
            cout << "Type here: ";
            
            string typedSentence;
            getline(cin, typedSentence);
            
            allOriginal += sentences[i] + " ";
            allTyped += typedSentence + " ";
        }

        
        auto endTime = high_resolution_clock::now();
        auto duration = duration_cast<seconds>(endTime - startTime);
        double timeTakenMinutes = duration.count() / 60.0;
        
        if (timeTakenMinutes == 0) timeTakenMinutes = 0.01; 

        int totalWords = countWords(allOriginal);
        int wpm = static_cast<int>(totalWords / timeTakenMinutes);
        int spm = static_cast<int>(sentenceCount / timeTakenMinutes);
        double accuracy = calculateAccuracy(allOriginal, allTyped);

        
        currentTest.setWPM(wpm);
        currentTest.setSPM(spm);
        currentTest.setAccuracy(accuracy);
        currentTest.setDateTime(getCurrentDateTime());

        
        currentTest.displaySummary();

        
        historyManager.saveTest(currentTest);
        cout << "\n✓ Test results saved to history!\n";
    }

    
    string chooseDifficulty() const {
        cout << "\n========================================\n";
        cout << "      SELECT DIFFICULTY LEVEL\n";
        cout << "========================================\n";
        cout << "1. Easy   (Short simple sentences)\n";
        cout << "2. Medium (Moderate length sentences)\n";
        cout << "3. Hard   (Complex long sentences)\n";
        cout << "========================================\n";
        cout << "Enter your choice (1-3): ";
        
        int choice;
        cin >> choice;
        cin.ignore();

        switch (choice) {
            case 1: return "Easy";
            case 2: return "Medium";
            case 3: return "Hard";
            default: 
                cout << "Invalid choice! Defaulting to Easy.\n";
                return "Easy";
        }
    }
};

// Main function
int main() {
    TypingTestGame game;
    game.start();
    return 0;
}