var app = angular.module('UrfMadnessAppControllers', ['ngStorage']);

app.controller('HomeCtrl', function ($scope, $http, $localStorage) {
  // Default fact identifier value
  $scope.$storage = $localStorage.$default({ factId: 0 });

  $scope.leagues = {
    bronze: false,
    silver: false,
    gold: false,
    platinum: false,
    diamond: false,
    master: false,
    challenger: false
  };

  $scope.chooseLeague = function (league) {
    if (typeof($scope.leagues[league]) != 'undefined') {
      $scope.leagues[league] = !$scope.leagues[league];
    }
  };

  $http.get('/static/facts.json').then(function (result) {
    $scope.facts = result.data;

    $scope.roll = function () {
      var id = 0;
      do {
        id = Math.floor(Math.random() * $scope.facts.length);
      } while (id == $scope.$storage.factId);
      $scope.$storage.factId = id;
      $scope.randomFact = $scope.facts[id];
    };

    $scope.roll();
  });
});
