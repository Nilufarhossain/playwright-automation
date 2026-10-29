const {test,expect} = require("@playwright/test");


test("TC001: Verify OrabgeHRM Login Page", async({page}) => {

    await page.goto('https://opensource-demo.orangehrmlive.com/');
    await expect(page.locator("input[name='username']")).toBeVisible();
    await expect(page.locator("input[name='password']")).toBeVisible();
    await expect(page.locator("button[type='submit']")).toBeVisible();
}
);

test("TC002:Verify Empty Login Test", async({page}) =>{
    await page.goto("https://opensource-demo.orangehrmlive.com/");
    await page.locator("button[type='submit']").click();

    await expect(page.getByText("Required")).toHaveCount(2);
}
);

test("TC003: Verify Invalid Login Test", async({page}) => {
    await page.goto("https://opensource-demo.orangehrmlive.com/");
    await page.locator("input[name='username']").fill("InvalidUser");
    await page.locator("input[name='password']").fill("InvalidPassword");
    await page.locator("button[type='submit']").click();

    await expect(page.getByText('Invalid credentials')).toBeVisible();

}
);

test("TC004: Verify Login Test", async({page}) =>
{
    await page.goto("https://opensource-demo.orangehrmlive.com/");
    await page.locator("input[name='username']").fill("Admin");
    await page.locator("input[name='password']").fill("admin123");
    await page.locator("button[type='submit']").click();

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
}
);

// Logout Test

test("TC005: Verify Logout Test", async({page}) => {

    await page.goto("https://opensource-demo.orangehrmlive.com/");
    await page.locator("input[name='username']").fill("Admin");
    await page.locator("input[name='password']").fill("admin123");
    await page.locator("button[type='submit']").click();

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    await page.locator(".oxd-userdropdown-tab").click();

    await page.getByRole('menuitem',{name:'Logout'}).click();

    await expect(page.locator("input[name='username']")).toBeVisible();
}
);