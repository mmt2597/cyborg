(function() {
    'use strict';

    angular.module('myApp.Resizer_Directive', [])
        .directive('resizer', function($document) {
          return {
          link: function($scope, $element, $attrs) {
              $element.on('mousedown', function(event) {
                  event.preventDefault();
                  $document.on('mousemove', mousemove);
                  $document.on('mouseup', mouseup);
              });

              function mousemove(event) {
                  event.preventDefault();
                  if($attrs.resizer == 'vertical') {
                      // Handle vertical resizer
                      var x = event.pageX;

                      if($attrs.resizerMax && x > $attrs.resizerMax) { x = parseInt($attrs.resizerMax); }
                      if($attrs.resizerMax && x  < $attrs.resizerMin ) { x = 55; }
                      document.querySelector($attrs.resizerLeft.toString()).style.width = (x - 55) + 'px'
                  }
                  else {
                    // Handle horizontal resizer
                      var y = event.pageY;

                      if($attrs.resizerYMax && x > $attrs.resizerYMax) { y = parseInt($attrs.resizerYMax); }
                      if($attrs.resizerYMax && x  < $attrs.resizerYMin ) { y = 55; }
                      document.querySelector($attrs.resizerBottom.toString()).style.height = (-y + 555) + 'px';

                  }
              }

              function mouseup() {
                  $document.unbind('mousemove', mousemove);
                  $document.unbind('mouseup', mouseup);
              }
          }
          };
        });
})();
