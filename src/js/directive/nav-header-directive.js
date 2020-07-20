(function() {
    'use strict';

    angular.module('myApp.NavHeader_Directive', [])
      .directive('navHeader', function() {
          return {
            restrict: 'E',
            templateUrl: 'src/views/components/NavHeader.html'
          };
      });
})();
