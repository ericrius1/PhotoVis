var PHOTOVIS = PHOTOVIS || {};

PHOTOVIS.FB = new function() {

  var bandLikes = [];
  this.photoURLS = [];
  var startTime = 1199145600;
  var endTime = 1230768000;
  var intervalTime = endTime - startTime;

  this.init = function() {
    //Start in 2008
    FB.api('/me/photos', 
    {
      'since:': startTime,
      'until': endTime

    }, function(response) {
      var photos = response.data;

      //Get the URLs for the highest quality photos and shuffle them
      highResPhotos = _.pluck(photos, 'images');
      for(var i = 0;  i < highResPhotos.length; i++){
        highResPhotos[i] = highResPhotos[i][0];
      }
      PHOTOVIS.FB.photoURLS = _.shuffle(_.pluck(highResPhotos, 'source'));
      PHOTOVIS.World.preload();
    });

    //Get user music likes
    FB.api('me/likes', function(response) {
      var likes = response.data;
      for (var i = 0; i < likes.length; i++) {
        if (likes[i].category === "Musician/band") {
          bandLikes.push(likes[i].name)
        }
      }
      //Now start audio
      var bandIndex = Math.floor(Math.random() * bandLikes.length);
      SC.get("/tracks", {
        limit: 10,
        filter: "streamable",
        q: bandLikes[bandIndex],
        consumer_key: 'cf3043573dc5269cf0199331ff6e2717'
      }, function(search_tracks) {
        var trackIndex = Math.floor(Math.random() * search_tracks.length);
        console.log("MUSICIAN: ", bandLikes[bandIndex]);
        console.log("SONG NAME: ", search_tracks[trackIndex].title);
        var trackURL = "https://api.soundcloud.com/tracks/" + search_tracks[trackIndex].id + "/stream?oauth_consumer_key=cf3043573dc5269cf0199331ff6e2717";
        PHOTOVIS.Audio.init(trackURL);
        $('#fbContainer').hide();
      });
    });
  };

  this.begin = function() {
    PHOTOVIS.World.init();
  }
}
