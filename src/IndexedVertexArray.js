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
  constructor(vertexArray = null, numVertices = 0) {
    W3DL.Utils.ValidateArguments([Array, Number], arguments, 0);
    this.vertices = vertexArray;
    this.vertexCount = numVertices;
    this.vao = 0;
    this.vbo = 0;
  }

  initialize(vertexArray = null, numVertices = 0) {
    W3DL.Utils.ValidateArguments([W3DL.Vertex, Number], arguments, 0);
  }
};
