/**
 * Created by walter on 15-4-16.
 */

newsApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/list/:listPage', {
                templateUrl: 'pages/newsList.html',
                controller: 'newsListCtrl'
            }).
            when('/content/:newsId', {
                templateUrl: 'pages/newsContent.html',
                controller: 'newsContentCtrl'
            }).
            otherwise({
                redirectTo: '/list/1'
            });
    }
]);
