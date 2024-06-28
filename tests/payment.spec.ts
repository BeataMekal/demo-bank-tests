import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';

test.describe('Payment tests', () => {
  test.beforeEach(async ({ page }) => {
    const userId = loginData.userId;
    const userPassword = loginData.password;

    await page.goto('/');
    await page.getByTestId('login-input').fill(userId);
    await page.getByTestId('password-input').fill(userPassword);
    await page.getByTestId('login-button').click();
    await page.getByRole('link', { name: 'płatności' }).click();
  });

  test('simple payment', async ({ page }) => {
    //Arrange
    const transferReceiver = 'Jan Nowak';
    const transferAccount = '22 2787 8757 5788 8844 4222 22214';
    const transferAmount = '50';
    const expectedMessage = `Przelew wykonany! ${transferAmount},00PLN dla Jan Nowak`;

    //Act
    await page.getByTestId('transfer_receiver').fill(transferReceiver);
    await page.getByTestId('form_account_to').fill(transferAccount);
    await page.getByTestId('form_amount').fill(transferAmount);
    await page.getByRole('button', { name: 'wykonaj przelew' }).click();
    await page.getByTestId('close-button').click();

    //Assert
    await expect(page.locator('#show_messages')).toHaveText(expectedMessage)
  });
});
