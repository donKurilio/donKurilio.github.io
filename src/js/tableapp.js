angular.module("TableApp", ["ngResource", "ngAnimate"])
    .controller("TableController", ["$scope", "$resource", function ($scope, $resource) {
        $scope.showModal = false;
        $scope.sortType = 'id';
        $scope.sortReverse = false;
        var data = $resource("./persons.json").get(function () {
            $scope.persons = data.persons;
        });
        $scope.editPerson = function (id) {
            $scope.bufPerson = angular.copy(_.find($scope.persons, function (obj) {
                return obj.id === id
            }));
            $scope.isEditing = true;
            $scope.ModalTitle = 'Редактирование записи';
            $scope.showModal = true;
        };
        $scope.savePerson = function (id) {
            if (id !== undefined) {
                $scope.persons = _.map($scope.persons, function (obj) {
                    return obj.id === id ? $scope.bufPerson : obj;
                })
            }
            else {
                $scope.bufPerson.id = _.max(_.pluck($scope.persons, "id")) + 1;
                $scope.persons.push($scope.bufPerson);
            }
            $scope.closeModal();
        };
        $scope.addPerson = function () {
            $scope.ModalTitle = 'Добавление записи';
            $scope.isEditing = false;
            $scope.bufPerson = {};
            $scope.showModal = true;
        };
        $scope.delPerson = function (id) {
            $scope.persons = _.reject($scope.persons, function (obj) {
                return obj.id === id;
            });
            $scope.closeModal();
        };
        $scope.sortBy = function (attr) {
            if ($scope.sortType === attr) $scope.sortReverse = !$scope.sortReverse;
            else {
                $scope.sortType = attr;
                $scope.sortReverse = false;
            }
        };
        $scope.closeModal = function () {
            $scope.showModal = false;
            $scope.MyForm.$setPristine();
        }
    }]);