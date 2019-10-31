(function(global) {

  var canvas, gl, program;

  glUtils.SL.init({ callback:function() { main(); } });

  function main() {
    // Register Callbacks
    // window.addEventListener('resize', resizer);

    // Get canvas element and check if WebGL enabled
    canvas = document.getElementById("glcanvas");
    gl = glUtils.checkWebGL(canvas);

    // Initialize the shaders and program
    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
        fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);

    program = glUtils.createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);

    const vertices = [

    ];

    const cubePoints = [
      [-0.5, -0.5,  0.5],
      [-0.5,  0.5,  0.5],
      [ 0.5,  0.5,  0.5],
      [ 0.5, -0.5,  0.5],
      [-0.5, -0.5, -0.5],
      [-0.5,  0.5, -0.5],
      [ 0.5,  0.5, -0.5],
      [ 0.5, -0.5, -0.5],
    ];

    const cubeColors = [
      [],
      [1.0, 0.0, 0.0],
      [0.0, 1.0, 0.0],
      [0.0, 0.0, 1.0],
      [1.0, 1.0, 1.0],
      [1.0, 0.5, 0.0],
      [1.0, 1.0, 0.0],
    ];

    function quad(a, b, c, d) {
      var indices = [a, b, c, a, c, d];
      for (const i of indices) {
        vertices.push(...cubePoints[i]);
        vertices.push(...cubeColors[a]);
      }
    }
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
    quad(6, 5, 1, 2);

    // Buffer object for communication between CPU Memory and GPU Memory
    const vertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    // Connection between attributes
    const vPostion = gl.getAttribLocation(program, 'vPosition');
    const vColor = gl.getAttribLocation(program, 'vColor');
    gl.vertexAttribPointer(
      vPostion, //
      3,        // Number of elements in attribute
      gl.FLOAT, //
      gl.FALSE, 
      6 * Float32Array.BYTES_PER_ELEMENT,
      0
      );
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, gl.FALSE,
      6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
      
      gl.enableVertexAttribArray(vPostion);
      gl.enableVertexAttribArray(vColor);

    document.addEventListener('keydown', onKeyDown);

    // Connection for uniform value for translation purpose
    const thetaUniformLocation = gl.getUniformLocation(program, 'theta');
    let theta = Math.PI;
    let thetaSpeed = Math.PI/72;
    // const yscaleUniformLocation = gl.getUniformLocation(program, 'yscale');    
    // let yscaler = 0.0;

    // Model matrix definition
    const mmLoc = gl.getUniformLocation(program, "modelMatrix");
    const mm = glMatrix.mat4.create();
    glMatrix.mat4.translate(mm, mm, [0.0, 0.0, -2.0]);

    // View matrix and projection configuration
    const vmLoc = gl.getUniformLocation(program, 'viewMatrix');
    const vm = glMatrix.mat4.create();
    const pmLoc = gl.getUniformLocation(program, 'projectionMatrix');
    const pm = glMatrix.mat4.create();
    let camera = {x: 0.0, y: 0.0, z: 0.0};
    gl.uniformMatrix4fv(vmLoc, false, vm);
    glMatrix.mat4.perspective(pm,
      glMatrix.glMatrix.toRadian(90),   // fovy in radian
      canvas.width/canvas.height,       // aspect ratio
      0.5,      // near
      10.0,     // far
    );
    gl.uniformMatrix4fv(pmLoc, false, pm);

    // Interactive control using keyboard
    function onKeyDown(event) {
      if (event.keyCode == 189) thetaSpeed -= 0.01;       // key '-'
      else if (event.keyCode == 187) thetaSpeed += 0.01;  // key '='
      else if (event.keyCode == 48) thetaSpeed = 0;       // key '0'
      if (event.keyCode == 88) axis[x] = !axis[x];
      if (event.keyCode == 89) axis[y] = !axis[y];
      if (event.keyCode == 90) axis[z] = !axis[z];
      if (event.keyCode == 38) camera.z -= 0.1;
      else if (event.keyCode == 40) camera.z += 0.1;
      if (event.keyCode == 37) camera.x -= 0.1;
      else if (event.keyCode == 39) camera.x += 0.1;
    }

    function render() {
      theta += 0.001;

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Passing theta uniform for rotation within vertex shader
      gl.uniform1f(thetaUniformLocation, theta);

      // Camera view position
      glMatrix.mat4.lookAt(vm,
        [0.0, 0.0,  0.0], // Camera position
        [0.0, 0.0, -2.0], // Camera view direction
        [0.0, 1.0,  0.0], // Upward camera direction
      );

      // Rotation using glMatrix
      glMatrix.mat4.rotateZ(mm, mm, thetaSpeed);
      glMatrix.mat4.rotateY(mm, mm, thetaSpeed * 2);
      glMatrix.mat4.rotateX(mm, mm, thetaSpeed);
      gl.uniformMatrix4fv(mmLoc, false, mm);

      // Drawing
      gl.drawArrays(gl.TRIANGLES, 0, 36);

      requestAnimationFrame(render);
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    render();
  }

})(window || this);
