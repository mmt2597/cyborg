(function() {
  'use strict';

  angular.module('myApp.Main_Controller', [])
    .controller('mainController', function($scope, TabService, $sce){

      //  $scope.open = true;

        $scope.isVisible = true;
        $scope.showHide = function () {
            $scope.isVisible = !$scope.isVisible;
        }

        $scope.showHideConsole = function () {
            $scope.isVisible = !$scope.isVisible;
        }

        $scope.tabLength = TabService.getTab();

        var count = 1;
        $scope.addNewTab = function () {
          TabService.addTab('untitled', count);
          count++;
        }

        $scope.closeTab = function (index) {
          TabService.removeTab(index);
          count--;
        }

    });
})();
