var Cylon = require('cylon');
var config = require('./config');
var socket = require('socket.io-client')(config.remote);

Cylon.robot({
  connections: {
    edison: {adaptor: 'intel-iot'}
  },

  devices: {
    playerOneButton: {driver: 'button', pin: 3},
    playerTwoButton: {driver: 'button', pin: 4},
    resetButton: {driver: 'button', pin: 5}
  },

  work: function (myEdison) {
    var playerOneScore = 0,
        playerOneButtonDisabled = false,
        playerTwoScore = 0,
        playerTwoButtonDisabled = false,
        buttonDisabledTimeout = 1000;

    myEdison.resetButton.on('push', function () {
      playerOneScore = 0;
      playerTwoScore = 0;
      socket.emit('reset', {});
    });

    myEdison.playerOneButton.on('push', function() {
      if (playerOneButtonDisabled === true) {
        return;
      }

      playerOneButtonDisabled = true;
      playerOneScore += 1;
      updateScore();
      setTimeout(function() {
        playerOneButtonDisabled = false;
      }, buttonDisabledTimeout);
    });

    myEdison.playerTwoButton.on('push', function() {
      if (playerTwoButtonDisabled === true) {
        return;
      }

      playerTwoButtonDisabled = true;
      playerTwoScore += 1;
      updateScore();
      setTimeout(function() {
        playerTwoButtonDisabled = false;
      }, buttonDisabledTimeout);
    });

    function updateScore() {
      var gameStatus = getGameStatus();
      if (gameStatus.over) {
        socket.emit('gameOver', gameStatus.msg);
      } else {
        socket.emit('score', { playerOne: playerOneScore, playerTwo: playerTwoScore });
      }
    }

    function getGameStatus() {
      var result = {
        over: false,
        msg: ''
      };

      if (playerOneScore >= 11 && ((playerOneScore - playerTwoScore) >= 2)) {
        result.over = true;
        result.msg = 'Player one has won';
      }

      if (playerTwoScore >= 11 && ((playerTwoScore - playerOneScore) >= 2)) {
        result.over = true;
        result.msg = 'Player two has won';
      }

      return result;
    }
  }
}).start();