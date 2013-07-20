var PV = PV || {};

PV.FB = new function() {

  var bandLikes = [];
  var worldLoaded = false;
  this.photoURLS = [];
  var startTime = 1167609600;
  var endTime = 1170288000;
  var intervalTime = (endTime - startTime) * 2;

  this.init = function() {


    this.addPhotos();


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
        PV.Audio.init(trackURL);
        $('#fbContainer').hide();
      });
    });
  };

  this.addPhotos = function(){
    FB.api('/me/photos', 
    {
      'since:': startTime,
      'until': endTime,
      limit: '5'

    }, function(response) {
      var photos = response.data;

      //Get the URLs for the highest quality photos and shuffle them
      highResPhotos = _.pluck(photos, 'images');
      for(var i = 0;  i < highResPhotos.length; i++){
        highResPhotos[i] = highResPhotos[i][0];
      }
      PV.FB.photoURLS =  _.shuffle(_.pluck(highResPhotos, 'source'));
      if(!worldLoaded){
        PV.World.preload();
        worldLoaded = true;
      }

      startTime += intervalTime;
      endTime +=intervalTime;

    });

  }

  this.begin = function() {
    PV.World.init();
  }
}
