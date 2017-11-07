// jshint esversion: 6

/**
 * @todo Documentation.
 * @file
 * @requires {@link IndexedVertexArray.js}
 * @requires {@link Material.js}
 * @requires {@link Object3D.js}
 * @requires {@link ShaderProgram.js}
 * @see W3DL.GraphicsObject3D
 */

/**
 * @todo Documentation.
 * @class
 * @extends W3DL.Object3D
 */
W3DL.GraphicsObject3D = class GraphicsObject3D extends W3DL.Object3D {
  constructor(vertexArray = null, position = new W3DL.Vector3D(), scale = new W3DL.Vector3D(1, 1, 1), rotation = new W3DL.Vector3D()) {
    DEBUG && W3DL.Utils.ValidateArguments([W3DL.IndexedVertexArray, W3DL.Vector3D, W3DL.Vector3D, W3DL.Vector3D], arguments, 0); // jshint ignore:line
    super(position, scale, rotation);
    this.vertices = vertexArray;
    this.shaderProgram = null;
    this.objectMaterial = null;
  }

  initialize(shader, material, recursive = false, vertexArray = null, recursiveVAO = false) {
    DEBUG && W3DL.Utils.ValidateArguments([W3DL.ShaderProgram, W3DL.Material, Boolean, W3DL.IndexedVertexArray, Boolean], arguments, 2); // jshint ignore:line
    if (recursive)
    {
      /* TODO: This is a hack and should be removed. */
      this.children.forEach(function(child) {
        if (recursiveVAO) {
          child.initialize(shader, material, recursive, vertexArray, recursiveVAO);
        } else {
          child.initialize(shader, material, recursive);
        }
      });
      this.shaderProgram = shader;
      this.objectMaterial = material;
      if (vertexArray) this.vertices = vertexArray;
    }
  }

  draw(gl, parentTransformation = W3DL.Matrix4.Identity()) {
    DEBUG && W3DL.Utils.ValidateArguments([WebGLRenderingContext, W3DL.Matrix4], arguments, 1); // jshint ignore:line
    super.draw(gl, parentTransformation);
    if (this.shaderProgram) {
      gl.useProgram(this.shaderProgram.id);

      this.shaderProgram.bindUniformMatrix(gl, "transform", this.transformation);
      this.shaderProgram.bindUniformVector(gl, "ambient", this.objectMaterial.ambient.toVector4D);
      this.shaderProgram.bindUniformVector(gl, "diffuse", this.objectMaterial.diffuse.toVector4D);
      this.shaderProgram.bindUniformVector(gl, "specular", this.objectMaterial.specular.toVector4D);
      this.shaderProgram.bindUniformFloat(gl, "shine", this.objectMaterial.shine);
      this.shaderProgram.bindUniformFloat(gl, "toon", this.objectMaterial.toon);

      if (this.objectMaterial.texture) {
        gl.activeTexture(this.objectMaterial.texture.unit);
        gl.bindTexture(gl.TEXTURE_2D, this.objectMaterial.texture.id);
        this.shaderProgram.bindUniformInt(gl, "textureSampler", this.objectMaterial.texture.unit);
        this.shaderProgram.bindUniformFloat(gl, "hasTexture", 1.0);
      } else {
        this.shaderProgram.bindUniformFloat(gl, "hasTexture", 0.0);
      }

      if (this.vertices && this.vertices.vertexArrayObject)
      {
        gl.bindVertexArray(this.vertices.vertexArrayObject);
        //gl.drawArraysInstancedARB(gl.TRIANGLES, 0, this.vertices.vertices.length, 1);
        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.vertices.length);
        gl.bindVertexArray(0);
      }
    }
  }

  setInheritedShader(shader) {
    DEBUG && W3DL.Utils.ValidateArguments([W3DL.ShaderProgram], arguments); // jshint ignore:line
    this.children.forEach(function(child) {
      child.setInheritedShader(shader);
    });
    this.shaderProgram = shader;
  }

  setInheritedMaterial(material) {
    DEBUG && W3DL.Utils.ValidateArguments([W3DL.Material], arguments); // jshint ignore:line
    this.children.forEach(function(child) {
      child.setInheritedMaterial(material);
    });
    this.objectMaterial = material;
  }
};
