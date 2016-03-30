var twitterStream = angular.module('myApp', ['chart.js'])

twitterStream.controller("mainCtrl", ['$scope', 'socket',
function ($scope, socket) {
  //chart labels
  $scope.labels = ["Supreme", "Palace", "Bape", "CDG", "Hypebeast", "Highsnobiety"];
  //chart colors
  $scope.colors = ['#FF0000', '#FFFFFF', '#8B4513', '#D02B55', '#66757f', "#000000"];
  //intial data values
  $scope.brandData = [0,0,0,0,0,0];

  socket.on('newTweet', function (tweet) {
    console.log(tweet);
    $scope.tweet = tweet.text
    $scope.user = tweet.user.screen_name
    //parse source from payload

    //check source and increment for #supreme tweets
    if ($scope.tweet.indexOf('@Supreme_NYC') !== -1){
        $scope.brandData[0]++
    }

    else if ($scope.tweet.indexOf('@PALACELONDON') !== -1) {
        $scope.brandData[1]++
    }

    else if ($scope.tweet.indexOf('@BAPEOFFICIAL') !== -1) {
        $scope.brandData[2]++
    }

    else if ($scope.tweet.indexOf('@COMMEGARCONS') !== -1) {
        $scope.brandData[3]++
    }

    else if ($scope.tweet.indexOf('@HYPEBEAST') !== -1) {
        $scope.brandData[4]++
    }

    else if ($scope.tweet.indexOf('@highsnobiety') !== -1) {
        $scope.brandData[5]++
    }

  });
}
]);


/*---------SOCKET IO METHODS (careful)---------*/

twitterStream.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});
