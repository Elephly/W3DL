// jshint esversion: 6

/**
 * @todo Documentation.
 * @file
 * @requires {@link Math.js}
 * @requires {@link Vector.js}
 * @see W3DL.Matrix
 * @see W3DL.Matrix4
 */

/**
 * A class to represent a matrix of any dimension, supporting operations that
 * are functionally portable across all matrices.
 * @class
 * @abstract
 */
W3DL.Matrix = class Matrix {
  constructor() {
    if (new.target === W3DL.Matrix) {
      throw new TypeError("Cannot construct instances of abstract class: " + new.target.name);
    }
    if (this.matrixMultiply === undefined || typeof this.matrixMultiply !== "function") {
      throw new TypeError("Override required for method: matrixMultiply");
    }
    if (this.vectorMultiply === undefined || typeof this.vectorMultiply !== "function") {
      throw new TypeError("Override required for method: vectorMultiply");
    }

    /**
     * A two dimensional array of numbers holding the entries of the matrix.
     * @type {Number[][]}
     */
    this.entries = null;
  }

  /**
   * Returns a matrix with the value 0 in each entry.
   * @returns {W3DL.Matrix} The null matrix object.
   */
  static Null() {
    return new this();
  }

  /**
   * Returns a matrix with the value 0 in each entry and the value 1 in
   * entry[m][n], where m and n are the indices of the last row and column of
   * the matrix, respectively.
   * @returns {W3DL.Matrix} The zero matrix object.
   */
  static Zero() {
    var matrix = new this();
    var m = matrix.entries.length;
    var n = matrix.entries[m - 1].length;
    matrix.entries[m - 1][n - 1] = 1;
    return matrix;
  }

  /**
   * Returns the identity matrix, a matrix with the value 0 in each entry and
   * the value 1 in each entry[i][i] where i is an arbitrary index in the
   * matrix less than both the maximum number of columns and rows.
   * @returns {W3DL.Matrix} The identity matrix object.
   */
  static Identity() {
    var matrix = new this();
    for (var i = 0; i < matrix.entries.length; i++) {
      if (matrix.entries[i] === undefined || matrix.entries[i][i] === undefined) {
        break;
      }
      matrix.entries[i][i] = 1;
    }
    return matrix;
  }

  /**
   * Sets each entry of the matrix called on to 0.
   */
  nullify() {
    for (var i = 0; i < this.entries.length; i++) {
      for (var j = 0; j < this.entries[i].length; j++) {
        this.entries[i][j] = 0;
      }
    }
  }

  /**
   * Returns a transposed matrix copy of the matrix called on. A transposed
   * matrix is a matrix where for each pair of entries ([i][0-m], [0-n][i]),
   * the entries are swapped, resulting in a matrix flipped about the identity
   * matrix diagonal.
   * @returns {W3DL.Matrix} The transposed matrix object.
   */
  transposed() {
    var matrix = new this.constructor();
    for (var i = 0; i < this.entries.length; i++) {
      for (var j = 0; j < this.entries[i].length; j++) {
        if (matrix.entries[j][i] !== undefined) {
          matrix.entries[j][i] = this.entries[i][j];
        }
      }
    }
    return matrix;
  }

  /**
   * Returns a matrix resulting from the sum of the matrix called on and the
   * input matrix parameter.
   * @param {W3DL.Matrix} other The matrix object to be added to the matrix
   *        called on.
   * @returns {W3DL.Matrix} A matrix resulting from the sum of the matrix
   *          called on and the input matrix parameter.
   */
  add(other) {
    DEBUG && W3DL.Utils.ValidateArguments([this.constructor], arguments); // jshint ignore:line
    var matrix = new this.constructor();
    for (var i = 0; i < matrix.entries.length; i++) {
      for (var j = 0; j < matrix.entries[i].length; j++) {
        matrix.entries[i][j] = this.entries[i][j] + other.entries[i][j];
      }
    }
    return matrix;
  }

  /**
   * Returns a matrix resulting from the difference between the matrix called
   * on and the input matrix parameter.
   * @param {W3DL.Matrix} other The matrix object to be subtracted from the
   *        matrix called on.
   * @returns {W3DL.Matrix} A matrix resulting from the difference between the
   *          matrix called on and the input matrix parameter.
   */
  subtract(other) {
    DEBUG && W3DL.Utils.ValidateArguments([this.constructor], arguments); // jshint ignore:line
    var matrix = new this.constructor();
    for (var i = 0; i < matrix.entries.length; i++) {
      for (var j = 0; j < matrix.entries[i].length; j++) {
        matrix.entries[i][j] = this.entries[i][j] - other.entries[i][j];
      }
    }
    return matrix;
  }

  /**
   * Returns a matrix resulting from the multiplication between the matrix
   * called on and the input parameter, which may be a number, a matrix, or a
   * vector.
   * @param {Number|W3DL.Matrix|W3DL.Vector} multiplier The multiplier for the
   *        operation. This parameter is to be multiplied by the matrix called
   *        on.
   * @returns {W3DL.Matrix} A matrix resulting from the product of the matrix
   *          called on and the input multiplier parameter.
   */
  multiply(multiplier) {
    DEBUG && W3DL.Utils.ValidateArguments([[Number, W3DL.Matrix, W3DL.Vector]], arguments); // jshint ignore:line
    var product = null;
    if (new multiplier.constructor() instanceof Number) {
      product = new this.constructor();
      for (var i = 0; i < this.entries.length; i++) {
        for (var j = 0; j < this.entries[i].length; j++) {
          product.entries[i][j] = this.entries[i][j] * multiplier;
        }
      }
    } else if (multiplier instanceof W3DL.Matrix) {
      product = this.matrixMultiply(multiplier);
    } else if (multiplier instanceof W3DL.Vector) {
      product = this.vectorMultiply(multiplier);
    }
    return product;
  }

  /**
   * Constructs a string of the entries of the matrix called on for easy
   * reading.
   * @returns {String} A string of the entries of the matrix called on.
   */
  toString() {
    var str = "";
    this.entries.forEach(function(entry, index, array) {
      str = str + entry.toString();
      if (index < array.length - 1) {
        str = str + "\n";
      }
    });
    return str;
  }

  /**
   * Constructs a one dimensional array of the entries of the matrix called on.
   * @returns {Number[]} An array of entries of the matrix called on.
   */
  get toArray() {
    let arr = [];
    for (let y = 0; y < this.entries[0].length; y++) {
      for (let x = 0; x < this.entries.length; x++) {
        arr.push(this.entries[x][y]);
      }
    }
    return arr;
  }

  /**
   * Constructs a Float32Array of the entries of the matrix called on.
   * @returns {Float32Array} A Float32Array of entries of the matrix called on.
   */
  get toFloat32Array() {
    return new Float32Array(this.toArray);
  }
};

/**
 * @todo Documentation.
 * @class
 * @extends W3DL.Matrix
 */
W3DL.Matrix4 = class Matrix4 extends W3DL.Matrix {
  constructor(vector1 = new W3DL.Vector4D(0, 0, 0, 0), vector2 = new W3DL.Vector4D(0, 0, 0, 0), vector3 = new W3DL.Vector4D(0, 0, 0, 0), vector4 = new W3DL.Vector4D(0, 0, 0, 0)) {
    DEBUG && W3DL.Utils.ValidateArguments([W3DL.Vector4D, W3DL.Vector4D, W3DL.Vector4D, W3DL.Vector4D], arguments, 0); // jshint ignore:line
    super();
    this.entries = [vector1.toArray, vector2.toArray, vector3.toArray, vector4.toArray];
  }

  /*
  Creates a matrix like this:
         1       0       0       0
         0  cos(a) -sin(a)       0
         0  sin(a)  cos(a)       0
         0       0       0       1
  where a = angle.
  */
  static RotationAboutX(angle, isDegree = true) {
    DEBUG && W3DL.Utils.ValidateArguments([Number, Boolean], arguments, 1); // jshint ignore:line
    var a = (isDegree ? W3DL.Math.DegreeToRadian(angle) : angle);

    var matrix = W3DL.Matrix4.Identity();
    matrix.entries[1][1] = matrix.entries[2][2] = Math.cos(a);
    matrix.entries[1][2] = -(matrix.entries[2][1] = Math.sin(a));

    return matrix;
  }

  /*
  Creates a matrix like this:
    cos(a)       0  sin(a)       0
         0       1       0       0
   -sin(a)       0  cos(a)       0
         0       0       0       1
  where a = angle.
  */
  static RotationAboutY(angle, isDegree = true) {
    DEBUG && W3DL.Utils.ValidateArguments([Number, Boolean], arguments, 1); // jshint ignore:line
    var a = (isDegree ? W3DL.Math.DegreeToRadian(angle) : angle);

    var matrix = W3DL.Matrix4.Identity();
    matrix.entries[0][0] = matrix.entries[2][2] = Math.cos(a);
    matrix.entries[0][2] = -(matrix.entries[2][0] = -Math.sin(a));

    return matrix;
  }

  /*
  Creates a matrix like this:
    cos(a) -sin(a)       0       0
    sin(a)  cos(a)       0       0
         0       0       1       0
         0       0       0       1
  where a = angle.
  */
  static RotationAboutZ(angle, isDegree = true) {
    DEBUG && W3DL.Utils.ValidateArguments([Number, Boolean], arguments, 1); // jshint ignore:line
    var a = (isDegree ? W3DL.Math.DegreeToRadian(angle) : angle);

    var matrix = W3DL.Matrix4.Identity();
    matrix.entries[0][0] = matrix.entries[1][1] = Math.cos(a);
    matrix.entries[0][1] = -(matrix.entries[1][0] = Math.sin(a));

    return matrix;
  }

  static RollPitchYawRotation(roll, pitch, yaw, isDegree = true) {
    DEBUG && W3DL.Utils.ValidateArguments([Number, Number, Number, Boolean], arguments, 3); // jshint ignore:line
    return (this.RotationAboutY(yaw, isDegree).matrixMultiply(
      this.RotationAboutX(pitch, isDegree)).matrixMultiply(
        this.RotationAboutZ(roll, isDegree)));
  }

  static RotationAboutVectorAxis(vector, angle, isDegree = true) {
    DEBUG && W3DL.Utils.ValidateArguments([[W3DL.Vector3D, W3DL.Vector4D], Number, Boolean], arguments, 2); // jshint ignore:line
    var a = (isDegree ? W3DL.Math.DegreeToRadian(angle) : angle);
    var v = vector.normalized();

    var x = v.x;
    var y = v.y;
    var z = v.z;
    var c = Math.cos(a);
    var s = Math.sin(a);

    return new W3DL.Matrix4(new W3DL.Vector4D(c + (x * x * (1 - c)), (x * y * (1 - c)) - (z * s), (x * z * (1 - c)) + (y * s), 0),
      new W3DL.Vector4D((x * y * (1 - c)) + (z * s), c + (y * y * (1 - c)), (y * z * (1 - c)) - (x * s), 0),
      new W3DL.Vector4D((z * x * (1 - c)) - (y * s), (z * y * (1 - c)) + (x * s), c + (z * z * (1 - c)), 0),
      new W3DL.Vector4D());
  }

  static Scale(x, y, z) {
    DEBUG && W3DL.Utils.ValidateArguments([Number, Number, Number], arguments); // jshint ignore:line
    return new W3DL.Matrix4(new W3DL.Vector4D(x, 0, 0, 0), new W3DL.Vector4D(0, y, 0, 0), new W3DL.Vector4D(0, 0, z, 0), new W3DL.Vector4D());
  }

  static Translation(x, y, z) {
    DEBUG && W3DL.Utils.ValidateArguments([Number, Number, Number], arguments); // jshint ignore:line
    return new W3DL.Matrix4(new W3DL.Vector4D(1, 0, 0, x), new W3DL.Vector4D(0, 1, 0, y), new W3DL.Vector4D(0, 0, 1, z), new W3DL.Vector4D());
  }

  static TranslationFromVector(vector) {
    DEBUG && W3DL.Utils.ValidateArguments([[W3DL.Vector3D, W3DL.Vector4D]], arguments); // jshint ignore:line
    return W3DL.Matrix4.Translation(vector.x, vector.y, vector.z);
  }

  static Camera(position, lookAt, upVector) {
    DEBUG && W3DL.Utils.ValidateArguments([[W3DL.Vector3D, W3DL.Vector4D], [W3DL.Vector3D, W3DL.Vector4D], [W3DL.Vector3D, W3DL.Vector4D]], arguments); // jshint ignore:line
    var pos = (position instanceof W3DL.Vector3D ? position : new W3DL.Vector3D(position.x, position.y, position.z));
    var look = (lookAt instanceof W3DL.Vector3D ? lookAt : new W3DL.Vector3D(lookAt.x, lookAt.y, lookAt.z));
    var up = (upVector instanceof W3DL.Vector3D ? upVector : new W3DL.Vector3D(upVector.x, upVector.y, upVector.z));

    var n = pos.subtract(look).normalized;
    var u = up.normalized.cross(n).normalized;
    var v = n.cross(u);

    var matrix = new W3DL.Matrix4(new W3DL.Vector4D(u.x, u.y, u.z), new W3DL.Vector4D(v.x, v.y, v.z), new W3DL.Vector4D(n.x, n.y, n.z), new W3DL.Vector4D());
    matrix.entries[0][3] = u.negative().dot(pos);
    matrix.entries[1][3] = v.negative().dot(pos);
    matrix.entries[2][3] = n.negative().dot(pos);
    return matrix;
  }

  static FrustumProjetion(xMin, yMin, xMax, yMax, nearPlane, farPlane) {
    DEBUG && W3DL.Utils.ValidateArguments([Number, Number, Number, Number, Number, Number], arguments); // jshint ignore:line
    throw new Error("Unimplemented.");
  }

  static SymmetricPerspectiveProjection(fieldOfView, aspectRatio, nearPlane, farPlane) {
    DEBUG && W3DL.Utils.ValidateArguments([Number, Number, Number, Number], arguments); // jshint ignore:line
    var matrix = W3DL.Matrix4.Identity();
    var cot = 1 / Math.tan(W3DL.Math.DegreeToRadian(fieldOfView / 2));
    matrix.entries[0][0] = cot / aspectRatio;
    matrix.entries[1][1] = cot;
    matrix.entries[2][2] = (nearPlane + farPlane) / (nearPlane - farPlane);
    matrix.entries[2][3] = 2 * nearPlane * farPlane / (nearPlane - farPlane);
    matrix.entries[3][2] = -1;
    matrix.entries[3][3] = 0;
    return matrix;
  }

  matrixMultiply(other) {
    DEBUG && W3DL.Utils.ValidateArguments([W3DL.Matrix4], arguments); // jshint ignore:line
    var matrix = new W3DL.Matrix4();
    var otherMatrix = other.transposed();
    for (var i = 0; i < 4; i++) {
      var vector1 = new W3DL.Vector4D(this.entries[i][0], this.entries[i][1], this.entries[i][2], this.entries[i][3]);
      for (var j = 0; j < 4; j++) {
        var vector2 = new W3DL.Vector4D(otherMatrix.entries[j][0], otherMatrix.entries[j][1], otherMatrix.entries[j][2], otherMatrix.entries[j][3]);
        matrix.entries[i][j] = vector1.dot(vector2);
      }
    }
    return matrix;
  }

  vectorMultiply(vector) {
    DEBUG && W3DL.Utils.ValidateArguments([W3DL.Vector4D], arguments); // jshint ignore:line
    var rows = [
      new W3DL.Vector4D(this.entries[0][0], this.entries[0][1], this.entries[0][2], this.entries[0][3]),
      new W3DL.Vector4D(this.entries[1][0], this.entries[1][1], this.entries[1][2], this.entries[1][3]),
      new W3DL.Vector4D(this.entries[2][0], this.entries[2][1], this.entries[2][2], this.entries[2][3]),
      new W3DL.Vector4D(this.entries[3][0], this.entries[3][1], this.entries[3][2], this.entries[3][3]),
    ];
    return new W3DL.Vector4D(rows[0].dot(vector), rows[1].dot(vector), rows[2].dot(vector), rows[3].dot(vector));
  }
};
