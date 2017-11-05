#!/usr/bin/node

// jshint esversion: 6

// Required node modules
var fs = require("fs-extra");
var jsdoc = require("jsdoc-api");
var os = require("os");
var path = require("path");
var uglifyjs = require("uglify-es");

// Variables
var args = process.argv.slice(2);
var delim = (os.type() === "Windows_NT" ? "\\" : "/");

var projRootDir = process.cwd();
var projBinDir = path.join(projRootDir, "bin");
var projDemoDir = path.join(projRootDir, "demo");
var projDocDir = path.join(projRootDir, "docs");
var projShaderDir = path.join(projRootDir, "shaders");
var projSrcDir = path.join(projRootDir, "src");
var projTmpDir = path.join(projRootDir, ".tmp");
var outFileMin = "w3dl.min.js";
var outFileMap = "w3dl.min.js.map";

var buildTypes = [];
var allSelected = false;
var clean = false;
var defineStrings = {
  debug: "const DEBUG = false\n",
  nodeModule: "const NODE_MODULE = false\n",
  toString: function() {
    return this.debug + this.nodeModule;
  }
};

var availableBuildTypes = {
  array: ["w3dl", "docs"],
  get w3dl() { return this.array[0]; },
  get docs() { return this.array[1]; }
};

// Parse arguments
args.forEach(function(arg) {
  var a = arg.toLowerCase();
  if (a === "all") {
    buildTypes = [];
    buildTypes = buildTypes.concat(availableBuildTypes.array);
    allSelected = true;
  } else if (a === "clean") {
    clean = true;
  } else if (a === "debug") {
    defineStrings.debug = "const DEBUG = true\n";
  } else if (a === "module") {
    defineStrings.nodeModule = "const NODE_MODULE = true\n";
  } else {
    if (availableBuildTypes.array.indexOf(a) === -1) {
      console.error("Invalid argument: " + a + ".");
    } else if (!allSelected) {
      if (buildTypes.indexOf(a) === -1) {
        buildTypes.push(a);
      }
    }
  }
});

if (buildTypes.length < 1) {
  buildTypes.push(availableBuildTypes.w3dl);
}

if (!clean && buildTypes.includes(availableBuildTypes.docs)) {
  buildTypes = buildTypes.filter(function(type) {
    return type !== availableBuildTypes.w3dl;
  });
  buildTypes = [availableBuildTypes.w3dl].concat(buildTypes);
}

try {
  fs.removeSync(projTmpDir);
} catch (err) {
  console.error("Failed to remove temporary build directory. " + err);
}

buildTypes.forEach(function(buildType) {
  var currentBuild = buildType.toUpperCase();
  console.log((clean ? "Cleaning " : "Building ") + currentBuild + "...");
  fs.mkdirSync(projTmpDir);
  if (buildType === availableBuildTypes.w3dl) {
    if (clean) {
      try {
        fs.removeSync(projBinDir);
      } catch (err) {
        console.error("Failed to remove bin directory. " + err);
      }
    } else {
      try {
        fs.statSync(projBinDir);
      } catch (err) {
        fs.mkdirSync("bin");
      }
      try {
        fs.writeFileSync(path.join(projTmpDir, "Defines.js"), defineStrings.toString());
      } catch (err) {
        console.error("Failed to write to temporary Defines file. " + err);
      }
      var srcFiles = [];
      srcFiles.push(path.join(projSrcDir, "W3DL.js")); // MUST BE FIRST
      srcFiles.push(path.join(projTmpDir, "Defines.js"));
      srcFiles.push(path.join(projShaderDir, "color-fragment.js"));
      srcFiles.push(path.join(projShaderDir, "color-vertex.js"));
      srcFiles.push(path.join(projShaderDir, "gouraud-fragment.js"));
      srcFiles.push(path.join(projShaderDir, "gouraud-vertex.js"));
      srcFiles.push(path.join(projShaderDir, "phong-fragment.js"));
      srcFiles.push(path.join(projShaderDir, "phong-vertex.js"));
      srcFiles.push(path.join(projShaderDir, "texture-fragment.js"));
      srcFiles.push(path.join(projShaderDir, "texture-vertex.js"));
      srcFiles.push(path.join(projShaderDir, "white-vertex.js"));
      srcFiles.push(path.join(projSrcDir, "Utils.js"));
      srcFiles.push(path.join(projSrcDir, "Application.js"));
      srcFiles.push(path.join(projSrcDir, "Math.js"));
      srcFiles.push(path.join(projSrcDir, "Color.js"));
      srcFiles.push(path.join(projSrcDir, "Vector.js"));
      srcFiles.push(path.join(projSrcDir, "Matrix.js"));
      srcFiles.push(path.join(projSrcDir, "Vertex.js"));
      srcFiles.push(path.join(projSrcDir, "IndexedVertexArray.js"));
      srcFiles.push(path.join(projSrcDir, "ShaderProgram.js"));
      srcFiles.push(path.join(projSrcDir, "Texture2D.js"));
      srcFiles.push(path.join(projSrcDir, "Material.js"));
      srcFiles.push(path.join(projSrcDir, "Object3D.js"));
      srcFiles.push(path.join(projSrcDir, "GraphicsObject3D.js"));
      srcFiles.push(path.join(projSrcDir, "W3DLModule.js")); // MUST BE LAST
      var code = {};
      for (var i = 0; i < srcFiles.length; i++) {
        code[srcFiles[i]] = fs.readFileSync(srcFiles[i], "utf8");
      }
      var uglifyResult = uglifyjs.minify(code,
        {
          sourceMap: {
            filename: "w3dl.min.js",
            root: "file:///",
            url: "w3dl.min.js.map",
          },
          compress: {
            dead_code: true,
            unused: true
          },
          ecma: 6,
          warnings: true
        }
      );
      try {
        fs.writeFileSync(path.join(projBinDir, outFileMin), uglifyResult.code);
      } catch (err) {
        console.error("Failed to save " + outFileMin + ". " + err);
      }
      try {
        fs.writeFileSync(path.join(projBinDir, outFileMap), uglifyResult.map);
      } catch (err) {
        console.error("Failed to save " + outFileMap + ". " + err);
      }
    }
  } else if (buildType === availableBuildTypes.docs) {
    if (clean) {
      try {
        fs.removeSync(projDocDir);
      } catch (err) {
        console.error("Failed to remove docs directory. " + err);
      }
    } else {
      try {
        jsdoc.renderSync(
          {
            destination: projDocDir,
            files: projSrcDir,
            recurse: true,
            readme: path.join(projRootDir, "DOC_README.md")
          }
        );
      } catch (err) {
        console.error("Failed to build docs. " + err);
      }
      try {
        fs.readdirSync(projDemoDir).forEach(function(file) {
          if (file !== "." && file !== "..") {
            fs.copySync(path.join(projDemoDir, file), path.join(projDocDir, file));
          }
        });
        fs.readdirSync(projBinDir).forEach(function(file) {
          if (file !== "." && file !== "..") {
            fs.copySync(path.join(projBinDir, file), path.join(projDocDir, "scripts", file));
          }
        });
      } catch(err) {
        console.error("Failed to copy demo files to docs directory. " + err);
      }
    }
  } else {
    console.error("Invalid build target attempt: " + buildType + ".");
    return;
  }
  try {
    fs.removeSync(projTmpDir);
  } catch (err) {
    console.error("Failed to remove temporary build directory. " + err);
  }
});
