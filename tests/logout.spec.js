
const { test, expect } = require('@playwright/test');
const { login } = require('../helpers/login');

test('TC009: Verify Logout Functionality', async ({ page }) => {

    // Step 1: Login
    await login(page);

    // Step 2: Verify Dashboard
    await expect(
        page.getByRole('heading', { name: 'Dashboard' })
    ).toBeVisible();

    console.log('Login successful!');

    // Step 3: Open user dropdown
    await page.locator('.oxd-userdropdown-tab').click();

    // Step 4: Verify Logout option is visible
    const logoutButton = page.getByRole('menuitem', {
        name: 'Logout'
    });

    await expect(logoutButton).toBeVisible();

    // Step 5: Click Logout
    await logoutButton.click();

    // Step 6: Verify login page URL
    await expect(page).toHaveURL(/auth\/login/, {
        timeout: 15000
    });

    // Step 7: Verify Login button is visible
    await expect(
        page.getByRole('button', { name: 'Login' })
    ).toBeVisible();

    console.log('Logout verified successfully!');

});
