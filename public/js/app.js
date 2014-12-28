(function() {
  'use strict';

  angular.module('app', ['ngRoute', 'appControllers', 'appDirectives']).
    config(['$routeProvider', function ($routeProvider) {
      $routeProvider.
      when('/blocks', {
        templateUrl: 'partials/blocks.html',
        controller: 'BlocksController'
      }).
      // when('/blocks/:blockID', {
      //   templateUrl: 'partials/block.html',
      //   controller: 'BlockController'
      // }).
      otherwise({
        redirectTo: '/blocks'
      });
    }]);

})();
