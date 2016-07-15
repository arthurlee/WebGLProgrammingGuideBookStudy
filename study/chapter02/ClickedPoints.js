
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
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
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

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position.');
        return;
    }

    // version 1
    //gl.vertexAttrib3f(a_Position, 0.5, 0.0, 0.0);

    // version 2
    //gl.vertexAttrib4f(a_Position, 0.5, 0.5, 0.0, 1.0);

    // version 3
    //var position = new Float32Array([0.5, 0.5, 0.0, 1.0]);
    //gl.vertexAttrib4fv(a_Position, position);

    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    if (a_PointSize < 0) {
        console.log('Failed to get the storage location of a_PointSize.');
        return;
    }
    
    gl.vertexAttrib1f(a_PointSize, 10.0);

    // 
    canvas.onmousedown = function(event) {
        click(event, gl, canvas, a_Position);
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //gl.drawArrays(gl.POINTS, 0, 1);
}

var g_points = [];
function click(event, gl, canvas, a_Position) {
    var x = event.clientX;
    var y = event.clientY;
    var rect = event.target.getBoundingClientRect();
    //console.log(`x = ${x}, y = ${y}`);
    //console.log(rect);
    x = ((x - rect.left) - canvas.height/2) / (canvas.height/2);
    y = (canvas.width/2 - (y - rect.top)) / (canvas.width/2);

    g_points.push({x:x, y:y});

    gl.clear(gl.COLOR_BUFFER_BIT);
    var len = g_points.length;
    for (var i = 0; i < len; i+= 1) {
        gl.vertexAttrib3f(a_Position, g_points[i].x, g_points[i].y, 0.0);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}
