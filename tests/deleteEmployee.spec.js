
const { test, expect } = require('@playwright/test');
const { login } = require('../helpers/login');

test('TC008: Verify Delete Employee', async ({ page }) => {

    test.setTimeout(90000);

    // Step 1: Login
    await login(page);

    // Step 2: Verify Dashboard
    await expect(
        page.getByRole('heading', { name: 'Dashboard' })
    ).toBeVisible();

    // Step 3: Navigate to PIM
    await page.getByRole('link', { name: 'PIM' }).click();

    // Step 4: Open Add Employee
    await page.getByText('Add Employee', { exact: true }).click();

    await expect(
        page.getByRole('heading', { name: 'Add Employee' })
    ).toBeVisible();

    // Step 5: Enter employee details
    await page.getByPlaceholder('First Name').fill('DeleteTest');
    await page.getByPlaceholder('Last Name').fill('Employee');

    // Step 6: Capture generated Employee ID
    const employeeIdField = page.locator('.oxd-input-group')
        .filter({ hasText: 'Employee Id' })
        .locator('input');

    const employeeId = await employeeIdField.inputValue();

    expect(employeeId).not.toBe('');

    console.log('Employee ID:', employeeId);

    // Step 7: Save employee
    await page.getByRole('button', {
        name: 'Save',
        exact: true
    }).click();

    // Step 8: Verify employee profile opens
    await expect(page).toHaveURL(
        /\/pim\/viewPersonalDetails\/empNumber\/\d+/,
        { timeout: 15000 }
    );

    console.log('Employee created successfully!');

    // Step 9: Navigate to Employee List
    await page.getByRole('link', {
        name: 'Employee List'
    }).click();

    await expect(page).toHaveURL(
        /\/pim\/viewEmployeeList/,
        { timeout: 15000 }
    );

    // Step 10: Find Employee ID search field
    const searchIdField = page.locator('.oxd-input-group')
        .filter({ hasText: 'Employee Id' })
        .locator('input');

    await expect(searchIdField).toBeVisible();

    // Step 11: Search employee
    await searchIdField.fill(employeeId);

    await page.getByRole('button', {
        name: 'Search',
        exact: true
    }).click();

    // Step 12: Verify employee appears
    const employeeResult = page.getByText(employeeId, {
        exact: true
    });

    await expect(employeeResult).toBeVisible({
        timeout: 15000
    });

    console.log('Employee found!');

    // Step 13: Find the employee result row/card
    const employeeCard = page.locator('.oxd-table-card, .orangehrm-employee-card')
        .filter({ hasText: employeeId });

    await expect(employeeCard).toHaveCount(1);

    // Step 14: Click Delete icon for this employee
    await employeeCard.locator('button')
        .filter({ has: page.locator('i.bi-trash') })
        .click();

    // Step 15: Verify confirmation dialog
    const confirmationDialog = page.getByRole('dialog');

    await expect(confirmationDialog).toBeVisible();

    // Step 16: Confirm deletion
    await confirmationDialog.getByRole('button', {
        name: /Yes, Delete/i
    }).click();

    // Step 17: Verify deletion success message
    await expect(
        page.getByText('Successfully Deleted', { exact: true })
    ).toBeVisible({ timeout: 15000 });

    console.log('Employee deleted successfully!');

    // Step 18: Search again
    await expect(searchIdField).toBeVisible();

    await searchIdField.fill(employeeId);

    await page.getByRole('button', {
        name: 'Search',
        exact: true
    }).click();

    // Step 19: Verify no records found
    await expect(
        page.locator('.oxd-table-body')
    ).not.toContainText(employeeId, {
        timeout: 15000
    });

    console.log('Deleted employee no longer appears in results!');

});
