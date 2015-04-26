/**
 * Created by walter on 15-4-16.
 */

newsApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'pages/newsList.html',
                controller: 'newsListCtrl'
            }).
            when('/content', {
                templateUrl: 'pages/newsContent.html',
                controller: 'newsContentCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
    }
]);
