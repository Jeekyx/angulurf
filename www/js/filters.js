var app = angular.module('UrfMadnessApp.Filters', []);

app.filter('unit', function () {
  var units = {
    percentage: '%',
    meters: 'm'
  };

  return function (input) {
    return units[input];
  };
});

app.filter('leaguevisible', function () {
  var leagues = [ 'bronze', 'silver', 'gold', 'platinum', 'diamond', 'master', 'challenger' ];

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
    return '/img/' + league + '_1.png';
  };
});
