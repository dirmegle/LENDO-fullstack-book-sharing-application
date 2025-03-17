import { test, expect, Page } from '@playwright/test'
import { fakeUserWithoutId } from './utils/fakeData'

let page: Page

const dummyBookDetails = {
    isbn: '9781781100264',
    partialName: 'Harry Potter'
}

test.describe.serial('find a book by title, view details and add to library', () => {

    const user = fakeUserWithoutId()

    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext()
        page = await context.newPage()

        await page.goto(`/login?activeTab=signup`)
        await page.getByRole('textbox', { name: 'First name' }).click()
        await page.getByRole('textbox', { name: 'First name' }).fill(user.firstName)
        await page.getByRole('textbox', { name: 'Last name' }).fill(user.lastName)
        await page.getByRole('textbox', { name: 'Email' }).fill(user.email)
        await page.getByRole('textbox', { name: 'Password', exact: true }).fill('password123!')
        await page.getByRole('textbox', { name: 'Repeat password' }).fill('password123!')
        await page.getByRole('button', { name: 'Submit' }).click()
        await page.goto('/login?activeTab=login')
        await page.getByRole('textbox', { name: 'Email' }).fill(user.email)
        await page.getByRole('textbox', { name: 'Password', exact: true }).fill('password123!')
        await page.getByRole('button', { name: 'Submit' }).click()
    })

    test('user can search for a book and see details', async () => {
        const ownershipStatusLocator = page.locator('[data-testid="book-details-ownership-status"]')

        const bookResultsWindow = page.locator('[data-testid="book-search-results"]')
        const bookSearchLink = page.locator('[data-testid="book-search-link"]')

        await page.goto('/home')
        await page.getByRole('tab', { name: 'ISBN' }).click()
        await page.getByRole('textbox', { name: 'Search books by isbn' }).fill(dummyBookDetails.isbn)
        await expect(bookResultsWindow).toBeVisible()
        await bookSearchLink.first().click()
        await expect(page.locator('[data-testid="book-title"]')).toContainText(dummyBookDetails.partialName)
        await expect(ownershipStatusLocator).toContainText("Not owned")
    })

    test('user can add book to personal library', async () => {
        const toastLocator = page.locator('[data-testid="toast"]')
        const bookCardLocator = page.locator('[data-testid="book-card"]').filter({ hasText: dummyBookDetails.partialName })

        await expect(toastLocator).toBeHidden()
        await page.locator('[data-testid="personal-library-handler-button"]').click()
        await expect(page.locator('[data-testid="library-addition-dialog"]')).toBeVisible()
        await page.locator('[data-testid="book-addition-button"]').click()
        await expect(toastLocator).toBeVisible()
        await page.goto('/library?activeTab=personal')
        await expect(bookCardLocator).toBeVisible()
    })

    test('user can remove book if there are no active reservations', async () => {
        const ownershipStatusLocator = page.locator('[data-testid="book-details-ownership-status"]')
        const toastLocator = page.locator('[data-testid="toast"]')
        const bookCardLocator = page.locator('[data-testid="book-card"]').filter({ hasText: dummyBookDetails.partialName })

        await bookCardLocator.click()
        await expect(ownershipStatusLocator).toContainText("In your library")
        await page.locator('[data-testid="personal-library-handler-button"]').click()
        await expect(page.locator('[data-testid="library-removal-dialog"]')).toBeVisible()
        await page.locator('[data-testid="book-removal-button"]').click()
        await expect(toastLocator).toBeVisible()
        await expect(ownershipStatusLocator).toContainText("Not owned")
    })
})