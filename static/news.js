/**
 * Created by walter on 15-4-16.
 */

var newsApp = angular.module('newsApp', ['ngRoute', 'ngCookies']);

newsApp.factory('socket', function($rootScope) {
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

newsApp.run(function ($rootScope, $cookieStore) {
    $rootScope.userId = $cookieStore.get('userId');
    if (!$rootScope.userId) {
        $rootScope.userId = new Date().getTime() + parseInt(Math.random()*9000+1000).toString();
        $cookieStore.put('userId', $rootScope.userId);
    }
});
