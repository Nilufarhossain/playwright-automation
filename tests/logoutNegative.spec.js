
const { test, expect } = require('@playwright/test');
const { login } = require('../helpers/login');

// Reusable logout function
async function logout(page) {
    await page.locator('.oxd-userdropdown-tab').click();

    await page.getByRole('menuitem', {
        name: 'Logout'
    }).click();

    await expect(page).toHaveURL(/auth\/login/);
}


// TC010: Access Dashboard after logout
test('TC010: Cannot access Dashboard after logout', async ({ page }) => {

    // Step 1: Login
    await login(page);

    // Step 2: Verify Dashboard
    await expect(
        page.getByRole('heading', { name: 'Dashboard' })
    ).toBeVisible();

    // Step 3: Logout
    await logout(page);

    // Step 4: Try accessing Dashboard directly
    await page.goto(
        'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index'
    );

    // Step 5: Verify redirect to Login
    await expect(page).toHaveURL(/auth\/login/, {
        timeout: 15000
    });

    console.log('TC010 Passed: Dashboard access blocked after logout');

});


// TC011: Access Employee List after logout
test('TC011: Cannot access Employee List after logout', async ({ page }) => {

    // Step 1: Login
    await login(page);

    // Step 2: Open Employee List
    await page.getByRole('link', {
        name: 'PIM'
    }).click();

    await expect(page).toHaveURL(/pim\/viewEmployeeList/);

    // Step 3: Logout
    await logout(page);

    // Step 4: Try accessing Employee List directly
    await page.goto(
        'https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewEmployeeList'
    );

    // Step 5: Verify redirect to Login
    await expect(page).toHaveURL(/auth\/login/, {
        timeout: 15000
    });

    console.log('TC011 Passed: Employee List access blocked after logout');

});


// TC012: Browser Back button after logout
test('TC012: Cannot access protected page using Back button', async ({ page }) => {

    // Step 1: Login
    await login(page);

    // Step 2: Verify Dashboard
    await expect(
        page.getByRole('heading', { name: 'Dashboard' })
    ).toBeVisible();

    // Step 3: Logout
    await logout(page);

    // Step 4: Press browser Back button
    await page.goBack();

    // Step 5: Verify protected content is not accessible
    await expect(
        page.getByRole('heading', { name: 'Dashboard' })
    ).not.toBeVisible({ timeout: 15000 });

    // Step 6: Try reloading the previous page
    await page.reload();

    // Step 7: Verify login is required
    await expect(page).toHaveURL(/auth\/login/, {
        timeout: 15000
    });

    console.log('TC012 Passed: Back button cannot restore authenticated access');

});
