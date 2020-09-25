// create isolated component for pokemon detail list view
angular.
module('pokemonDetailList').
component('pokemonDetailList',{
	templateUrl: 'pokemon-detail-list/pokemon-detail-list.template.html',
	controller: function PokemonDetailListController($scope,$http){

		// array with pokemon data for ngrepeat
		this.pokemons = [];

		// control var for showing spinner
		this.pokemonLoaded = false;

	 	// needed in ajax request for correct reference outside of return function
		var _this = this;

		// fetch pokemon data from poke api
		$http.get('https://pokeapi.co/api/v2/pokemon?limit=150&offset=0').
		then(function(response) {

			// response data
			var pokemonData = response.data.results;

			// result data is a json with name and url for details to that pokemon;
			// need to fetch pokemon details for all of the pokemon -> needed for sorting by type of pokemon
			angular.forEach( pokemonData, function( pokemon,index ) {
				
				var pokeURL = pokemon.url;

				$http.get( pokeURL ).then(function(response) {

					_this.pokemons.push(response.data);

				});

				// control var for spinner
				if( pokemonData.length - 1 == index ) _this.pokemonLoaded = true;

			});

		});

		// set default order property for select dropdown
	    this.orderProperty = 'order';

	}

});