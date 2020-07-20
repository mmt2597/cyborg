(function() {
   'use strict';

   angular.module('myApp.Preference_Controller', [])
      .controller('PreferenceController',  function ($rootScope, $scope, $http) {
         angular.extend($scope, {

         })
            // Get all Themes JSON
            $http.get('data/ace_theme.json').then(function(response) {
                  $scope.listOfTheme = response.data;
            });
            // Theme
            $scope.watchChangeTheme = function() {
               $rootScope.theme = $scope.config.name;
            };
            // Font
            $scope.watchChangeFont = function() {
               var x = event.pageX;
               console.log(x);
               $rootScope.fontSize = $scope.config.fontSize
            };
            // Tab Size
            $scope.watchChangeTabSize = function() {
               $rootScope.tabSize = $scope.config.tabSize;
            }
            // Gutter
            $scope.watchChangeGutter = function() {
               $rootScope.gutter = $scope.config.gutter;
            }
            // Fold Widget
            $scope.watchChangeFoldWidget = function() {
               $rootScope.foldWidget = $scope.config.foldWidget;
            }

            $scope.watchChangePrintMargin = function() {
               $rootScope.printMargin = $scope.config.printMargin;
            }

            $scope.watchChangeShowInvisible = function() {
               $rootScope.showInvisible = $scope.config.showInvisible;
            }

            $scope.watchChangeWordWrap = function() {
               $rootScope.wordWrap = $scope.config.wordWrap;
            }

            $scope.watchChangeReadOnly = function() {
               $rootScope.readOnly = $scope.config.readOnly;
            }
      });
})();
