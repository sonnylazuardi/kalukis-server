/**
 * Draw a rectangular outline as the user is drawing on
 * top of the canvas
 */
define(function(require) {

  var asOutlineShape = require('./asOutlineShape');

  function getBoundaryPoint(point, xLength, yHeight, distance) {
    var x = point.x,
        y = point.y,
        points = [];
    // top
    for (var iter = x + distance; iter < xLength; iter += distance) {
      points.push({x: iter, y: y});
    }

    // get left
    for (iter = y; iter < yHeight; iter += distance) {
      points.push({x: x, y: iter});
    }

    // get bottom
    for (iter = x; iter < xLength; iter += distance) {
      points.push({x: iter, y: yHeight});
    }

    // get right
    for (iter = yHeight; iter > y; iter -= distance) {
      points.push({x: xLength, y: iter});
    }

    return points;
  }

  function RectOutline(canvas, cfg) {
    this.initialize(canvas, cfg);
  }

  RectOutline.prototype.getOutlinePoints = function(pointDistance) {
    var xLength = this.outline.x + this.outline.width,
        yHeight = this.outline.y + this.outline.height,
        x = this.outline.x,
        y = this.outline.y;
    
    var points = getBoundaryPoint({x: x, y: y}, xLength, yHeight, pointDistance);
    // this is a need hack (at the moment), so that we can draw
    // a shape for pencil brush
    // please see `pencil.js` `drawAtPoints` method
    points[0].type = 'Rect';
    points[0].outline = this.outline;

    return points;
  };

  RectOutline.prototype.onMouseDown = function(e) {
    this.canvas.selection = false;
    var point = this.canvas.getPointer(e.e);

    this.outline = {
      x: point.x,
      y: point.y,
      width: 1,
      height: 1
    };

    this.isDrawing = true;
    this.startPoint = this.outerPoint = point;

    return this;
  };

  RectOutline.prototype.onMouseMove = function(e) {
    if (this.isDrawing) {
      var point = this.canvas.getPointer(e.e);

      this.updateOutline(point);
    }

    return this;
  };

  // TODO can we improve this?
  RectOutline.prototype.updateOutline = function(point) {
    this.outline.height = point.y - this.outline.y;
    this.outline.width = point.x - this.outline.x;

    this.outerPoint = point;

    this.renderOutline();

    return this;
  };

  RectOutline.prototype.normalizeOutlinePosition = function() {
    if (this.outline.width < 0) {
      this.outline.x = this.outline.x + this.outline.width;
      this.outline.width *= -1;
    }

    if (this.outline.height < 0) {
      this.outline.y = this.outline.y + this.outline.height;
      this.outline.height *= -1;
    }
  };

  RectOutline.prototype.renderOutline = function() {
    var ctx = this.canvas.contextTop;

    this.canvas.clearContext(ctx);
    ctx.save();

    ctx.lineWidth = 1;
    ctx.strokeStyle = this.cfg.strokeColor;
    ctx.strokeRect(this.outline.x, this.outline.y, this.outline.width, this.outline.height);

    ctx.restore();

    return this;
  };

  asOutlineShape.call(RectOutline.prototype);

  return RectOutline;
  
});