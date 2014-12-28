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

      // based on GitHub's timeAgo formatter
      function getRelativeDateTimeString(string) {
        var now = new Date();
        var date = new Date(string);
        var milliseconds = now.getTime() - date.getTime();
        var seconds = Math.round(milliseconds / 1000);
        var minutes = Math.round(seconds / 60);
        var hours = Math.round(minutes / 60);
        var days = Math.round(hours / 24);
        var months = Math.round(days / 30);
        var years = Math.round(months / 12);

        if (0 > milliseconds) {
          return 'just now';
        } else if (10 > seconds) {
          return 'just now';
        } else if (45 > seconds) {
          return seconds + ' seconds ago';
        } else if (90 > seconds) {
          return 'a minute ago';
        } else if (45 > minutes) {
          return minutes + ' minutes ago';
        } else if (90 > minutes) {
          return 'an hour ago';
        } else if (24 > hours) {
          return hours + ' hours ago';
        } else if (36 > hours) {
          return 'a day ago';
        } else if (30 > days) {
          return days + ' days ago';
        } else if (45 > days) {
          return 'a month ago';
        } else if (12 > months) {
          return months + ' months ago';
        } else if (18 > months) {
          return 'a year ago';
        } else {
          return years + ' years ago';
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
