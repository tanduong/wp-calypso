/**
 * External dependencies
 */
import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import omit from 'lodash/omit';

/**
 * Internal dependencies
 */
import {
	PLUGINS_RECEIVE,
	PLUGINS_REQUEST,
	PLUGINS_REQUEST_SUCCESS,
	PLUGINS_REQUEST_FAILURE,
	PLUGIN_ACTIVATE_REQUEST,
	PLUGIN_ACTIVATE_REQUEST_SUCCESS,
	PLUGIN_ACTIVATE_REQUEST_FAILURE,
	PLUGIN_DEACTIVATE_REQUEST_SUCCESS,
	PLUGIN_UPDATE_REQUEST_SUCCESS,
	PLUGIN_AUTOUPDATE_ENABLE_REQUEST_SUCCESS,
	PLUGIN_AUTOUPDATE_DISABLE_REQUEST_SUCCESS,
	PLUGIN_INSTALL_REQUEST_SUCCESS,
	PLUGIN_REMOVE_REQUEST_SUCCESS
} from 'state/action-types';
import {
	ACTIVATE_PLUGIN
} from '../constants';
import { isRequesting, hasRequested, plugins } from '../reducer';
import status from '../status/reducer';
import { akismet, jetpack } from './fixtures/plugins';

describe( 'reducer:', () => {
	describe( 'isRequesting', () => {
		it( 'should track when fetches start', () => {
			const state = isRequesting( undefined, {
				type: PLUGINS_REQUEST,
				siteId: 'one.site'
			} );
			expect( state ).to.eql( { 'one.site': true } );
		} );

		it( 'should track when fetches end', () => {
			const state = isRequesting( undefined, {
				type: PLUGINS_RECEIVE,
				siteId: 'one.site'
			} );
			expect( state ).to.eql( { 'one.site': false } );
		} );
	} );

	describe( 'hasRequested', () => {
		it( 'should track when fetches start', () => {
			const state = hasRequested( undefined, {
				type: PLUGINS_REQUEST,
				siteId: 'one.site'
			} );
			expect( state ).to.eql( { 'one.site': true } );
		} );

		it( 'should not track when fetches end', () => {
			const state = hasRequested( undefined, {
				type: PLUGINS_RECEIVE,
				siteId: 'one.site'
			} );
			expect( state ).to.not.eql( { 'one.site': false } );
		} );
	} );

	describe( 'plugins', () => {
		it( 'should load the plugins on this site', () => {
			const originalState = deepFreeze( { 'one.site': [] } );
			const state = plugins( originalState, {
				type: PLUGINS_REQUEST_SUCCESS,
				siteId: 'one.site',
				data: [ akismet ]
			} );
			expect( state ).to.eql( { 'one.site': [ akismet ] } );
		} );

		it( 'should load an empty set if there is an error', () => {
			const originalState = deepFreeze( { 'one.site': [] } );
			const testError = new Error( 'Could not fetch plugins for Site One.' );
			testError.name = 'RequestError';
			const state = plugins( originalState, {
				type: PLUGINS_REQUEST_FAILURE,
				siteId: 'one.site',
				error: testError
			} );
			expect( state ).to.eql( { 'one.site': [] } );
		} );

		it( 'should show an activated plugin as active', () => {
			const originalState = deepFreeze( { 'one.site': [ Object.assign( {}, akismet, { active: false } ) ] } );
			const state = plugins( originalState, {
				type: PLUGIN_ACTIVATE_REQUEST_SUCCESS,
				siteId: 'one.site',
				pluginId: akismet.id,
				data: Object.assign( {}, akismet, { active: true } )
			} );
			expect( state ).to.eql( { 'one.site': [ Object.assign( {}, akismet, { active: true } ) ] } );
		} );

		it( 'should show a deactivated plugin as inactive', () => {
			const originalState = deepFreeze( { 'one.site': [ Object.assign( {}, akismet, { active: true } ) ] } );
			const state = plugins( originalState, {
				type: PLUGIN_DEACTIVATE_REQUEST_SUCCESS,
				siteId: 'one.site',
				pluginId: akismet.id,
				data: Object.assign( {}, akismet, { active: false } )
			} );
			expect( state ).to.eql( { 'one.site': [ Object.assign( {}, akismet, { active: false } ) ] } );
		} );

		it( 'should show an updated plugin as up-to-date', () => {
			const originalState = deepFreeze( { 'one.site': [ jetpack ] } );
			const updatedPlugin = omit( jetpack, 'update' );
			const state = plugins( originalState, {
				type: PLUGIN_UPDATE_REQUEST_SUCCESS,
				siteId: 'one.site',
				pluginId: jetpack.id,
				data: updatedPlugin,
			} );
			expect( state ).to.eql( { 'one.site': [ updatedPlugin ] } );
		} );

		it( 'should show a plugin with autoupdate enabled', () => {
			const originalState = deepFreeze( { 'one.site': [ Object.assign( {}, akismet, { autoupdate: false } ) ] } );
			const state = plugins( originalState, {
				type: PLUGIN_AUTOUPDATE_ENABLE_REQUEST_SUCCESS,
				siteId: 'one.site',
				pluginId: jetpack.id,
				data: Object.assign( {}, akismet, { autoupdate: true } )
			} );
			expect( state ).to.eql( { 'one.site': [ Object.assign( {}, akismet, { autoupdate: true } ) ] } );
		} );

		it( 'should show a plugin with autoupdate disabled', () => {
			const originalState = deepFreeze( { 'one.site': [ Object.assign( {}, akismet, { autoupdate: true } ) ] } );
			const state = plugins( originalState, {
				type: PLUGIN_AUTOUPDATE_DISABLE_REQUEST_SUCCESS,
				siteId: 'one.site',
				pluginId: jetpack.id,
				data: Object.assign( {}, akismet, { autoupdate: false } )
			} );
			expect( state ).to.eql( { 'one.site': [ Object.assign( {}, akismet, { autoupdate: false } ) ] } );
		} );

		it( 'should load a new plugin when installed', () => {
			const originalState = deepFreeze( { 'one.site': [ akismet ] } );
			const state = plugins( originalState, {
				type: PLUGIN_INSTALL_REQUEST_SUCCESS,
				siteId: 'one.site',
				pluginId: jetpack.id,
				data: jetpack
			} );
			expect( state ).to.eql( { 'one.site': [ akismet, jetpack ] } );
		} );

		it( 'should remove an existing plugin when deleted', () => {
			const originalState = deepFreeze( { 'one.site': [ akismet, jetpack ] } );
			const state = plugins( originalState, {
				type: PLUGIN_REMOVE_REQUEST_SUCCESS,
				siteId: 'one.site',
				pluginId: jetpack.id
			} );
			expect( state ).to.eql( { 'one.site': [ akismet ] } );
		} );
	} );

	describe( 'status', () => {
		it( 'should set a progress status entry when an action begins', () => {
			const originalState = deepFreeze( {} );
			const state = status( originalState, {
				type: PLUGIN_ACTIVATE_REQUEST,
				action: ACTIVATE_PLUGIN,
				siteId: 'one.site',
				pluginId: akismet.id,
			} );
			expect( state ).to.eql( {
				'one.site': {
					[ akismet.id ]: {
						status: 'inProgress',
						action: ACTIVATE_PLUGIN,
					}
				}
			} );
		} );

		it( 'should set a successful status entry for a successful action', () => {
			const originalState = deepFreeze( {
				'one.site': {
					[ akismet.id ]: {
						status: 'inProgress',
						action: ACTIVATE_PLUGIN,
					}
				}
			} );
			const state = status( originalState, {
				type: PLUGIN_ACTIVATE_REQUEST_SUCCESS,
				action: ACTIVATE_PLUGIN,
				siteId: 'one.site',
				pluginId: akismet.id,
				data: Object.assign( {}, akismet, { active: true } )
			} );
			expect( state ).to.eql( {
				'one.site': {
					[ akismet.id ]: {
						status: 'completed',
						action: ACTIVATE_PLUGIN,
					}
				}
			} );
		} );

		it( 'should set a error status entry for a failed action', () => {
			const originalState = deepFreeze( {} );
			const testError = new Error( 'Plugin file does not exist.' );
			testError.name = 'activation_error';
			const state = status( originalState, {
				type: PLUGIN_ACTIVATE_REQUEST_FAILURE,
				action: ACTIVATE_PLUGIN,
				siteId: 'one.site',
				pluginId: akismet.id,
				error: testError
			} );
			expect( state ).to.eql( {
				'one.site': {
					[ akismet.id ]: {
						status: 'error',
						action: ACTIVATE_PLUGIN,
						error: testError
					}
				}
			} );
		} );
	} );
} );
