
const { test, expect } = require('@playwright/test');

const loginURL =
    'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

// TC013: Valid username with invalid password
test('TC013: Login with invalid password', async ({ page }) => {

    // Step 1: Open Login page
    await page.goto(loginURL);

    // Step 2: Enter valid username
    await page.getByPlaceholder('Username').fill('Admin');

    // Step 3: Enter invalid password
    await page.getByPlaceholder('Password').fill('WrongPassword123');

    // Step 4: Click Login
    await page.getByRole('button', { name: 'Login' }).click();

    // Step 5: Verify error message
    await expect(
        page.getByText('Invalid credentials')
    ).toBeVisible();

    // Step 6: Verify user remains on Login page
    await expect(page).toHaveURL(/auth\/login/);

    console.log('TC013 Passed: Invalid password rejected');

});


// TC014: Invalid username with valid password
test('TC014: Login with invalid username', async ({ page }) => {

    // Step 1: Open Login page
    await page.goto(loginURL);

    // Step 2: Enter invalid username
    await page.getByPlaceholder('Username').fill('WrongUser123');

    // Step 3: Enter valid demo password
    await page.getByPlaceholder('Password').fill('admin123');

    // Step 4: Click Login
    await page.getByRole('button', { name: 'Login' }).click();

    // Step 5: Verify error message
    await expect(
        page.getByText('Invalid credentials')
    ).toBeVisible();

    // Step 6: Verify user remains on Login page
    await expect(page).toHaveURL(/auth\/login/);

    console.log('TC014 Passed: Invalid username rejected');

});


// TC015: Login with empty username and password
test('TC015: Login with empty credentials', async ({ page }) => {

    // Step 1: Open Login page
    await page.goto(loginURL);

    // Step 2: Leave username and password empty

    // Step 3: Click Login
    await page.getByRole('button', { name: 'Login' }).click();

    // Step 4: Verify both required field errors
    await expect(
        page.getByText('Required', { exact: true })
    ).toHaveCount(2);

    // Step 5: Verify user remains on Login page
    await expect(page).toHaveURL(/auth\/login/);

    console.log('TC015 Passed: Required field validation displayed');

});
