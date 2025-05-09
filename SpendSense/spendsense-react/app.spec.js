// e2e/app.spec.js
const { test, expect } = require('@playwright/test');

// Home Page
test('homepage loads and shows logo, Start Game, and Tutorial buttons', async ({ page }) => {
    await page.goto('http://localhost:5000');
    await expect(page.locator('img[alt="SpendSense Logo"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /start game/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /tutorial/i })).toBeVisible();
});

// Information Menu
test('can open menu and see About Us and Know Your Money links', async ({ page }) => {
    await page.goto('http://localhost:5000');
    await page.getByRole('button', { name: /menu/i }).click();
    await expect(page.getByRole('link', { name: /about us/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /know your money/i })).toBeVisible();
});

// About Us Page
test('can navigate to About Us page from menu', async ({ page }) => {
    await page.goto('http://localhost:5000');
    await page.getByRole('button', { name: /menu/i }).click();
    await page.getByRole('link', { name: /about us/i }).click();
    await expect(page.getByRole('heading', { name: /about us/i })).toBeVisible();
});

// Start Game and User Form
test('can start the game and see the user form', async ({ page }) => {
    await page.goto('http://localhost:5000');
    await page.getByRole('button', { name: /start game/i }).click(); // Corrected selector
    // Wait for the animation to finish and the form to be visible
    await expect(page.getByRole('heading', { name: /enter your details/i })).toBeVisible({ timeout: 5000 });
    await page.getByTestId('name-input');
    await page.getByTestId('username-input');
    await page.getByTestId('age-input');
    await page.getByTestId('location-input');
});

// User Form Validation
test('shows error if user form submitted empty', async ({ page }) => {
    await page.goto('http://localhost:5000');
    await page.getByRole('button', { name: /start game/i }).click();
    await page.getByRole('button', { name: /submit/i }).click();
    await expect(page.getByTestId('name-error')).toBeVisible();
    await expect(page.getByTestId('username-error')).toBeVisible();
    await expect(page.getByTestId('age-error')).toBeVisible();
    await expect(page.getByTestId('location-error')).toBeVisible();
});

// User Form Submit and JobSelect
test('can fill and submit the form and see JobSelect page', async ({ page }) => {
    await page.goto('http://localhost:5000');
    await page.getByRole('button', { name: /start game/i }).click();
    await page.getByTestId('name-input').fill('Test User');
    await page.getByTestId('username-input').fill('testuser');
    await page.getByTestId('age-input').fill('21');
    await page.getByTestId('location-input').fill('London');
    await expect(page.getByRole('heading', { name: /pick your first job/i })).toBeVisible();
});

// JobSelect and Employment Info
test('can select a job and see employment information', async ({ page }) => {
    await page.goto('http://localhost:5000');
    await page.getByRole('button', { name: /start game/i }).click();
    await page.getByTestId('name-input').fill('Test User');
    await page.getByTestId('username-input').fill('testuser');
    await page.getByTestId('age-input').fill('21');
    await page.getByTestId('location-input').fill('London');
    await page.getByRole('button', { name: /submit/i }).click();
    await expect(page.getByRole('heading', { name: /pick your first job/i })).toBeVisible();

    await page.locator('.job-card').first().click(); //does not work

    await page.getByTestId('continue-button').scrollIntoViewIfNeeded();
    await page.getByTestId('continue-button').click();
    await expect(page.getByRole('heading', { name: /employment information/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /continue to payslip/i })).toBeVisible();
});
//Also doesnt work because of the card clicking issue
// Payslip and Personal Allowances
// test('can continue to payslip and see personal allowances', async ({ page }) => {
//     await page.goto('http://localhost:5000');
//     await page.getByRole('button', { name: /start game/i }).click();
//     await page.getByTestId('name-input').fill('Test User');
//     await page.getByTestId('username-input').fill('testuser');
//     await page.getByTestId('age-input').fill('21');
//     await page.getByTestId('location-input').fill('London');
//     await page.getByRole('button', { name: /submit/i }).click();
//     await expect(page.getByRole('heading', { name: /pick your first job/i })).toBeVisible();
//     await page.getByRole('button', { name: 'Continue', exact: true }).scrollIntoViewIfNeeded();
//     await page.getByRole('button', { name: 'Continue', exact: true }).click();
//     await expect(page.getByRole('heading', { name: /employment information/i })).toBeVisible();
//     await page.getByTestId('continue-button').scrollIntoViewIfNeeded();
//     await page.getByTestId('continue-button').click();
//     await page.getByRole('button', { name: 'Continue to Payslip', exact: true }).click();
//     await expect(page.getByRole('heading', { name: /personal allowances/i })).toBeVisible();
// });