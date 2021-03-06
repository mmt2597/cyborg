/*(function() {
    'use strict';

    angular.module('myApp.Contextmenu_Directive', [])
      .directive('contextmenu', function ($parse, $window) {
          var menu = document.getElementById('menu');

          return function (scope, element, attrs) {
              var fn = $parse(attrs.rightClick);  
              element.on('contextmenu', function (event) {

                console.log(event.target);
                  menu.style.display = "block";
                  menu.style.left = (event.pageX - 55)+ 'px';
                  menu.style.top = (event.pageY - 60) + 'px';

                  scope.$apply(function() {
                      event.preventDefault();
                      fn(scope, {$event: event});
                  });
              });

              angular.element($window).on('click', function() {
                  menu.style.display = "";
                  menu.style.left = "";
                  menu.style.top = "";
              });
          }
      });
})();*/