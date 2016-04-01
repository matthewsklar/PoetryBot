/**
 * Created by Matthew Sklar on 3/14/2016.
 */

var theme = "";
var rhymeScheme = [];
var syllableScheme = [];
var stanzaScheme = [];
var previousWord = "";
var output = "";
var syllablesOnLine = 0;
var line = 0;
var rhymes = [];
var currentLine = "";
var syllablesLeft = 0;
var wordsPerRoulette = 10;
var attempts = 0;
var attemptsBeforeRestart = 3;
var startingWord = "";
var type = 1;
var currentStanza = 0;
var linesInCurrentStanza = 0;

var usedRhymeWords = [];

var themes = [
    "death", "ocean", "sea", "science", "unknown", "sloth", "love",
    "family", "life", "hope", "nature", "tree", "god", "sex", "kumbaya"
];
var blacklist = [
    "ca", ".", "le", "pshaw", "duh", "dah", "pizzazz", "wussy", "speechify", "verklempt", "niner",
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
];
var errorBlackList = [
    "kinsperson", "olympiads", "seafloor", "tommyrot"
];
var endWordBlackList = [
    'the', 'a', 'an', 'at', 'been', 'in', 'of', 'to', 'by', 'my',
    'too', 'not', 'and', 'but', 'or', 'than', 'then', 'no', 'o',
    'for', 'so', 'which', 'their', 'on', 'your', 'as', 'has',
    'what', 'is', 'nor', 'i'
]

$(document).ready(function() {
    $("#freeverse").click(function() {
       createPoem(0);
    });
    $("#limerick").click(function() {
        createPoem(1);
    });
    $("#haiku").click(function() {
        createPoem(2);
    });
    $("#sonnet").click(function () {
        createPoem(3);
    })
});

/**
 * Manage the creation of a poem
 *
 * @param poemType type of poem
 */
function createPoem(poemType) {
    output = "";
    line = 0;
    rhymeScheme = [];
    syllableScheme = [];
    syllablesOnLine = 0;
    rhymes = [];
    previousWord = "";
    theme = generateTheme();
    currentStanza = 0;
    linesInCurrentStanza = 0;
    type = poemType;

    generateScheme(type);
    generateLines();
}

/**
 * Generate the theme of the poem
 */
function generateTheme() {
    var random = Math.floor(Math.random() * themes.length);
    console.log(themes[random]);
    return themes[random];
}

/**
 * Generate the scheme of the poem
 *
 * @param type type of poem
 */
function generateScheme(type) {
    switch (type) {
        case 0: // free form
            var lineCount = Math.floor(Math.random() * 14) + 1;

            for (var i = 0; i < lineCount; i++) {
                rhymeScheme.push(rhymeScheme.length);

                syllableScheme.push(Math.floor(Math.random() * 4) + 6);

                stanzaScheme = []; // TODO: Possibly change
            }

            break;
        case 1: //limerick
            rhymeScheme = [ 0, 0, 1, 1, 0 ];

            first = Math.floor(Math.random() * 3) + 7;
            second = Math.floor(Math.random() * 2) + 5;
            syllableScheme = [ first, first, second, second, first ];

            stanzaScheme = [];
            break;
        case 2: //haiku
            rhymeScheme = [ 0, 1, 2 ];

            syllableScheme = [ 5, 7, 5 ];

            stanzaScheme = [];
            break;
        case 3: //Sonnet
            rhymeScheme = [ 0, 1, 0, 1, 2, 3, 2, 3, 4, 5, 4, 5, 6, 6 ];

            syllableScheme = [ 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10 ];

            stanzaScheme = [ 4, 4, 4 ];
            break;
        default:
            break;
    }
}

/**
 * Generate the poem
 */
function generateLines() {
    console.log("--------------------Generate Poem--------------------");

    $.getJSON("http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&minLength=3&maxLength=15&limit=1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5", function(data) {
        previousWord = data[0].word;
        console.log("Starting word: " + previousWord);
        currentLine += " " + previousWord;
        startingWord = previousWord;
        syllablesOnLine += syllableCount(previousWord);
        console.log("word: '" + previousWord + "' syllables: " + syllableCount(previousWord));
        console.log(syllableScheme);
        syllablesLeft = syllableScheme[line] - syllablesOnLine;
        generateWords();
    });
}

/**
 * Generate the words in the poem
 */
function generateWords() {
    if (line < rhymeScheme.length) {
        if (syllableScheme[line] - syllablesOnLine > 3) {
            console.log("word: https://api.datamuse.com/words?topis=" + theme + "&lc=" + previousWord);
            $.getJSON("https://api.datamuse.com/words?topis=" + theme + "&lc=" + previousWord, function (data) {
                syllablesLeft = syllableScheme[line] - syllablesOnLine;
                /*$.getJSON("http://rhymebrain.com/talk?function=getWordInfo&word=ye", function (data) {
                    console.log(JSON.stringify(data));
                });*/
                // Indexes of words to be included in random selection
                var rouletteWordIndexes = [];
                for (var i = 0; i < data.length; i++) {
                    if (rouletteWordIndexes.length < wordsPerRoulette) {
                        var word = data[i].word;
                        var syllables = syllableCount(word);

                        if (syllables != -1 && syllables < syllablesLeft && legalWord(word)) {
                            rouletteWordIndexes[rouletteWordIndexes.length] = i;
                        }
                    }
                }


                if (rouletteWordIndexes.length != 0) {
                    var index = rouletteWordIndexes[Math.floor(Math.random() * rouletteWordIndexes.length)];

                    previousWord = data[index].word;

                    var syllables = syllableCount(previousWord);

                    syllablesOnLine += syllables;
                    currentLine += " " + previousWord;
                    console.log("word: '" + previousWord + "' index: " + index + " syllables: " + syllables);
                } else {
                    console.log("rouletteWordIndexes is empty: ");
                    currentLine = "";
                    syllablesOnLine = 0;
                    attempts++;
                    if (attempts >= attemptsBeforeRestart) {
                        restartPoem();
                        return;
                    }
                }

                syllablesLeft = syllableScheme[line] - syllablesOnLine;

                generateWords();
            });
        } else {
            if (rhymes.length > rhymeScheme[line]) {
                console.log("line: " + line + " https://api.datamuse.com/words?topis=" + theme + "&lc=" + previousWord + "&rel_rhy=" + rhymes[rhymeScheme[line]]);
                $.getJSON("https://api.datamuse.com/words?topis=" + theme + "&lc=" + previousWord + "&rel_rhy=" + rhymes[rhymeScheme[line]], function (data) {
                    // Indexes of words to be included in random selection
                    var rouletteWordIndexes = endWordRouletteSelection(data);

                    console.log("roull: " + rouletteWordIndexes + " rhymes: " + rhymes[rhymeScheme[line]]);

                    if (rouletteWordIndexes.length != 0) {
                        addLastWord(data, rouletteWordIndexes);
                    } else {
                        console.log("2rouletteWordIndexes = 0");
                        console.log("line: " + line);
                        currentLine = "";
                        line--;
                        attempts++;
                        if (attempts >= attemptsBeforeRestart) {
                            restartPoem();
                            return;
                        }
                    }

                    handleLastWordResults();
                });
            } else {
                console.log("line: " + line + " https://api.datamuse.com/words?topis=" + theme + "&lc=" + previousWord);
                $.getJSON("https://api.datamuse.com/words?topis=" + theme + "&lc=" + previousWord, function (data) {
                    // Indexes of words to be included in random selection
                    var rouletteWordIndexes = endWordRouletteSelection(data);

                    console.log("roull: " + rouletteWordIndexes + " rhymes: " + rhymes[rhymeScheme[line]]);

                    if (rouletteWordIndexes.length != 0) {
                        addLastWord(data, rouletteWordIndexes);
                        rhymes[rhymeScheme[line]] = previousWord;
                    } else {
                        console.log("3rouletteWordIndexes = 0");
                        currentLine = "";
                        line--;
                        attempts++;
                        if (attempts >= attemptsBeforeRestart) {
                            restartPoem();
                            return;
                        }
                    }

                    handleLastWordResults();
                });
            }
        }
    }
}

/**
 * Checks if the word is legal
 *
 * @param word The word to be checked
 * @returns {boolean} If the word is legal
 */
function legalWord(word) {
    return (checkBlacklist(word) && checkSpaces(word));
}

/**
 * Checks if the word has been used before as a rhyme
 *
 * @param word The word to be checked
 * @returns {boolean} If the word has not been used before
 */
function legalLastWord(word) {
    for (var i = 0; i < usedRhymeWords.length; i++) {
        if (usedRhymeWords[i] == word) return false;
    }

    for (var i = 0; i < errorBlackList.length; i++) {
        if (errorBlackList[i] == word) return false;
    }

    for (var i = 0; i < endWordBlackList.length; i++) {
        if (endWordBlackList[i] == word) return false;
    }

    return true;
}

/**
 * Checks if the word is blacklisted
 *
 * @param word The word to be checked
 * @returns {boolean} If the word is not blacklisted
 */
function checkBlacklist(word) {
    for (var i = 0; i < blacklist.length; i++) {
        if (blacklist[i] == word) return false;
    }

    return true;
}

/**
 * Checks if the word contains spaces
 *
 * @param word The word to be checked
 * @returns {boolean} If the word has no spaces
 */
function checkSpaces(word) {
    return word.indexOf(' ') < 0;
}

/**
 * Restart the poem
 */
function restartPoem() {
    console.log("--------------------Restart Poem--------------------");

    createPoem(type);
}

/**
 * Word roulette selection for final word in line
 *
 * @param data returned JSON
 * @returns {Array} The words to pick from
 */
function endWordRouletteSelection(data) {
    var rouletteWordIndexes = [];
    console.log("syllables left: " + syllablesLeft);
    for (var i = 0; i < data.length; i++) {
        if (rouletteWordIndexes.length < wordsPerRoulette) {
            var word = data[i].word;
            var syllables = syllableCount(word);

            if (syllables != -1 && syllables == syllablesLeft && legalWord(word) && legalLastWord(word)) {
                rouletteWordIndexes[rouletteWordIndexes.length] = i;
            }
        }
    }

    return rouletteWordIndexes;
}

/**
 * Add the final word in a line
 *
 * @param data returned JSON
 * @param rouletteWordIndexes words to choose from
 */
function addLastWord(data, rouletteWordIndexes) {
    var index = rouletteWordIndexes[Math.floor(Math.random() * rouletteWordIndexes.length)];
    var syllables = syllableCount(previousWord);

    previousWord = data[index].word;
    usedRhymeWords.push(previousWord);
    currentLine += " " + previousWord;
    syllablesOnLine += syllableCount(previousWord);
    console.log("word: '" + previousWord + "' index: " + index + " syllables: " + syllables);
    console.log("line " + line + " syllables: " + syllablesOnLine);
    output += currentLine.charAt(1).toUpperCase() + currentLine.slice(2) + "</br>";
    attempts = 0;

    if (stanzaScheme[currentStanza] != null) {
        if (stanzaScheme[currentStanza] - 1 == linesInCurrentStanza) {
            linesInCurrentStanza = 0;
            output += "</br>";
            console.log("new stanza");
        } else {
            linesInCurrentStanza++;
        }
    }
}

/**
 * Create line with generated words
 * and submit poem if it ends
 */
function handleLastWordResults() {
    console.log("line " + line + ": " + currentLine);

    if (line == rhymeScheme.length - 1) document.getElementById("poem").innerHTML = output;

    currentLine = "";
    syllablesOnLine = 0;
    line++;

    generateWords();
}

// TODO: Fix
/**
 * Find the amount of syllables in a word
 *
 * @param word The word to process
 * @returns {*} Amount of syllables (-1 if not found)
 */
function syllableCount(word) {
    word = word.toLowerCase();

    if(word.length <= 3) return 1;

    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    word = word.match(/[aeiouy]{1,2}/g);

    if (word != null) return word.length;

    return -1;
}