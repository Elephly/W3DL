// jshint esversion: 6

/**
 * This file defines a namespace for common math functions to be used globally
 * from both within and outside of the W3DL API.
 * @file
 * @requires {@link Utils.js}
 * @see W3DL.Math
 */

/**
 * Common math functions to be used globally.
 * @namespace
 */
W3DL.Math = {
  /**
   * Converts an angle represented in degrees to an angle represented in
   * radians.
   * @param {Number} a An angle represented in degrees.
   * @returns {Number} An angle represented in radians.
   */
  DegreeToRadian: function(a) {
    DEBUG && W3DL.Utils.ValidateArguments([Number], arguments); // jshint ignore:line
    return (a * Math.PI / 180.0);
  },

  /**
   * Converts an angle represented in radians to an angle represented in
   * degrees.
   * @param {Number} a An angle represented in radians.
   * @returns {Number} An angle represented in degrees.
   */
  RadianToDegree: function(a) {
    DEBUG && W3DL.Utils.ValidateArguments([Number], arguments); // jshint ignore:line
    return (a * 180.0 / Math.PI);
  },

  /**
   * Finds the linear interpolation between two values <tt>a</tt> and <tt>b</tt>
   * at the interpolation ratio <tt>t</tt>.
   * @param {Number} a The value interpolating from.
   * @param {Number} b The value interpolating to.
   * @param {Number} t The interpolation ratio from <tt>a</tt> to <tt>b</tt>.
   * @returns {Number} The linear interpolation between <tt>a</tt> and
              <tt>b</tt> at the interpolation ratio <tt>t</tt>.
   */
  Lerp: function(a, b, t) {
    DEBUG && W3DL.Utils.ValidateArguments([Number, Number, Number], arguments); // jshint ignore:line
    if (t > 1 || t < 0)
    {
      t -= Math.floor(t);
    }
    return ((1 - t) * a) + (t * b);
  }
};
