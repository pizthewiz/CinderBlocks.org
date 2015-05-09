(function() {
  'use strict';

  angular.module('app', ['ngRoute', 'appControllers', 'appDirectives']).
    config(['$routeProvider', function ($routeProvider) {
      $routeProvider.
        when('/', {
          templateUrl: 'partials/blocks.html',
          controller: 'BlocksController'
        }).
        when('/blocks', {
          redirectTo: '/'
        }).

        // when('/blocks/:blockID', {
        //   templateUrl: 'partials/block.html',
        //   controller: 'BlockController'
        // }).

        when('/about', {
          templateUrl: 'partials/about.html',
          controller: 'AboutController'
        });
    }]);

})();
