(function() {
    'use strict';

    angular.module('myApp.Ace_Controller', [])
      .controller('aceController', function($rootScope, $scope, $interval) {

          $scope.aceLoaded = function (_editor) {
                        var session  = _editor.getSession();
                        var renderer = _editor.renderer;
                         _editor.setReadOnly(false);
                        session.setMode("ace/mode/javascript");
                        session.setUndoManager(new ace.UndoManager());

                $interval (function () {

                    var selectedTheme         = $rootScope.theme,
                        selectedFontSize      = $rootScope.fontSize,
                        selectedTabSize       = $rootScope.tabSize,
                        selectedGutter        = $rootScope.gutter,
                        selectedFoldWidget    = $rootScope.foldWidget,
                        selectedPrintMargin   = $rootScope.printMargin,
                        selectedShowInvisible = $rootScope.showInvisible,
                        selectedWordWrap      = $rootScope.wordWrap,
                        selectedReadOnly      = $rootScope.readOnly;


                    _editor.setOptions({

                        // Editor Options
                        theme: 'ace/theme/' + (selectedTheme !== undefined ? selectedTheme : 'ambiance'),
                        mode: 'ace/mode/javascript',
                        readOnly: selectedReadOnly,

                        // Renederer Options
                        showGutter: selectedGutter, // Bool
                        showPrintMargin: selectedPrintMargin, // Bool
                        showInvisibles: selectedShowInvisible, // Bool
                        showFoldWidgets: selectedFoldWidget, // Bool
                        displayIndentGuides: true,

                        // Session Options
                        fontSize: selectedFontSize,
                        tabSize: selectedTabSize,
                        wrap: selectedWordWrap
                    });
              }, 1000);
          };
      });
})();
