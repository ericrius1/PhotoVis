var PHOTOVIS = PHOTOVIS || {};

PHOTOVIS.FB= new function() {

  this.init = function() {
    FB.api('/me', function(response) {
      console.log('Good to see you, ' + response.name + '.');
    });

    FB.api('/me/photos', function(response){
      var photos = response.data;
      var photoIndex = Math.floor(Math.random() * photos.length);
      var photoURL = photos[photoIndex].source;
      PHOTOVIS.Audio.init();
      PHOTOVIS.Surface.init(photoURL);
    })
  };
}