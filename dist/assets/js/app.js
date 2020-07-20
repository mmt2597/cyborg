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
;(function() {
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
;(function() {
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
;(function() {
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
;;(function() {
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
;(function() {
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
;(function() {
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
;;/*(function() {
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
})();*/;(function() {
    'use strict';

    angular.module('myApp.NavHeader_Directive', [])
      .directive('navHeader', function() {
          return {
            restrict: 'E',
            templateUrl: 'src/views/components/NavHeader.html'
          };
      });
})();
;(function() {
    'use strict';

    angular.module('myApp.Resizer_Directive', [])
        .directive('resizer', function($document) {
          return {
          link: function($scope, $element, $attrs) {
              $element.on('mousedown', function(event) {
                  event.preventDefault();
                  $document.on('mousemove', mousemove);
                  $document.on('mouseup', mouseup);
              });

              function mousemove(event) {
                  event.preventDefault();
                  if($attrs.resizer == 'vertical') {
                      // Handle vertical resizer
                      var x = event.pageX;

                      if($attrs.resizerMax && x > $attrs.resizerMax) { x = parseInt($attrs.resizerMax); }
                      if($attrs.resizerMax && x  < $attrs.resizerMin ) { x = 55; }
                      document.querySelector($attrs.resizerLeft.toString()).style.width = (x - 55) + 'px'
                  }
                  else {
                    // Handle horizontal resizer
                      var y = event.pageY;

                      if($attrs.resizerYMax && x > $attrs.resizerYMax) { y = parseInt($attrs.resizerYMax); }
                      if($attrs.resizerYMax && x  < $attrs.resizerYMin ) { y = 55; }
                      document.querySelector($attrs.resizerBottom.toString()).style.height = (-y + 555) + 'px';

                  }
              }

              function mouseup() {
                  $document.unbind('mousemove', mousemove);
                  $document.unbind('mouseup', mouseup);
              }
          }
          };
        });
})();
;// (function() {
//     'use strict';

//     angular.module('myApp.rightClick', [])
//       .directive('contextmenu', function ($parse, $window) {
//           var menu = document.getElementById('menu');

//           return function(scope, element, attrs){
//               var fn = $parse(attrs.rightClick);
//               element.on('contextmenu', function () {

//                   menu.style.display = "block";
//                   menu.style.left = (event.pageX - 55)+ 'px';
//                   menu.style.top = (event.pageY - 60) + 'px';

//                  /* scope.$apply(function() {
//                       event.preventDefault();
//                       fn(scope, {$event: event});
//                   });*/
//               });

//               angular.element($window).on('click', function() {
//                   console.log("leave");
//                   menu.style.display = "";
//                   menu.style.left = "";
//                   menu.style.top = "";
//               });
//           }
//       });
// })();
;(function() {
    'use strict';

    angular.module('myApp.SubTab_Directive', [])
        .directive('subContent', function() {
            return {
              restrict: 'E',
              templateUrl: 'src/views/components/SubTab.html'
            }
        });
})();
;// (function () {
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
;(function() {
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
;(function() {
    'use strict';

    angular.module('myApp.Tree_Service', [])
        .factory('TreeService', function($http) {
            var svc = {};
            var treeDirectories = [{
            		name: "GulpSrc",
            		type: "folder",
            		collapse: true,
            		children: [{
            			name: "CSS",
            			type: "folder",
            			collapse: false,
            			children: [{
            					name: "style1.css",
            					type: "file"
            				},
            				{
            					name: "style2.css",
            					type: "file"
            				}
            			]
            		}]
            	},
            	{
            		name: "SGulpSrc",
            		type: "folder",
            		collapse: true,
            		children: [{
            			name: "CSS",
            			type: "folder",
            			collapse: false,
            			children: [{
            					name: "style1.css",
            					type: "file"
            				},
            				{
            					name: "style2.css",
            					type: "file"
            				}
            			]
            		}]
            	}
            ]


              svc.add = function(item) {
                  treeDirectories.push(item);
              }
              svc.delete = function() {
                (function recurse(obj) {
                    for(var key in obj) {
                        console.log(obj[key]);
                        console.log(angular.toJson(obj[key]));
                    }
                })(treeDirectories);
              }

              svc.getData = function() {
                console.log(treeDirectories);
               return treeDirectories;
              }
            return svc;
        });

})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXIvVGFiQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvYWNlQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvbWFpbkNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVyL21vZGFsQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvbmF2YmFyQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvcHJlZmVyZW5jZUNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVyL3RyZWVDb250cm9sbGVyLmpzIiwiZGlyZWN0aXZlL2NvbmZpZy1kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmUvY29udGV4dG1lbnUtZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlL25hdi1oZWFkZXItZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlL3Jlc2l6ZXItZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlL3JpZ2h0Q2xpY2stZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlL3N1Yi10YWItZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlL3RyZWUtZGlyZWN0aXZlLmpzIiwic2VydmljZXMvdGFiU2VydmljZS5qcyIsInNlcnZpY2VzL3RyZWVTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0NoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0NoQ0EsQ0NBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0NwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0M1R0EsQ0NBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0MxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0M5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENDaElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuICBhbmd1bGFyLm1vZHVsZSgnbXlBcHAnLCBbXG4gICAgICAgICd1aS5hY2UnLFxuICAgICAgICAndWkuYm9vdHN0cmFwJyxcbiAgICAgICAgJ3VpLmJvb3RzdHJhcC5jb250ZXh0TWVudScsXG4gICAgICAgICdteUFwcC5UcmVlX1NlcnZpY2UnLFxuICAgICAgICAnbXlBcHAuVGFiX1NlcnZpY2UnLFxuICAgICAgICAnbXlBcHAuU3ViVGFiX0RpcmVjdGl2ZScsXG4gICAgICAgIC8vJ215QXBwLlRyZWVWaWV3X0RpcmVjdGl2ZScsXG4gICAgICAgICdteUFwcC5SZXNpemVyX0RpcmVjdGl2ZScsXG4gICAgICAgICdteUFwcC5OYXZIZWFkZXJfRGlyZWN0aXZlJyxcbiAgICAgICAgJ215QXBwLk1haW5fQ29udHJvbGxlcicsXG4gICAgICAgICdteUFwcC5uYXZiYXJDb250cm9sbGVyJyxcbiAgICAgICAgJ215QXBwLlRyZWVWaWV3X0NvbnRyb2xsZXInLFxuICAgICAgICAnbXlBcHAuVGFiX0NvbnRyb2xsZXInLFxuICAgICAgICAnbXlBcHAuQWNlX0NvbnRyb2xsZXInLFxuICAgICAgICAnbXlBcHAuUHJlZmVyZW5jZV9Db250cm9sbGVyJ10pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnbXlBcHAuVGFiX0NvbnRyb2xsZXInLCBbXSlcbiAgICAgIC5jb250cm9sbGVyKCdUYWJDb250cm9sbGVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMudGFiID0gMTtcblxuICAgICAgICAgIHRoaXMuc2V0VGFiID0gZnVuY3Rpb24gKHRhYklkKSB7XG4gICAgICAgICAgICB0aGlzLnRhYiA9IHRhYklkO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICB0aGlzLmlzU2V0ID0gZnVuY3Rpb24odGFiSWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRhYiA9PT0gdGFiSWQ7XG4gICAgICAgICAgfTtcbiAgICAgIH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnbXlBcHAuQWNlX0NvbnRyb2xsZXInLCBbXSlcbiAgICAgIC5jb250cm9sbGVyKCdhY2VDb250cm9sbGVyJywgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHNjb3BlLCAkaW50ZXJ2YWwpIHtcblxuICAgICAgICAgICRzY29wZS5hY2VMb2FkZWQgPSBmdW5jdGlvbiAoX2VkaXRvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlc3Npb24gID0gX2VkaXRvci5nZXRTZXNzaW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVuZGVyZXIgPSBfZWRpdG9yLnJlbmRlcmVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgIF9lZGl0b3Iuc2V0UmVhZE9ubHkoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbi5zZXRNb2RlKFwiYWNlL21vZGUvamF2YXNjcmlwdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlc3Npb24uc2V0VW5kb01hbmFnZXIobmV3IGFjZS5VbmRvTWFuYWdlcigpKTtcblxuICAgICAgICAgICAgICAgICRpbnRlcnZhbCAoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZFRoZW1lICAgICAgICAgPSAkcm9vdFNjb3BlLnRoZW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRGb250U2l6ZSAgICAgID0gJHJvb3RTY29wZS5mb250U2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkVGFiU2l6ZSAgICAgICA9ICRyb290U2NvcGUudGFiU2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkR3V0dGVyICAgICAgICA9ICRyb290U2NvcGUuZ3V0dGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRGb2xkV2lkZ2V0ICAgID0gJHJvb3RTY29wZS5mb2xkV2lkZ2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRQcmludE1hcmdpbiAgID0gJHJvb3RTY29wZS5wcmludE1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkU2hvd0ludmlzaWJsZSA9ICRyb290U2NvcGUuc2hvd0ludmlzaWJsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkV29yZFdyYXAgICAgICA9ICRyb290U2NvcGUud29yZFdyYXAsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZFJlYWRPbmx5ICAgICAgPSAkcm9vdFNjb3BlLnJlYWRPbmx5O1xuXG5cbiAgICAgICAgICAgICAgICAgICAgX2VkaXRvci5zZXRPcHRpb25zKHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRWRpdG9yIE9wdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZW1lOiAnYWNlL3RoZW1lLycgKyAoc2VsZWN0ZWRUaGVtZSAhPT0gdW5kZWZpbmVkID8gc2VsZWN0ZWRUaGVtZSA6ICdhbWJpYW5jZScpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZTogJ2FjZS9tb2RlL2phdmFzY3JpcHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZE9ubHk6IHNlbGVjdGVkUmVhZE9ubHksXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlbmVkZXJlciBPcHRpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93R3V0dGVyOiBzZWxlY3RlZEd1dHRlciwgLy8gQm9vbFxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1ByaW50TWFyZ2luOiBzZWxlY3RlZFByaW50TWFyZ2luLCAvLyBCb29sXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93SW52aXNpYmxlczogc2VsZWN0ZWRTaG93SW52aXNpYmxlLCAvLyBCb29sXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93Rm9sZFdpZGdldHM6IHNlbGVjdGVkRm9sZFdpZGdldCwgLy8gQm9vbFxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheUluZGVudEd1aWRlczogdHJ1ZSxcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2Vzc2lvbiBPcHRpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogc2VsZWN0ZWRGb250U2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYlNpemU6IHNlbGVjdGVkVGFiU2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdyYXA6IHNlbGVjdGVkV29yZFdyYXBcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgIH07XG4gICAgICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnbXlBcHAuTWFpbl9Db250cm9sbGVyJywgW10pXG4gICAgLmNvbnRyb2xsZXIoJ21haW5Db250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCBUYWJTZXJ2aWNlLCAkc2NlKXtcblxuICAgICAgLy8gICRzY29wZS5vcGVuID0gdHJ1ZTtcblxuICAgICAgICAkc2NvcGUuaXNWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLnNob3dIaWRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHNjb3BlLmlzVmlzaWJsZSA9ICEkc2NvcGUuaXNWaXNpYmxlO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnNob3dIaWRlQ29uc29sZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRzY29wZS5pc1Zpc2libGUgPSAhJHNjb3BlLmlzVmlzaWJsZTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS50YWJMZW5ndGggPSBUYWJTZXJ2aWNlLmdldFRhYigpO1xuXG4gICAgICAgIHZhciBjb3VudCA9IDE7XG4gICAgICAgICRzY29wZS5hZGROZXdUYWIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgVGFiU2VydmljZS5hZGRUYWIoJ3VudGl0bGVkJywgY291bnQpO1xuICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuY2xvc2VUYWIgPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgICBUYWJTZXJ2aWNlLnJlbW92ZVRhYihpbmRleCk7XG4gICAgICAgICAgY291bnQtLTtcbiAgICAgICAgfVxuXG4gICAgfSk7XG59KSgpO1xuIiwiIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdteUFwcC5uYXZiYXJDb250cm9sbGVyJywgW10pXG4gICAgICAuY29udHJvbGxlcignbmF2YmFyQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgVHJlZVNlcnZpY2UpIHtcblxuICAgICAgICB2YXIgY29udGVudCwgcmFjaztcbiAgICAgICAgdmFyIGNyZWF0ZUNvbnRlbnQgPSBmdW5jdGlvbihjb250ZW50VHlwZSwgc2VsZWN0ZWRDb250ZXh0TWVudSkge1xuXG4gICAgICAgICAgICByYWNrID0gKGNvbnRlbnRUeXBlID09ICdmb2xkZXInID8gJ0ZvbGRlcicgOiAnRmlsZScpO1xuICAgICAgICAgICAgY29udGVudCA9IHByb21wdChcIkVudGVyIE5ldyBcIisgcmFjayArIFwiIE5hbWVcIik7XG5cbiAgICAgICAgICAgIGlmKGNvbnRlbnQgPT0gXCJcIiB8fCBjb250ZW50ID09IG51bGwpIHsgYWxlcnQoXCJJbnZhbGlkIE5hbWVcIik7IH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJhY2sgPSAoc2VsZWN0ZWRDb250ZXh0TWVudSA9PSAnbmV3ZmlsZScgPyB7bmFtZTogY29udGVudCwgdHlwZTogJ2ZpbGUnfSA6IHtuYW1lOiBjb250ZW50LCB0eXBlOiAnZm9sZGVyJywgY29sbGFwc2U6IHRydWUsIGNoaWxkcmVuOiBbXX0pO1xuXG4gICAgICAgICAgICAgICAgaWYoY29udGVudFR5cGUgPT0gJ2ZvbGRlcicpIHsgVHJlZVNlcnZpY2UuYWRkKHJhY2spOyByZXR1cm47IH1cbiAgICAgICAgICAgICAgICBUcmVlU2VydmljZS5hZGQocmFjayk7IHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICAgJHNjb3BlLm5hdi5uZXdGaWxlID0gZnVuY3Rpb24oKSB7IGNyZWF0ZUNvbnRlbnQoJ2ZpbGUnLCAnbmV3ZmlsZScpOyB9XG4gICAgICAgICAgJHNjb3BlLm5hdi5uZXdGb2xkZXIgPSBmdW5jdGlvbigpIHsgY3JlYXRlQ29udGVudCgnZm9sZGVyJywgJ25ld2ZvbGRlcicpOyB9XG4gICAgICB9KVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICd1c2Ugc3RyaWN0JztcblxuICAgYW5ndWxhci5tb2R1bGUoJ215QXBwLlByZWZlcmVuY2VfQ29udHJvbGxlcicsIFtdKVxuICAgICAgLmNvbnRyb2xsZXIoJ1ByZWZlcmVuY2VDb250cm9sbGVyJywgIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRodHRwKSB7XG4gICAgICAgICBhbmd1bGFyLmV4dGVuZCgkc2NvcGUsIHtcblxuICAgICAgICAgfSlcbiAgICAgICAgICAgIC8vIEdldCBhbGwgVGhlbWVzIEpTT05cbiAgICAgICAgICAgICRodHRwLmdldCgnZGF0YS9hY2VfdGhlbWUuanNvbicpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICRzY29wZS5saXN0T2ZUaGVtZSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIFRoZW1lXG4gICAgICAgICAgICAkc2NvcGUud2F0Y2hDaGFuZ2VUaGVtZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgJHJvb3RTY29wZS50aGVtZSA9ICRzY29wZS5jb25maWcubmFtZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyBGb250XG4gICAgICAgICAgICAkc2NvcGUud2F0Y2hDaGFuZ2VGb250ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICB2YXIgeCA9IGV2ZW50LnBhZ2VYO1xuICAgICAgICAgICAgICAgY29uc29sZS5sb2coeCk7XG4gICAgICAgICAgICAgICAkcm9vdFNjb3BlLmZvbnRTaXplID0gJHNjb3BlLmNvbmZpZy5mb250U2l6ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIFRhYiBTaXplXG4gICAgICAgICAgICAkc2NvcGUud2F0Y2hDaGFuZ2VUYWJTaXplID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAkcm9vdFNjb3BlLnRhYlNpemUgPSAkc2NvcGUuY29uZmlnLnRhYlNpemU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBHdXR0ZXJcbiAgICAgICAgICAgICRzY29wZS53YXRjaENoYW5nZUd1dHRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgJHJvb3RTY29wZS5ndXR0ZXIgPSAkc2NvcGUuY29uZmlnLmd1dHRlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEZvbGQgV2lkZ2V0XG4gICAgICAgICAgICAkc2NvcGUud2F0Y2hDaGFuZ2VGb2xkV2lkZ2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAkcm9vdFNjb3BlLmZvbGRXaWRnZXQgPSAkc2NvcGUuY29uZmlnLmZvbGRXaWRnZXQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRzY29wZS53YXRjaENoYW5nZVByaW50TWFyZ2luID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAkcm9vdFNjb3BlLnByaW50TWFyZ2luID0gJHNjb3BlLmNvbmZpZy5wcmludE1hcmdpbjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHNjb3BlLndhdGNoQ2hhbmdlU2hvd0ludmlzaWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgJHJvb3RTY29wZS5zaG93SW52aXNpYmxlID0gJHNjb3BlLmNvbmZpZy5zaG93SW52aXNpYmxlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkc2NvcGUud2F0Y2hDaGFuZ2VXb3JkV3JhcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgJHJvb3RTY29wZS53b3JkV3JhcCA9ICRzY29wZS5jb25maWcud29yZFdyYXA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRzY29wZS53YXRjaENoYW5nZVJlYWRPbmx5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAkcm9vdFNjb3BlLnJlYWRPbmx5ID0gJHNjb3BlLmNvbmZpZy5yZWFkT25seTtcbiAgICAgICAgICAgIH1cbiAgICAgIH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnbXlBcHAuVHJlZVZpZXdfQ29udHJvbGxlcicsIFtdKVxuICAgICAgLmNvbnRyb2xsZXIoJ3RyZWVWaWV3Q29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgVHJlZVNlcnZpY2UpIHtcblxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQVggXCIsIFRyZWVTZXJ2aWNlLmdldERhdGEoKSk7XG4gICAgICAgICRzY29wZS50cmVlRGlyZWN0b3JpZXMgPSBUcmVlU2VydmljZS5nZXREYXRhKCk7XG5cblxuICAgICAgICB2YXIgY29udGVudCwgaXRlbTtcbiAgICAgICAgdmFyIGNyZWF0ZUNvbnRlbnQgPSBmdW5jdGlvbihhY2N1LCBjb250ZW50VHlwZSwgc2VsZWN0ZWRDb250ZXh0TWVudSkge1xuICAgICAgICAgICAgdmFyIGhvbGRlciA9IChjb250ZW50VHlwZSA9PSAnZm9sZGVyJyA/ICdGb2xkZXInIDogJ0ZpbGUnKTtcblxuICAgICAgICAgICAgY29udGVudCA9IHByb21wdChcIkVudGVyIE5ldyBcIisgaG9sZGVyICsgXCIgTmFtZVwiKTtcbiAgICAgICAgICAgIGlmKGNvbnRlbnQgPT0gXCJcIiB8fCBjb250ZW50ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgYWxlcnQoXCJJbnZhbGlkIE5hbWVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgaG9sZGVyID0gKHNlbGVjdGVkQ29udGV4dE1lbnUgPT0gJ25ld2ZpbGUnID8ge25hbWU6IGNvbnRlbnQsIHR5cGU6ICdmaWxlJ30gOiB7bmFtZTogY29udGVudCwgdHlwZTogJ2ZvbGRlcicsIGNvbGxhcHNlOiB0cnVlLCBjaGlsZHJlbjogW119KTtcbiAgICAgICAgICAgICAgICBpZihjb250ZW50VHlwZSA9PSAnZm9sZGVyJykge1xuICAgICAgICAgICAgICAgICAgYWNjdS5wdXNoKGhvbGRlcik7XG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQ2hpbGRyZW4nKTtcbiAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYWNjdS5wdXNoKGhvbGRlcik7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NvbGxlY3Rpb24nKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBub2RlIFRyZWUgRnVuY3Rpb25hbGl0eVxuICAgICAgICAvLyBzY29wZS5pc0hpZGRlbiA9IHRydWU7XG4gICAgICAgIC8vIHNjb3BlLmNvbGxhcHNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coc2NvcGUuaXNIaWRkZW4pO1xuICAgICAgICAvLyAgICAgIHNjb3BlLmlzSGlkZGVuID0gc2NvcGUuaXNIaWRkZW4gPyBmYWxzZSA6IHRydWVcbiAgICAgICAgLy8gfVxuICAgICAgICAvL1xuICAgICAgICAvLyAkc2NvcGUubm9kZVNlbGVjdGVkID0gZnVuY3Rpb24gKCRpdGVtLCBpKSB7XG4gICAgICAgIC8vICAgICBpZigkaXRlbS50eXBlID09ICdmaWxlJykge1xuICAgICAgICAvLyAgICAgICB2YXIgdGFiRXhpc3QgPSBUYWJTZXJ2aWNlLmdldFRhYigpO1xuICAgICAgICAvLyAgICAgICBpZih0YWJFeGlzdCA9PSAnJykge1xuICAgICAgICAvLyAgICAgICAgIFRhYlNlcnZpY2UuYWRkVGFiKCRpdGVtLm5hbWUpO1xuICAgICAgICAvLyAgICAgICB9IGVsc2Uge1xuICAgICAgICAvLyAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHRhYkV4aXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgaWYodGFiRXhpc3RbaV0gPT0gJGl0ZW0ubmFtZSkge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJBbHJlYWR5IGV4aXN0cyA6IFwiICsgdGFiRXhpc3RbaV0pO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAvLyAgICAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgIFRhYlNlcnZpY2UuYWRkVGFiKCRpdGVtLm5hbWUpO1xuICAgICAgICAvLyAgICAgICB9XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH1cblxuICAgICAgICAkc2NvcGUubWVudU9wdGlvbnMgPSBbXG4gICAgICAgICAgICAvLyBDUkVBVElORyBGSUxFXG4gICAgICAgICAgICBbJ05ldyBGaWxlJywgZnVuY3Rpb24gKCRpdGVtKSB7XG4gICAgICAgICAgICAgICAgaWYgKCRpdGVtLm5vZGUudHlwZSA9PT0gJ2ZvbGRlcicpIHsgLy8gTkVXIEZJTEUgV0hFTiBJVFwiUyBDTElDS0VEIE9OIEZPTERFUlxuICAgICAgICAgICAgICAgICAgaXRlbSA9ICRpdGVtLm5vZGUuY2hpbGRyZW47XG4gICAgICAgICAgICAgICAgICBjcmVhdGVDb250ZW50KGl0ZW0sICdmaWxlJywgJ25ld2ZpbGUnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZigkaXRlbS5ub2RlLnR5cGUgPT09ICdmaWxlJykgeyAvLyBORVcgRklMRSBXSEVOIElUXCJTIENMSUNLRUQgT04gRklMRVxuICAgICAgICAgICAgICAgICAgICBpdGVtID0gJGl0ZW0uJHBhcmVudC5jb2xsZWN0aW9uO1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVDb250ZW50KGl0ZW0sICdmaWxlJywgJ25ld2ZpbGUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHRyYW5zaXQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqc29uJylbMF07XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codHJhbnNpdCk7XG4gICAgICAgICAgICB9XSxcblxuICAgICAgICAgICAgLy8gQ1JFQVRJTkcgRk9MREVSXG4gICAgICAgICAgICBbJ05ldyBGb2xkZXInLCBmdW5jdGlvbiAoJGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBpZiAoJGl0ZW0ubm9kZS50eXBlID09PSAnZm9sZGVyJykgeyAvLyBORVcgRk9MREVSIFdIRU4gSVRcIlMgQ0xJQ0tFRCBPTiBGT0xERVJcbiAgICAgICAgICAgICAgICAgICAgaXRlbSAgPSAkaXRlbS5ub2RlLmNoaWxkcmVuO1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVDb250ZW50KGl0ZW0sICdmb2xkZXInLCAnbmV3Zm9sZGVyJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgkaXRlbS5ub2RlLnR5cGUgPT09ICdmaWxlJykgeyAvLyBORVcgRklMRSBXSEVOIElUXCJTIENMSUNLIE9OIEZJTEVcbiAgICAgICAgICAgICAgICAgICAgaXRlbSA9ICRpdGVtLiRwYXJlbnQuY29sbGVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlQ29udGVudChpdGVtLCAnZm9sZGVyJywgJ25ld2ZvbGRlcicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgWydSZW5hbWUnLCBmdW5jdGlvbigkaXRlbSkge1xuICAgICAgICAgICAgICB2YXIgY3VycmVudE5hbWUgPSAkaXRlbS5ub2RlLm5hbWVcbiAgICAgICAgICAgICAgdmFyIG5hbWUgPSBwcm9tcHQoXCJDaGFuZ2UgZmlsZSBuYW1lXCIsIGN1cnJlbnROYW1lKTtcbiAgICAgICAgICAgICAgICBpZihuYW1lID09PSBjdXJyZW50TmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcIllvdSBkaWRuJ3QgY2hhbmdlIHRoZSBuYW1lXCIpOyByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAkaXRlbS5ub2RlLm5hbWUgPSBuYW1lO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vICBjb25zb2xlLmxvZyhcInJlbmFtZSBcIiwgJGl0ZW0uJHBhcmVudC5jb2xsZWN0aW9uKTtcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgWydEZWxldGUnLCBmdW5jdGlvbiAoJGl0ZW0pIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coYW5ndWxhci50b0pzb24oJGl0ZW0ubm9kZSkpO1xuICAgICAgICAgICAgICAvLyB2YXIgbmFtZSA9ICRpdGVtLm5vZGUubmFtZVxuICAgICAgICAgICAgICAvLyBpZihjb25maXJtKFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSBcIisgbmFtZSkgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAvLyRpdGVtLiRwYXJlbnQuY29sbGVjdGlvbi5zcGxpY2UoJGl0ZW0uJHBhcmVudC4kaW5kZXgsIDEpO1xuICAgICAgICAgICAgICRpdGVtLiRwYXJlbnQuY29sbGVjdGlvbi5zcGxpY2UoJGl0ZW0uJHBhcmVudC4kaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgIC8vIHJldHVybjtcbiAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygkaXRlbS4kcGFyZW50LmNvbGxlY3Rpb24uc3BsaWNlKCRpdGVtLiRwYXJlbnQuJGluZGV4LCAxKSk7XG5cbiAgICAgICAgICAgIH1dXG4gICAgICAgIF07XG5cbiAgICAgIH0pO1xufSkoKTtcbiIsIiIsIi8qKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdteUFwcC5Db250ZXh0bWVudV9EaXJlY3RpdmUnLCBbXSlcbiAgICAgIC5kaXJlY3RpdmUoJ2NvbnRleHRtZW51JywgZnVuY3Rpb24gKCRwYXJzZSwgJHdpbmRvdykge1xuICAgICAgICAgIHZhciBtZW51ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUnKTtcblxuICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICAgIHZhciBmbiA9ICRwYXJzZShhdHRycy5yaWdodENsaWNrKTsgIFxuICAgICAgICAgICAgICBlbGVtZW50Lm9uKCdjb250ZXh0bWVudScsIGZ1bmN0aW9uIChldmVudCkge1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgIG1lbnUuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgICAgICAgICAgIG1lbnUuc3R5bGUubGVmdCA9IChldmVudC5wYWdlWCAtIDU1KSsgJ3B4JztcbiAgICAgICAgICAgICAgICAgIG1lbnUuc3R5bGUudG9wID0gKGV2ZW50LnBhZ2VZIC0gNjApICsgJ3B4JztcblxuICAgICAgICAgICAgICAgICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgZm4oc2NvcGUsIHskZXZlbnQ6IGV2ZW50fSk7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KCR3aW5kb3cpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgbWVudS5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgIG1lbnUuc3R5bGUubGVmdCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICBtZW51LnN0eWxlLnRvcCA9IFwiXCI7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgIH0pO1xufSkoKTsqLyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnbXlBcHAuTmF2SGVhZGVyX0RpcmVjdGl2ZScsIFtdKVxuICAgICAgLmRpcmVjdGl2ZSgnbmF2SGVhZGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy92aWV3cy9jb21wb25lbnRzL05hdkhlYWRlci5odG1sJ1xuICAgICAgICAgIH07XG4gICAgICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ215QXBwLlJlc2l6ZXJfRGlyZWN0aXZlJywgW10pXG4gICAgICAgIC5kaXJlY3RpdmUoJ3Jlc2l6ZXInLCBmdW5jdGlvbigkZG9jdW1lbnQpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycykge1xuICAgICAgICAgICAgICAkZWxlbWVudC5vbignbW91c2Vkb3duJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAkZG9jdW1lbnQub24oJ21vdXNlbW92ZScsIG1vdXNlbW92ZSk7XG4gICAgICAgICAgICAgICAgICAkZG9jdW1lbnQub24oJ21vdXNldXAnLCBtb3VzZXVwKTtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgZnVuY3Rpb24gbW91c2Vtb3ZlKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgaWYoJGF0dHJzLnJlc2l6ZXIgPT0gJ3ZlcnRpY2FsJykge1xuICAgICAgICAgICAgICAgICAgICAgIC8vIEhhbmRsZSB2ZXJ0aWNhbCByZXNpemVyXG4gICAgICAgICAgICAgICAgICAgICAgdmFyIHggPSBldmVudC5wYWdlWDtcblxuICAgICAgICAgICAgICAgICAgICAgIGlmKCRhdHRycy5yZXNpemVyTWF4ICYmIHggPiAkYXR0cnMucmVzaXplck1heCkgeyB4ID0gcGFyc2VJbnQoJGF0dHJzLnJlc2l6ZXJNYXgpOyB9XG4gICAgICAgICAgICAgICAgICAgICAgaWYoJGF0dHJzLnJlc2l6ZXJNYXggJiYgeCAgPCAkYXR0cnMucmVzaXplck1pbiApIHsgeCA9IDU1OyB9XG4gICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcigkYXR0cnMucmVzaXplckxlZnQudG9TdHJpbmcoKSkuc3R5bGUud2lkdGggPSAoeCAtIDU1KSArICdweCdcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBIYW5kbGUgaG9yaXpvbnRhbCByZXNpemVyXG4gICAgICAgICAgICAgICAgICAgICAgdmFyIHkgPSBldmVudC5wYWdlWTtcblxuICAgICAgICAgICAgICAgICAgICAgIGlmKCRhdHRycy5yZXNpemVyWU1heCAmJiB4ID4gJGF0dHJzLnJlc2l6ZXJZTWF4KSB7IHkgPSBwYXJzZUludCgkYXR0cnMucmVzaXplcllNYXgpOyB9XG4gICAgICAgICAgICAgICAgICAgICAgaWYoJGF0dHJzLnJlc2l6ZXJZTWF4ICYmIHggIDwgJGF0dHJzLnJlc2l6ZXJZTWluICkgeyB5ID0gNTU7IH1cbiAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCRhdHRycy5yZXNpemVyQm90dG9tLnRvU3RyaW5nKCkpLnN0eWxlLmhlaWdodCA9ICgteSArIDU1NSkgKyAncHgnO1xuXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBmdW5jdGlvbiBtb3VzZXVwKCkge1xuICAgICAgICAgICAgICAgICAgJGRvY3VtZW50LnVuYmluZCgnbW91c2Vtb3ZlJywgbW91c2Vtb3ZlKTtcbiAgICAgICAgICAgICAgICAgICRkb2N1bWVudC51bmJpbmQoJ21vdXNldXAnLCBtb3VzZXVwKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcbn0pKCk7XG4iLCIvLyAoZnVuY3Rpb24oKSB7XG4vLyAgICAgJ3VzZSBzdHJpY3QnO1xuXG4vLyAgICAgYW5ndWxhci5tb2R1bGUoJ215QXBwLnJpZ2h0Q2xpY2snLCBbXSlcbi8vICAgICAgIC5kaXJlY3RpdmUoJ2NvbnRleHRtZW51JywgZnVuY3Rpb24gKCRwYXJzZSwgJHdpbmRvdykge1xuLy8gICAgICAgICAgIHZhciBtZW51ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUnKTtcblxuLy8gICAgICAgICAgIHJldHVybiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpe1xuLy8gICAgICAgICAgICAgICB2YXIgZm4gPSAkcGFyc2UoYXR0cnMucmlnaHRDbGljayk7XG4vLyAgICAgICAgICAgICAgIGVsZW1lbnQub24oJ2NvbnRleHRtZW51JywgZnVuY3Rpb24gKCkge1xuXG4vLyAgICAgICAgICAgICAgICAgICBtZW51LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4vLyAgICAgICAgICAgICAgICAgICBtZW51LnN0eWxlLmxlZnQgPSAoZXZlbnQucGFnZVggLSA1NSkrICdweCc7XG4vLyAgICAgICAgICAgICAgICAgICBtZW51LnN0eWxlLnRvcCA9IChldmVudC5wYWdlWSAtIDYwKSArICdweCc7XG5cbi8vICAgICAgICAgICAgICAgICAgLyogc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgZm4oc2NvcGUsIHskZXZlbnQ6IGV2ZW50fSk7XG4vLyAgICAgICAgICAgICAgICAgICB9KTsqL1xuLy8gICAgICAgICAgICAgICB9KTtcblxuLy8gICAgICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJHdpbmRvdykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxlYXZlXCIpO1xuLy8gICAgICAgICAgICAgICAgICAgbWVudS5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcbi8vICAgICAgICAgICAgICAgICAgIG1lbnUuc3R5bGUubGVmdCA9IFwiXCI7XG4vLyAgICAgICAgICAgICAgICAgICBtZW51LnN0eWxlLnRvcCA9IFwiXCI7XG4vLyAgICAgICAgICAgICAgIH0pO1xuLy8gICAgICAgICAgIH1cbi8vICAgICAgIH0pO1xuLy8gfSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnbXlBcHAuU3ViVGFiX0RpcmVjdGl2ZScsIFtdKVxuICAgICAgICAuZGlyZWN0aXZlKCdzdWJDb250ZW50JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy92aWV3cy9jb21wb25lbnRzL1N1YlRhYi5odG1sJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbn0pKCk7XG4iLCIvLyAoZnVuY3Rpb24gKCkge1xuLy8gICAgICd1c2Ugc3RyaWN0Jztcbi8vXG4vLyAgICAgYW5ndWxhci5tb2R1bGUoICdteUFwcC5UcmVlVmlld19EaXJlY3RpdmUnLCBbXSlcbi8vICAgICAgICAgLmRpcmVjdGl2ZSgnY29sbGVjdGlvbicsIGZ1bmN0aW9uICgpIHtcbi8vICAgICAgICAgICAgIHJldHVybiB7XG4vLyAgICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbi8vICAgICAgICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgIHNjb3BlOiB7XG4vLyAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb246ICc9J1xuLy8gICAgICAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvdmlld3MvY29tcG9uZW50cy9jb2xsZWN0aW9uLmh0bWwnXG4vLyAgICAgICAgICAgICB9O1xuLy8gICAgICAgICB9KVxuLy8gICAgICAgICAuZGlyZWN0aXZlKCdmYW1pbHknLCBmdW5jdGlvbigkY29tcGlsZSwgVHJlZVNlcnZpY2UsIFRhYlNlcnZpY2UpIHtcbi8vICAgICAgICAgICAgIHJldHVybiB7XG4vLyAgICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbi8vICAgICAgICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgIHNjb3BlOiB7XG4vLyAgICAgICAgICAgICAgICAgICAgIGZhbWlseTogJz0nXG4vLyAgICAgICAgICAgICAgICAgfSxcbi8vICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy92aWV3cy9jb21wb25lbnRzL3RyZWVEaXJlY3RvcnkuaHRtbCcsXG4vLyAgICAgICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgIGlmKGFuZ3VsYXIuaXNBcnJheShzY29wZS5mYW1pbHkuY2hpbGRyZW4pKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFwcGVuZChcIjxjb2xsZWN0aW9uIGNvbGxlY3Rpb249J2ZhbWlseS5jaGlsZHJlbic+PC9jb2xsZWN0aW9uPlwiKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSkoc2NvcGUpXG4vLyAgICAgICAgICAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgIHZhciBjb250ZW50LCBpdGVtO1xuLy9cbi8vICAgICAgICAgICAgICAgICAgICAgdmFyIGNyZWF0ZUNvbnRlbnQgPSBmdW5jdGlvbihhY2N1LCBjb250ZW50VHlwZSwgc2VsZWN0ZWRDb250ZXh0TWVudSkge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhvbGRlciA9IChjb250ZW50VHlwZSA9PSAnZm9sZGVyJyA/ICdGb2xkZXInIDogJ0ZpbGUnKTtcbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gcHJvbXB0KFwiRW50ZXIgTmV3IFwiKyBob2xkZXIgKyBcIiBOYW1lXCIpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgaWYoY29udGVudCA9PSBcIlwiIHx8IGNvbnRlbnQgPT0gbnVsbCkge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIkludmFsaWQgTmFtZVwiKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBob2xkZXIgPSAoc2VsZWN0ZWRDb250ZXh0TWVudSA9PSAnbmV3ZmlsZScgPyB7bmFtZTogY29udGVudCwgdHlwZTogJ2ZpbGUnfSA6IHtuYW1lOiBjb250ZW50LCB0eXBlOiAnZm9sZGVyJywgY29sbGFwc2U6IHRydWUsIGNoaWxkcmVuOiBbXX0pO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNvbnRlbnRUeXBlID09ICdmb2xkZXInKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2N1LnB1c2goaG9sZGVyKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDaGlsZHJlbicpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2N1LnB1c2goaG9sZGVyKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY29sbGVjdGlvbicpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgICAgICAgfVxuLy9cbi8vICAgICAgICAgICAgICAgICAgICAgLy8gRmFtaWx5IFRyZWUgRnVuY3Rpb25hbGl0eVxuLy8gICAgICAgICAgICAgICAgICAgICAvLyBzY29wZS5pc0hpZGRlbiA9IHRydWU7XG4vLyAgICAgICAgICAgICAgICAgICAgIC8vIHNjb3BlLmNvbGxhcHNlID0gZnVuY3Rpb24gKCkge1xuLy8gICAgICAgICAgICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coc2NvcGUuaXNIaWRkZW4pO1xuLy8gICAgICAgICAgICAgICAgICAgICAvLyAgICAgIHNjb3BlLmlzSGlkZGVuID0gc2NvcGUuaXNIaWRkZW4gPyBmYWxzZSA6IHRydWVcbi8vICAgICAgICAgICAgICAgICAgICAgLy8gfVxuLy9cbi8vICAgICAgICAgICAgICAgICAgICAgc2NvcGUubm9kZVNlbGVjdGVkID0gZnVuY3Rpb24gKCRpdGVtLCBpKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBpZigkaXRlbS50eXBlID09ICdmaWxlJykge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGFiRXhpc3QgPSBUYWJTZXJ2aWNlLmdldFRhYigpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0YWJFeGlzdCA9PSAnJykge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRhYlNlcnZpY2UuYWRkVGFiKCRpdGVtLm5hbWUpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHRhYkV4aXN0Lmxlbmd0aDsgaSsrKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGFiRXhpc3RbaV0gPT0gJGl0ZW0ubmFtZSkge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJBbHJlYWR5IGV4aXN0cyA6IFwiICsgdGFiRXhpc3RbaV0pO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRhYlNlcnZpY2UuYWRkVGFiKCRpdGVtLm5hbWUpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgIHNjb3BlLm1lbnVPcHRpb25zID0gW1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ1JFQVRJTkcgRklMRVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgWydOZXcgRmlsZScsIGZ1bmN0aW9uICgkaXRlbSkge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkaXRlbS5mYW1pbHkudHlwZSA9PT0gJ2ZvbGRlcicpIHsgLy8gTkVXIEZJTEUgV0hFTiBJVFwiUyBDTElDS0VEIE9OIEZPTERFUlxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbSA9ICRpdGVtLmZhbWlseS5jaGlsZHJlbjtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZUNvbnRlbnQoaXRlbSwgJ2ZpbGUnLCAnbmV3ZmlsZScpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoJGl0ZW0uZmFtaWx5LnR5cGUgPT09ICdmaWxlJykgeyAvLyBORVcgRklMRSBXSEVOIElUXCJTIENMSUNLRUQgT04gRklMRVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtID0gJGl0ZW0uJHBhcmVudC5jb2xsZWN0aW9uO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVDb250ZW50KGl0ZW0sICdmaWxlJywgJ25ld2ZpbGUnKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRyYW5zaXQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqc29uJylbMF07XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codHJhbnNpdCk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICB9XSxcbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDUkVBVElORyBGT0xERVJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIFsnTmV3IEZvbGRlcicsIGZ1bmN0aW9uICgkaXRlbSkge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkaXRlbS5mYW1pbHkudHlwZSA9PT0gJ2ZvbGRlcicpIHsgLy8gTkVXIEZPTERFUiBXSEVOIElUXCJTIENMSUNLRUQgT04gRk9MREVSXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0gID0gJGl0ZW0uZmFtaWx5LmNoaWxkcmVuO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVDb250ZW50KGl0ZW0sICdmb2xkZXInLCAnbmV3Zm9sZGVyJyk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkaXRlbS5mYW1pbHkudHlwZSA9PT0gJ2ZpbGUnKSB7IC8vIE5FVyBGSUxFIFdIRU4gSVRcIlMgQ0xJQ0sgT04gRklMRVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtID0gJGl0ZW0uJHBhcmVudC5jb2xsZWN0aW9uO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVDb250ZW50KGl0ZW0sICdmb2xkZXInLCAnbmV3Zm9sZGVyJyk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgfV0sXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBbJ1JlbmFtZScsIGZ1bmN0aW9uKCRpdGVtKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW50TmFtZSA9ICRpdGVtLmZhbWlseS5uYW1lXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuYW1lID0gcHJvbXB0KFwiQ2hhbmdlIGZpbGUgbmFtZVwiLCBjdXJyZW50TmFtZSk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYobmFtZSA9PT0gY3VycmVudE5hbWUpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJZb3UgZGlkbid0IGNoYW5nZSB0aGUgbmFtZVwiKTsgcmV0dXJuO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGl0ZW0uZmFtaWx5Lm5hbWUgPSBuYW1lO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICBjb25zb2xlLmxvZyhcInJlbmFtZSBcIiwgJGl0ZW0uJHBhcmVudC5jb2xsZWN0aW9uKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIH1dLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgWydEZWxldGUnLCBmdW5jdGlvbiAoJGl0ZW0pIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYW5ndWxhci50b0pzb24oJGl0ZW0uZmFtaWx5KSk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZhciBuYW1lID0gJGl0ZW0uZmFtaWx5Lm5hbWVcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYoY29uZmlybShcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgXCIrIG5hbWUpID09IHRydWUpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8kaXRlbS4kcGFyZW50LmNvbGxlY3Rpb24uc3BsaWNlKCRpdGVtLiRwYXJlbnQuJGluZGV4LCAxKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAkaXRlbS4kcGFyZW50LmNvbGxlY3Rpb24uc3BsaWNlKCRpdGVtLiRwYXJlbnQuJGluZGV4LCAxKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXR1cm47XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJGl0ZW0uJHBhcmVudC5jb2xsZWN0aW9uLnNwbGljZSgkaXRlbS4kcGFyZW50LiRpbmRleCwgMSkpO1xuLy9cbi8vICAgICAgICAgICAgICAgICAgICAgICAgIH1dXG4vLyAgICAgICAgICAgICAgICAgICAgIF07XG4vLyAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgfVxuLy8gICAgICAgICB9KVxuLy8gfSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnbXlBcHAuVGFiX1NlcnZpY2UnLCBbXSlcbiAgICAgIC5mYWN0b3J5KCdUYWJTZXJ2aWNlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHRhYkl0ZW0gPSBbXTtcbiAgICAgICAgICB2YXIgc3ZjID0ge307XG5cbiAgICAgICAgICBzdmMuYWRkVGFiID0gZnVuY3Rpb24gKGl0ZW0sIGlkTm8pIHtcbiAgICAgICAgICAgIHRhYkl0ZW0ucHVzaCh7bmFtZTogaXRlbSwgaWQ6IGlkTm99KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQURERURcIik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc3ZjLnJlbW92ZVRhYiA9IGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICB0YWJJdGVtLnNwbGljZShpLCAxKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzdmMuZ2V0VGFiID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRhYkl0ZW07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHN2YztcbiAgICAgIH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnbXlBcHAuVHJlZV9TZXJ2aWNlJywgW10pXHJcbiAgICAgICAgLmZhY3RvcnkoJ1RyZWVTZXJ2aWNlJywgZnVuY3Rpb24oJGh0dHApIHtcclxuICAgICAgICAgICAgdmFyIHN2YyA9IHt9O1xyXG4gICAgICAgICAgICB2YXIgdHJlZURpcmVjdG9yaWVzID0gW3tcclxuICAgICAgICAgICAgXHRcdG5hbWU6IFwiR3VscFNyY1wiLFxyXG4gICAgICAgICAgICBcdFx0dHlwZTogXCJmb2xkZXJcIixcclxuICAgICAgICAgICAgXHRcdGNvbGxhcHNlOiB0cnVlLFxyXG4gICAgICAgICAgICBcdFx0Y2hpbGRyZW46IFt7XHJcbiAgICAgICAgICAgIFx0XHRcdG5hbWU6IFwiQ1NTXCIsXHJcbiAgICAgICAgICAgIFx0XHRcdHR5cGU6IFwiZm9sZGVyXCIsXHJcbiAgICAgICAgICAgIFx0XHRcdGNvbGxhcHNlOiBmYWxzZSxcclxuICAgICAgICAgICAgXHRcdFx0Y2hpbGRyZW46IFt7XHJcbiAgICAgICAgICAgIFx0XHRcdFx0XHRuYW1lOiBcInN0eWxlMS5jc3NcIixcclxuICAgICAgICAgICAgXHRcdFx0XHRcdHR5cGU6IFwiZmlsZVwiXHJcbiAgICAgICAgICAgIFx0XHRcdFx0fSxcclxuICAgICAgICAgICAgXHRcdFx0XHR7XHJcbiAgICAgICAgICAgIFx0XHRcdFx0XHRuYW1lOiBcInN0eWxlMi5jc3NcIixcclxuICAgICAgICAgICAgXHRcdFx0XHRcdHR5cGU6IFwiZmlsZVwiXHJcbiAgICAgICAgICAgIFx0XHRcdFx0fVxyXG4gICAgICAgICAgICBcdFx0XHRdXHJcbiAgICAgICAgICAgIFx0XHR9XVxyXG4gICAgICAgICAgICBcdH0sXHJcbiAgICAgICAgICAgIFx0e1xyXG4gICAgICAgICAgICBcdFx0bmFtZTogXCJTR3VscFNyY1wiLFxyXG4gICAgICAgICAgICBcdFx0dHlwZTogXCJmb2xkZXJcIixcclxuICAgICAgICAgICAgXHRcdGNvbGxhcHNlOiB0cnVlLFxyXG4gICAgICAgICAgICBcdFx0Y2hpbGRyZW46IFt7XHJcbiAgICAgICAgICAgIFx0XHRcdG5hbWU6IFwiQ1NTXCIsXHJcbiAgICAgICAgICAgIFx0XHRcdHR5cGU6IFwiZm9sZGVyXCIsXHJcbiAgICAgICAgICAgIFx0XHRcdGNvbGxhcHNlOiBmYWxzZSxcclxuICAgICAgICAgICAgXHRcdFx0Y2hpbGRyZW46IFt7XHJcbiAgICAgICAgICAgIFx0XHRcdFx0XHRuYW1lOiBcInN0eWxlMS5jc3NcIixcclxuICAgICAgICAgICAgXHRcdFx0XHRcdHR5cGU6IFwiZmlsZVwiXHJcbiAgICAgICAgICAgIFx0XHRcdFx0fSxcclxuICAgICAgICAgICAgXHRcdFx0XHR7XHJcbiAgICAgICAgICAgIFx0XHRcdFx0XHRuYW1lOiBcInN0eWxlMi5jc3NcIixcclxuICAgICAgICAgICAgXHRcdFx0XHRcdHR5cGU6IFwiZmlsZVwiXHJcbiAgICAgICAgICAgIFx0XHRcdFx0fVxyXG4gICAgICAgICAgICBcdFx0XHRdXHJcbiAgICAgICAgICAgIFx0XHR9XVxyXG4gICAgICAgICAgICBcdH1cclxuICAgICAgICAgICAgXVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgc3ZjLmFkZCA9IGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgdHJlZURpcmVjdG9yaWVzLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIHN2Yy5kZWxldGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIChmdW5jdGlvbiByZWN1cnNlKG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIga2V5IGluIG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhvYmpba2V5XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFuZ3VsYXIudG9Kc29uKG9ialtrZXldKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSkodHJlZURpcmVjdG9yaWVzKTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIHN2Yy5nZXREYXRhID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0cmVlRGlyZWN0b3JpZXMpO1xyXG4gICAgICAgICAgICAgICByZXR1cm4gdHJlZURpcmVjdG9yaWVzO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHN2YztcclxuICAgICAgICB9KTtcclxuXHJcbn0pKCk7XHJcbiJdfQ==
