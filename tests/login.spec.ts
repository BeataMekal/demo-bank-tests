import { test, expect } from '@playwright/test';

test.describe('User login to Demobank', () => {
  test.beforeEach(async ({ page }) => {
    const url = 'https://demo-bank.vercel.app/';
    await page.goto(url);
    
  });

  //grupa testów
  test('successful login with correct credentials', async ({ page }) => {
    // Arrange
    const userId = 'testerLO';
    const userPassword = '12345678';
    const expectedUserName = 'Jan Demobankowy';

    // Act
    await page.getByTestId('login-input').fill(userId);
    await page.getByTestId('password-input').fill(userPassword);
    await page.getByTestId('login-button').click();

    //Assert
    await expect(page.getByTestId('user-name')).toHaveText(expectedUserName);
  });

  test('unsuccessful login with too short username', async ({ page }) => {
    // Arrange
    const incorrectUserId = 'tester';
    const expectedErrorMessage = 'identyfikator ma min. 8 znaków';

    // Arrange
    await page.getByTestId('login-input').fill(incorrectUserId);
    await page.getByTestId('password-input').click();

    // Assert
    await expect(page.getByTestId('error-login-id')).toHaveText(
      expectedErrorMessage,
    );
  });

  test('unsuccessful login with too short password', async ({ page }) => {
    // Arrange
    const userId = 'testerLO';
    const incorrectUserPassword = '1234';
    const expectedErrorMessage = 'hasło ma min. 8 znaków';

    // Arrange
    await page.getByTestId('login-input').fill(userId);
    await page.getByTestId('password-input').fill(incorrectUserPassword);
    await page.getByTestId('password-input').blur(); // wyjście z focusa

    // Assert
    await expect(page.getByTestId('error-login-password')).toHaveText(
      expectedErrorMessage,
    );
  });
});
