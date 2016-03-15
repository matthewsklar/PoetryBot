/**
 * Created by Matthew Sklar on 3/14/2016.
 */

var theme = "";
var rhymeScheme = [];
var syllableScheme = [];
var previousWord = "";

$(document).ready(function() {
    $("#test").click(function() {
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
    output = "";
    previousWord = "The";

    output += previousWord;

    for (i = 0; i < rhymeScheme.length; i++) {
        syllables = 0;
        if (output == previousWord) syllables += syllableCount(previousWord);

        syllablesLeft = syllableScheme[i] - syllables;

        while (syllablesLeft > 0) {
            // TODO: finish
            $.getJSON("https://api.datamuse.com/words?topics=" + theme + "&rel_bga=" + previousWord, function(data) {
                console.log(JSON.stringify(data));
            });
            syllablesLeft--;
        }
    }
}

function syllableCount(word) {
    word = word.toLowerCase();                                     //word.downcase!
    if(word.length <= 3) { return 1; }                             //return 1 if word.length <= 3
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');   //word.sub!(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
    word = word.replace(/^y/, '');                                 //word.sub!(/^y/, '')
    return word.match(/[aeiouy]{1,2}/g).length;                    //word.scan(/[aeiouy]{1,2}/).size
}