
//
// ES6: template literals for multi line string, it is so useful.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
//

// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_ModelViewMatrix;
    varying vec4 v_Color;
    void main() {
        gl_Position = u_ModelViewMatrix * a_Position;
        v_Color = a_Color;
    } 
`;

// Fragment shader program
var FSHADER_SOURCE = `
    #ifdef GL_ES
    precision mediump float;
    #endif

    varying vec4 v_Color;
    void main() {
        gl_FragColor = v_Color;
    }
`;

function main() {
    var canvas = document.getElementById('webgl');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element.');
        return;
    }

    var gl = getWebGLContext(canvas, true);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders');
        return;
    }

    // 设置顶点坐标和颜色（蓝色三角形在最前面）
    var n = initVertexBuffers(gl);
    if ( n < 0 ) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    var u_ModelViewMatrix = gl.getUniformLocation(gl.program, 'u_ModelViewMatrix');
    if (!u_ModelViewMatrix) {
        console.log('Failed to get the storage location of u_ModelViewMatrix.');
        return;
    }

    // 设置视点、视线和上方向
    var modelViewMatrix = new Matrix4();
    modelViewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0).rotate(-10, 0, 0, 1);

    gl.uniformMatrix4fv(u_ModelViewMatrix, false, modelViewMatrix.elements);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
      // vertex coordinates    color
      //  x, y, z              r, g, b

      // green triangle (in the end)
         0.0,  0.5, -0.4,      0.4, 1.0, 0.4,
        -0.5, -0.5, -0.4,      0.4, 1.0, 0.4,
         0.5, -0.5, -0.4,      1.0, 0.4, 0.4,

      // yello triangle (in the middle)
         0.5,  0.4, -0.2,     1.0, 0.4, 0.4,
        -0.5,  0.4, -0.2,     1.0, 1.0, 0.4,
         0.0, -0.6, -0.2,     1.0, 1.0, 0.4,

      // blue  triangle (in the front) 
         0.0,  0.5,  0.0,     0.4, 0.4, 1.0,
        -0.5, -0.5,  0.0,     0.4, 0.4, 1.0,
         0.5, -0.5,  0.0,     1.0, 0.4, 0.4,      
    ]);

    var n = 9;

    // vertex

    var buffer = gl.createBuffer();
    if (!buffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var FSIZE = vertices.BYTES_PER_ELEMENT;

    // position
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position.');
        return;
    }

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    // texture
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0) {
        console.log('Failed to get the storage location of a_Color.');
        return;
    }

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    // unbind the buffer (from sample code)
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return n;
}

