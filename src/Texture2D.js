// jshint esversion: 6

/**
 * @todo Documentation.
 * @file
 * @requires {@link Utils.js}
 * @see W3DL.Texture2D
 */

/**
 * @todo Documentation.
 * @class
 */
W3DL.Texture2D = class Texture2D {
  constructor(element) {
    DEBUG && W3DL.Utils.ValidateArguments([[ImageData, HTMLImageElement, HTMLCanvasElement, HTMLCanvasElement, ImageBitmap]], arguments); // jshint ignore:line
    this.element = element;
    this.id = 0;
    this.unit = 0;
  }

  initialize(gl, unit = 0) {
    DEBUG && W3DL.Utils.ValidateArguments([WebGLRenderingContext, Number], arguments, 1); // jshint ignore:line
    this.unit = gl.TEXTURE0 + (unit < gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS ? unit : 0);

    let image = null;
    this.id = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.id);
    // set the repeat behaviour
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // set the sampling behaviour
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // set the texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.element);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
};
