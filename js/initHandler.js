$(document).ready(function() {
  
  SC.initialize({
    client_id: 'cf3043573dc5269cf0199331ff6e2717',
    redirect_uri: 'http://ericrius1.github.io/PhotoVis',
  });

  window.fbAsyncInit = function() {
    FB.init({
      //local
      appId: '301734256630292', // App ID
      //deploy
      //appId: process.env.PHOTOVIS_FBAPP_ID,
      status: true, // check login status
      cookie: true, // enable cookies to allow the server to access the session
      xfbml: true // parse XFBML
    });

    // Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
    // for any authentication related change, such as login, logout or session refresh. This means that
    // whenever someone who was previously logged out tries to log in again, the correct case below 
    // will be handled. 
    FB.Event.subscribe('auth.authResponseChange', function(response) {
      // Here we specify what we do with the response anytime this event occurs. 
      if (response.status === 'connected') {
        $('.intro').hide();
        PV.FB.init();
      } else {
        FB.login({
          scope: 'user_photos, user_actions.music'
        });
      }
    });
  };

  // Load the SDK asynchronously
  (function(d) {
    var js, id = 'facebook-jssdk',
      ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement('script');
    js.id = id;
    js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
  }(document));
});