import test, { expect } from "@playwright/test"
import { fakeUserWithoutId } from "./utils/fakeData"

const URL_LOGGED_IN = '/home'

test.describe.serial('user sign up and login', () => {
    const user = fakeUserWithoutId()
    
    test('visiting user can successfully sign up', async ({page}) => {
        const toastLocator = page.locator('[data-testid="toast"]')

        await expect(toastLocator).toBeHidden()
        
        await page.goto(`/login?activeTab=signup`)
        await page.getByRole('textbox', { name: 'First name' }).click()
        await page.getByRole('textbox', { name: 'First name' }).fill(user.firstName)
        await page.getByRole('textbox', { name: 'Last name' }).fill(user.lastName)
        await page.getByRole('textbox', { name: 'Email' }).fill(user.email)
        await page.getByRole('textbox', { name: 'Password', exact: true }).fill('password123!')
        await page.getByRole('textbox', { name: 'Repeat password' }).fill('password123!')
        await page.getByRole('button', { name: 'Submit' }).click()

        await expect(toastLocator).toBeVisible()
    })

    test('user cannot access authorized url without login', async ({ page }) => {
        await page.goto(URL_LOGGED_IN)
        await page.waitForURL('/login')
    })

    test('registered user can successfully log in', async ({page}) => {
        const greetingMessageLocator = page.locator('[data-testid="greeting-message"]')

        await expect(greetingMessageLocator).toBeHidden()

        await page.goto(`/login?activeTab=login`)
        await page.getByRole('textbox', { name: 'Email' }).fill(user.email)
        await page.getByRole('textbox', { name: 'Password', exact: true }).fill('password123!')
        await page.getByRole('button', { name: 'Submit' }).click()

        await expect(greetingMessageLocator).toBeVisible()
    })

})

