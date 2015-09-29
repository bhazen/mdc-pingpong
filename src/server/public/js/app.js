var app = angular.module('ping-pong', []);

app.controller('gameController', function($scope) {
  var self = this;
  var socket = io();

  self.mode = "waiting";
  self.lastGame = "";
  self.playerOneScore = 0;
  self.playerTwoScore = 0;

  socket.on('clear', function () {
    $scope.$apply(function() {
      self.playerOneScore = 0;
      self.playerTwoScore = 0;
      self.mode = "waiting";
    });
  });

  socket.on('update', function (msg) {
    $scope.$apply(function() {
      self.mode = "game";
      self.playerTwoScore = msg.playerTwo;
      self.playerOneScore = msg.playerOne;
    });
  });

  socket.on('over', function (msg) {
    $scope.$apply(function() {
      self.lastGame = msg;
      self.mode = "waiting";
      self.playerOneScore = 0;
      self.playerTwoScore = 0;
    });
  });

});

angular.element(document).ready(function() {
  angular.bootstrap(document, ['ping-pong']);
});