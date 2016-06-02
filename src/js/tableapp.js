angular.module("TableApp", ["ngResource"])
    .controller("TableController", ["$scope", "$resource", function ($scope, $resource) {
        $scope.showModal = false;
        var data = $resource("./persons.json").get(function () {
            $scope.persons = data.persons;
        });
        $scope.editPerson = function (id) {
            $scope.isEditing = true;
            $scope.ModalTitle = 'Редактирование записи';
            $scope.bufPerson = angular.copy(_.find($scope.persons, function (obj) {
                return obj.id === id
            }));
            $scope.showModal = true;
        };
        $scope.savePerson = function (id) {
            if (id!==undefined) {
                $scope.persons = _.map($scope.persons, function (obj) {
                    return obj.id === id ? $scope.bufPerson : obj;
                })
            }
            else {
                $scope.bufPerson.id = _.max(_.pluck($scope.persons, "id")) + 1;
                $scope.persons.push($scope.bufPerson);
            }
            $scope.showModal = false;
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
            $scope.showModal = false;
        }
    }]);