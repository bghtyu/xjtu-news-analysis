/**
 * Created by walter on 15-4-16.
 */

newsApp.controller('newsListCtrl', function($scope, $routeParams, socket) {
    $scope.newsList = [];
    $scope.listPage = $routeParams.listPage;
    socket.emit('getNewsList', $scope.listPage);
    socket.on('newsList', function (result) {
        function dateFormat (newsItem) {
            newsItem.date = newsItem.date.substr(0,10);
            return newsItem;
        }
        $scope.newsList = result.newsList.map(dateFormat);
        $scope.pageMax = result.pageMax;
    });
});

newsApp.directive('pageList', function() {
    function pageItem (options) {
        var disabledStr = ' class="disabled"';
        var activeStr = ' class="active"';
        var preStr = [
            ' aria-label="Previous"',
            '<span aria-hidden="true">&laquo;</span>'
        ];
        var nextStr = [
            ' aria-label="Next"',
            '<span aria-hidden="true">&raquo;</span>'
        ];

        return '<li' + (options.disabled ? disabledStr : '')
            + (options.active ? activeStr : '')
            + '><a href="#/list/'
            + options.page
            + '"'
            + (options.pre ? (preStr[0]+'>'+preStr[1]) : '')
            + (options.next ? (nextStr[0]+'>'+nextStr[1]) : '')
            + (!(options.pre || options.next) ? ('>'+options.page) : '')
            + '</a></li>';
    }

    function pageMake (listPage, pageMax) {
        var page = parseInt(listPage);
        var pageSelector = '';
        var selectorLength = 7;

        if (page < 4) {
            var selectorStart = 1-page;
        } else if (page > (pageMax - 3)) {
            selectorStart = pageMax-page+1-selectorLength;
        } else {
            selectorStart = (1-selectorLength)/2;
        }

        pageSelector += pageItem({ page: (page-1<1)?1:page-1, pre: true, disabled: (page-1<1)?true:null });
        for (var i=selectorStart; i<selectorLength+selectorStart; i++ ) {
                pageSelector += pageItem({ page: page+i, active: (i==0)?true:null });
        }
        pageSelector += pageItem({ page: (page+1>pageMax)?pageMax:page+1, next: true, disabled: (page+1>pageMax)?true:null });

        return pageSelector;
    }

    return {
        restrict: 'C',
        link: function (scope, element) {
            scope.$watch(
                function () { return scope.pageMax; },
                function () {
                    if (scope.pageMax) {
                        element.html(pageMake(scope.listPage, scope.pageMax));
                    }
                }
            );
        }
    };
});
