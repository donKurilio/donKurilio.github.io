angular.module("TableApp", ["ngResource"])
    .controller("TableController", ["$scope", "$resource", function ($scope, $resource) {
        var modalDomEl = $('#myModal');
        var data = $resource("./persons.json").get(function () {
            $scope.persons = data.persons;
        });
        $scope.editPerson = function (id) {
            $scope.isEditing = true;
            $scope.ModalTitle = 'Редактирование записи';
            $scope.bufPerson = _.clone(_.find($scope.persons, function (obj) {
                return obj.id == id
            }));
            modalDomEl.modal('toggle');
        };
        $scope.savePerson = function (id) {
            if ($scope.MyForm.$valid) {
                id ?
                    $scope.persons = _.map($scope.persons, function (obj) {
                        return obj.id == id ? $scope.bufPerson : obj;
                    }) :
                    $scope.persons.push(_.extend($scope.bufPerson, {"id": _.last($scope.persons).id + 1}));
                modalDomEl.modal('toggle');
            }
        };
        $scope.addPerson = function () {
            $scope.ModalTitle = 'Добавление записи';
            $scope.isEditing = false;
            $scope.bufPerson = {};
            modalDomEl.modal('toggle');
        };
        $scope.delPerson = function (id) {
            $scope.persons = _.reject($scope.persons, function (obj) {
                return obj.id == id;
            });
            modalDomEl.modal('toggle');
        }
    }]);