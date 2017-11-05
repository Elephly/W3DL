// jshint esversion: 6

/**
 * This file defines the base class for a W3DL application.
 * @file
 * @requires {@link Utils.js}
 * @see W3DL.Application
 */

/**
 * A class to represent a W3DL application, containing the main update and draw
 * functions as well as handling the WebGL context directly. This class should
 * be derived from to form the main application class in any user application.
 * @class
 * @abstract
 */
W3DL.Application = class Application {
  /**
   * @param {HTMLCanvasElement} canvas The DOM canvas from which to take the
            WebGL context.
   */
  constructor(canvas) {
    DEBUG && W3DL.Utils.ValidateArguments([HTMLCanvasElement], arguments); // jshint ignore:line
    if (new.target === W3DL.Application) {
      throw new TypeError("Cannot construct instances of abstract class: " + new.target.name);
    }

    /**
     * The WebGL context retrieved from the input canvas object.
     * @type {WebGLRenderingContext}
     */
    this.gl = canvas.getContext("webgl");

    if (!this.gl) {
      console.warn("webgl not supported. Falling back on experimental-webgl.");
      this.gl = canvas.getContext("experimental-webgl");
    }

    if (!this.gl) {
      alert("Your browser does not support WebGL.");
      throw new Error("Browser does not support WebGL.");
    }

    /**
     * Flag indicating whether or not the initialize function has run yet
     * @type {Boolean}
     */
    this.isInitialized = false;

    /**
     * The time associated with the most recent call to the update function.
     * @type {DOMHighResTimeStamp}
     */
    this.lastUpdateTime = 0;

    this.dispatchInitialize();
    this.dispatchUpdate(true);
    this.dispatchDraw(true);
  }

  /**
   * Dispatches the application's initialize function if one exists.
   */
  dispatchInitialize() {
    setTimeout(function(app) {
      if (app.initialize) {
        app.initialize();
      }
      app.isInitialized = true;
    }, 0, this);
  }

  /**
   * Dispatches the application's update function if one exists, reregisters it
   * to be called after another 16 milliseconds, and updates the lastUpdateTime
   * variable.
   */
  dispatchUpdate(initialize) {
    DEBUG && W3DL.Utils.ValidateArguments([Boolean], arguments, 0); // jshint ignore:line
    let previousUpdateTime = this.lastUpdateTime;
    this.lastUpdateTime = performance.now();
    if (this.isInitialized && this.update && !initialize) {
      this.update(this.lastUpdateTime - previousUpdateTime);
    }
    setTimeout(function(app) {app.dispatchUpdate();}, 16, this);
  }

  /**
   * Dispatches the application's draw function if one exists and reregisters it
   * for the next animation frame.
   */
  dispatchDraw(initialize) {
    DEBUG && W3DL.Utils.ValidateArguments([Boolean], arguments, 0); // jshint ignore:line
    if (this.isInitialized && this.draw && !initialize) {
      this.draw();
    }
    requestAnimationFrame(function(app) {return function() {app.dispatchDraw();};}(this));
  }
};
