(function() {
    'use strict';

    angular.module('myApp.Tab_Controller', [])
      .controller('TabController', function () {
          this.tab = 1;

          this.setTab = function (tabId) {
            this.tab = tabId;
          };

          this.isSet = function(tabId) {
            return this.tab === tabId;
          };
      });
})();
