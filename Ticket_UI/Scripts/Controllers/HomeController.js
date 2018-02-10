//HomeController code
app.controller('HomeController', function ($scope, $timeout, $q, $log, $mdToast) {
    var last = {
        bottom: true,
        top: false,
        left: false,
        right: true
    };

    $scope.toastPosition = angular.extend({}, last);

    $scope.getToastPosition = function () {
        sanitizePosition();

        return Object.keys($scope.toastPosition)
            .filter(function (pos) { return $scope.toastPosition[pos]; })
            .join(' ');
    };

    function sanitizePosition() {
        var current = $scope.toastPosition;

        if (current.bottom && last.top) current.top = false;
        if (current.top && last.bottom) current.bottom = false;
        if (current.right && last.left) current.left = false;
        if (current.left && last.right) current.right = false;

        last = angular.extend({}, current);
    }

    $scope.showSimpleToast = function () {
        var pinTo = $scope.getToastPosition();

        $mdToast.show(
            $mdToast.simple()
                .textContent('Simple Toast!')
                .position(pinTo)
                .hideDelay(3000)
        );
    };
    $scope.WelcomeNote = "Book flights, trains and buses";
    $scope.selectedItem = null;
    $scope.searchText = null;
    $scope.simulateQuery = false;
    $scope.isDisabled = false;
    $scope.searchText = null;

    $scope.querySearch = function (query) {
        var results = query ? $scope.states.filter(createFilterFor(query)) : $scope.states,
            deferred;
        if ($scope.simulateQuery) {
            deferred = $q.defer();
            $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
            return deferred.promise;
        } else {
            return results;
        }
    }

    // list of `state` value/display objects
    $scope.states = loadAll();
    $scope.qSearch = $scope.querySearch($scope.searchText);

    $scope.newState = newState;

    function newState(state) {
        alert("Sorry! You'll need to create a Constitution for " + state + " first!");
    }

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */

    function searchTextChange(text) {
        $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
        $log.info('Item changed to ' + JSON.stringify(item));
    }

    /**
     * Build `states` list of key/value pairs
     */
    function loadAll() {
        var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
              Wisconsin, Wyoming';

        return allStates.split(/, +/g).map(function (state) {
            return {
                value: state.toLowerCase(),
                display: state
            };
        });
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(state) {
            return (state.value.indexOf(lowercaseQuery) === 0);
        };

    }
});