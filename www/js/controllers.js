var app = angular.module('UrfMadnessApp.Controllers', ['ngStorage']);

app.controller('HomeCtrl', ['$scope', '$http', '$localStorage', 'API', function ($scope, $http, $localStorage, API) {
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
      img: '/img/icon_teemo.png',
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

  $scope.randomLeagueGenerator = function () {
    var id = Math.floor(Math.random() * leagues.length);
    return leagues[id];
  };

  $scope.randomFactPopulator = function (selected) {
    API.random(function (data) {
      console.log(data);
      leagues.forEach(function (element, index, array) {
        // @TODO: Change sentence from type, etc.
        // @TODO: Work with the null case.
        // @TODO: Change sentence design.
        var sentence = 'of ' + element + ' players have bought ';
        if (data[element]!= null) {
          console.log(data);
          $scope.facts[$scope.index].leagues[element]['fact'] = {
            unit: "percentage",
            value: data[element].percent,
            sentence: sentence
          };
        }
      });

      $scope.facts[$scope.index].type = data.type;
      // @TODO: See image disposition and what to take.
      $scope.facts[$scope.index].img = data.object.image;

      if (typeof selected != "undefined")
      selected.forEach(function (element, index, array) {
        if (!$scope.facts[$scope.index].leagues[element]['visible'])
        $scope.facts[$scope.index]['count']++;

        $scope.facts[$scope.index].leagues[element]['visible'] = true;
      });
    });
  };

  $scope.chooseLeague = function (league) {
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
        img: '/img/icon_teemo.png',
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
}]);
