(function() {
  'use strict';

  angular.module('app', ['ngRoute', 'appControllers', 'appFilters']).
    config(['$routeProvider', function ($routeProvider) {
      $routeProvider.
      when('/blocks', {
        templateUrl: 'partials/blocks.html',
        controller: 'BlocksController'
      }).
      when('/blocks/:blockID', {
        templateUrl: 'partials/block.html',
        controller: 'BlockController'
      }).
      otherwise({
        redirectTo: '/blocks'
      });
    }]).

    directive('badge', [function () {
      return {
        restrict: 'A',
        // template: '<canvas></canvas>',
        link: function (scope, element, attrs) {
          var canvas = element[0];
          var ctx = canvas.getContext('2d');

          // hidpi handling
          var devicePixelRatio = window.devicePixelRatio || 1;
          var backingStoreRatio = ctx.backingStorePixelRatio ||
            ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;
          if (devicePixelRatio !== backingStoreRatio) {
            var pixelRatio = devicePixelRatio / backingStoreRatio;

            canvas.style.width = '' + canvas.width + 'px';
            canvas.style.height = '' + canvas.height + 'px';

            canvas.width = canvas.width * pixelRatio;
            canvas.height = canvas.height * pixelRatio;
            ctx.scale(pixelRatio, pixelRatio);
          }

          var drawFallback = function () {
            var img = new Image();
            img.onerror = function () {
              ctx.fillStyle = 'rgb(255, 0, 0)';
              ctx.fillRect(0, 0, attrs.width, attrs.height);
            };
            img.onload = function () {
              ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, attrs.width, attrs.height);
              ctx.globalCompositeOperation = 'multiply';
              var colors = ['rgb(255, 255, 0)', 'rgb(255, 0, 255)', 'rgb(0, 255, 255)'];
              ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
              ctx.fillRect(0, 0, attrs.width, attrs.height);
            };
            img.src = 'img/block.png';
          };

          if (!attrs.imageUrl) {
            drawFallback();
          } else {
            var img = new Image();
            img.onerror = function () {
              drawFallback();
            };
            img.onload = function () {
              // aspect fill and center
              var x = 0, y = 0, w = img.width, h = img.height;
              var aspectRatio = (img.width / img.height) / (attrs.width / attrs.height);
              if (aspectRatio > 1) {
                w /= aspectRatio;
                x = (img.width - w) / 2;
              } else if (aspectRatio < 1) {
                h *= aspectRatio;
                y = (img.height - h) / 2;
              }
              ctx.drawImage(img, x, y, w, h, 0, 0, attrs.width, attrs.height);
            };
            img.src = attrs.imageUrl;
          }
        }
      };
    }]);

})();
