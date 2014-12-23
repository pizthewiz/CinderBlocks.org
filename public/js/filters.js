(function() {
  'use strict';

  angular.module('appFilters', []).
    // based on https://github.com/wildlyinaccurate/angular-relative-date
    value('now', new Date()).
    filter('relativeTime', ['now', function (now) {
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
