var d3 = require('d3');
var _ = require('lodash');

module.exports.cheerioTable = function($, $table) {
  var rows = [];
  var headCols = [];

  $table.find('tr').each(function(i) {
    var isHeader = i === 0;
    var columns = [], classes = [];

    $(this).find('td').each(function() {
      var text = $(this).text().trim(); // trim --> to remove whitespace before and after
      var colspan = $(this).attr('colspan') || 1;
      for(var i = 1; i <= colspan; i++) {
        columns.push(text + (i > 1 ? ' ' + i : ''));
      }
      classes = classes.concat(($(this).attr('class') || '').split(' '));
    });

    if(isHeader) {
      columns.push('classes');
      headCols = columns;
    }
    else {

      // check if amount of cols is the same as the first/header row
      // beacuse --> it is possible that the colspan in the html is wrong...

      // push missing cols
      for (var i = 0; i < headCols.length - columns.length; i++){
        columns.push('');
      }

      var classes = _.uniq(classes).filter(Boolean).join(' ');

      // add classes to the last field
      columns[headCols.length-1] = classes;

      //columns.push(_.uniq(classes).filter(Boolean).join(' '));
    }

    rows.push(columns);
  });

  var objects = d3.csv.parse(d3.csv.formatRows(rows));
  objects.forEach(function(object) {
    object.classes = object.classes.split(' ');
  });

  return objects;
};
