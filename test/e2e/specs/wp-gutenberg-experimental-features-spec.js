/**
 * External dependencies
 */
import assert from 'assert';
import config from 'config';

/**
 * Internal dependencies
 */
import LoginFlow from '../lib/flows/login-flow.js';
import * as driverManager from '../lib/driver-manager';
import * as dataHelper from '../lib/data-helper';

const mochaTimeOut = config.get( 'mochaTimeoutMS' );
const startBrowserTimeoutMS = config.get( 'startBrowserTimeoutMS' );
const screenSize = driverManager.currentScreenSize();
const host = dataHelper.getJetpackHost();
const gutenbergUser =
	process.env.GUTENBERG_EDGE === 'true' ? 'gutenbergSimpleSiteEdgeUser' : 'gutenbergSimpleSiteUser';

// Experimental Gutenberg features that we depend on in Calypso (and other projects)
// Tests will fail if an experimental feature is no longer being exported from one
// of the @wordpress/* packages. The purpose of these tests is to give us an early
// warning if an experimental feature has been removed or renamed.
const EXPERIMENTAL_FEATURES = {
	'@wordpress/block-editor': [
		'__experimentalBlock',
		'__experimentalBlockPatternsMissing',
		'__experimentalInserterMenuExtension',
	],
	'@wordpress/date': [ '__experimentalGetSettings' ],
	'@wordpress/interface': [ '__experimentalMainDashboardButton' ],
};

/**
 * Given a string, returns a new string with dash separators converted to
 * camelCase equivalent. This is not as aggressive as `_.camelCase` in
 * converting to uppercase, where Lodash will also capitalize letters
 * following numbers.
 *
 * @param {string} string Input dash-delimited string.
 * @returns {string} Camel-cased string.
 */
function camelCaseDash( string ) {
	return string.replace( /-([a-z])/g, ( _, letter ) => letter.toUpperCase() );
}

let driver;

before( async function () {
	this.timeout( startBrowserTimeoutMS );
	driver = await driverManager.startBrowser();
} );

describe( `[${ host }] Experimental features we depend on are available (${ screenSize }) @parallel`, function () {
	this.timeout( mochaTimeOut );

	step( 'Can log in', async function () {
		this.loginFlow = new LoginFlow( driver, gutenbergUser );
		return await this.loginFlow.loginAndStartNewPost( null, true );
	} );

	step( 'Can find experimental package features', function () {
		for ( const [ packageName, features ] of Object.entries( EXPERIMENTAL_FEATURES ) ) {
			// Removes the `@wordpress/` prefix and hyphens from package name
			// The algorithm WP uses to convert package names to variable names is here: https://github.com/WordPress/gutenberg/blob/a03ea51e11a36d0abeecb4ce4e4cea5ffebdffc5/packages/dependency-extraction-webpack-plugin/lib/util.js#L40-L45
			const wpGlobalName = camelCaseDash( packageName.substr( '@wordpress/'.length ) );

			step( packageName, () => {
				step(
					`"${ wpGlobalName }" package should be available in the global window object`,
					async () => {
						const typeofPackage = await driver.executeScript(
							`return typeof window.wp['${ wpGlobalName }']`
						);
						console.log( wpGlobalName, 'typeofPackage:', typeofPackage );
						assert( typeofPackage !== 'undefined', `${ wpGlobalName } is undefined` );
					}
				);

				for ( const feature of features ) {
					step( `${ feature } should be available in ${ packageName }`, async () => {
						const typeofExperimentalFeature = await driver.executeScript(
							`typeof window.wp['${ wpGlobalName }']['${ feature }']`
						);
						assert.notStrictEqual(
							typeofExperimentalFeature,
							'undedfined',
							`${ feature } is undefined`
						);
					} );
				}
			} );
		}
	} );

	step( 'Experimental data we depend on is available', function () {
		// step( 'Can log in', async function () {
		// 	this.loginFlow = new LoginFlow( driver, gutenbergUser );
		// 	return await this.loginFlow.loginAndStartNewPost( null, true );
		// } );

		step(
			`wp.data.select( 'core/editor' ).getEditorSettings().__experimentalBlockPatterns`,
			async () => {
				const __experimentalBlockPatternsArePresent = await driver.executeScript(
					`return Array.isArray( window.wp.data.select( 'core/editor' ).getEditorSettings().__experimentalBlockPatterns )`
				);
				assert(
					__experimentalBlockPatternsArePresent,
					'__experimentalBlockPatterns was not iterable, please contact #team-ganon to update premium pattern highlighting'
				);
			}
		);
		step(
			`wp.data.select( 'core/editor' ).getEditorSettings().__missingExperimentalBlockPatterns`,
			async () => {
				const __missingExperimentalBlockPatternsArePresent = await driver.executeScript(
					`return Array.isArray( window.wp.data.select( 'core/editor' ).getEditorSettings().___missingExperimentalBlockPatterns )`
				);
				assert(
					__missingExperimentalBlockPatternsArePresent,
					'___missingExperimentalBlockPatterns was not iterable, please contact #team-ganon to update premium pattern highlighting'
				);
			}
		);
	} );

	after( async () => {
		return await driver.switchTo().defaultContent();
	} );
} );
