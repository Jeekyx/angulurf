var app = angular.module('UrfMadnessAppControllers', ['ngStorage']);

app.controller('HomeCtrl', function ($scope, $http, $localStorage) {
  // Default fact identifier value
  //$scope.$storage = $localStorage.$default({ factId: 0 });

  var leagues = [ 'bronze', 'silver', 'gold', 'platinum', 'diamond', 'master', 'challenger' ];

  // Default const
  $scope.stats = true;
  $scope.index = 0;
  $scope.max = 0;
  $scope.facts = {
    0: {
      count: 0,
      img: '/img/iconf_teemo.png',
      type: 'teemo',
      leagues: {
        bronze: { order: 0, visible: false, fact: {} },
        silver: { order: 1, visible: false, fact: {} },
        gold: { order: 2, visible: false, fact: {} },
        platinum: { order: 3, visible: false, fact: {} },
        diamond: { order: 4, visible: false, fact: {} },
        master: { order: 5, visible: false, fact: {} },
        challenger: { order: 6, visible: false, fact: {} }
      }
    }
  };

  $http.get('/static/facts.json').then(function (result) {
    $scope.allFacts = result.data;

    $scope.randomLeagueGenerator = function () {
      var id = Math.floor(Math.random() * leagues.length);
      return leagues[id];
    }

    $scope.randomFactPopulator = function (selected) {
      var id = Math.floor(Math.random() * $scope.allFacts.length);
      leagues.forEach(function (element, index, array) {
        $scope.facts[$scope.index].leagues[element]['fact'] = $scope.allFacts[id];
      });

      if (typeof selected != "undefined")
      selected.forEach(function (element, index, array) {
        if (!$scope.facts[$scope.index].leagues[element]['visible'])
        $scope.facts[$scope.index]['count']++;

        $scope.facts[$scope.index].leagues[element]['visible'] = true;
      });
    }

    $scope.chooseLeague = function (league) {
      // @TODO: Add fact league style.
      if (leagues.indexOf(league) > -1) {
        if ($scope.facts[$scope.index]['count'] == 0)
        $scope.stats = false;

        if (!$scope.facts[$scope.index].leagues[league]['visible']) {
          $scope.facts[$scope.index]['count']++;
          $scope.facts[$scope.index].leagues[league]['visible'] = true;
        } else if ($scope.facts[$scope.index]['count'] > 1) {
          $scope.facts[$scope.index]['count']--;
          $scope.facts[$scope.index].leagues[league]['visible'] = false;
        }
      }
    };

    $scope.previous = function () {
      if ($scope.index > 0) {
        $scope.index--;
      }
    };

    $scope.next = function () {
      $scope.index++;
      if ($scope.index > $scope.max) {
        // @TODO: Generated the selected array
        // @TODO: Generate new type and then get image
        $scope.facts[$scope.index] = {
          count: 0,
          img: '/img/iconf_teemo.png',
          type: 'teemo',
          leagues: {
            bronze: { order: 0, visible: false, fact: {} },
            silver: { order: 1, visible: false, fact: {} },
            gold: { order: 2, visible: false, fact: {} },
            platinum: { order: 3, visible: false, fact: {} },
            diamond: { order: 4, visible: false, fact: {} },
            master: { order: 5, visible: false, fact: {} },
            challenger: { order: 6, visible: false, fact: {} }
          }
        };
        var selected = [];
        leagues.forEach(function (element, index, array) {
          if ($scope.facts[$scope.index - 1].leagues[element]['visible'])
          selected.push(element);
        });
        $scope.randomFactPopulator(selected);
        $scope.max = $scope.index;
      }
    };

    $scope.randomFactPopulator();
  });
});
