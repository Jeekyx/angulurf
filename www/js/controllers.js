var app = angular.module('UrfMadnessApp.Controllers', ['ngStorage', 'ngAnimate']);

app.controller('HomeCtrl', ['$scope', '$http', '$localStorage', '$timeout', 'API',
function ($scope, $http, $localStorage, $timeout, API) {
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
    'firstDragon': 'Average game time of the first dragon kill',
    'firstBaron': 'Average game time of the first baron kill',
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
    'firstblood': 'timestamp',
    'firstDragon': 'timestamp',
    'firstBaron': 'timestamp',
    'firstLevel6': 'timestamp',
    'damageToChampAvg': 'avg',
    'totalDamageAvg': 'avg',
    'goldEarnedAvg': 'avg',
    'matchDurationAvg': 'timestamp'
  };

  // Default const
  $scope.statsData = {}
  $scope.contentShown = true;
  $scope.stats = true;
  $scope.index = 0;
  $scope.max = 0;
  $scope.facts = {
    0: {
      count: 0,
      img: '',
      type: 'picks',
      sentence: '',
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

  API.stats(function (data) {
    $scope.statsData = data;
    console.log(data);
  });

  $scope.roundUp = function () {
    if (units[$scope.facts[$scope.index].type] == 'avg')
    return 0;

    return 2;
  }

  $scope.randomLeagueGenerator = function () {
    var id = Math.floor(Math.random() * leagues.length);
    return leagues[id];
  };

  $scope.randomFactPopulator = function (selected) {
    API.random(function (data) {
      $scope.facts[$scope.index].type = data.type;
      $scope.facts[$scope.index].sentence = sentences[data.type];
      $scope.facts[$scope.index].img = data.icon.replace(".webp", ".jpg");
      if (typeof data.object != "undefined")
      $scope.facts[$scope.index].object = data.object;

      leagues.forEach(function (element, index, array) {
        $scope.facts[$scope.index].leagues[element]['name'] = element;
        if (data.data[element] != null) {
          $scope.facts[$scope.index].leagues[element]['value'] = data.data[element][units[data.type] == 'timestamp' ? 'avg' : units[data.type]];
          $scope.facts[$scope.index].leagues[element]['unit'] = units[data.type];
        } else {
          $scope.facts[$scope.index].leagues[element]['value'] = null;
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
      $scope.contentShown = false;
      $timeout(function () {
        $scope.index--;
        $timeout(function () {
          $scope.contentShown = true;
        }, 150);
      }, 150);
    }
  };

  $scope.next = function () {
    $scope.contentShown = false;
    $timeout(function () {
      $scope.index++;
      $timeout(function () {
        if ($scope.index > $scope.max) {
          $scope.facts[$scope.index] = jQuery.extend(true, {}, $scope.facts[$scope.index - 1]);
          $scope.facts[$scope.index].object = {};
          var selected = [];
          leagues.forEach(function (element, index, array) {
            if ($scope.facts[$scope.index - 1].leagues[element]['visible'])
            selected.push(element);
          });
          $scope.randomFactPopulator(selected);
          $scope.max = $scope.index;
        }
        $scope.contentShown = true;
      }, 150);
    }, 150);
  };

  $scope.randomFactPopulator();
}]);
