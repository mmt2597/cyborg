(function() {
    'use strict';

    angular.module('myApp.SubTab_Directive', [])
        .directive('subContent', function() {
            return {
              restrict: 'E',
              templateUrl: 'src/views/components/SubTab.html'
            }
        });
})();
