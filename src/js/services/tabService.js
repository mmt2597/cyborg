(function() {
    'use strict';

    angular.module('myApp.Tab_Service', [])
      .factory('TabService', function() {
          var tabItem = [];
          var svc = {};

          svc.addTab = function (item, idNo) {
            tabItem.push({name: item, id: idNo});
            console.log("ADDED");
          }

          svc.removeTab = function (i) {
            tabItem.splice(i, 1);
          }

          svc.getTab = function () {
            return tabItem;
          }

          return svc;
      });
})();
