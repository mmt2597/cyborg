(function() {
    'use strict';

    angular.module('myApp.TreeView_Controller', [])
      .controller('treeViewController', function($scope, TreeService) {

          console.log("AX ", TreeService.getData());
        $scope.treeDirectories = TreeService.getData();


        var content, item;
        var createContent = function(accu, contentType, selectedContextMenu) {
            var holder = (contentType == 'folder' ? 'Folder' : 'File');

            content = prompt("Enter New "+ holder + " Name");
            if(content == "" || content == null) {
              alert("Invalid Name");
            }
            else {
                var holder = (selectedContextMenu == 'newfile' ? {name: content, type: 'file'} : {name: content, type: 'folder', collapse: true, children: []});
                if(contentType == 'folder') {
                  accu.push(holder);
                  console.log('Children');
                  return;
                }
                accu.push(holder);
                console.log('collection');
                return;
            }
        }

        // node Tree Functionality
        // scope.isHidden = true;
        // scope.collapse = function () {
        //     console.log(scope.isHidden);
        //      scope.isHidden = scope.isHidden ? false : true
        // }
        //
        // $scope.nodeSelected = function ($item, i) {
        //     if($item.type == 'file') {
        //       var tabExist = TabService.getTab();
        //       if(tabExist == '') {
        //         TabService.addTab($item.name);
        //       } else {
        //           for(var i = 0; i < tabExist.length; i++) {
        //               if(tabExist[i] == $item.name) {
        //                 console.log("Already exists : " + tabExist[i]);
        //                 return;
        //               }
        //           }
        //           TabService.addTab($item.name);
        //       }
        //     }
        // }

        $scope.menuOptions = [
            // CREATING FILE
            ['New File', function ($item) {
                if ($item.node.type === 'folder') { // NEW FILE WHEN IT"S CLICKED ON FOLDER
                  item = $item.node.children;
                  createContent(item, 'file', 'newfile');
                }

                if($item.node.type === 'file') { // NEW FILE WHEN IT"S CLICKED ON FILE
                    item = $item.$parent.collection;
                    createContent(item, 'file', 'newfile');
                }
                var transit = document.getElementsByClassName('json')[0];
                console.log(transit);
            }],

            // CREATING FOLDER
            ['New Folder', function ($item) {
                if ($item.node.type === 'folder') { // NEW FOLDER WHEN IT"S CLICKED ON FOLDER
                    item  = $item.node.children;
                    createContent(item, 'folder', 'newfolder');
                }
                if ($item.node.type === 'file') { // NEW FILE WHEN IT"S CLICK ON FILE
                    item = $item.$parent.collection;
                    createContent(item, 'folder', 'newfolder');
                }
            }],
            ['Rename', function($item) {
              var currentName = $item.node.name
              var name = prompt("Change file name", currentName);
                if(name === currentName) {
                    alert("You didn't change the name"); return;
                }
              else {
                $item.node.name = name;
              }
              //  console.log("rename ", $item.$parent.collection);
            }],
            ['Delete', function ($item) {
              console.log(angular.toJson($item.node));
              // var name = $item.node.name
              // if(confirm("Are you sure you want to delete "+ name) == true) {
              //$item.$parent.collection.splice($item.$parent.$index, 1);
             $item.$parent.collection.splice($item.$parent.$index, 1);
              // }
              // return;
              //console.log($item.$parent.collection.splice($item.$parent.$index, 1));

            }]
        ];

      });
})();
