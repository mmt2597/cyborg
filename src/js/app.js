(function() {
  angular.module('myApp', [
        'ui.ace',
        'ui.bootstrap',
        'ui.bootstrap.contextMenu',
        'myApp.Tree_Service',
        'myApp.Tab_Service',
        'myApp.SubTab_Directive',
        //'myApp.TreeView_Directive',
        'myApp.Resizer_Directive',
        'myApp.NavHeader_Directive',
        'myApp.Main_Controller',
        'myApp.navbarController',
        'myApp.TreeView_Controller',
        'myApp.Tab_Controller',
        'myApp.Ace_Controller',
        'myApp.Preference_Controller']);
})();
