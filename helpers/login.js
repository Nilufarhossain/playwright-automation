async function login(page){
    await page.goto('https://opensource-demo.orangehrmlive.com/');
    await page.locator("input[name='username']").fill("Admin");
    await page.locator("input[name='password']").fill("admin123");
    await page.locator("button[type='submit']").click();


};
module.exports ={login};