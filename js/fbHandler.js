var PV = PV || {};

PV.FB = new function() {

  var bandLikes = [];
  var worldLoaded = false;
  this.photoURLS = [];
  //real
  // var startTime = 1136073600;
  // var endTime = 1167609600;
  //testing
  var startTime = 1325376000;
  var endTime = 1356998400;
  var finalTime = 1370044800
  var intervalTime = (endTime - startTime);

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
    console.log("START TTIME: ", startTime);
    console.log("ENDTIME: ", endTime);
    FB.api('/me/photos', 
    {
      'since:': startTime,
      'until': endTime,
      limit: 5

    }, function(response) {

      //we are at present, so
      if(startTime >= finalTime){
        console.log("LENGTH", PV.FB.photoURLS.length);
        PV.FB.photoURLS = _.uniq(PV.FB.photoURLS);
        PV.World.preload();
        PV.World.init();
        return;
      }
      var photos = response.data;
      for(var i = 0 ; i < photos.length; i++){
        console.log(photos[i].source);
      }

      //Get the URLs for the highest quality photos and shuffle them
      highResPhotos = _.pluck(photos, 'images');
      for(var i = 0;  i < highResPhotos.length; i++){
        highResPhotos[i] = highResPhotos[i][0];
      }
      PV.FB.photoURLS.push.apply(PV.FB.photoURLS, _.shuffle(_.pluck(highResPhotos, 'source'))); 



      startTime += intervalTime;
      endTime +=intervalTime;
      PV.FB.addPhotos();

    });

  }
}
