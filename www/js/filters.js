var app = angular.module('UrfMadnessApp.Filters', []);

app.filter('unit', function () {
  var units = {
    percent: '%',
    perPlayer: '',
    timestamp: '',
    avg: ''
  };

  return function (input) {
    return units[input];
  };
});

app.filter('leaguevisible', function () {
  var leagues = [ 'unranked', 'bronze', 'silver', 'gold', 'platinum', 'diamond', 'master', 'challenger' ];

  return function (items, visible) {
    var filtered = [];
    leagues.forEach(function (element, index, array) {
      if (typeof items[element]['visible'] != 'undefined' && items[element]['visible'] == visible) {
        items[element].name = element;
        filtered.push(items[element]);
      }
    });
    return filtered;
  };
});

app.filter('leagueimage', function () {
  return function (league) {
    if (league == 'unranked')
    return '/img/unranked.png';

    return '/img/' + league + '_1.png';
  };
});

app.filter('leaguechampion', function () {
  return function (text, type) {
    if (type == 'picks' || type == 'bans')
    return text + ', ';

    return text;
  };
});

app.filter('leaguetime', function () {
  return function (seconds) {
    var minutes = (Math.floor(seconds / 60)).toString();
    var seconds = (Math.floor(seconds % 60)).toString();

    if (minutes.length == 1)
    minutes = '0' + minutes;
    if (seconds.length == 1)
    seconds = '0' + seconds;

    return minutes + ':' + seconds;
  };
});
