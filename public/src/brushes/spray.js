define(function(require) {

  var fabric = require('fabric'),
      getRandomInt = fabric.util.getRandomInt,
      asBrush = require('./asBrush');

  function createSprayChunk( pointer, width, brush ) {
    var sprayChunkPoints = [ ];

    var x, y, radius = width / 2, _width;

    for (var i = 0; i < brush.density; i++) {

      x = fabric.util.getRandomInt(pointer.x - radius, pointer.x + radius);
      y = fabric.util.getRandomInt(pointer.y - radius, pointer.y + radius);

      if (brush.dotWidthVariance) {
        _width = fabric.util.getRandomInt(
          // bottom clamp width to 1
          Math.max(1, brush.dotWidth - brush.dotWidthVariance),
          brush.dotWidth + brush.dotWidthVariance);
      }
      else {
        _width = brush.dotWidth;
      }

      sprayChunkPoints.push({ x: x, y: y, width: _width });
    }

    return sprayChunkPoints;
  }

  function SprayBrush(canvas, cfg) {
    this.initialize(canvas, cfg);
  }

  SprayBrush.prototype.initBrush = function() {
    this.brush = new fabric.SprayBrush(this.canvas);
    this.brush.density = 10;
  };

  SprayBrush.prototype.drawOne = function( chunk ) {
    return new fabric.Rect({
      width: chunk.width,
      height: chunk.width,
      left: chunk.x + 1,
      top: chunk.y + 1,
      fill: this.cfg.fillColor
    });
  };

  SprayBrush.prototype.drawAtPoints = function( points ) {
    var originalRenderOnAddition = this.canvas.renderOnAddition;
    this.canvas.renderOnAddition = false;

    var sprays = [],
        point,
        sprayChunk;

    for (var i = 0, len = points.length; i < len; i++) {
      sprayChunk = createSprayChunk(points[i], this.cfg.width, this.brush);

      for (var j = 0, jlen = sprayChunk.length; j < jlen; j++) {
        sprays.push(this.drawOne(sprayChunk[j]));
      }
    }

    if (this.optimizeOverlapping) {
      sprays = this._getOptimizedRects(sprays);
    }

    this.processObjects(sprays);

    this.canvas.clearContext(this.canvas.contextTop);
    this.canvas.renderOnAddition = originalRenderOnAddition;
    this.canvas.renderAll();
  };

  asBrush.call(SprayBrush.prototype);

  return SprayBrush;

});