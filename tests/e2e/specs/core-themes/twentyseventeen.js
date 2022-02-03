/**
 * WordPress dependencies
 */
import {
	activateTheme,
	createURL,
	installTheme,
	setBrowserViewport,
	visitAdminPage,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { setTemplateMode } from '../../utils/amp-settings-utils';
import { DEFAULT_BROWSER_VIEWPORT_SIZE } from '../../config/bootstrap';

describe( 'Twenty Seventeen theme on AMP', () => {
	beforeAll( async () => {
		await installTheme( 'twentyseventeen' );
		await activateTheme( 'twentyseventeen' );

		await visitAdminPage( 'admin.php', 'page=amp-options' );
		await setTemplateMode( 'standard' );
	} );

	afterAll( async () => {
		await activateTheme( 'twentytwenty' );
	} );

	describe( 'main navigation on mobile', () => {
		beforeAll( async () => {
			// Assign a test menu to Top Menu location.
			await visitAdminPage( 'nav-menus.php', '' );
			await page.waitForSelector( 'input[name="menu-locations[top]"]' );
			await page.click( 'input[name="menu-locations[top]"]' );
			await page.click( '#save_menu_footer' );
			await page.waitForSelector( '#message', { text: /Test Menu 1 has been updated/ } );
		} );

		beforeEach( async () => {
			await setBrowserViewport( 'small' );
			await page.goto( createURL( '/' ) );
			await page.waitForSelector( '#page' );
		} );

		afterAll( async () => {
			await setBrowserViewport( DEFAULT_BROWSER_VIEWPORT_SIZE );
		} );

		it( 'should be initially hidden', async () => {
			await expect( page ).toMatchElement( '.main-navigation .menu-toggle[aria-expanded=false]' );
			await expect( page ).toMatchElement( '#top-menu', { visible: false } );
		} );

		it( 'should be toggled on a button click', async () => {
			await expect( page ).toClick( '.main-navigation .menu-toggle' );
			await expect( page ).toMatchElement( '.main-navigation .menu-toggle[aria-expanded=true]' );
			await expect( page ).toMatchElement( '#top-menu', { visible: true } );

			await expect( page ).toClick( '.main-navigation .menu-toggle' );
			await expect( page ).toMatchElement( '.main-navigation .menu-toggle[aria-expanded=false]' );
			await expect( page ).toMatchElement( '#top-menu', { visible: false } );
		} );

		it( 'should have a togglable submenu', async () => {
			await expect( page ).toClick( '.main-navigation .menu-toggle' );

			const menuItemWithSubmenu = await page.$( '.main-navigation .menu-item-has-children' );

			expect( menuItemWithSubmenu ).not.toBeNull();

			await expect( menuItemWithSubmenu ).toMatchElement( '.dropdown-toggle[aria-expanded=false]' );
			await expect( menuItemWithSubmenu ).toMatchElement( '.sub-menu', { visible: false } );

			await expect( menuItemWithSubmenu ).toClick( '.dropdown-toggle' );
			await expect( menuItemWithSubmenu ).toMatchElement( '.dropdown-toggle[aria-expanded=true]' );
			await expect( menuItemWithSubmenu ).toMatchElement( '.sub-menu', { visible: true } );

			await expect( menuItemWithSubmenu ).toClick( '.dropdown-toggle' );
			await expect( menuItemWithSubmenu ).toMatchElement( '.dropdown-toggle[aria-expanded=false]' );
			await expect( menuItemWithSubmenu ).toMatchElement( '.sub-menu', { visible: false } );
		} );
	} );
} );
