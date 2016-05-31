angular.module("TableApp",["ngResource"])
    .controller("TableController",["$scope","$resource",function($scope,$resource) {
        $scope.isEditing = false;
        var modalDomEl = $('#myModal');
        var indexE = -1; // индекс редактируемой записи
        var data = $resource("../persons.json").get(function(){
            $scope.persons = data.persons;
        });
        $scope.editPerson = function(index) {
            $scope.isEditing = true;
            $scope.ModalTitle = 'Редактирование записи';
            indexE = index;
            $scope.bufPerson = angular.copy($scope.persons[index]);
            modalDomEl.modal('toggle');
        }
        $scope.savePerson = function() {
            if ($scope.MyForm.$valid) {
                indexE!=-1 ?
                    $scope.persons[indexE] = $scope.bufPerson : // если запись редактируется
                    $scope.persons.push($scope.bufPerson); // если запись добавляется
                modalDomEl.modal('toggle');
                $scope.bufPerson = {};
                indexE=-1;
                $scope.isEditing = false;
            }
        }
        $scope.addPerson = function() {
            $scope.isEditing = false;
            indexE=-1;
            $scope.bufPerson = {};
            modalDomEl.modal('toggle');
            $scope.ModalTitle = 'Добавление записи';
        }
        $scope.delPerson = function() {
            $scope.persons.splice(indexE,1);
            indexE=-1;
            modalDomEl.modal('toggle');
        }
    }]);