angular.
  module('pokeApp').
  config(['$routeProvider',
    function config($routeProvider) {
      $routeProvider.
        when('/pokemon', {
          template: '<pokemon-detail-list></pokemon-detail-list>'
        }).
        when('/pokemon/:pokemonId', {
          template: '<pokemon-detail-page></pokemon-detail-page>'
        }).
        otherwise('/pokemon');
    }
]);