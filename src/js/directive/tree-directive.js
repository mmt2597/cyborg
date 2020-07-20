// (function () {
//     'use strict';
//
//     angular.module( 'myApp.TreeView_Directive', [])
//         .directive('collection', function () {
//             return {
//                 restrict: 'E',
//                 replace: true,
//                 scope: {
//                     collection: '='
//                 },
//                 templateUrl: 'src/views/components/collection.html'
//             };
//         })
//         .directive('family', function($compile, TreeService, TabService) {
//             return {
//                 restrict: 'E',
//                 replace: true,
//                 scope: {
//                     family: '='
//                 },
//                 templateUrl: 'src/views/components/treeDirectory.html',
//                 link: function(scope, element, attrs) {
//                     if(angular.isArray(scope.family.children)) {
//                         element.append("<collection collection='family.children'></collection>");
//                         $compile(element.contents())(scope)
//                     }
//
//                     var content, item;
//
//                     var createContent = function(accu, contentType, selectedContextMenu) {
//                         var holder = (contentType == 'folder' ? 'Folder' : 'File');
//
//                         content = prompt("Enter New "+ holder + " Name");
//                         if(content == "" || content == null) {
//                           alert("Invalid Name");
//                         }
//                         else {
//                             var holder = (selectedContextMenu == 'newfile' ? {name: content, type: 'file'} : {name: content, type: 'folder', collapse: true, children: []});
//                             if(contentType == 'folder') {
//                               accu.push(holder);
//                               console.log('Children');
//                               return;
//                             }
//                             accu.push(holder);
//                             console.log('collection');
//                             return;
//                         }
//                     }
//
//                     // Family Tree Functionality
//                     // scope.isHidden = true;
//                     // scope.collapse = function () {
//                     //     console.log(scope.isHidden);
//                     //      scope.isHidden = scope.isHidden ? false : true
//                     // }
//
//                     scope.nodeSelected = function ($item, i) {
//                         if($item.type == 'file') {
//                           var tabExist = TabService.getTab();
//                           if(tabExist == '') {
//                             TabService.addTab($item.name);
//                           } else {
//                               for(var i = 0; i < tabExist.length; i++) {
//                                   if(tabExist[i] == $item.name) {
//                                     console.log("Already exists : " + tabExist[i]);
//                                     return;
//                                   }
//                               }
//                               TabService.addTab($item.name);
//                           }
//                         }
//                     }
//
//                     scope.menuOptions = [
//                         // CREATING FILE
//                         ['New File', function ($item) {
//                             if ($item.family.type === 'folder') { // NEW FILE WHEN IT"S CLICKED ON FOLDER
//                               item = $item.family.children;
//                               createContent(item, 'file', 'newfile');
//                             }
//
//                             if($item.family.type === 'file') { // NEW FILE WHEN IT"S CLICKED ON FILE
//                                 item = $item.$parent.collection;
//                                 createContent(item, 'file', 'newfile');
//                             }
//                             var transit = document.getElementsByClassName('json')[0];
//                             console.log(transit);
//                         }],
//
//                         // CREATING FOLDER
//                         ['New Folder', function ($item) {
//                             if ($item.family.type === 'folder') { // NEW FOLDER WHEN IT"S CLICKED ON FOLDER
//                                 item  = $item.family.children;
//                                 createContent(item, 'folder', 'newfolder');
//                             }
//                             if ($item.family.type === 'file') { // NEW FILE WHEN IT"S CLICK ON FILE
//                                 item = $item.$parent.collection;
//                                 createContent(item, 'folder', 'newfolder');
//                             }
//                         }],
//                         ['Rename', function($item) {
//                           var currentName = $item.family.name
//                           var name = prompt("Change file name", currentName);
//                             if(name === currentName) {
//                                 alert("You didn't change the name"); return;
//                             }
//                           else {
//                             $item.family.name = name;
//                           }
//                           //  console.log("rename ", $item.$parent.collection);
//                         }],
//                         ['Delete', function ($item) {
//                           console.log(angular.toJson($item.family));
//                           // var name = $item.family.name
//                           // if(confirm("Are you sure you want to delete "+ name) == true) {
//                           //$item.$parent.collection.splice($item.$parent.$index, 1);
//                          $item.$parent.collection.splice($item.$parent.$index, 1);
//                           // }
//                           // return;
//                           //console.log($item.$parent.collection.splice($item.$parent.$index, 1));
//
//                         }]
//                     ];
//                 }
//             }
//         })
// })();
