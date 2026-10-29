
const { test, expect } = require('@playwright/test');
const { login } = require('../helpers/login');

// Reusable function to open Employee List
async function openEmployeeList(page) {

    // Login
    await login(page);

    // Verify Dashboard
    await expect(
        page.getByRole('heading', { name: 'Dashboard' })
    ).toBeVisible();

    // Open PIM
    await page.getByRole('link', { name: 'PIM' }).click();

    // Verify Employee List page
    await expect(
        page.getByText('Employee Information')
    ).toBeVisible();
}

// Reusable function to search by Employee ID
async function searchEmployee(page, employeeId) {

    // Find Employee ID field
    const employeeIdField = page
        .locator('.oxd-input-group')
        .filter({ hasText: 'Employee Id' })
        .locator('input');

    // Verify field is ready
    await expect(employeeIdField).toBeVisible();
    await expect(employeeIdField).toBeEditable();

    // Enter Employee ID
    await employeeIdField.fill(employeeId);

    // Verify entered value
    await expect(employeeIdField).toHaveValue(employeeId);

    // Click Search
    await page.getByRole('button', {
        name: 'Search',
        exact: true
    }).click();
}

// TC006 - Negative Employee Search
test('TC006: Search With Invalid Employee ID', async ({ page }) => {

    await openEmployeeList(page);

    // Search for an ID that should not exist
    await searchEmployee(page, '999999999');

    // Verify No Records Found
    await expect(
        page.locator('span.oxd-text', {
            hasText: 'No Records Found'
        })
    ).toBeVisible({ timeout: 15000 });

});

// TC007 - Positive Employee Search
test.skip('TC007: Search With Valid Employee ID', async ({ page }) => {

    await openEmployeeList(page);

    // Replace with a manually verified employee ID
    const employeeId = 'REPLACE_WITH_VALID_ID';

    await searchEmployee(page, employeeId);

    // Verify matching employee record
    await expect(
        page.getByText(`Id ${employeeId}`, { exact: true })
    ).toBeVisible({ timeout: 15000 });

});

