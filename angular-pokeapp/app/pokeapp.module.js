// create angular module -> root element and add needed modules as dependency
var pokeApp = angular.module('pokeApp',[
	'ngRoute',
	'ngAnimate',
	'pokemonDetailList',
	'pokemonDetailPage',
	'core'
	]
);