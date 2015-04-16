var app = angular.module('UrfMadnessApp.Services', []);

app.factory('API', ['$http', function ($http) {
  var service = {};

  service.random = function (callback) {
    var uri = '/random';
    $http.get(uri).then(function (data) {
      callback(data.data);
    });
  };

  service.stats = function (callback) {
    var uri = '/stats';
    $http.get(uri).then(function (data) {
      callback(data.data);
    });
  };

  return service;
}]);
