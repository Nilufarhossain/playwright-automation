
const { test, expect } = require('@playwright/test');
const { login } = require('../helpers/login');

test('TC019: Search with nonexistent Employee ID', async ({ page }) => {

    // Step 1: Login
    await login(page);

    // Step 2: Open PIM
    await page.getByRole('link', { name: 'PIM' }).click();

    // Step 3: Find Employee ID search field
    const employeeIdInput = page.locator('.oxd-input-group')
        .filter({ hasText: 'Employee Id' })
        .locator('input');

    // Step 4: Enter a nonexistent Employee ID
    await employeeIdInput.fill('999999999');

    // Step 5: Click Search
    await page.getByRole('button', { name: 'Search' }).click();

    // Step 6: Verify No Records Found
    await expect(
    page.getByText('No Records Found').first()
).toBeVisible();
    // Step 7: Verify no employee rows appear
    await expect(
        page.locator('.oxd-table-body .oxd-table-card')
    ).toHaveCount(0);

    console.log('TC019 Passed: Nonexistent employee not found!');

});


test('TC020: Search with unmatched alphanumeric Employee ID', async ({ page }) => {

    // Step 1: Login
    await login(page);

    // Step 2: Open PIM
    await page.getByRole('link', { name: 'PIM' }).click();

    // Step 3: Find Employee ID field
    const employeeIdInput = page.locator('.oxd-input-group')
        .filter({ hasText: 'Employee Id' })
        .locator('input');

    // Step 4: Enter an unmatched Employee ID
    const testId = 'INVALID-ABC-999';
    await employeeIdInput.fill(testId);

    // Step 5: Verify entered value
    await expect(employeeIdInput).toHaveValue(testId);

    // Step 6: Click Search
    await page.getByRole('button', { name: 'Search' }).click();

    // Step 7: Verify no employee records appear
    const rows = page.locator('.oxd-table-body .oxd-table-card');

    await expect(rows).toHaveCount(0);

    // Step 8: Verify still on Employee List
    await expect(page).toHaveURL(/pim\/viewEmployeeList/);

    console.log('TC020 Passed: No matching employee records found!');

});

