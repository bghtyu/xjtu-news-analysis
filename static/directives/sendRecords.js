/**
 * Created by walter on 15-5-2.
 */

newsApp.directive('sendRecords', function( $interval, socket ) {
    function link( $scope ) {
        var timer = $interval(function() {
            var listRecord = {
                userId : $scope.userId,
                time : Date.now()
            };
            if ($scope.newsItem) {
                listRecord.recordType = 'content';
                listRecord.newsId = $scope.newsItem._id;
            } else {
                listRecord.recordType = 'list';
                listRecord.newsId = $scope.newsList[0]._id;
            }
            socket.emit('listRecord', listRecord);
        }, 1000);

        $scope.$on("$destroy", function( event ) {
            $interval.cancel( timer );
        });
    }
    return({
        restrict: 'C',
        link: link
    });
});