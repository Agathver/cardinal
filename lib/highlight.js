var redeyed =  require('redeyed')
  , theme   =  require('../themes/default')
  , colors  =  require('ansicolors')

  , colorSurround =  colors.brightBlack
  , surroundClose =  '\u001b[39m'
  , lineMarker = '>'
  , positionMarker = '^'
  ;

function trimEmptyLines(lines) {

  // remove lines from the end until we find a non-empy one
  var line = lines.pop();
  while(!line || !line.length)
    line = lines.pop();

  // put the non-empty line back
  if (line) lines.push(line);
}

function normalizeMarkers(markers) {

  // map to hold markers
  var markersHash = {};

  for (var i in markers) {
    var marker = markers[i];
    if(!markersHash[marker.line]) {
      markersHash[marker.line] = [];
    }

    if(marker.column) {
      markersHash[marker.line].push(marker.column);
    }
  }
  return markersHash;
}

function processLines (highlightedCode, opts) {

  var highlightedLines = highlightedCode.split('\n');

  trimEmptyLines(highlightedLines);


  var linesLen = highlightedLines.length
    , lines = []
    , totalDigits
    , lineno
    , firstline = opts.firstline && !isNaN(opts.firstline) ? opts.firstline : 1
    , markers = {}
    , columns
    , marker
    , markerArray
    , maxColumn
    , margin
    ;

  function getDigits (n) {
    if (n < 10) return 1;
    if (n < 100) return 2;
    if (n < 1000) return 3;
    if (n < 10000) return 4;
    // this works for up to 99,999 lines - any questions?
    return 5;
  }

  function pad (n, totalDigits) {
    // not pretty, but simple and should perform quite well
    var padDigits= totalDigits - getDigits(n);
    switch(padDigits) {
      case 0: return '' + n;
      case 1: return ' ' + n;
      case 2: return '  ' + n;
      case 3: return '   ' + n;
      case 4: return '    ' + n;
      case 5: return '     ' + n;
    }
  }

  totalDigits = opts.linenos ? getDigits(linesLen + firstline - 1) : 0;

  // normalize markers
  if(opts.markers) {
    markers = normalizeMarkers(opts.markers);
  }

  for (var i = 0; i < linesLen; i++) {

    marker = opts.markers ? '  ' : '';
    lineno = opts.linenos ? pad(i + firstline, totalDigits) + ': ' : '';

    // apply line markers
    if (markers[i + 1]) {
      marker = lineMarker + ' ';
      columns = markers[i + 1];
    } else {
      // ensure a blank array is present else subsequent lines get appended with an empty position marker line
      columns = []
    }

    // Don't close the escape sequence here in order to not break multi line code highlights like block comments;
    lines.push( colorSurround(marker + lineno).replace(surroundClose, '') + highlightedLines[i]);

    // apply position markers
    if(columns.length) {
      // create a string
      margin = marker.length + lineno.length;
      markerArray = [];
      maxColumn = Math.max.apply(null, columns);
      
      for(var j = 0; j < maxColumn + margin; j++) {
        markerArray[j] = ' ';
      }

      for(var m in columns) {
        markerArray[columns[m] - 1 + margin] = positionMarker;
      }
      lines.push(markerArray.join(''));
    }

  }

  return lines.join('\n');
}

module.exports = function highlight (code, opts) {
  opts = opts || { };
  try {

    var result = redeyed(code, opts.theme || theme);

    var process = opts.linenos || opts.markers;

    return code = process ? processLines(result.code, opts) : result.code;
  } catch (e) {
    e.message = 'Unable to perform highlight. The code contained syntax errors: ' + e.message;
    throw e;
  }
};
