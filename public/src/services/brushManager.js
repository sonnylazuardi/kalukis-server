/**
 * I know how to manage the lifecycle of a brush. I also provide these
 * brushes when someone request them.
 */
define(function(require) {

  var defineComponent = require('flight/lib/component');

  return defineComponent(brushManager);
  var self;
  function brushManager() {

    this.defaultAttrs({
      /**
       * The canvas element ID
       * @type {String}
       */
      canvasId: undefined,

      /**
       * Canvas instance
       * @type {Object}
       */
      canvas: undefined,

      /**
       * Brushes that have been initted
       * @type {Object}
       */
      brushes: {},

      _socket: undefined,

      /**
       * Global brush properties
       * @type {Object}
       */
      prop: {
        /**
         * The fill color of a brush
         * @type {String}
         */
        fillColor: '#000000',

        /**
         * The stroke color of a brush
         * @type {String}
         */
        strokeColor: '#000000',

        /**
         * The width of a brush
         * @type {Number}
         */
        width: 10
      }
    });

    this.after('initialize', function() {
      this.attachEventListeners();
      self = this;
      this.attr._socket.on('brushProperties', function(data) {
        console.log("brush properties");
        self.brushProperties(data);
      });
    });

    /**
     * The events to listen to
     * @return {[type]} [description]
     */
    this.attachEventListeners = function() {
      this.on('canvas-ready', function(e, data){
        this.setCanvas(data.id, data.canvas);
      }.bind(this));

      this.on('change-brushProperty', function(e, data) {
        console.log("brush properties");
        this.brushProperties(data);
        self.attr._socket.emit('brushProperties', data);
      }.bind(this));

      this.on('request-brushProperties', function() {
        this.publishBrushProperties();
      }.bind(this));

      this.on('request-brush', function(e, data) {
        this.requestBrush(data.id);
      }.bind(this));
      
    };

    this.brushProperties = function(data) {
      var key = Object.keys(data)[0],
          value = data[key];
      this.updateBrushProperty(key, value);
    }
    /**
     * Setup canvas attributes
     * @param {String} id     Canvas element id
     * @param {Object} canvas Canvas Object
     */
    this.setCanvas = function(id, canvas) {
      this.attr.canvas = canvas;
      this.attr.canvasId = id;
    };

    /**
     * Publish the recorded brush properties
     */
    this.publishBrushProperties = function() {
      this.trigger('brushProperties-served', {
        properties: this.attr.prop
      });
    };

    /**
     * Update brush properties.
     * 
     * @param  {Object} data Event Data
     */
    this.updateBrushProperty = function(key, value) {
      if (!key) {
        return;
      }

      var oldValue = this.attr.prop[key];

      this.attr.prop[key] = value;

      this.trigger('brushProperty-updated', {
        key: key,
        oldValue: oldValue,
        newValue: this.attr.prop[key]
      });
    };

    /**
     * Set the properties of an active brush
     */
    this.setBrushProperties = function(brush) {
      Object.keys(this.attr.prop || {}).forEach(function(key) {
        brush.set(key, this.attr.prop[key]);
      }, this);
    };

    /**
     * Publish the requested brush
     * @param  {String} id Brush ID
     */
    this.requestBrush = function(id) {
      // the brush has been loaded before
      if (this.attr.brushes.hasOwnProperty(id)) {
        var brush = this.attr.brushes[id];
        // update the brush properties
        this.setBrushProperties(brush);

        this.publishRequestedBrush(brush);
      } else {
        // the brush has not been loaded before
        // TODO what if the brush requested cannot be found?
        require(['brushes/' + id], function(BrushProto) {
          var brush = new BrushProto(this.attr.canvas, this.attr.prop);
          // remember this brush
          this.attr.brushes[id] = brush;
          
          this.publishRequestedBrush(brush);
        }.bind(this));
      }
    };

    /**
     * Publish the requested brush
     * @param  {Object} brush The brush to publish
     */
    this.publishRequestedBrush = function(brush) {
      this.trigger('brush-served', {
        brush: brush
      });
    };
  }

});