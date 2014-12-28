(function() {
  'use strict';

  angular.module('appDirectives', []).
    directive('relativeTime', ['$timeout', function ($timeout) {
      function update(element, attrs) {
        element.text(getRelativeDateTimeString(attrs.datetime));

        // update every 30 seconds
        $timeout(function () {
          update(element, attrs);
        }, 30 * 1000);
      }

      // based on https://github.com/wildlyinaccurate/angular-relative-date
      function getRelativeDateTimeString(string) {
        var now = new Date();
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
      }

      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          update(element, attrs);
        }
      };
    }]).

    directive('badge', [function () {
      function draw(canvas, attrs) {
        var context = canvas.getContext('2d');

        // hidpi handling
        var devicePixelRatio = window.devicePixelRatio || 1;
        var backingStoreRatio = context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio || 1;
        if (devicePixelRatio !== backingStoreRatio) {
          canvas.style.width = '' + canvas.width + 'px';
          canvas.style.height = '' + canvas.height + 'px';

          var pixelRatio = devicePixelRatio / backingStoreRatio;
          canvas.width = canvas.width * pixelRatio;
          canvas.height = canvas.height * pixelRatio;
          context.scale(pixelRatio, pixelRatio);
        }

        if (!attrs.imageUrl) {
          drawFallback(context, attrs);
        } else {
          var img = new Image();
          img.onerror = function () {
            drawFallback(context, attrs);
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
            context.drawImage(img, x, y, w, h, 0, 0, attrs.width, attrs.height);
          };
          img.src = attrs.imageUrl;
        }
      }

      function drawFallback(context, attrs) {
        var img = new Image();
        img.onerror = function () {
          context.fillStyle = 'rgb(255, 0, 0)';
          context.fillRect(0, 0, attrs.width, attrs.height);
        };
        img.onload = function () {
          context.drawImage(img, 0, 0, img.width, img.height, 0, 0, attrs.width, attrs.height);
          context.globalCompositeOperation = 'multiply';
          var colors = ['rgb(255, 255, 0)', 'rgb(255, 0, 255)', 'rgb(0, 255, 255)'];
          context.fillStyle = colors[Math.floor(Math.random() * colors.length)];
          context.fillRect(0, 0, attrs.width, attrs.height);
        };
        img.src = 'img/block.png';
      }

      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          var canvas = element[0];
          draw(canvas, attrs);
        }
      };
    }]);

})();
