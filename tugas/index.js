(function(global) {

  var canvas, gl, program;

  glUtils.SL.init({ callback:function() { main(); } });

  function main() {
    // Register Callbacks
    window.addEventListener('resize', resizer);

    // Get canvas element and check if WebGL enabled
    canvas = document.getElementById("glcanvas");
    gl = glUtils.checkWebGL(canvas);

    // Initialize the shaders and program
    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
        fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);

    program = glUtils.createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);

    resizer();
  }

  function draw() {
    gl.clearColor(0, 0.07, 0.1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    var AOuterVertices = new Float32Array([
      -0.85, -0.85,     -0.6, +0.8,     -0.4, +0.8,     -0.15, -0.85,
      -0.3, -0.85,     -0.4, -0.3,     -0.6, -0.3,       -0.7, -0.85
      // -0.5, -0.5,   -0.5, +0.5,  0.0, +0.5,  0.0, 0.0,  +0.5, -0.5
    ]);
    var AInnerVertices = new Float32Array([
      -0.42, 0.0,     -0.58, 0.0,   -0.5, +0.5
    ]);

    var ABoldOuterVertices = new Float32Array([
      -0.85, -0.85,     -0.6, +0.8,     -0.7, -0.85,     
      -0.6, +0.8,     -0.7, -0.85,     -0.5, +0.5,
      -0.4, +0.8,     -0.6, +0.8,     -0.5, +0.5,
      -0.5, +0.5,     -0.15, -0.85,     -0.4, +0.8,
      -0.5, +0.5,     -0.15, -0.85,     -0.3, -0.85,

      -0.42, 0.0,     -0.58, 0.0,     -0.3, -0.4, 
      -0.3, -0.3,     -0.7, -0.3,     -0.58, 0.0, 
    ]);

    ABoldOuterVertices.forEach ((_, i) => {
      if(i%2==0)    
        ABoldOuterVertices[i] += 1;
    })

    const thetaUniformLocation = gl.getUniformLocation(program, 'theta');
    const offsetXUniformLocation = gl.getUniformLocation(program, 'offsetX');
    const yscaleUniformLocation = gl.getUniformLocation(program, 'yscale');    
    let theta = 0;
    let yscaler = 0.0;
    let yscale = 0.0;
    yscaler = 0.0052;

    function render() {
      theta += 0.0052;
      gl.uniform1f(thetaUniformLocation, theta);

      yscale += yscaler;
      if(Math.abs(yscale) > 1) {
        yscaler *= -1;
        yscale = 0.98;
      }

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Rotate for the left side
      gl.uniform1f(offsetXUniformLocation, 0.5);
      gl.uniform1f(yscaleUniformLocation, 1);
      drawA(gl.LINE_LOOP, AOuterVertices);
      drawA(gl.LINE_LOOP, AInnerVertices);

      // Rotate for the right side
      gl.uniform1f(thetaUniformLocation, 0);
      gl.uniform1f(yscaleUniformLocation, yscale);
      gl.uniform1f(offsetXUniformLocation, -0.5);
      drawA(gl.TRIANGLES, ABoldOuterVertices);

      requestAnimationFrame(render);
    }

    render();
  }

  function initPointBuffers() {
    var vertices = new Float32Array([
      -0.5, -0.5
    ]);
    var n = 1;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var aPosition = gl.getAttribLocation(program, 'aPosition');
    if (aPosition < 0) {
      console.log('Failed to get the storage location of aPosition');
      return -1;
    }

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
    return n;
  }

  function initLineBuffers() {
    var vertices = new Float32Array([
      -0.25, -0.25,  -0.25, +0.5
    ]);
    var n = 2;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var aPosition = gl.getAttribLocation(program, 'aPosition');
    if (aPosition < 0) {
      console.log('Failed to get the storage location of aPosition');
      return -1;
    }

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
    return n;
  }

  function initTriangleBuffers() {
    var vertices = new Float32Array([
      +0.5, -0.5,  0.0, 0.0,  +0.5, 0.0
    ]);
    var n = 3;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var aPosition = gl.getAttribLocation(program, 'aPosition');
    if (aPosition < 0) {
      console.log('Failed to get the storage location of aPosition');
      return -1;
    }

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
    return n;
  }

  // Generic format
  function drawA(type, vertices) {
    var n = initBuffers(vertices);
    if (n < 0) {
      console.log('Failed to set the positions of the vertices');
      return;
    }
    gl.drawArrays(type, 0, n);
  }

  function initBuffers(vertices) {
    var n = vertices.length / 2;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var aPosition = gl.getAttribLocation(program, 'aPosition');
    if (aPosition < 0) {
      console.log('Failed to get the storage location of aPosition');
      return -1;
    }

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
    return n;
  }

  function resizer() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    draw();
  }

})(window || this);
