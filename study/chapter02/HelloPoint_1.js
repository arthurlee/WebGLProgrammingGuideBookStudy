
//
// ES6: template literals for multi line string, it is so useful.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
//

// Vertex shader program
// 顶点着色器
var VSHADER_SOURCE = `
    void main() {
        // 齐次坐标（矩阵乘法，顶点变换）
        gl_Position = vec4(0.0, 0.0, 0.0, 1.0);     // Set the vertex coordinates of the point
        gl_PointSize = 10.0;                        // Set the point size
    } 
`;

// Fragment shader program
// 片元着色器，片元可以理解为像素。
var FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);    // Set the point color, RGBA
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

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, 1);
}
