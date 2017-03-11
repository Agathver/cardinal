var test = require('tap').test
  , cardinal = require('..');

var code =
  'for (int i = 0; i <= 10; i++) {\n'+
  '  console.log("hello world");\n'+
  '}';

test('adding a line marker', function (t) {
  var lines = cardinal.highlight(code, { markers: [ { line: 2 } ] }).split('\n');
  t.equals(lines[1].charAt(5), '>');
  t.end();
});

test('adding multiple line markers', function (t) {
  var lines = cardinal.highlight(code, { markers: [ { line: 2 }, { line: 3 } ] }).split('\n');
  t.equals(lines[1].charAt(5), '>');
  t.equals(lines[2].charAt(5), '>');
  t.end();
});

test('adding a marker beyond line count', function (t) {
  var lines = cardinal.highlight(code, { markers: [ { line: 5 } ] }).split('\n');
  for (var i in lines) {
    t.notEqual(lines[i].charAt(5), '>');
  }
  t.end();
});

test('adding a position marker', function (t) {
  var lines = cardinal.highlight(code, { markers: [ { line: 2, column: 6 } ] }).split('\n');
  t.equals(lines[2].charAt(7), '^');
  t.end();
});

test('adding multiple position markers', function (t) {
  var lines = cardinal.highlight(code, { markers: [ { line: 1, column: 3 }, { line: 2, column: 6 }, { line: 2, column: 4 } ] }).split('\n');
  t.equals(lines[1].charAt(4), '^');
  t.equals(lines[3].charAt(5), '^');
  t.equals(lines[3].charAt(7), '^');
  t.end();
});

test('adding a line marker with line numbers', function (t) {
  var lines = cardinal.highlight(code, { linenos: true, markers: [ { line: 2 } ] }).split('\n');
  t.equals(lines[1].charAt(5), '>');
  t.end();
});

test('adding multiple line markers with line numbers', function (t) {
  var lines = cardinal.highlight(code, { linenos: true, markers: [ { line: 2 }, { line: 3 } ] }).split('\n');
  t.equals(lines[1].charAt(5), '>');
  t.equals(lines[2].charAt(5), '>');
  t.end();
});

test('adding a marker beyond line count with line numbers', function (t) {
  var lines = cardinal.highlight(code, { linenos: true, markers: [ { line: 5 } ] }).split('\n');
  for (var i in lines) {
    t.notEqual(lines[i].charAt(5), '>');
  }
  t.end();
});

test('adding a position marker with line numbers', function (t) {
  var lines = cardinal.highlight(code, { linenos: true, markers: [ { line: 2, column: 6 } ] }).split('\n');
  t.equals(lines[2].charAt(10), '^');
  t.end();
});

test('adding multiple position markers with line numbers', function (t) {
  var lines = cardinal.highlight(code, { linenos: true, markers: [ { line: 1, column: 3 }, { line: 2, column: 6 }, { line: 2, column: 4 } ] }).split('\n');
  t.equals(lines[1].charAt(7), '^');
  t.equals(lines[3].charAt(8), '^');
  t.equals(lines[3].charAt(10), '^');
  t.end();
});

test('adding duplicate line markers', function (t) {
  var lines = cardinal.highlight(code, { markers: [ { line: 2 } ] }).split('\n');
  t.notEqual(lines[0].charAt(5), '>');
  t.equals(lines[1].charAt(5), '>');
  t.notEqual(lines[2].charAt(5), '>');
  t.end();
});

test('adding duplicate position markers', function (t) {
  var lines = cardinal.highlight(code, { markers: [ { line: 2, column: 6 }, { line: 2, column: 6 } ] }).split('\n');
  t.equals(lines[2].indexOf('^'), 7);
  t.equals(lines[2].lastIndexOf('^'), 7);
  t.end();
});