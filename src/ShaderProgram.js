// jshint esversion: 6

/**
 * @todo Documentation.
 * @file
 * @requires {@link Matrix.js}
 * @see W3DL.ShaderProgram
 */

/**
 * @todo Documentation.
 * @class
 */
W3DL.ShaderProgram = class ShaderProgram {
  constructor(vertShaderCode, fragShaderCode) {
    DEBUG && W3DL.Utils.ValidateArguments([String, String], arguments); // jshint ignore:line
    this.vertexShaderCode = vertShaderCode;
    this.fragmentShaderCode = fragShaderCode;
    this.id = 0;
  }

  initialize(gl) {
    DEBUG && W3DL.Utils.ValidateArguments([WebGLRenderingContext], arguments); // jshint ignore:line

    let vtxShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vtxShader, this.vertexShaderCode);
    gl.compileShader(vtxShader);
    if (!gl.getShaderParameter(vtxShader, gl.COMPILE_STATUS)) {
      throw new SyntaxError("Error compiling vertex shader. " + gl.getShaderInfoLog(vtxShader));
    }

    let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, this.fragmentShaderCode);
    gl.compileShader(fragShader);
    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
      throw new SyntaxError("Error compiling fragment shader. " + gl.getShaderInfoLog(fragShader));
    }

    this.id = gl.createProgram();
    gl.attachShader(this.id, vtxShader);
    gl.attachShader(this.id, fragShader);

    gl.linkProgram(this.id);
    if (!gl.getProgramParameter(this.id, gl.LINK_STATUS)) {
      throw new Error("Error linking program. " + gl.getProgramInfoLog(this.id));
    }

    gl.validateProgram(this.id);
    if (!gl.getProgramParameter(this.id, gl.VALIDATE_STATUS)) {
      throw new Error("Error validating program. " + gl.getProgramInfoLog(this.id));
    }

    gl.detachShader(this.id, vtxShader);
    gl.deleteShader(vtxShader);
    gl.detachShader(this.id, fragShader);
    gl.deleteShader(fragShader);
  }

  bindUniformMatrix(gl, uniformName, m) {
    gl.useProgram(this.id);
    let location = gl.getUniformLocation(this.id, uniformName);
    if (!location) {
      return false;
    }
    gl.uniformMatrix4fv(location, false, m.toFloat32Array);
  }

  bindUniformVector(gl, uniformName, v) {
    gl.useProgram(this.id);
    let location = gl.getUniformLocation(this.id, uniformName);
    if (!location) {
      return false;
    }
    let vArray = v.toFloat32Array;
    gl["uniform"+ vArray.length +"fv"](location, vArray);
    return true;
  }

  bindUniformFloat(gl, uniformName, f) {
    gl.useProgram(this.id);
    let location = gl.getUniformLocation(this.id, uniformName);
    if (!location) {
      return false;
    }
    gl.uniform1f(location, f);
    return true;
  }

  bindUniformInt(gl, uniformName, i) {
    gl.useProgram(this.id);
    let location = gl.getUniformLocation(this.id, uniformName);
    if (!location) {
      return false;
    }
    gl.uniform1i(location, i);
    return true;
  }
};
