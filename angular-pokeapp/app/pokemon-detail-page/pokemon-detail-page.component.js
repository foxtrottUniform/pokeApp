// create isolated component for pokemon detail
angular.
module('pokemonDetailPage').
component('pokemonDetailPage',{
	templateUrl: 'pokemon-detail-page/pokemon-detail-page.template.html',
	controller: ['$scope','$http','$routeParams',
		function PokemonDetailPageController( $scope,$http,$routeParams ){
			
			// fetch id out of URL parameter
			var pokemonId = $routeParams.pokemonId;

			// store base url for later use
			var pokemonAPIbaseUrl = 'https://pokeapi.co/api/v2/pokemon/';

			// build URL for catching base information about current pokemon
			var pokemonDataUrl = pokemonAPIbaseUrl + pokemonId;

			// correct reference variable inside AJAX requests
			var _this = this;

			/*
			* vars for pokemon Data
			*/

			this.pokemonData = [];
			this.pokemonDataEvolution = [];
			this.pokemonDataSpecies = [];
			this.pokemonDataMoves = [];


			// function for retrieving evolution data of pokemon
			function getPokemonEvolutionData(pokemonEvolutionJSON,depth){

				// create an object for the data of evolution steps from current pokemon
				var pokemonEvolutionObj = { 
					'name' : pokemonEvolutionJSON.species.name,
					'image' : '',
					'types' : [],
					'evolution_details' : ''
				};

				var pokemonEvolutionDetails = pokemonEvolutionJSON.evolution_details[0];

				// check how it evolves

				// always append trigger
				if( pokemonEvolutionDetails.trigger &&
					pokemonEvolutionDetails.trigger !== null 
				){

					pokemonEvolutionObj.evolution_details = '[Trigger: ' + pokemonEvolutionDetails.trigger.name + ']\r\n';

					if ( pokemonEvolutionDetails.trigger.name != 'trade') pokemonEvolutionObj.evolution_details += '[### Condition ###]\r\n';

				}

				// min level
				if( pokemonEvolutionDetails.min_level &&
					pokemonEvolutionDetails.min_level !== null 
				){

					pokemonEvolutionObj.evolution_details += '[min. level: ' + pokemonEvolutionDetails.min_level + ']';

				}

				// item
				if( 	pokemonEvolutionDetails.item &&
						pokemonEvolutionDetails.item !== null

				){

					pokemonEvolutionObj.evolution_details += '[use item: ' + pokemonEvolutionDetails.item.name + ']';

				}

				// happiness
				if( 	pokemonEvolutionDetails.min_happiness &&
						pokemonEvolutionDetails.min_happiness !== null

				){

					pokemonEvolutionObj.evolution_details += '[Happiness: ' + pokemonEvolutionDetails.min_happiness + ' (high)]';

				}

				// daytime
				if( 	pokemonEvolutionDetails.time_of_day &&
						pokemonEvolutionDetails.time_of_day !== null

				){

					pokemonEvolutionObj.evolution_details += '\r\n[Daytime: ' + pokemonEvolutionDetails.time_of_day + ']';

				}

				if( 	pokemonEvolutionDetails.location &&
						pokemonEvolutionDetails.location !== null

				){

					pokemonEvolutionObj.evolution_details += '[Evolve near special location]';

				}

				if( 	pokemonEvolutionDetails.min_affection &&
						pokemonEvolutionDetails.min_affection !== null

				){

					pokemonEvolutionObj.evolution_details += '[High affection]';

				}
				
				// url for pokemon Evolution Step details -> want images and type
				var pokemonDataEvolutionUrl = pokemonAPIbaseUrl + pokemonEvolutionObj.name;
				
				/* 
				* AJAX request:
				* Pokemon Evolutions Details
				*/
				$http.get( pokemonDataEvolutionUrl ).then( function(response) {

					// data from current evolution
					var pokemonDataEvolution = response.data;

					// add needed data to evolution object
					pokemonEvolutionObj.image = pokemonDataEvolution.sprites.front_shiny;
					
					// store types in type Array for ng-repeat in template
					pokemonEvolutionObj.types = getEvolutionTypes(pokemonDataEvolution.types);

					// add object to pokemon Evolution Array for ng-repeat in template
					_this.pokemonDataEvolution[depth].push(pokemonEvolutionObj);

				});


			} // end: function

			// create types array for iterated pokemon
			function getEvolutionTypes(typeArray){

				var pokemonEvolutionTypes = [];

				// more than one type possible
				angular.forEach( typeArray, function(type) {

					var pokemonEvolutionType = {'name':''};

					pokemonEvolutionType.name = type.type.name;

					// push in local types array
					pokemonEvolutionTypes.push(pokemonEvolutionType);
					
				});

				return pokemonEvolutionTypes;
			}

			// start creating pokemon Evolution Chain Object
			function createPokemonEvolutionChain(pokemonEvolutionUrl){

				/*  
				* AJAX request:
				* Pokemon Evolution Chain
				*/
				$http.get( pokemonEvolutionUrl ).then( function(response) {

					// actual evolution data
					var pokemonEvolutionArray = response.data.chain.evolves_to;

					// prevent missing evolution error
					if( pokemonEvolutionArray &&
						pokemonEvolutionArray.length
					){

						var pokemonBaseEvolutionUrl = pokemonAPIbaseUrl + response.data.chain.species.name;

						// fetch base pokemon Info then create rest of evolution chain
						$http.get( pokemonBaseEvolutionUrl ).then( function(response) {

							var pokemonBaseData = response.data;

							// create base pokemon object
							var pokemonEvolutionBaseObj = {
								'name' 	: pokemonBaseData.name,
								'image' : pokemonBaseData.sprites.front_shiny,
								'types' : []
							};
								
							// get types out of type array and store it in pokemon Base Evolution Object
							pokemonEvolutionBaseObj.types = getEvolutionTypes(pokemonBaseData.types);

							// loop through evolution depths in the very first Array
							angular.forEach( pokemonEvolutionArray, function(pokemonEvolutionJSON, depth1) {
								
								/*
								* DEPTH : 1
								*/
								
								// create array for each of the evolutions from base Object
								_this.pokemonDataEvolution[depth1] = [];

								// add base pokemon to evolution array
								_this.pokemonDataEvolution[depth1].push(pokemonEvolutionBaseObj);


								// get pokemon evolution data and store it in current evolution chain
								getPokemonEvolutionData(pokemonEvolutionJSON,depth1);


								// check if there are nested evolutions
								// could be: final evolution | 
								// evolutions under different circumstances (level, stones, areas,...)
								if ( pokemonEvolutionJSON.evolves_to &&
									 pokemonEvolutionJSON.evolves_to.length
								) {

									var pokemonEvolutionJSONnested = pokemonEvolutionJSON.evolves_to;

									// loop through each nested evolution
									angular.forEach( pokemonEvolutionJSONnested, function(pokemonEvolutionJSON) {
										
										/*
										* DEPTH : 2
										*/

										getPokemonEvolutionData(pokemonEvolutionJSON,depth1);

									});

								}

							});
						
						});

					}

				
				});

			}

			// var for showing spinner if moves are done loading (everything should also be loaded then)
			this.movesLoaded = false;

			// create pokemon moves object
			function createPokemonMoves(){

				angular.forEach( _this.pokemonData.moves, function( moveObj,index ) {

					var moveDetailsUrl = moveObj.move.url;

					// get details for iterated move
					$http.get( moveDetailsUrl ).then( function(response) {

						var moveData = response.data;

						var moveDetailObj = {
							'name'			: '',
							'accuracy' 		: '',
							'power'			: '',
							'damage_class'	: '',
							'category'		: '',
							'type'			: ''
						};

						// assign values out of response to placeholder object
						moveDetailObj.name = moveData.name;
						moveDetailObj.accuracy = ( moveData.accuracy === null ) ? '-' : moveData.accuracy;
						moveDetailObj.power = ( moveData.power === null ) ? '-' : moveData.power;
						moveDetailObj.damage_class = ( moveData.damage_class === null ) ? '-' : moveData.damage_class.name;
						moveDetailObj.category = ( moveData.meta.category.name === null ) ? '-' : moveData.meta.category.name;
						moveDetailObj.type = ( moveData.type.name === null ) ? '-' : moveData.type.name;

						// push created move Ojbect in Moves Array
						_this.pokemonDataMoves.push(moveDetailObj);


					});

					// movesLoaded = true if we iterate over the last object in array
					if ( _this.pokemonData.moves.length - 1  == index ) _this.movesLoaded = true;

				});

			}

			// set default order to ascending ( =false )
			$scope.reverse = false;
			$scope.moveOrder = null;

			// table order function
			$scope.orderMovesBy = function(moveOrder){

				$scope.reverse = ($scope.moveOrder === moveOrder) ? ! $scope.reverse : false;
				$scope.moveOrder = moveOrder;

			}


			
			/* 
			* 1st AJAX request:
			* Pokemon Data
			*/
			$http.get( pokemonDataUrl ).then( function(response) {

				_this.pokemonData = response.data;

				// create moves object for use in template with ng-repeat
				createPokemonMoves();


				// build URL for catching species data, which holds evolution chain URL
				var pokemonSpeciesUrl = _this.pokemonData.species.url;


				/*  
				* AJAX request:
				* Pokemon Species
				*/
				$http.get( pokemonSpeciesUrl ).then( function(response) {
 

					_this.pokemonDataSpecies = response.data;
					
					var pokemonEvolutionUrl;

					// check if current pokemon species is already an evolution
					// need to start from the very first pokemon in evolution chain

					if( _this.pokemonDataSpecies.evolves_from_species === null ){
						
						pokemonEvolutionUrl = _this.pokemonDataSpecies.evolution_chain.url;
						createPokemonEvolutionChain(pokemonEvolutionUrl);

					}else{ // go back to first pokemon in chain

						$http.get( _this.pokemonDataSpecies.evolves_from_species.url ).then( function(response) {
							
							var currentSpeciesData = response.data;
							
							if( currentSpeciesData.evolves_from_species !== null ){

								$http.get( currentSpeciesData.evolves_from_species.url ).then( function(response) {

									pokemonEvolutionUrl = response.data.evolution_chain.url;
									createPokemonEvolutionChain(pokemonEvolutionUrl);

								});


							}else{

								pokemonEvolutionUrl = currentSpeciesData.evolution_chain.url;
								createPokemonEvolutionChain(pokemonEvolutionUrl);

							}

						});


					}


				});


			});

		}
	]

});