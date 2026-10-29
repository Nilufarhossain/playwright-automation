
const { test, expect } = require('@playwright/test');
const { login } = require('../helpers/login');

test('TC016: Cannot add employee without required fields', async ({ page }) => {

    // Step 1: Login
    await login(page);

    // Step 2: Open PIM
    await page.getByRole('link', { name: 'PIM' }).click();

    // Step 3: Click Add Employee
    await page.getByRole('link', { name: 'Add Employee' }).click();

    // Step 4: Leave First Name and Last Name empty

    // Step 5: Click Save
    await page.getByRole('button', { name: 'Save' }).click();

    // Step 6: Verify required field errors
    await expect(
        page.getByText('Required', { exact: true })
    ).toHaveCount(2);

    // Step 7: Verify we are still on Add Employee page
    await expect(page).toHaveURL(/pim\/addEmployee/);

    console.log('TC016 Passed: Required fields validated successfully!');

});


test('TC017: Cannot add employee with duplicate Employee ID', async ({ page }) => {

    // Step 1: Login
    await login(page);

    // Step 2: Open Add Employee page
    await page.getByRole('link', { name: 'PIM' }).click();
    await page.getByRole('link', { name: 'Add Employee' }).click();

    // Step 3: Get the automatically generated Employee ID
    const employeeIdInput = page.locator('.oxd-input-group')
        .filter({ hasText: 'Employee Id' })
        .locator('input');

    const existingId = await employeeIdInput.inputValue();

    // Step 4: Create the first employee with this ID
    await page.getByPlaceholder('First Name').fill('DuplicateTest');
    await page.getByPlaceholder('Last Name').fill('Original');

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page).toHaveURL(/pim\/viewPersonalDetails/);

    console.log('First employee created with ID:', existingId);

    // Step 5: Open Add Employee again
    await page.getByRole('link', { name: 'Add Employee' }).click();

    // Step 6: Enter different employee name
    await page.getByPlaceholder('First Name').fill('DuplicateTest');
    await page.getByPlaceholder('Last Name').fill('Second');

    // Step 7: Enter the same Employee ID
    const secondEmployeeIdInput = page.locator('.oxd-input-group')
        .filter({ hasText: 'Employee Id' })
        .locator('input');

    await secondEmployeeIdInput.fill(existingId);

    // Step 8: Verify duplicate ID error
    await expect(
        page.getByText('Employee Id already exists')
    ).toBeVisible({ timeout: 10000 });

    // Step 9: Verify employee was not saved
    await expect(page).toHaveURL(/pim\/addEmployee/);

    console.log('TC017 Passed: Duplicate Employee ID rejected!');

});


test('TC018: Validate maximum length of employee first name', async ({ page }) => {

    // Step 1: Login
    await login(page);

    // Step 2: Open Add Employee
    await page.getByRole('link', { name: 'PIM' }).click();
    await page.getByRole('link', { name: 'Add Employee' }).click();

    // Step 3: Enter a very long first name
    const longName = 'A'.repeat(200);

    const firstNameInput = page.getByPlaceholder('First Name');

    await firstNameInput.fill(longName);

    // Step 4: Enter a valid last name
    await page.getByPlaceholder('Last Name').fill('Tester');

    // Step 5: Check whether the field limits input length
    const actualName = await firstNameInput.inputValue();

    console.log('Entered name length:', longName.length);
    console.log('Accepted name length:', actualName.length);

    // Step 6: Verify the application handles the long input
    if (actualName.length < longName.length) {

        // Input was restricted by a maximum-length rule
        console.log('TC018: Input length was restricted');

        expect(actualName.length).toBeLessThan(longName.length);

    } else {

        // Input was accepted; check for validation
        await page.getByRole('button', { name: 'Save' }).click();

        const errorMessage = page.getByText('Should not exceed', {
            exact: false
        });

        await expect(errorMessage).toBeVisible({
            timeout: 10000
        });

        console.log('TC018: Long name rejected with validation');

    }

    console.log('TC018 Passed: Long name validation verified!');

});
