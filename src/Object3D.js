// jshint esversion: 6

/**
 * This file defines a class for a base 3D object. A 3D object is represented by
 * its transformation values such as position, scale, and rotation. A 3D object
 * also contains a list of children objects and implements basic update and draw
 * methods to be invoked each update and draw frame.
 * @file
 * @requires {@link Matrix.js}
 * @see W3DL.Object3D
 */

/**
 * @todo Documentation.
 * @class
 */
W3DL.Object3D = class Object3D {
  constructor(initialPosition = new W3DL.Vector3D(), initialScale = new W3DL.Vector3D(1, 1, 1), initialRotation = new W3DL.Vector3D()) {
    DEBUG && W3DL.Utils.ValidateArguments([W3DL.Vector3D, W3DL.Vector3D, W3DL.Vector3D], arguments, 0); // jshint ignore:line
    this.position = initialPosition;
    this.scale = initialScale;
    this.rotation = initialRotation;
    this.transformation = W3DL.Matrix4.Identity();
    this.children = [];
  }

  update(deltaTime) {
    DEBUG && W3DL.Utils.ValidateArguments([Number], arguments); // jshint ignore:line
    this.children.forEach(function(child) {
      child.update(deltaTime);
    });
  }

  draw(parentTransformation = W3DL.Matrix4.Identity()) {
    DEBUG && W3DL.Utils.ValidateArguments([W3DL.Matrix4], arguments, 0); // jshint ignore:line
    // Scale is not passed onto children
    this.transformation = parentTransformation.multiply(W3DL.Matrix4.Translation(this.position.x, this.position.y, this.position.z)).
      multiply(W3DL.Matrix4.RollPitchYawRotation(this.rotation.z, this.rotation.x, this.rotation.y));

      this.children.forEach(function(child) {
        child.draw(this.transformation);
      });

    this.transformation = this.transformation.multiply(W3DL.Matrix4.Scale(this.scale.x, this.scale.y, this.scale.z));
  }

  rotate(x, y, z, isDegree = true) {
    DEBUG && W3DL.Utils.ValidateArguments([Number, Number, Number, Boolean], arguments, 3); // jshint ignore:line
    this.rotation.x += (!isDegree ? W3DL.Math.RadianToDegree(x) : x);
    this.rotation.y += (!isDegree ? W3DL.Math.RadianToDegree(y) : y);
    this.rotation.z += (!isDegree ? W3DL.Math.RadianToDegree(z) : z);
  }

  scale(x, y, z, recursive = false) {
    DEBUG && W3DL.Utils.ValidateArguments([Number, Number, Number, Boolean], arguments, 3); // jshint ignore:line
    if (recursive) {
      this.children.forEach(function(child) {
        child.scale(x, y, z, recursive);
      });
    }
    this.scale.x *= x;
    this.scale.y *= y;
    this.scale.z *= z;
  }

  translate(x, y, z) {
    DEBUG && W3DL.Utils.ValidateArguments([Number, Number, Number], arguments); // jshint ignore:line
    this.position.x += x;
    this.position.y += y;
    this.position.z += z;
  }

  pitch(angle, isDegree = true) {
    DEBUG && W3DL.Utils.ValidateArguments([Number, Boolean], arguments, 1); // jshint ignore:line
    this.rotation.x += (!isDegree ? W3DL.Math.RadianToDegree(angle) : angle);
  }

  yaw(angle, isDegree = true) {
    DEBUG && W3DL.Utils.ValidateArguments([Number, Boolean], arguments, 1); // jshint ignore:line
    this.rotation.y += (!isDegree ? W3DL.Math.RadianToDegree(angle) : angle);
  }

  roll(angle, isDegree = true) {
    DEBUG && W3DL.Utils.ValidateArguments([Number, Boolean], arguments, 1); // jshint ignore:line
    this.rotation.z += (!isDegree ? W3DL.Math.RadianToDegree(angle) : angle);
  }

  addChild(child) {
    DEBUG && W3DL.Utils.ValidateArguments([W3DL.Object3D], arguments); // jshint ignore:line
    this.children.push(child);
  }

  removeChild(child) {
    DEBUG && W3DL.Utils.ValidateArguments([W3DL.Object3D], arguments); // jshint ignore:line
    var index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
    }
  }
};
