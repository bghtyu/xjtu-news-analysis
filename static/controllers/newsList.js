/**
 * Created by walter on 15-4-16.
 */

angular.module('newsApp').controller('newsListCtrl', function($scope, socket) {
    $scope.newsList = [];
    socket.emit('getNewsList');
    socket.on('newsList', function (newsList) {
        $scope.newsList = newsList;
    });
});