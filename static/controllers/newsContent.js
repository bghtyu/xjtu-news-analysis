/**
 * Created by walter on 15-4-16.
 */

newsApp.controller('newsContentCtrl', function($scope, $routeParams, socket) {
    $scope.newsItem = {};
    $scope.newsItem.newsId = $routeParams.newsId;
    socket.on('newsContent', function (newsContent) {
        $scope.newsItem = newsContent;
    });
    socket.emit('getNewsContent', $scope.newsItem.newsId);
});

newsApp.directive('newsContent', function() {
    return {
        restrict: 'C',
        link: function (scope, element) {
            scope.$watch(
                function () { return scope.newsItem.newsId; },
                function () {
                    element.html(scope.newsItem.body);
                }
            );
        }
    };
});