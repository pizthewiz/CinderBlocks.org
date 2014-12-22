(function() {
  'use strict';

  angular.module('app', ['ngRoute', 'appControllers']).
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
    }])

    // based on https://github.com/wildlyinaccurate/angular-relative-date
    .value('now', new Date())
    .filter('relativeTime', ['now', function (now) {
      return function (string) {
        var date = new Date(string);
        var delta = Math.round((now - date) / 1000);

        var second = 1;
        var minute = second * 60;
        var hour = minute * 60;
        var day = hour * 24;
        var week = day * 7;
        var month = day * 30;
        var year = day * 365;

        if (delta < second * 30) {
          return 'just now';
        } else if (delta < minute) {
          return '' + delta + ' seconds ago';
        } else if (delta < minute * 2) {
          return 'a minute ago';
        } else if (delta < hour) {
          return '' + Math.floor(delta / minute) + ' minutes ago';
        } else if (delta < hour * 2) {
          return 'an hour ago';
        } else if (delta < day) {
          return '' + Math.floor(delta / hour) +  ' hours ago';
        } else if (delta < day * 2) {
          return 'a day ago';
        } else if (delta < week) {
          return '' + Math.floor(delta / day) +  ' days ago';
        } else if (delta < week * 2) {
          return 'a week ago';
        } else if (delta < month) {
          return '' + Math.floor(delta / week) +  ' weeks ago';
        } else if (delta < month * 2) {
          return 'a month ago';
        } else if (delta < year) {
          return '' + Math.floor(delta / month) +  ' months ago';
        } else if (delta < year * 2) {
          return 'a year ago';
        } else {
          return 'years ago';
        }
      };
    }]);

})();
