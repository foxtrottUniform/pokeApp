// format String filter: 
// capitalize starting letter;
// remove '-' sign and capitalize following letter
angular.module('core').filter('formatString', function() {
	return function(x) {

		// @side Note: in the browser console i get an error that x is undefined; couldnt figure out why;
		// also the filter is working and if i just return x; i get no error

		// return x;

		var i, c, hitPos, txt = '';

		for ( i = 0; i < x.length; i++ ) {
			
			// current character
			c = x[i];

			// capitalize characters
			if ( i == 0 || i == hitPos ) c = c.toUpperCase();

			// check if c euqals '-' sign; if so replace it whith space
			// and capitalize following letter
			if( c == '-' ){
				c = c.replace('-',' ');
				hitPos = i+1;
			}

			txt += c;
		}

		return txt;

	};
});