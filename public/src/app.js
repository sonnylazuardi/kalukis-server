/**
 * I'm alive
 */
define(function(require){

  var canvas = require('services/canvas'),
  
      brushPainter = require('painters/brushPainter'),
      freehandPainter = require('painters/freehandPainter'),
      textPainter = require('painters/textPainter'),
      imagePainter = require('painters/imagePainter'),
      shirtPainter = require('painters/shirtPainter'),

      paintWidgets = require('ui/paintWidget/paintWidgets'),
      canvasManipulationWidget = require('ui/canvasManipulationWidget/canvasManipulationWidget'),
      brushSizeWidget = require('ui/brushSizeWidget/brushSizeWidget'),
      brushDistanceWidget = require('ui/brushDistanceWidget/brushDistanceWidget'),
      brushSensitivityWidget = require('ui/brushSensitivityWidget/brushSensitivityWidget'),
      imageCanvasWidget = require('ui/imageCanvasWidget/imageCanvasWidget'),
      freehandWidget = require('ui/freehandWidget/freehandWidget'),
      testWidget = require('ui/testWidget/testWidget'),
      saveWidget = require('ui/saveWidget/saveWidget'),
      fbWidget = require('ui/FBWidget/FBWidget'),
      colorWidget = require('ui/colorWidget/colorWidget'),
      brushPanelWidget = require('ui/brushPanel/brushPanel'),
      //David widget 
      textWidget = require('ui/textWidget/textWidget'),

      shirtWidget = require('ui/shirtWidget/shirtWidget'),

      notification = require('ui/notification/notification'),
      keyHandler = require('ui/keyHandler/keyHandler'),

      brushManager = require('services/brushManager'),
      outlineManager = require('services/outlineManager'),

      cleaningService = require('services/canvasServices/cleaner'),

      brushList = require('data/brushList'),
      paintWidgetList = require('data/paintWidgetList'),
      canvasManipulationList = require('data/canvasManipulationList'), 
      _socket;

  function Application(socket){
  // function Application(){
    // application wide error handling
    requirejs.onError = function(err) {
      console.log(err);
    };
    _socket = socket;
  }

  Application.prototype.start = function() {
    /**
     * Any components that needs to hold a reference
     * to canvas instance and canvas element, should be
     * placed in this upper block, before the `lukis`
     * component is instantiated
     */
    freehandWidget.attachTo('.left-navigation');
    testWidget.attachTo('.left-navigation');
    paintWidgets.attachTo('.left-navigation');
    imageCanvasWidget.attachTo('.left-navigation');
    canvasManipulationWidget.attachTo('.left-navigation');
    saveWidget.attachTo('.left-navigation');
    fbWidget.attachTo('.left-navigation');
    //David widget
    textWidget.attachTo('.left-navigation');
    shirtWidget.attachTo('.left-navigation');

    brushSizeWidget.attachTo('#sizerange');
    brushDistanceWidget.attachTo('#brushdistance');
    brushSensitivityWidget.attachTo('#brushsensitivity');
    colorWidget.attachTo('#colorpicker');
    brushPanelWidget.attachTo('#brushes');
    notification.attachTo('#status-bar');
    
    keyHandler.attachTo(document);

    brushManager.attachTo(document, {_socket: _socket});
    outlineManager.attachTo(document);

    cleaningService.attachTo(document, {_socket: _socket});


    /**
     * The lukis component will publish the canvas instance
     * and its DOM element with an event name of `canvasConstructed`.
     */
    brushPainter.attachTo(document, {_socket: _socket});
    freehandPainter.attachTo(document, {_socket: _socket});
    textPainter.attachTo(document, {_socket: _socket});
    imagePainter.attachTo(document, {_socket: _socket});
    shirtPainter.attachTo(document, {_socket: _socket});

    /**
     * Components that hold data should be instantiated here.
     * It should publish an update on its data once its is
     * instantiated
     */
    brushList.attachTo(document);
    paintWidgetList.attachTo(document);
    canvasManipulationList.attachTo(document);

    /**
     * The canvas service is setup down here. After it has
     * been initialized, it'll publish canvas-ready event,
     * which also publishes canvas instance and it's ID
     */
    canvas.attachTo(document, {
      id: 'lukis',
      canvasAttrs: {
        backgroundColor: '#ECF0F1',
        interactive: true,
        selection: true  
      }
    });
  };

  return Application;
});