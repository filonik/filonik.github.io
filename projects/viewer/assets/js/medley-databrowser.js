  function asTreeModel(type, prefix) {
    if (type && type.innerType && type.innerType.attributes) {
      return type.innerType.attributes.map(function (attribute){
        return {
          "id": prefix + "." + attribute.name,
          "data": attribute.type,
          "name": attribute.name,
          "title": attribute.type.toString(),
        };
      });
    }
    return [];
  }

(function() {
  'use strict';
  
  angular.module('medley', []).directive('databrowser', ['$compile', function( $compile ) {
    return {
      restrict: 'EA',
      scope: {
        model: '=',
      },
      controller: ['$scope', '$timeout', '$templateCache', '$interpolate', function ($scope, $timeout, $templateCache, $interpolate) {
        $scope.treeModel = [];
        $scope.treeOptions = {
          //dirSelectable: false,
          isLeaf: function (node) {
            var attributes = node.data.innerType.attributes;
            var result = !(angular.isDefined(attributes) && attributes.length);
            return result;
          }
        };
        
        $scope.$watch('model', function (value) {
          //console.log('model changed', value);
          var treeModel = [];
          if (value && value.head) {
            treeModel = asTreeModel(value.head.type, '');
          }
          //$timeout(function() {
          //  $scope.$apply(function() {
               $scope.treeModel = treeModel;
          //  });
          //}, 0);
        });
        
        $scope.selectedNode = ".";
        
        $scope.showSelected = function (node, selected) {
          $scope.selectedNode = selected ? node.id : ".";
        };
        
        $scope.fetchChildren = function (node, expanded) {
          node.children = asTreeModel(node.data, node.id);
        };
      }],
      template: '<div class="content">'
      + '<div class="content-left" style="background-color: #eee;">'
      + '<treecontrol class="tree-light" tree-model="treeModel" on-node-toggle="fetchChildren(node, expanded)" on-selection="showSelected(node, selected)" options="treeOptions">'
      + '<span title="{{node.title}}">{{node.name}}</span>'
      + '</treecontrol>'
      + '</div>'
      + '<div class="content-inner" style="background-color: #fff;">'
      + '{{selectedNode}}'
      + '</div>'
      + '</div>',
    };
  }]);
  
}).call(this);