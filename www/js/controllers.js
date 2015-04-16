var app = angular.module('UrfMadnessApp.Controllers', ['ngStorage']);

app.controller('HomeCtrl', ['$scope', '$http', '$localStorage', 'API', function ($scope, $http, $localStorage, API) {
  // Default fact identifier value
  //$scope.$storage = $localStorage.$default({ factId: 0 });

  var leagues = [ 'unranked', 'bronze', 'silver', 'gold', 'platinum', 'diamond', 'master', 'challenger' ];

  var sentences = {
    'kills': 'Average number of kills per player',
    'double': 'Average number of doublekills per player',
    'triple': 'Average number of triplekills per player',
    'quadra': 'Average number of quadrakills per player',
    'penta': 'Average number of pentakills per player',
    'picks': 'Champion pick percentage: ',
    'items': 'Item buy percentage: ',
    'bans': 'Champion ban percentage: ',
    'spells': 'Selected spell percentage: ',
    'firstblood': 'Average game time of the firstblood',
    'firstDragon': 'Average game time of the first dragon killed',
    'firstBaron': 'Average game time of the first baron killed',
    'firstLevel6': 'Average game time of the first player reaching level 6',
    'damageToChampAvg': 'Average damage dealt to champion',
    'totalDamageAvg': 'Average total damage dealt',
    'goldEarnedAvg': 'Average gold earned',
    'matchDurationAvg': 'Average match duration'
  };

  var units = {
    'kills': 'perPlayer',
    'double': 'perPlayer',
    'triple': 'perPlayer',
    'quadra': 'perPlayer',
    'penta': 'perPlayer',
    'picks': 'percent',
    'items': 'percent',
    'bans': 'percent',
    'spells': 'percent',
    'firstblood': 'avg',
    'firstDragon': 'avg',
    'firstBaron': 'avg',
    'firstLevel6': 'avg',
    'damageToChampAvg': 'avg',
    'totalDamageAvg': 'avg',
    'goldEarnedAvg': 'avg',
    'matchDurationAvg': 'avg'
  };

  // Default const
  $scope.stats = true;
  $scope.index = 0;
  $scope.max = 0;
  $scope.facts = {
    0: {
      count: 0,
      img: '/img/icon_teemo.png',
      type: 'pick',
      sentence: 'This is a sentence',
      object: {},
      leagues: {
        unranked: { order: 0, visible: false, value: 0, unit: '' },
        bronze: { order: 1, visible: false, value: 0, unit: '' },
        silver: { order: 2, visible: false, value: 0, unit: '' },
        gold: { order: 3, visible: false, value: 0, unit: '' },
        platinum: { order: 4, visible: false, value: 0, unit: '' },
        diamond: { order: 5, visible: false, value: 0, unit: '' },
        master: { order: 6, visible: false, value: 0, unit: '' },
        challenger: { order: 7, visible: false, value: 0, unit: '' }
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
      $scope.facts[$scope.index].type = data.type;
      $scope.facts[$scope.index].sentence = sentences[data.type];
      $scope.facts[$scope.index].img = data.icon.replace(".webp", ".jpg");
      leagues.forEach(function (element, index, array) {
        // @TODO: Check if any type is missing.
        // @TODO: Work with the null case.
        // @TODO: Change sentence design.
        // @TODO: Tooltip champion/item (LAST PRIORITY).
        // @TODO: Get global game stats.
        // @TODO: Add object data.
        if (data.data[element] != null) {
          $scope.facts[$scope.index].leagues[element]['fact']['value'] = data.data[element][units[data.type]];
          $scope.facts[$scope.index].leagues[element]['fact']['unit'] = units[data.type];
        }
      });

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
      $scope.facts[$scope.index] = {
        count: 0,
        img: '/img/icon_teemo.png',
        type: 'pick',
        sentence: 'This is a sentence',
        object: {},
        leagues: {
          unranked: { order: 0, visible: false, value: 0, unit: '' },
          bronze: { order: 1, visible: false, value: 0, unit: '' },
          silver: { order: 2, visible: false, value: 0, unit: '' },
          gold: { order: 3, visible: false, value: 0, unit: '' },
          platinum: { order: 4, visible: false, value: 0, unit: '' },
          diamond: { order: 5, visible: false, value: 0, unit: '' },
          master: { order: 6, visible: false, value: 0, unit: '' },
          challenger: { order: 7, visible: false, value: 0, unit: '' }
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
