
const { test, expect } = require('@playwright/test');
const { login } = require('../helpers/login');

// TC023: Cancel Employee Deletion
test('TC023: Cancel employee deletion', async ({ page }) => {

    test.setTimeout(90000);

    // Step 1: Login
    await login(page);

    // Step 2: Open Add Employee
    await page.getByRole('link', { name: 'PIM' }).click();
    await page.getByRole('link', { name: 'Add Employee' }).click();

    // Step 3: Create test employee
    await page.getByPlaceholder('First Name').fill('CancelDelete');
    await page.getByPlaceholder('Last Name').fill('Tester');

    const employeeIdInput = page.locator('.oxd-input-group')
        .filter({ hasText: 'Employee Id' })
        .locator('input');

    const employeeId = await employeeIdInput.inputValue();

    expect(employeeId).not.toBe('');

    // Step 4: Save employee
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page).toHaveURL(
        /pim\/viewPersonalDetails/,
        { timeout: 20000 }
    );

    await expect(
        page.getByPlaceholder('First Name')
    ).toHaveValue('CancelDelete');

    console.log('Employee created successfully!');

    // Step 5: Open Employee List
    await page.getByRole('link', {
        name: 'Employee List'
    }).click();

    // Step 6: Search employee
    const searchIdInput = page.locator('.oxd-input-group')
        .filter({ hasText: 'Employee Id' })
        .locator('input');

    await searchIdInput.fill(employeeId);

    await page.getByRole('button', {
        name: 'Search'
    }).click();

    // Step 7: Verify employee exists
    const employeeRow = page.locator('.oxd-table-card')
        .filter({ hasText: employeeId });

    await expect(employeeRow).toBeVisible({
        timeout: 15000
    });

    console.log('Employee found!');

    // Step 8: Click Delete
    await employeeRow.locator('.bi-trash').click();

    // Step 9: Verify confirmation dialog
    const dialog = page.getByRole('dialog');

    await expect(dialog).toBeVisible();

    // Step 10: Cancel deletion
    await dialog.getByRole('button', {
        name: 'No, Cancel'
    }).click();

    // Step 11: Verify dialog closed
    await expect(dialog).not.toBeVisible();

    // Step 12: Verify employee still exists
    await expect(employeeRow).toBeVisible({
        timeout: 15000
    });

    console.log(
        'TC023 Passed: Employee remains after cancelling deletion!'
    );

});


// TC024: Deleted Employee Not Found
test('TC024: Deleted employee should not appear in search results', async ({ page }) => {

    test.setTimeout(90000);

    // Step 1: Login
    await login(page);

    // Step 2: Open Add Employee
    await page.getByRole('link', { name: 'PIM' }).click();
    await page.getByRole('link', { name: 'Add Employee' }).click();

    // Step 3: Create employee
    await page.getByPlaceholder('First Name').fill('DeletedSearch');
    await page.getByPlaceholder('Last Name').fill('Tester');

    const employeeIdInput = page.locator('.oxd-input-group')
        .filter({ hasText: 'Employee Id' })
        .locator('input');

    const employeeId = await employeeIdInput.inputValue();

    expect(employeeId).not.toBe('');

    // Step 4: Save employee
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page).toHaveURL(
        /pim\/viewPersonalDetails/,
        { timeout: 20000 }
    );

    console.log('Employee created successfully!');

    // Step 5: Open Employee List
    await page.getByRole('link', {
        name: 'Employee List'
    }).click();

    // Step 6: Search employee
    const searchIdInput = page.locator('.oxd-input-group')
        .filter({ hasText: 'Employee Id' })
        .locator('input');

    await searchIdInput.fill(employeeId);

    await page.getByRole('button', {
        name: 'Search'
    }).click();

    const employeeRow = page.locator('.oxd-table-card')
        .filter({ hasText: employeeId });

    await expect(employeeRow).toBeVisible({
        timeout: 15000
    });

    // Step 7: Delete employee
    await employeeRow.locator('.bi-trash').click();

    const dialog = page.getByRole('dialog');

    await expect(dialog).toBeVisible();

    await dialog.getByRole('button', {
        name: 'Yes, Delete'
    }).click();

    // Step 8: Verify employee removed
    await expect(employeeRow).toHaveCount(0, {
        timeout: 15000
    });

    // Step 9: Search again
    await searchIdInput.fill(employeeId);

    await page.getByRole('button', {
        name: 'Search'
    }).click();

    // Step 10: Verify employee does not exist
    await expect(
        page.locator('.oxd-table-card')
            .filter({ hasText: employeeId })
    ).toHaveCount(0);

    console.log(
        'TC024 Passed: Deleted employee not found!'
    );

});


// TC025: Access Deleted Employee Profile
test('TC025: Cannot access deleted employee profile', async ({ page }) => {

    test.setTimeout(90000);

    // Step 1: Login
    await login(page);

    // Step 2: Open Add Employee
    await page.getByRole('link', { name: 'PIM' }).click();
    await page.getByRole('link', { name: 'Add Employee' }).click();

    // Step 3: Create employee
    await page.getByPlaceholder('First Name').fill('DeletedProfile');
    await page.getByPlaceholder('Last Name').fill('Tester');

    const employeeIdInput = page.locator('.oxd-input-group')
        .filter({ hasText: 'Employee Id' })
        .locator('input');

    const employeeId = await employeeIdInput.inputValue();

    expect(employeeId).not.toBe('');

    console.log('Employee ID:', employeeId);

    // Step 4: Save employee
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page).toHaveURL(
        /pim\/viewPersonalDetails/,
        { timeout: 20000 }
    );

    await expect(
        page.getByPlaceholder('First Name')
    ).toHaveValue('DeletedProfile');

    console.log('Employee created successfully!');

    // Step 5: Store employee profile URL
    const profileURL = page.url();

    console.log('Original profile URL:', profileURL);

    // Step 6: Open Employee List
    await page.getByRole('link', {
        name: 'Employee List'
    }).click();

    // Step 7: Search employee
    const searchIdInput = page.locator('.oxd-input-group')
        .filter({ hasText: 'Employee Id' })
        .locator('input');

    await searchIdInput.fill(employeeId);

    await page.getByRole('button', {
        name: 'Search'
    }).click();

    const employeeRow = page.locator('.oxd-table-card')
        .filter({ hasText: employeeId });

    await expect(employeeRow).toBeVisible({
        timeout: 15000
    });

    console.log('Employee found!');

    // Step 8: Delete employee
    await employeeRow.locator('.bi-trash').click();

    const dialog = page.getByRole('dialog');

    await expect(dialog).toBeVisible();

    await dialog.getByRole('button', {
        name: 'Yes, Delete'
    }).click();

    // Step 9: Verify employee removed
    await expect(employeeRow).toHaveCount(0, {
        timeout: 15000
    });

    console.log('Employee deleted successfully!');

    // Step 10: Open deleted employee profile URL
    await page.goto(profileURL);

    // Step 11: Verify No Records Found message
    await expect(
        page.getByText('No Records Found').first()
    ).toBeVisible({ timeout: 15000 });

    // Step 12: Verify original employee data is unavailable
    const firstNameField = page.getByPlaceholder('First Name');

    if (await firstNameField.count() > 0) {
        await expect(firstNameField).not.toHaveValue(
            'DeletedProfile',
            { timeout: 10000 }
        );
    }

    console.log(
        'TC025 Passed: Deleted employee data is not accessible!'
    );

});
