import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';
import { LoginPage } from '../pages/login.page';
import { PulpitPage } from '../pages/pulpit.page';

test.describe('Pulpit tests', () => {
  let pulpitPage: PulpitPage;
  test.beforeEach(async ({ page }) => {
    const userId = loginData.userId;
    const userPassword = loginData.userPassword;

    await page.goto('/');
    const loginPage = new LoginPage(page);
    await loginPage.login(userId, userPassword);

    pulpitPage = new PulpitPage(page);
  });

  test('quick payment with correct data', {tag: ["@pulpit", "@integration"], annotation: {
    type: 'documentation',
    description: 'https://jaktestowac.pl/course/playwright-wprowadzenie/',
  },}, async ({
    page,
  }) => {
    // Arrange
    const receiverId = '2';
    const transferAmount = '150';
    const transferTitle = 'pizza';
    const expectedTransferReceiver = 'Chuck Demobankowy';
    const expectedMessage = `Przelew wykonany! ${expectedTransferReceiver} - ${transferAmount},00PLN - ${transferTitle}`;

    // Act
    await pulpitPage.executeQuickPayment(
      receiverId,
      transferAmount,
      transferTitle,
    );

    // Assert
    await expect(pulpitPage.messageText).toHaveText(expectedMessage);
  });

  test('successful mobile top-up', {tag: ["@pulpit", "@integration"]}, async ({ page }) => {
    // Arrange
    const topupReceiver = '500 xxx xxx';
    const topupAmount = '50';
    const expectedMessage = `Doładowanie wykonane! ${topupAmount},00PLN na numer ${topupReceiver}`;

    //Act
    await pulpitPage.executeMobileTopUp(topupReceiver, topupAmount);

    // Assert
    await expect(pulpitPage.messageText).toHaveText(expectedMessage);
  });

  test('correct balance after successful mobile top-up', {tag: ["@pulpit", "@integration"]}, async ({
    page,
  }) => {
    // Arrange
    const topupReceiver = '500 xxx xxx';
    const topupAmount = '50';
    const initialBalance = await page.locator('#money_value').innerText();
    const expectedBalance = Number(initialBalance) - Number(topupAmount);

    //Act
    await pulpitPage.executeMobileTopUp(topupReceiver, topupAmount);

    // Assert
    await expect(pulpitPage.moneyValueText).toHaveText(`${expectedBalance}`);
  });
});
