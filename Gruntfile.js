var crawler = require('./src/crawler.js');

module.exports = function(grunt) {
  function getElectionId() {
    var id = grunt.option('election-id');
    if(!id) {
      throw new Error ('No election id provided');
    }
    return id;
  }

  grunt.registerTask('fetch:lists:canton', 'fetches list results', function() {
    var done = this.async();

    crawler.lists.canton(getElectionId()).then(function(rows) {
      console.log(rows);
      done();
    });
  });

  grunt.registerTask('fetch:lists:constituencies', 'fetches list results in constituencies', function() {
    var done = this.async();

    crawler.lists.constituencies(getElectionId()).then(function(rows) {
      //console.log(rows);
      console.log(JSON.stringify(rows));
      done();
    });
  });


  grunt.registerTask('fetch:lists:allConstituencyDetails', 'fetches seats allocation results in constituencies and canton', function() {
    var done = this.async();

    crawler.lists.allConstituencyDetails(getElectionId()).then(function(rows) {
      //console.log(rows);
      console.log(JSON.stringify(rows));
      done();
    });
  });

  grunt.registerTask('fetch:exe:canton', 'fetches executive candidate results', function() {
    var done = this.async();

    crawler.exe.candidates.canton(getElectionId()).then(function(rows) {
      console.log(rows);
      done();
    });
  });

  grunt.registerTask('fetch:exe:constituencies', 'fetches executive candidates results for each constituency', function() {
    var done = this.async();

    crawler.exe.candidates.constituencies(getElectionId()).then(function(rows) {
      console.log(rows);
      done();
    });
  });

};
