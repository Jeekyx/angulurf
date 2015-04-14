var app = angular.module('UrfMadnessAppControllers', ['ngStorage']);

app.controller('HomeCtrl', function ($scope, $http, $localStorage) {
  // Default fact identifier value
  $scope.$storage = $localStorage.$default({ factId: 0 });

  $scope.index = 0;
  $scope.max = 0;
  $scope.leagues = [ 'bronze', 'silver', 'gold', 'platinum', 'diamond', 'master', 'challenger' ];
  $scope.facts = {
    0: {
      count: 0,
      img: '/img/icon_teemo.png',
      type: 'teemo',
      bronze: false,
      silver: false,
      gold: false,
      platinum: false,
      diamond: false,
      master: false,
      challenger: false
    }
  };

  $http.get('/static/facts.json').then(function (result) {
    $scope.allFacts = result.data;

    $scope.randomLeagueGenerator = function () {
      var id = Math.floor(Math.random() * $scope.leagues.length);
      return $scope.leagues[id];
    }

    $scope.randomFactGenerator = function (league) {
      if (typeof(league) == "undefined")
      var league = $scope.randomLeagueGenerator();

      $scope.facts[$scope.index]['count']++;
      var id = Math.floor(Math.random() * $scope.allFacts.length);
      $scope.facts[$scope.index][league] = $scope.allFacts[id];
    }

    $scope.chooseLeague = function (league) {
      // @TODO: Why not changing tab style ? Why not adding fact after index > 0 ? Add fact league style.
      if ($scope.leagues.indexOf(league) > -1) {
        if ($scope.facts[$scope.index][league] == false) {
          $scope.randomFactGenerator(league);
        } else if ($scope.facts[$scope.index]['count'] > 1) {
          $scope.facts[$scope.index]['count']--;
          $scope.facts[$scope.index][league] = false;
        }
      }
      console.log($scope.facts);
    };

    $scope.previous = function () {
      if ($scope.index > 0) {
        $scope.index--;
      }
    };

    $scope.next = function () {
      $scope.index++;
      if ($scope.index > $scope.max) {
        // @TODO: Generate new type and then get image
        $scope.facts[$scope.index] = {
          count: 0,
          img: '/img/icon_teemo.png',
          type: 'teemo'
        };
        $scope.randomFactGenerator();
        $scope.max = $scope.index;
      }
    };

    $scope.randomFactGenerator();
  });
});
