describe('PokeAppController', function() {

  beforeEach(module('pokeApp'));

  it('should create a `pokemon list` with 150 pokemons', inject(function($controller) {
    var scope = {};
    var ctrl = $controller('pokemonDetailList', {$scope: scope});

    expect(scope.pokemons.length).toBe(150);
  }));

});