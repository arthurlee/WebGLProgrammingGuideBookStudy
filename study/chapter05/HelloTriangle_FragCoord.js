
//
// ES6: template literals for multi line string, it is so useful.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
//

// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_PointSize;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = a_PointSize;
    } 
`;

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    uniform float u_Width;
    uniform float u_Height;
    void main() {
        //gl_FragColor = vec4(gl_FragCoord.x/u_Width, 0.0, gl_FragCoord.y/u_Height, 1.0);
        gl_FragColor = vec4(
            gl_FragCoord.x/u_Width, 
            (gl_FragCoord.x + gl_FragCoord.y) / (u_Width + u_Height) / 2.0, 
            gl_FragCoord.y/u_Height, 
            1.0);
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

    var n = initVertexBuffers(gl);
    if ( n < 0 ) {
        console.log('/Failed to set the positions of the vertices');
        return;
    }

    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    if (a_PointSize < 0) {
        console.log('Failed to get the storage location of a_PointSize.');
        return;
    }
    
    gl.vertexAttrib1f(a_PointSize, 10.0);

    var u_Width = gl.getUniformLocation(gl.program, 'u_Width');
    if (! u_Width) {
        console.log('Failed to get u_Width variable');
        return;
    }

    //gl.uniform1f(u_Width, canvas.clientWidth);
    gl.uniform1f(u_Width, gl.drawingBufferWidth);

    var u_Height = gl.getUniformLocation(gl.program, 'u_Height');
    if (! u_Height) {
        console.log('Failed to get u_Height variable');
        return;
    }

    //gl.uniform1f(u_Height, canvas.clientHeight);
    gl.uniform1f(u_Height, gl.drawingBufferHeight);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //var mode = gl.POINTS;
    //var mode = gl.LINES;
    //var mode = gl.LINE_STRIP;
    //var mode = gl.LINE_LOOP;
    var mode = gl.TRIANGLES;
    //var mode = gl.TRIANGLES_STRIP;
    gl.drawArrays(mode, 0, n);
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5
    ]);
    var n = 3;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position.');
        return;
    }

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    return n;
}
