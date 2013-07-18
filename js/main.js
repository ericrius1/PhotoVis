/**
 * Copyright (C) 2011 by Paul Lewis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var AEROTWIST = AEROTWIST || {};
AEROTWIST.Surface = new function() {
  // internal opts
  var camera,
    scene,
    renderer = null,
    canvas = null,
    context = null,
    $container = $('#container'),
    width = $container.width(),
    height = $container.height(),
    $gui = $('#gui'),
    opts = [],
    projector = new THREE.Projector(),
    center = new THREE.Vector3(),
    orbitCamera = true,
    orbitValue = 0,
    lastRainDrop = 0,
    image = null,
    running = true,

    // core objects
    surface = null,
    surfaceVerts = [],
    raindrops = [],

    // constants
    DAMPEN = .9,
    AGGRESSION = 400,
    DEPTH = 500,
    NEAR = 1,
    FAR = 10000,
    X_RESOLUTION = 16,
    Y_RESOLUTION = 16,
    SURFACE_WIDTH = 400,
    SURFACE_HEIGHT = 400,
    DROP_RATE = 200,
    fin = true;

  this.pause = function() {
    running = false;
  }

  this.play = function() {
    if (!running) {
      running = true;
      update();
    }
  }

  /**
   * Initializes the experiment and kicks
   * everything off. Yay!
   */
  this.init = function() {
    // stop the user clicking
    document.onselectstart = function() {
      return false;
    };

    // set up our initial opts
    opts["magnitude"] = 30;
    opts["orbitSpeed"] = 0.001;
    opts["orbit"] = true;
    opts["wireframeOpacity"] = 1;
    opts["raindrops"] = true;
    opts["elasticity"] = 0.001;



    // create our stuff
    if (createRenderer()) {
      createObjects();
      scene.add(new THREE.AmbientLight(0xFFFFFF));
      update();
    }
  };

  function cancel(event) {
    if (event.preventDefault)
      event.preventDefault();

    return false;
  }

  /**
   * Creates the objects we need
   */

  function createObjects() {

    var planeMaterial = new THREE.MeshLambertMaterial({
      color: 0xFFFFFF,
      map: THREE.ImageUtils.loadTexture("images/love.jpg"),
      shading: THREE.SmoothShading
    });

    surface = new THREE.Mesh(new THREE.PlaneGeometry(SURFACE_WIDTH, SURFACE_HEIGHT, X_RESOLUTION, Y_RESOLUTION), planeMaterial);
    surface.rotation.x = -Math.PI * .5;
    surface.overdraw = true;
    scene.add(surface);

    // go through each vertex

    surfaceVerts = surface.geometry.vertices;
    sCount = surfaceVerts.length;

    // three.js creates the verts for the
    // mesh in x,y,z order I think
    while (sCount--) {
      var vertex = surfaceVerts[sCount];

      vertex.springs = [];
      vertex.velocity = new THREE.Vector3();

      // connect this vertex to the ones around it
      if (vertex.x > (-SURFACE_WIDTH * .5)) {
        // connect to left
        vertex.springs.push({
          start: sCount,
          end: sCount - 1
        });
      }

      if (vertex.x < (SURFACE_WIDTH * .5)) {
        // connect to right
        vertex.springs.push({
          start: sCount,
          end: sCount + 1
        });
      }

      if (vertex.y < (SURFACE_HEIGHT * .5)) {
        // connect above
        vertex.springs.push({
          start: sCount,
          end: sCount - (X_RESOLUTION + 1)
        });
      }

      if (vertex.y > (-SURFACE_HEIGHT * .5)) {
        // connect below
        vertex.springs.push({
          start: sCount,
          end: sCount + (X_RESOLUTION + 1)
        });
      }
    }
  }

  /**
   * Creates the WebGL renderer
   */

  function createRenderer() {
    var ok = false;
    renderer = new THREE.WebGLRenderer();
    camera = new THREE.PerspectiveCamera(45, width / height, NEAR, FAR);
    scene = new THREE.Scene();
    canvas = document.createElement('canvas');
    canvas.width = SURFACE_WIDTH;
    canvas.height = SURFACE_HEIGHT;
    context = canvas.getContext('2d');
    // position the camera
    camera.position.y = 220;
    camera.position.z = DEPTH;

    // start the renderer
    renderer.setSize(width, height);
    $container.append(renderer.domElement);
    return true;
  }


  /**
   * Updates the velocity and position
   * of the particles in the view
   */

  function updateMusic() {

    index = (3 * (X_RESOLUTION + 1)) + 3;

    if (index >= 0 && index < surfaceVerts.length) {
      surfaceVerts[index].velocity.z += opts.magnitude;
    }
  }

  function update() {
    updateMusic();
    var v = surfaceVerts.length;
    while (v--) {
      var vertex = surfaceVerts[v],
        acceleration = new THREE.Vector3(0, 0, -vertex.z * opts["elasticity"]),
        springs = vertex.springs,
        s = springs.length;

      vertex.velocity.add(acceleration);

      while (s--) {
        var spring = springs[s],
          extension = surfaceVerts[spring.start].z - surfaceVerts[spring.end].z;

        acceleration = new THREE.Vector3(0, 0, extension * opts["elasticity"] * 50);
        surfaceVerts[spring.end].velocity.add(acceleration);
        surfaceVerts[spring.start].velocity.sub(acceleration);
      }

      vertex.add(vertex.velocity);

      vertex.velocity.multiplyScalar(DAMPEN);
    }

    surface.geometry.computeFaceNormals(true);
    surface.geometry.verticesNeedUpdate = true;
    surface.geometry.normalsNeedUpdate = true;

    // set up a request for a render
    requestAnimationFrame(render);
  }

  /**
   * Renders the current state
   */

  function render() {
    camera.lookAt(surface.position);
    // only render
    if (renderer) {
      renderer.render(scene, camera);
    }

    // set up the next frame
    if (running) {
      update();
    }
  }

};

// Surfaceize!
$(document).ready(function() {

  if (Modernizr.webgl) {
    // Go!
    AEROTWIST.Surface.init();
  }
});