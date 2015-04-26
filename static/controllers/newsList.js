/**
 * Created by walter on 15-4-16.
 */

newsApp.controller('newsListCtrl', function($scope, socket) {
    $scope.newsList = [];
    socket.on('newsList', function (newsList) {
        $scope.newsList = newsList;
    });
    socket.emit('getNewsList');
});