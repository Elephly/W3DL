// jshint esversion: 6

/**
 * @todo Documentation.
 * @file
 * @requires {@link Color.js}
 * @requires {@link Texture2D.js}
 * @see W3DL.Material
 */

/**
 * @todo Documentation.
 * @class
 */
W3DL.Material = class Material {
  constructor(texture = null, ambient = new ColorRGBA(), diffuse = new ColorRGBA(),
              specular = new ColorRGBA(), shine = 1, toon = false) {
    DEBUG && W3DL.Utils.ValidateArguments([W3DL.Texture2D, W3DL.ColorRGBA, W3DL.ColorRGBA, W3DL.ColorRGBA, Number, Boolean], arguments, 0); // jshint ignore:line
    this.texture = texture;
    this.ambient = ambient;
    this.diffuse = diffuse;
    this.specular = specular;
    this.shine = shine;
    this.toon = toon;
  }
};
