(function() {
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
