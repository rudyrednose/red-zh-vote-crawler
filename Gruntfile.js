var fileSave = require('file-save');

var crawler = require('./src/crawler.js');

module.exports = function(grunt) {
  function getElectionId() {
    var id = grunt.option('election-id');
    if(!id) {
      throw new Error ('No election id provided');
    }
    return id;
  }

  grunt.registerTask('save:all', 'fetch and save all needed current data', function() {
    var done = this.async();

    //var electionId = getElectionId();
    //var rrId = 'rr2015_preview';
    //var krId = 'kr2011_medieninfo';

    var rrId = 'rr2015';
    var krId = 'kr2015';

    var timestamp = Math.round(Date.now()/1000);

    // rr_pro-bezirk
    crawler.exe.candidates.constituencies(rrId).then(function(rows) {
      var fileSrc = 'output/'+timestamp+'_rr_pro-bezirk.json';
      fileSave(fileSrc).write(JSON.stringify(rows), 'utf8', function(){
        console.log('SAVED to '+fileSrc);

        // kr_pro-bezirk
        //crawler.seats.districts(krId, -2).then(function(rows) {
        crawler.lists.constituencies(krId).then(function(rows) {
          var fileSrc = 'output/'+timestamp+'_kr_pro-bezirk-listen.json';
          fileSave(fileSrc).write(JSON.stringify(rows), 'utf8', function(){
            console.log('SAVED to '+fileSrc)

            // kr_pro-gemeinde
            crawler.lists.allConstituencyDetails(krId).then(function(rows) {
              var fileSrc = 'output/'+timestamp+'_kr_pro-gemeinde.json';
              fileSave(fileSrc).write(JSON.stringify(rows), 'utf8', function(){
                console.log('SAVED to '+fileSrc)

                done();

              });
            });
          });
        });
      });
    });


  });


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


  grunt.registerTask('fetch:seats:districts', 'fetches seats and more results in ', function() {
    var done = this.async();

    crawler.seats.districts(getElectionId(), -2) // -2 for the new 2015 table
      .then(function(rows) {
        console.log(rows[1]);
        //console.log(JSON.stringify(rows));
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
