/**
 * Created by Matthew Sklar on 3/14/2016.
 */

var theme = "";
var rhymeScheme = [];
var syllableScheme = [];
var previousWord = "";
var output = "";
var syllablesOnLine = 0;
var line = 0;
var rhymes = [];
var currentLine = "";

var themes = [ "death", "ocean", "sea", "science", "unknown", "sloth", "love", "family", "life", "hope", "nature", "tree", "god", "sex", "kumbaya" ];
var whitelist = [ "ca", ".", "le" ];

$(document).ready(function() {
    $("#test").click(function() {
        output = "";
        line = 0;
        rhymeScheme = [];
        syllableScheme = [];
        syllablesOnLine = 0;
        rhymes = [];
        previousWord = "";
        createPoem();
    });
});

/**
 * Manage the creation of a poem
 */
function createPoem() {
    theme = generateTheme();

    generateRhymeScheme(1);
    generateSyllableScheme(1);
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
 * Generate the rhyme scheme of the poem
 *
 * @param type type of poem
 */
function generateRhymeScheme(type) {
    switch (type) {
        case 0: // free form
            break;
        case 1: //limerick
            rhymeScheme = [ 0, 0, 1, 1, 0 ];
            break;
        default:
            break;
    }
}

function generateSyllableScheme(type) {
    switch (type) {
        case 0:
            break;
        case 1:
            first = Math.floor(Math.random() * 3) + 7;
            second = Math.floor(Math.random() * 2) + 5;

            syllableScheme = [ first, first, second, second, first ];
            break;
        default:
            break;
    }
}

function generateLines() {
    previousWord = "The";
    output += previousWord;

    generateWords();
}

function generateWords() {
    if (line < 5) {
        if (syllableScheme[line] - syllablesOnLine > 3) {
            console.log("word: https://api.datamuse.com/words?topics=" + theme + "&lc=" + previousWord);
            $.getJSON("https://api.datamuse.com/words?topics=" + theme + "&lc=" + previousWord, function (data) {
                var possibleWordIndexes = [];

                if (data.length < 7) {
                    for (var i = 0; i < data.length; i++) possibleWordIndexes[i] = i;
                } else {
                    for (var i = 0; i < data.length; i++) {
                        if (possibleWordIndexes.length < 7) {
                            var word = data[i].word;

                            if (checkWhitelist(word)) {
                                possibleWordIndexes[possibleWordIndexes.length] = i;
                            }
                        }
                    }
                }

                if (possibleWordIndexes.length != 0) {
                    var index = possibleWordIndexes[Math.floor(Math.random() * possibleWordIndexes.length)];

                    previousWord = data[index].word;

                    syllablesOnLine += syllableCount(previousWord);
                    currentLine += " " + previousWord;
                } else {
                    currentLine = "";
                }

                generateWords();
            });
        } else {
            if (rhymes.length > rhymeScheme[line]) {
                console.log("line: " + line + " https://api.datamuse.com/words?topics=" + theme + "&lc=" + previousWord + "&rel_rhy=" + rhymes[rhymeScheme[line]]);
                $.getJSON("https://api.datamuse.com/words?topics=" + theme + "&lc=" + previousWord + "&rel_rhy=" + rhymes[rhymeScheme[line]], function (data) {
                    var possibleWordIndexes = [];
                    var canEnd = true;

                    if (data.length < 7) {
                        for (var i = 0; i < data.length; i++) possibleWordIndexes[i] = i;
                    } else {
                        for (var i = 0; i < data.length; i++) {
                            if (possibleWordIndexes.length < 7) {
                                var word = data[i].word;

                                if (checkWhitelist(word)) {
                                    possibleWordIndexes[possibleWordIndexes.length] = i;
                                }
                            }
                        }
                    }

                    if (possibleWordIndexes.length != 0) {
                        var index = possibleWordIndexes[Math.floor(Math.random() * possibleWordIndexes.length)];

                        previousWord = data[index].word;
                        currentLine += " " + previousWord;
                    } else {
                        currentLine = "";
                        canEnd = false;
                        // TODO: fix
                        //line--;
                    }

                    output += currentLine + "\n";
                    if (line == rhymeScheme.length && canEnd) document.getElementById("poem").textContent = output;
                    currentLine = "";
                });
            } else {
                console.log("line: " + line + " https://api.datamuse.com/words?topics=" + theme + "&lc=" + previousWord);
                $.getJSON("https://api.datamuse.com/words?topics=" + theme + "&lc=" + previousWord, function (data) {
                    var possibleWordIndexes = [];

                    if (data.length < 7) {
                        for (var i = 0; i < data.length; i++) possibleWordIndexes[i] = i;
                    } else {
                        for (var i = 0; i < data.length; i++) {
                            if (possibleWordIndexes.length < 7) {
                                var word = data[i].word;

                                if (checkWhitelist(word)) {
                                    possibleWordIndexes[possibleWordIndexes.length] = i;
                                }
                            }
                        }
                    }

                    if (possibleWordIndexes.length != 0) {
                        var index = possibleWordIndexes[Math.floor(Math.random() * possibleWordIndexes.length)];

                        previousWord = data[index].word;
                        rhymes[rhymeScheme[line]] = previousWord;
                        currentLine += " " + previousWord;
                    } else {
                        currentLine = "";
                        //line--;
                    }

                    output += currentLine + "\n";
                    currentLine = "";
                });
            }

            syllablesOnLine = 0;
            line++;
            generateWords();
        }
    }
}

function checkWhitelist(word) {
    for (i = 0; i < whitelist.length; i++) {
        if (whitelist[i] == word) return false;
    }

    return true;
}

function syllableCount(word) {
    word = word.toLowerCase();                                     //word.downcase!
    if(word.length <= 3) { return 1; }                             //return 1 if word.length <= 3
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');   //word.sub!(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
    word = word.replace(/^y/, '');                                 //word.sub!(/^y/, '')
    return word.match(/[aeiouy]{1,2}/g).length;                    //word.scan(/[aeiouy]{1,2}/).size
}