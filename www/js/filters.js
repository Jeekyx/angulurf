var app = angular.module('UrfMadnessAppFilters', []);

app.filter('unit', function() {
  var units = {
    percentage: '%',
    meters: 'm'
  };

  return function(input) {
    return units[input];
  };
});
