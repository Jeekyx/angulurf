var app = angular.module('UrfMadnessAppFilters', []);

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
      if (typeof items[element]['visible'] != 'undefined' && items[element]['visible'] == visible)
      filtered.push(items[element]);
    });
    return filtered;
  };
});
