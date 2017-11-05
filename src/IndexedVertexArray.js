// jshint esversion: 6

/**
 * @todo Documentation.
 * @file
 * @requires {@link Vertex.js}
 * @see W3DL.IndexedVertexArray
 */

/**
 * @todo Documentation.
 * @class
 */
W3DL.IndexedVertexArray = class IndexedVertexArray {
  constructor(vertexArray = []) {
    DEBUG && W3DL.Utils.ValidateArguments([Array], arguments, 0); // jshint ignore:line
    this.vertices = vertexArray;
    this.vertexArrayObject = 0;
    this.vertexBufferObject = 0;
  }

  initialize(gl) {
    DEBUG && W3DL.Utils.ValidateArguments([WebGLRenderingContext], arguments); // jshint ignore:line
    if (this.vertices && this.vertices.length > 0) {
      let v = this.vertices[0];

      let posSize = v.position.toArray.length;
      let colSize = v.color.toArray.length;
      let texSize = v.texture.toArray.length;
      let norSize = v.normal.toArray.length;
      let vecSize = posSize + colSize + texSize + norSize;

      let offsets = {};
      let offset = 0;
      for (let k in v) {
        offsets[k] = offset;
        offset += v[k].toArray.length;
      }

      // The following 4 values are hardcoded as they should be consistent along
      // all shaders
      let posInd = 0; // gl.getAttribLocation(shaderProgram.id, "vtxPosition");
      let norInd = 1; // gl.getAttribLocation(shaderProgram.id, "vtxNormal");
      let colInd = 2; // gl.getAttribLocation(shaderProgram.id, "vtxColor");
      let texInd = 3; // gl.getAttribLocation(shaderProgram.id, "vtxTextureCoord");

      this.vertexArrayObject = gl.genVertexArrays();
      gl.bindVertexArray(vertexArrayObject);

      this.vertexBufferObject = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
      gl.bufferData(gl.ARRAY_BUFFER, this.vertices.toFloat32Array, gl.STATIC_DRAW);

      gl.vertexAttribPointer(posInd, posSize, gl.FLOAT, gl.FALSE, vecSize * Float32Array.BYTES_PER_ELEMENT, offsets.position * Float32Array.BYTES_PER_ELEMENT);
      gl.enableVertexAttribArray(positionLoc);
      //gl.vertexAttribDivisor(posInd, 0);

      gl.vertexAttribPointer(norInd, norSize, gl.FLOAT, gl.FALSE, vecSize * Float32Array.BYTES_PER_ELEMENT, offsets.normal * Float32Array.BYTES_PER_ELEMENT);
      gl.enableVertexAttribArray(norInd);
      //gl.vertexAttribDivisor(norInd, 0);

      gl.vertexAttribPointer(colInd, colSize, gl.FLOAT, gl.FALSE, vecSize * Float32Array.BYTES_PER_ELEMENT, offsets.color * Float32Array.BYTES_PER_ELEMENT);
      gl.enableVertexAttribArray(colInd);
      //gl.vertexAttribDivisor(colInd, 0);

      gl.vertexAttribPointer(texInd, texSize, gl.FLOAT, gl.FALSE, vecSize * Float32Array.BYTES_PER_ELEMENT, offsets.texture * Float32Array.BYTES_PER_ELEMENT);
      gl.enableVertexAttribArray(texInd);
      //gl.vertexAttribDivisor(texInd, 0);

      gl.enableVertexAttribArray(0);
      gl.bindVertexArray(0);
    }
  }
};
