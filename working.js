function removeSpacesAndNewLines(text) {
  text = text.split("\n").join(""); // remove all new lines
  text = text.replace(/ /g, ""); // remove all white spaces
  return text;
}

function readBeetweenChars( fileText, startChar, endChar ) {
  // reformat all the texts to single line
  let fileTextSingleLine = StringComposeWriter.removeSpacesAndNewLines(
    fileText
  );
  startChar = StringComposeWriter.removeSpacesAndNewLines(startChar);
  endChar = StringComposeWriter.removeSpacesAndNewLines(endChar);
  let startCharSplit = fileTextSingleLine.split(startChar);
  if (startCharSplit.length <= 1) throw new Error(this.ERR_NO_START_CHAR_FOUND);
  let foundContent  = "";
  for (let i = 0; i < startCharSplit.length; i++) {
    let content = startCharSplit[i].trim();
    if (endChar && content.indexOf(endChar) == -1) continue; // check if the end character is contained if not skip
    let endCharSplit = endChar ? content.split(endChar) : [content];
    foundContent = endCharSplit[0];
    return foundContent;
  }
  return "";
}

function reinsertSpacesAndNewlines(
  oldFormatText,
  singleLineText
) {

  let singleLineTextCopy = singleLineText;
  let oldFormatTextSpaces = oldFormatText.split(" ");
  let emptyWordsCount = 0; // check how many consequent empty word there are ( "" )

  // re-add all the spaces and new lines based on the oldFormat
  for (let maybeSingleWord of oldFormatTextSpaces) {
    let words = maybeSingleWord.includes("\n")
      ? maybeSingleWord.split("\n").join(" \n ").split(" ")
      : [maybeSingleWord];
    let rep = 0;
    while (rep < words.length) {
      let word = words[rep];
      if (!word && words.length == 1) {
        emptyWordsCount++;
        break;
      } else if (!word) {
        rep++;
        continue;
      }
      // find the index of the current word in the single line text
      let wordIndex = singleLineTextCopy.indexOf(word);
      if (wordIndex == -1) {
        rep++;
        continue;
      }
      // find the letter that is right after the current word in the single line text copy
      // [ the letter is used for have the correct accuracy in re-formatting the text]
      let letter = singleLineTextCopy[wordIndex + word.length];
      // remove the current word from the single line text copy
      singleLineTextCopy = singleLineTextCopy.replace(word, "");
      // default char to add is a space becouse the inital split was from spaces
      let toAdd = " ";

      if (rep + 1 < words.length - 1 && words[rep + 1] == "\n") {
        toAdd = "\n";
      }
      // refactor the main single line text with re-build the old format

      singleLineText = singleLineText.replace(
        word + letter,
        " ".repeat(emptyWordsCount) + word + toAdd + letter
      );
      emptyWordsCount = 0;
      rep++;
    }
  }
  return singleLineText;
}

function escapeRegexChars( text ){
  return text.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&');
}
function appendBeetweenChars( fileText, textToAdd, startChar, endChar ) {
  console.log( escapeRegexChars(startChar) )
  let startCharSpacesInsensitive = escapeRegexChars(startChar).replace(/[ \t]+/g, '\[\\s\\S\]*');
  let endCharSpacesInsensitive = escapeRegexChars(endChar).replace(/[ \t]+/g, '\[\\s\\S\]*');

  let startCharRegex = new RegExp( startCharSpacesInsensitive, 'g');
  let endCharRegex = new RegExp( endCharSpacesInsensitive, 'g');
  let bewtweenCharsRegex = new RegExp( startCharSpacesInsensitive + '(.?\[\\s\\S\])*' + endCharSpacesInsensitive );
  console.log( bewtweenCharsRegex );
  let matches = fileText.match( bewtweenCharsRegex );
  console.log( matches )
  if( !matches ) return fileText;
  let textBetweenChars = matches[0].replace( startCharRegex, '' ).replace(endCharRegex, '');
  return fileText.replace( bewtweenCharsRegex, startChar + textBetweenChars + textToAdd + endChar );

}

console.log( appendBeetweenChars(`function add_lib(){}`, `Fine Thanks`, 'function add_lib(){', '}') )