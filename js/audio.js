var PHOTOVIS = PHOTOVIS || {}

PHOTOVIS.Audio = new function() {

  this.init = function() {


    var context;
    var source;
    var analyser;
    var buffer;
    var url = 'music/lights.mp3';
    this.soundArray = new Array();
    this.boost = 0;
    this.sourceJs;

    $.ajaxPrefilter(function(settings, _, jqXHR) {
      jqXHR.setRequestHeader("Access-Control-Allow-Origin", "*");
    });

    try {
      if (typeof webkitAudioContext === 'function') {
        context = new webkitAudioContext();
      } else {
        context = new AudioContext();
      }
    } catch (e) {
      $('#info').text('Web Audio API is not supported in this browser');
    }


    $.ajax({
      url: 'http://songza.com/listen/minimalist-indie-pop-evening-TacticCo/',
      datatType: 'arraybuffer',
      success: function(data) {
        console.log("shnur");
        debugger;
      }
    });

    var handleAudio = function(data) {
      debugger;
      // context.decodeAudioData(
      //   request.response,
      //   function(buffer) {
      //     if (!buffer) {
      //       $('#info').text('Error decoding file data');
      //       return;
      //     }

      //     sourceJs = context.createJavaScriptNode(2048);
      //     sourceJs.buffer = buffer;
      //     sourceJs.connect(context.destination);
      //     analyser = context.createAnalyser();
      //     analyser.smoothingTimeConstant = 0.6;
      //     analyser.fftSize = 512;

      //     source = context.createBufferSource();
      //     source.buffer = buffer;
      //     source.loop = true;

      //     source.connect(analyser);
      //     analyser.connect(sourceJs);
      //     source.connect(context.destination);


      //     this.sourceJs.onaudioprocess = function(e) {
      //       PHOTOVIS.Audio.soundArray = new Uint8Array(analyser.frequencyBinCount);
      //       analyser.getByteFrequencyData(PHOTOVIS.Audio.soundArray);
      //       this.boost = 0;
      //       for (var i = 0; i < PHOTOVIS.Audio.soundArray.length; i++) {
      //         PHOTOVIS.Audio.boost += PHOTOVIS.Audio.soundArray[i];
      //       }
      //       PHOTOVIS.Audio.boost = PHOTOVIS.Audio.boost / PHOTOVIS.Audio.soundArray.length;
      //     };
      //     play();
      //   }
      // );
    };



    function play() {
      source.noteOn(0);
    }
  }
}