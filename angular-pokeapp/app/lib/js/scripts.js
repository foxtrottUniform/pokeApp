// check if given elem is scrolled in isInViewport
function isInViewport(elem) {
    var bounding = elem.getBoundingClientRect();
    
    // need only vertical position
    return (
        bounding.top >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );
};

// iterate over desired elements
function checkElements(){
	
	// only animate which arent already animated
	var elems = document.querySelectorAll('.animInView:not(.anim)');

	for(var i = 0; i < elems.length; i++ ){

		var curElem = elems[i];

		if( isInViewport(curElem) ){
			if ( ! curElem.classList.contains('anim') )	curElem.className += ' anim';
		}

	}
}

// on scroll | on load search for elements that get animated
window.onscroll = function(){ checkElements() };

// would need the onload function for elements on the start of page, f.e. jumbotron at pokemon detail page
// with angular couldnt figure out in appropriate time why the onload doesnt work as without angular
// window.onload = function(){ checkElements() };