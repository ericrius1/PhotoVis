var PHOTOVIS = PHOTOVIS || {};

PHOTOVIS.FbHandler = new function() {

  this.init = function() {
    FB.api('/me', function(response) {
      console.log('Good to see you, ' + response.name + '.');
    });

    FB.api('/me/permissions', function(response){
      debugger;
    })
  };
}