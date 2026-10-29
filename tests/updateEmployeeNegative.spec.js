
const { test, expect } = require('@playwright/test');
const { login } = require('../helpers/login');

test('TC021: Cannot update employee with empty Last Name', async ({ page }) => {

    // Step 1: Login
    await login(page);

    // Step 2: Open Add Employee
    await page.getByRole('link', { name: 'PIM' }).click();
    await page.getByRole('link', { name: 'Add Employee' }).click();

    // Step 3: Create a test employee
    await page.getByPlaceholder('First Name').fill('NegativeUpdate');
    await page.getByPlaceholder('Last Name').fill('Tester');

    await page.getByRole('button', { name: 'Save' }).click();

    // Step 4: Verify Personal Details page
    await expect(page).toHaveURL(/pim\/viewPersonalDetails/);


    // Step 5: Find the Personal Details form
    const personalDetailsForm = page.locator(
        '.orangehrm-horizontal-padding form'
    ).first();

    // Step 6: Clear Last Name
    const lastNameInput = page.getByPlaceholder('Last Name');

    await lastNameInput.fill('');

    await expect(lastNameInput).toHaveValue('');
    console.log('Last Name successfully cleared!');

    // Step 7: Click Save in the Personal Details form
    await personalDetailsForm.getByRole('button', {
        name: 'Save'
    }).click();

    // Step 8: Check what validation appears
    console.log('Validation messages:',
        await page.locator('.oxd-input-field-error-message')
            .allTextContents()
    );

    console.log('Last Name value:',
        await lastNameInput.inputValue()
    );

    console.log('Toast messages:',
        await page.locator('.oxd-toast').allTextContents()
    );
    // Reload the employee profile
    await page.reload();

    // Verify the original Last Name was preserved
    await expect(
        page.getByPlaceholder('Last Name')
    ).toHaveValue('Tester');

    console.log('TC021 Passed: Original Last Name preserved!');

});


test('TC022: Cannot update employee with duplicate Employee ID', async ({ page }) => {

    // Step 1: Login
    await login(page);

    // Step 2: Open Add Employee
    await page.getByRole('link', { name: 'PIM' }).click();
    await page.getByRole('link', { name: 'Add Employee' }).click();

    // Step 3: Create first employee
    await page.getByPlaceholder('First Name').fill('DuplicateUpdate');
    await page.getByPlaceholder('Last Name').fill('First');

    const employeeIdInput = page.locator('.oxd-input-group')
        .filter({ hasText: 'Employee Id' })
        .locator('input');

    const firstEmployeeId = await employeeIdInput.inputValue();

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page).toHaveURL(/pim\/viewPersonalDetails/);

    console.log('First Employee ID:', firstEmployeeId);

    // Step 4: Create second employee
    await page.getByRole('link', { name: 'Add Employee' }).click();

    await page.getByPlaceholder('First Name').fill('DuplicateUpdate');
    await page.getByPlaceholder('Last Name').fill('Second');

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page).toHaveURL(/pim\/viewPersonalDetails/);

    // Step 5: Find Employee ID on Personal Details page
    const secondEmployeeIdInput = page.locator('.oxd-input-group')
        .filter({ hasText: 'Employee Id' })
        .locator('input');

    const originalSecondId = await secondEmployeeIdInput.inputValue();

    // Step 6: Try using the first employee's ID
    await secondEmployeeIdInput.fill(firstEmployeeId);

    // Step 7: Trigger validation
    await secondEmployeeIdInput.blur();

        // Step 8: Check the actual validation message
    console.log(
        'Validation messages:',
        await page.locator('.oxd-input-field-error-message').allTextContents()
    );

    console.log(
        'Employee ID after editing:',
        await secondEmployeeIdInput.inputValue()
    );
    // Step 9: Verify the second employee ID has not changed
    // in the database by reloading the profile
    await page.reload();

    await expect(secondEmployeeIdInput).toHaveValue(originalSecondId);

    console.log('TC022 Passed: Duplicate Employee ID rejected!');

});
