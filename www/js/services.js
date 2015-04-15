var app = angular.module('UrfMadnessApp.Services', []);

app.factory('API', ['$http', function ($http) {
  var service = {};

  service.random = function (callback) {
    var uri = '/static/data.json';
    $http.get(uri).then(function (data) {
      callback(data.data);
    });
  };

  return service;
}]);
