var Q = require('q');
var fetcher = require('./fetcher.js');
var converter = require('./converter.js');

var baseUrl = 'http://www.wahlen.zh.ch/wahlen/';

function htmlFetch(url, transformer) {
  var deferred = Q.defer();

  fetcher.html(baseUrl + url).then(function($) {
    deferred.resolve(transformer($));
  }, function(failure) {
    deferred.reject(failure);
  });

  return deferred.promise;
}

module.exports.lists = {
  canton: function(electionId) {
    return htmlFetch(electionId + '/viewer.php?menu=listen_kanton', function($) {
      var rows = converter.cheerioTable($, $('table').last());

      return rows;
    });
  },
  constituencies: function(electionId) {
    return htmlFetch(electionId + '/viewer.php?menu=listen_wk&wk=a', function($) {
      var rows = converter.cheerioTable($, $('table').last());

      return rows;
    });
  },

  allConstituencyDetails: function(electionId) {
    var self = this;

    return self.constituencyDetailRecursively(electionId, 1, []);

  },

  constituencyDetailRecursively: function(electionId, detailId, fullResult) {
    var self = this;

    return htmlFetch(electionId + '/viewer.php?menu=listen_wk&wk='+detailId, function($) {
      var rows = converter.cheerioTable($, $('table').last());

      fullResult.push(rows);

      if (detailId < 19){
        return self.constituencyDetailRecursively(electionId, detailId+1, fullResult);
      }else{
        return fullResult;
      }

    });
  }
};

module.exports.seats = {
  districts: function(electionId, tableEq) {
    return htmlFetch(electionId + '/viewer.php?menu=sitzzuteilung', function($) {

      var $table = $('table').eq(tableEq);

      $table.find('tr.kopf').first().remove();

      //console.log($('table').eq(-3));

      var rows = converter.cheerioTable($, $table);

      return rows;
    });
  }
};



module.exports.exe = {
  candidates: {
    canton: function(electionId) {
      return htmlFetch(electionId + '/viewer.php?table=kandkanton', function($) {
        var rows = converter.cheerioTable($, $('table').eq(-2)).slice(0, -1);

        return rows;
      });
    },

    constituencies: function(electionId) {
      return htmlFetch(electionId + '/viewer.php?table=kandbezirke', function($) {
        var rows = converter.cheerioTable($, $('table').eq(-2)).slice(0, -1);

        return rows;
      });
    }
  }


};

