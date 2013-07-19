var PHOTOVIS = PHOTOVIS || {};

PHOTOVIS.FB = new function() {

  this.init = function() {
    FB.api('/me', function(response) {
      console.log('Good to see you, ' + response.name + '.');
    });

    FB.api('/me/photos', function(response) {
      var photos = response.data;
      //create a shuffled list of photoURLS
      var photoURLS = _.shuffle(_.pluck(photos, 'source'));
      var photoURL = photoURLS[0];
      var index = 1;
      PHOTOVIS.Surface.init(photoURL);
      setInterval(function() {
        var photoURL = photoURLS[index];

        PHOTOVIS.Surface.changePhoto(photoURL);
        index++;
      }, 5000)

    })

    //Get user music likes
    FB.api('me/likes', function(response) {
      var likes = response.data;
      var bandLikes = [];
      for (var i = 0; i < likes.length; i++) {
        if (likes[i].category === "Musician/band") {
          bandLikes.push(likes[i].name)
        }
      }
      console.log(bandLikes);


      SC.get("/tracks", {
        limit: 30,
        filter: "streamable",
        q: "Purity Ring",
        consumer_key: 'cf3043573dc5269cf0199331ff6e2717'
      }, function(search_tracks) {
        var trackURL = "https://api.soundcloud.com/tracks/" +search_tracks[0].id+ "/stream?oauth_consumer_key=cf3043573dc5269cf0199331ff6e2717";
        PHOTOVIS.Audio.init(trackURL);
      });
    })
  };
}


//<audio preload="auto" autoplay="" src="https://api.soundcloud.com/tracks/101650333/stream?oauth_consumer_key=OV0rhviPClsRKXnSyHuyA"></audio>
//<audio preload = "auto" autoplaysrc="https://api.soundcloud.com/tracks13478383/stream?oauth_consumer_key=cf3043573dc5269cf0199331ff6e2717"></audio>





