/**
* Functions for working with theme search filters. The filter syntax is
* {taxonomy}:{term}
* allowing whitespace after the :
*
* Valid values for {taxonomy} and {term} are contained in the
* `taxonomies` object.
*/

/**
 * External dependencies
 */
import forIn from 'lodash/forIn';

// Regular expressions for matching "taxonomy:term" search-box syntax
const FILTER_REGEX_STRING = '(\\w+)\\:\\s*([\\w-]+)';
const FILTER_REGEX_GLOBAL = new RegExp( FILTER_REGEX_STRING, 'g' );
const FILTER_REGEX_SINGLE = new RegExp( '^' + FILTER_REGEX_STRING + '$' );
const FILTER_TAXONOMY_GROUP = 1;
const FILTER_TERM_GROUP = 2;

/* eslint-disable */
/* Autogenerated object */
const taxonomies = {
    "color": [
        "black",
        "blue",
        "brown",
        "dark",
        "gray",
        "green",
        "light",
        "orange",
        "pink",
        "purple",
        "red",
        "silver",
        "tan",
        "white",
        "yellow"
    ],
    "column": [
        "four-columns",
        "left-sidebar",
        "one-column",
        "right-sidebar",
        "three-columns",
        "two-columns"
    ],
    "feature": [
        "accessibility-ready",
        "author-bio",
        "blog-excerpts",
        "breadcrumb-navigation",
        "classic-menu",
        "custom-background",
        "custom-colors",
        "custom-header",
        "custom-menu",
        "editor-style",
        "featured-content-with-pages",
        "featured-image-header",
        "featured-images",
        "fixed-menu",
        "flexible-header",
        "front-page-post-form",
        "full-width-template",
        "infinite-scroll",
        "microformats",
        "multiple-menus",
        "one-page",
        "post-formats",
        "post-slider",
        "rtl-language-support",
        "site-logo",
        "sticky-post",
        "testimonials",
        "theme-options",
        "threaded-comments",
        "translation-ready",
        "video",
        "wordads"
    ],
    "layout": [
        "fixed-layout",
        "fluid-layout",
        "responsive-layout"
    ],
    "subject": [
        "announcement",
        "art",
        "artwork",
        "blog",
        "business",
        "cartoon",
        "collaboration",
        "craft",
        "design",
        "education",
        "fashion",
        "food",
        "gaming",
        "holiday",
        "hotel",
        "journal",
        "lifestream",
        "magazine",
        "major-league-baseball",
        "mlb",
        "music",
        "nature",
        "news",
        "outdoors",
        "partner",
        "photoblogging",
        "photography",
        "portfolio",
        "productivity",
        "real-estate",
        "school",
        "scrapbooking",
        "seasonal",
        "sports",
        "travel",
        "tumblelog",
        "video",
        "wedding"
    ],
    "style": [
        "abstract",
        "artistic",
        "bright",
        "clean",
        "colorful",
        "conservative",
        "contemporary",
        "curved",
        "dark",
        "earthy",
        "elegant",
        "faded",
        "flamboyant",
        "flowery",
        "formal",
        "funny",
        "futuristic",
        "geometric",
        "glamorous",
        "grungy",
        "hand-drawn",
        "handcrafted",
        "humorous",
        "industrial",
        "light",
        "metallic",
        "minimal",
        "modern",
        "natural",
        "paper-made",
        "playful",
        "professional",
        "retro",
        "simple",
        "sophisticated",
        "tech",
        "textured",
        "traditional",
        "urban",
        "vibrant",
        "whimsical"
    ]
};
/* eslint-enable */

let termTable;

/**
 * @return {Object} a table of terms to taxonomies.
 */
function getTermTable() {
	if ( ! termTable ) {
		termTable = {};
		forIn( taxonomies, ( terms, taxonomy ) => {
			terms.forEach( ( term ) => {
				termTable[ term ] = taxonomy;
			} );
		} );
	}
	return termTable;
}

// return specified part of a taxonomy:term string
function splitFilter( filter, group ) {
	const match = filter.match( FILTER_REGEX_SINGLE );
	if ( match ) {
		return match[ group ];
	}
	return '';
}

// return term from a taxonomy:term string
function getTerm( filter ) {
	return splitFilter( filter, FILTER_TERM_GROUP );
}

// return taxonomy from a taxonomy:term string
function getTaxonomy( filter ) {
	return splitFilter( filter, FILTER_TAXONOMY_GROUP );
}

/**
 * Given the 'term' part, returns a complete filter
 * in "taxonomy:term" search-box format.
 *
 * @param {string} term - the term slug
 * @return {string} - complete taxonomy:term filter, or empty string if term is not valid
 */
export function getFilter( term ) {
	const terms = getTermTable();
	if ( terms[ term ] ) {
		return `${ terms[ term ] }:${ term }`;
	}
	return '';
}

/**
 * Checks that a taxonomy:term filter is valid, using the theme
 * taxonomy data.
 *
 * @param {string} filter - filter in form taxonomy:term
 * @return {boolean} true if filter pair is valid
 */
function filterIsValid( filter ) {
	return getTermTable()[ getTerm( filter ) ] === getTaxonomy( filter );
}

/**
 * Return a sorted array of filter terms.
 *
 * Sort is alphabetical on the complete "taxonomy:term" string.
 *
 * @param {array} terms - Array of term strings
 * @return {array} sorted array
 */
export function sortFilterTerms( terms ) {
	return terms.map( getFilter ).filter( filterIsValid ).sort().map( getTerm );
}

/**
 * Return a string of valid, sorted, comma-separated filter
 * terms from an input string. Input may contain search
 * terms (which will be ignored) as well as filters.
 *
 * @param {string} input - the string to parse
 * @return {string} comma-seperated list of valid filters
 */
export function getSortedFilterTerms( input ) {
	const matches = input.match( FILTER_REGEX_GLOBAL );
	if ( matches ) {
		const terms = matches.filter( filterIsValid ).map( getTerm );
		return sortFilterTerms( terms ).join( ',' );
	}
	return '';
}

/**
 * Strips any "taxonomy:term" filter strings from the input.
 *
 * @param {string} input - the string to parse
 * @return {string} input string minus any filters
 */
export function stripFilters( input ) {
	return input.replace( FILTER_REGEX_GLOBAL, '' ).trim();
}

export function getSubjects() {
	return taxonomies.subject;
}
