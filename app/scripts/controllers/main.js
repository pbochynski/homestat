'use strict';


angular.module('homestatApp')
  .controller('MainCtrl', function ($scope, $http, $interval) {

    $scope.addTodo = function () {
      $scope.todos.push($scope.todo);
      $scope.todo = '';
    };
    $scope.onRegulator = function () {
      $http.put("/regulator", $scope.regulator);
    };
    $scope.onHeater = function () {
      $http.put("/heater", $scope.heater);
    };
    $scope.reload = function () {
      $http.get("/stat")
        .success(function (response) {
          $scope.regulator = response.regulator;
          $scope.heater = response.heater;
          $scope.sensors = response.sensors;
        });
    };
    $scope.reload();

    $interval(function () {
      $http.get("/stat")
        .success(function (response) {
          $scope.sensors = response.sensors;
        });
    }, 5000);

  });


