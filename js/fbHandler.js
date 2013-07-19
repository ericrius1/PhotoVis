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
      PHOTOVIS.Audio.init();
      PHOTOVIS.Surface.init(photoURL);
      setInterval(function() {
        var photoURL = photoURLS[index];

        PHOTOVIS.Surface.changePhoto(photoURL);
        index++;
      }, 5000)

    })

    //Get user music likes
    FB.api('me/likes', function(response){
      var likes = response.data;
      var bandLikes = [];
      for(var i = 0; i < likes.length; i++){
        if(likes[i].category === "Musician/band"){
          bandLikes.push(likes[i].name)
        }
      }
      console.log(bandLikes);
    })
  };
}