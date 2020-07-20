(function() {
    'use strict';

    angular.module('myApp.navbarController', [])
      .controller('navbarController', function($scope, TreeService) {

        var content, rack;
        var createContent = function(contentType, selectedContextMenu) {

            rack = (contentType == 'folder' ? 'Folder' : 'File');
            content = prompt("Enter New "+ rack + " Name");

            if(content == "" || content == null) { alert("Invalid Name"); }
            else {
                rack = (selectedContextMenu == 'newfile' ? {name: content, type: 'file'} : {name: content, type: 'folder', collapse: true, children: []});

                if(contentType == 'folder') { TreeService.add(rack); return; }
                TreeService.add(rack); return;
            }
        }

          $scope.nav.newFile = function() { createContent('file', 'newfile'); }
          $scope.nav.newFolder = function() { createContent('folder', 'newfolder'); }
      })
})();
