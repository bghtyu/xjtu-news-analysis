/**
 * Created by walter on 15-4-16.
 */

angular.module('newsApp', []);

angular.module('newsApp').factory('socket', function($rootScope) {
    var socket = io();
    return {
        on: function(eventName, callback) {
            socket.on(eventName, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function(eventName, data, callback) {
            socket.emit(eventName, data, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    }
});

angular.module('newsApp').controller('newsListCtrl', function($scope, socket) {
    $scope.newsList = [];
    socket.on('newsList', function (newsList) {
        $scope.newsList = newsList;
    });
    socket.emit('getNewsList');
});