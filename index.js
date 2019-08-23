// //render gifs or css to text with markdown
// //objective: [gif-0], [/gif-0]
// // [css-0], [/css-0]

// //[gif-0] regex
// const gifStartRegex = RegExp("\\[gif-\\d\\]")
// //[/gif-0] regex
// const gifEndRegex = RegExp("\\[\\/gif-\\d\\]")
// function textly() {
//     console.log('textly')
//     //test 4

// }

// export default function textly_plugin(md) {
//     console.log(md)
//     let tag = '[gif-1] blah blah [/gif-3]'
//     console.log(gifStartRegex.test(tag))
//     console.log(gifStartRegex.lastIndex)
//     console.log(gifEndRegex.test(tag))
//     console.log(gifEndRegex.lastIndex)
//     md.inline.ruler.after('sub', 'textly', textly)
// }

// Process ~subscript~

'use strict';

const regexIndexOf = function(str,regex) {
  var reMatch      = str.match(regex);
  var firstIndex = str.indexOf(reMatch[0]);
  var lastIndex  = str.lastIndexOf(reMatch[reMatch.length-1]);
  return {firstIndex: firstIndex, lastIndex: lastIndex}
}

// same as UNESCAPE_MD_RE plus a space
var UNESCAPE_RE = /\\([ \\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g;
const tildaUTF8 = 0x7E
const leftSquareBracketUTF8 = 0x5B
const rightSquareBracketUTF8 = 0x5D
const solidusUTF8 = 0x2F
const cUTF8 = 0x63
const cssRegex = /\[\[[a-zA-Z\-][a-zA-Z0-9\-]{1,25}\]\]/

function textlyInline(state, silent) {
  var found,
      match,
      content,
      token,
      max = state.posMax,
      start = state.pos;
console.log(start)
  if (state.src.charCodeAt(start) !== leftSquareBracketUTF8/* ~ */) { return false; }
  if (silent) { return false; } // don't run any pairs in validation mode
  if (start + 2 >= max) { return false; }

  state.pos = start + 1;

  while (state.pos < max) {

    if (state.src.charCodeAt(state.pos) === leftSquareBracketUTF8/* [ */  && state.src.charCodeAt(state.pos +1) === leftSquareBracketUTF8) {
      let string9 = state.src.slice(state.pos, state.pos + 30)
      let stringMatch = {bool: false, string: ''}
      let match9 = cssRegex.exec(string9)
      if (match9) {
        stringMatch = {bool: true, string: string9}
      }
      if (stringMatch.bool) {
        found = true;
        console.log(stringMatch.string)
        console.log(stringMatch.string.length)
        let stringName = stringMatch.string.slice(regexIndexOf(stringMatch.string, /\[/g).firstIndex, regexIndexOf(stringMatch.string, /\]/g).firstIndex + 2)
        let className = stringMatch.string.slice(regexIndexOf(stringMatch.string, /\[/g).firstIndex + 2, regexIndexOf(stringMatch.string, /\]/g).firstIndex)
        console.log(className)
        stringMatch.string = stringName
        stringMatch.className = className
        match = stringMatch
        console.log(match)
        break;
      }

    }

    state.md.inline.skipToken(state);
  }

  if (!found || start + 1 === state.pos) {
    state.pos = start;
    return false;
  }

  content = found? state.src.slice(start + match.string.length, state.pos) : state.src.slice(start + 1, state.pos)

  // don't allow unescaped spaces/newlines inside
  // if (content.match(/(^|[^\\])(\\\\)*\s/)) {
  //   state.pos = start;
  //   return false;
  // }

  // found!
  state.posMax = state.pos;
  state.pos = start + 1;

  // Earlier we checked !silent, but this implementation does not need it
  token         = state.push('css_open', 'span', 1);
  token.markup  = match.string.slice(2, match.string.length-2);
  token.attrs = [['class', match.string.slice(2, match.string.length-2)]]

  token         = state.push('text', '', 0);
  token.content = content.replace(UNESCAPE_RE, '$1');

  token         = state.push('css_close', 'span', -1);
  token.markup  = match.string.slice(2, match.string.length-2);

  state.pos = state.posMax + match.string.length;
  state.posMax = max;
  console.log('state')
  console.log(state)
  console.log('silent')
  console.log(silent)
  return true;
}
function textlyInline2(state, silent) {
  var found,
      match,
      content,
      token,
      max = state.posMax,
      start = state.pos;
console.log(start)
  if (state.src.charCodeAt(start) !== leftSquareBracketUTF8/* ~ */) { return false; }
  if (silent) { return false; } // don't run any pairs in validation mode
  if (start + 2 >= max) { return false; }

  state.pos = start + 1;

  while (state.pos < max) {

    if (state.src.charCodeAt(state.pos) === leftSquareBracketUTF8/* [ */  && state.src.charCodeAt(state.pos +1) === leftSquareBracketUTF8) {
      let string9 = state.src.slice(state.pos, state.pos + 30)
      let stringMatch = {bool: false, string: ''}
      let match9 = cssRegex.exec(string9)
      if (match9) {
        stringMatch = {bool: true, string: string9}
      }
      if (stringMatch.bool) {
        found = true;
        console.log(stringMatch.string)
        console.log(stringMatch.string.length)
        let stringName = stringMatch.string.slice(regexIndexOf(stringMatch.string, /\[/g).firstIndex, regexIndexOf(stringMatch.string, /\]/g).firstIndex + 2)
        let className = stringMatch.string.slice(regexIndexOf(stringMatch.string, /\[/g).firstIndex + 2, regexIndexOf(stringMatch.string, /\]/g).firstIndex)
        console.log(className)
        stringMatch.string = stringName
        stringMatch.className = className
        match = stringMatch
        console.log(match)
        break;
      }

    }

    state.md.inline.skipToken(state);
  }

  if (!found || start + 1 === state.pos) {
    state.pos = start;
    return false;
  }

  content = found? state.src.slice(start + match.string.length, state.pos) : state.src.slice(start + 1, state.pos)

  // don't allow unescaped spaces/newlines inside
  // if (content.match(/(^|[^\\])(\\\\)*\s/)) {
  //   state.pos = start;
  //   return false;
  // }

  // found!
  state.posMax = state.pos;
  state.pos = start + 1;

  // Earlier we checked !silent, but this implementation does not need it
  token         = state.push('css_open', 'span', 1);
  token.markup  = match.string.slice(2, match.string.length-2);
  token.attrs = [['class', match.string.slice(2, match.string.length-2)]]

  token         = state.push('text', '', 0);
  token.content = content.replace(UNESCAPE_RE, '$1');

  token         = state.push('css_close', 'span', -1);
  token.markup  = match.string.slice(2, match.string.length-2);

  state.pos = state.posMax + match.string.length;
  state.posMax = max;
  console.log('state')
  console.log(state)
  console.log('silent')
  console.log(silent)
  return true;
}

module.exports = function textly_plugin(md) {
  // md.inline.ruler.after('text', 'css', textlyInline);
  md.inline.ruler.after('entity', 'css', textlyInline);
};


