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

$(document).ready(function() {
    $("#test").click(function() {
        output = "";
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
    return "sea";
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
            $.getJSON("https://api.datamuse.com/words?topics=" + theme + "&lc=" + previousWord, function (data) {
                var index = Math.floor(Math.random() * 10);

                while (data[index].word == '.') {
                    index = Math.floor(Math.random() * 10);
                }

                previousWord = data[index].word;

                syllablesOnLine += syllableCount(previousWord);

                output += " " + previousWord;
                generateWords();
            });
        } else {
            console.log(rhymeScheme[line]);
            if (rhymes.length > rhymeScheme[line]) {
                console.log(rhymes[rhymeScheme[line]]);
                $.getJSON("https://api.datamuse.com/words?topics=" + theme + "&lc=" + previousWord + "&rel_rhy=" + rhymes[rhymeScheme[line]], function (data) {
                    console.log("https://api.datamuse.com/words?topics=" + theme + "&lc=" + previousWord + "&rel_rhy=" + rhymes[rhymeScheme[line]]);
                    var index = Math.floor(Math.random() * 5);

                    while (data[index].word == '.') {
                        index = Math.floor(Math.random() * 5);
                    }

                    previousWord = data[index].word;
                    output += " " + previousWord + "\n";
                    //console.log(previousWord);
                    console.log(output);
                });
            } else {
                $.getJSON("https://api.datamuse.com/words?topics=" + theme + "&lc=" + previousWord, function (data) {
                    var index = Math.floor(Math.random() * 10);

                    while (data[index].word == '.') {
                        index = Math.floor(Math.random() * 10);
                    }

                    previousWord = data[index].word;
                    rhymes[rhymeScheme[line]] = previousWord;
                    output += " " + previousWord + "\n";
                });
            }
            console.log(output); syllablesOnLine = 0;
            line++;
            generateWords();
        }
    } else {
        line = 0;
    }
}

function syllableCount(word) {
    word = word.toLowerCase();                                     //word.downcase!
    if(word.length <= 3) { return 1; }                             //return 1 if word.length <= 3
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');   //word.sub!(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
    word = word.replace(/^y/, '');                                 //word.sub!(/^y/, '')
    return word.match(/[aeiouy]{1,2}/g).length;                    //word.scan(/[aeiouy]{1,2}/).size
}