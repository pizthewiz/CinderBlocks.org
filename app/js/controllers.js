(function() {
  'use strict';

  angular.module('appControllers', []).
    controller('BlocksController', ['$scope', '$http', function ($scope, $http) {
      $scope.blocks = [];
      $scope.filter = {supports: []};
      $scope.predicate = ['-commit.date'];

      $http({method: 'GET', url: '/data/blocks.json'}).
        success(function(data, status, headers, config) {
          $scope.blocks = data;
        }).
        error(function(data, status, headers, config) {
          // TODO - something?
        });

      $scope.setFilter = function (os) {
        if ($scope.filter.supports.indexOf(os) !== -1) {
          var index = $scope.filter.supports.indexOf(os);
          $scope.filter.supports.splice(index, 1);
        } else {
          $scope.filter.supports = [os];
        }
      };

      $scope.filterFunc = function (block) {
        return $scope.filter.supports.every(function (os) {
          return block.supports.indexOf(os) !== -1;
        });
      };

      $scope.setPredicate = function (primary, secondary) {
        var predicate = secondary ? [primary, secondary] : [primary];
        if (JSON.stringify($scope.predicate) !== JSON.stringify(predicate)) {
          $scope.predicate = predicate;
        } else {
          // reverse sort direction
          var matches = $scope.predicate[0].match(/(\-)?(.*)/);
          $scope.predicate[0] = (matches[1] === undefined ? '-' : '') + matches[2];
        }
      };
    }]).

    controller('BlockController', ['$scope', '$routeParams', function ($scope, $routeParams) {
    }]);

})();
