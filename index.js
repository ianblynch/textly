'use strict';

const regexIndexOf = function(str,regex) {
  var reMatch      = str.match(regex);
  var firstIndex = str.indexOf(reMatch[0]);
  var lastIndex  = str.lastIndexOf(reMatch[reMatch.length-1]);
  return {firstIndex: firstIndex, lastIndex: lastIndex}
}

// same as UNESCAPE_MD_RE plus a space
var UNESCAPE_RE = /\\([ \\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g;
const leftSquareBracketUTF8 = 0x5B
const cssRegex = /\[\[[a-zA-Z\-][a-zA-Z0-9\-]{1,25}\]\]/

function textlyInline(state, silent) {
  var found,
      match,
      content,
      token,
      max = state.posMax,
      start = state.pos;
  if (state.src.charCodeAt(start) !== leftSquareBracketUTF8/* ~ */) { return false; }
  if (silent) { return false; } // don't run any pairs in validation mode
  if (start + 2 >= max) { return false; }

  state.pos = start + 1;

  while (state.pos < max) {

    if (state.src.charCodeAt(state.pos) === leftSquareBracketUTF8/* [ */  && state.src.charCodeAt(state.pos +1) === leftSquareBracketUTF8) {
      let string9 = state.src.slice(state.pos, state.pos + 200)
      let stringMatch = {bool: false, string: ''}
      let match9 = cssRegex.exec(string9)
      if (match9) {
        stringMatch = {bool: true, string: string9}
      }
      if (stringMatch.bool) {
        found = true;
        let stringName = stringMatch.string.slice(regexIndexOf(stringMatch.string, /\[/g).firstIndex, regexIndexOf(stringMatch.string, /\]/g).firstIndex + 2)
        let className = stringMatch.string.slice(regexIndexOf(stringMatch.string, /\[/g).firstIndex + 2, regexIndexOf(stringMatch.string, /\]/g).firstIndex)
        stringMatch.string = stringName
        stringMatch.className = className
        match = stringMatch
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


  // found!
  state.posMax = state.pos;
  state.pos = start + 1;

  token         = state.push('css_open', 'span', 1);
  token.markup  = match.string.slice(2, match.string.length-2);
  token.attrs = [['class', match.string.slice(2, match.string.length-2)], ['textly-element', 'inline']]

  token         = state.push('text', '', 0);
  token.content = content.replace(UNESCAPE_RE, '$1');

  token         = state.push('css_close', 'span', -1);
  token.markup  = match.string.slice(2, match.string.length-2);

  state.pos = state.posMax + match.string.length;
  state.posMax = max;

  return true;
}



// function textlyBlockTyping(state, startLine) {
// console.log(state)
// }

module.exports = function textly_plugin(md) {
  // md.block.ruler.after('paragraph', 'typing', textlyBlockTyping)
  md.inline.ruler.after('entity', 'css', textlyInline);
};


