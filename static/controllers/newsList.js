/**
 * Created by walter on 15-4-16.
 */

newsApp.controller('newsListCtrl', function($scope, $routeParams, socket) {
    $scope.newsList = [];
    $scope.listPage = $routeParams.listPage;
    socket.emit('getNewsList', $scope.listPage);
    socket.on('newsList', function (newsList) {
        function dateFormat (newsItem) {
            newsItem.date = newsItem.date.substr(0,10);
            return newsItem;
        }
        $scope.newsList = newsList.map(dateFormat);
    });
});
