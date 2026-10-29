
const { test, expect } = require('@playwright/test');
const { login } = require('../helpers/login');

test('TC007: Verify Add and Update Employee', async ({ page }) => {

    test.setTimeout(90000);

    // Step 1: Login
    await login(page);

    // Step 2: Verify Dashboard
    await expect(
        page.getByRole('heading', { name: 'Dashboard' })
    ).toBeVisible();

    // Step 3: Open PIM
    await page.getByRole('link', { name: 'PIM' }).click();

    // Step 4: Open Add Employee
    await page.getByRole('link', {
        name: 'Add Employee'
    }).click();

    // Step 5: Verify Add Employee page
    await expect(
        page.getByRole('heading', { name: 'Add Employee' })
    ).toBeVisible();

    // Step 6: Enter employee details
    await page.getByPlaceholder('First Name').fill('Automation');
    await page.getByPlaceholder('Last Name').fill('Tester');

    // Step 7: Verify entered values
    await expect(
        page.getByPlaceholder('First Name')
    ).toHaveValue('Automation');

    await expect(
        page.getByPlaceholder('Last Name')
    ).toHaveValue('Tester');

    // Step 8: Capture generated Employee ID
    const employeeIdField = page.locator('.oxd-input-group')
        .filter({ hasText: 'Employee Id' })
        .locator('input');

    const employeeId = await employeeIdField.inputValue();

    expect(employeeId).not.toBe('');

    console.log('New Employee ID:', employeeId);

    // Step 9: Save new employee
    await page.getByRole('button', {
        name: 'Save',
        exact: true
    }).click();

    // Step 10: Verify Personal Details page
    await expect(page).toHaveURL(
        /pim\/viewPersonalDetails/,
        { timeout: 20000 }
    );

    await expect(
        page.getByRole('heading', { name: 'Personal Details' })
    ).toBeVisible();

    console.log('Employee created successfully!');

    // Step 11: Verify employee details
    await expect(
        page.getByPlaceholder('First Name')
    ).toHaveValue('Automation');

    await expect(
        page.getByPlaceholder('Last Name')
    ).toHaveValue('Tester');

    console.log('Employee details verified successfully!');

    // Step 12: Open Employee List
    await page.getByRole('link', {
        name: 'Employee List'
    }).click();

    await expect(page).toHaveURL(
        /pim\/viewEmployeeList/,
        { timeout: 20000 }
    );

    // Step 13: Search by Employee ID
    const searchIdField = page.locator('.oxd-input-group')
        .filter({ hasText: 'Employee Id' })
        .locator('input');

    await searchIdField.fill(employeeId);

    await page.getByRole('button', {
        name: 'Search'
    }).click();

    // Step 14: Verify employee appears
    const employeeRow = page.locator('.oxd-table-card')
        .filter({ hasText: employeeId });

    await expect(employeeRow).toBeVisible({
        timeout: 15000
    });

    console.log('Employee found in search results!');

    // Step 15: Open employee profile
    await employeeRow.getByText(employeeId, {
        exact: true
    }).click();

    await expect(page).toHaveURL(
        /pim\/viewPersonalDetails\/empNumber\/\d+/,
        { timeout: 15000 }
    );

    await expect(
        page.getByRole('heading', { name: 'Personal Details' })
    ).toBeVisible();

    console.log('Employee profile opened successfully!');

    // Step 16: Locate Last Name field
    const lastNameField = page.locator('input[name="lastName"]');

    // Step 17: Find the Personal Details form
    const personalDetailsForm = page.locator('form')
        .filter({ has: lastNameField });

    // Step 18: Update Last Name using keyboard input
    await lastNameField.click();

    await lastNameField.press('ControlOrMeta+A');

    await lastNameField.pressSequentially('UpdatedTester', {
        delay: 50
    });

    // Step 19: Move focus away
    await lastNameField.press('Tab');

    // Step 20: Verify the new value
    await expect(lastNameField).toHaveValue('UpdatedTester');

    console.log('Last Name updated using keyboard!');

    // Step 21: Capture employee update API requests
    const updateRequests = [];

    page.on('response', (response) => {

        const request = response.request();

        if (
            response.url().includes('/pim/employees/') &&
            ['PUT', 'PATCH'].includes(request.method())
        ) {
            updateRequests.push({
                status: response.status(),
                url: response.url(),
                requestBody: request.postData()
            });
        }

    });

    // Step 22: Save Personal Details
    await personalDetailsForm
        .getByRole('button', {
            name: 'Save',
            exact: true
        }).click();

    // Step 23: Verify success notification
    await expect(
        page.getByText('Successfully Updated', {
            exact: true
        })
    ).toBeVisible({ timeout: 15000 });

    console.log('Success notification displayed!');

    // Step 24: Print API request details
    console.log(
        'Update API requests:',
        JSON.stringify(updateRequests, null, 2)
    );

    // Step 25: Verify the submitted Last Name
    const personalDetailsUpdate = updateRequests.find(
        item => item.url.includes('/personal-details')
    );

    expect(
        personalDetailsUpdate,
        'Expected a Personal Details update API request'
    ).toBeDefined();

    const requestBody = JSON.parse(
        personalDetailsUpdate.requestBody
    );

    console.log('Submitted Last Name:', requestBody.lastName);

    expect(requestBody.lastName).toBe('UpdatedTester');

    // Step 26: Verify value after Save
    await expect(lastNameField).toHaveValue(
        'UpdatedTester',
        { timeout: 15000 }
    );

    console.log('Updated value remains after Save!');

    // Step 27: Reload employee profile
    await page.reload();

    // Step 28: Verify Personal Details loaded
    await expect(
        page.getByRole('heading', { name: 'Personal Details' })
    ).toBeVisible({ timeout: 15000 });

    // Step 29: Verify updated Last Name persisted
    await expect(
        page.locator('input[name="lastName"]')
    ).toHaveValue('UpdatedTester', {
        timeout: 15000
    });

    console.log('TC007 Passed: Employee update persisted successfully!');

});
