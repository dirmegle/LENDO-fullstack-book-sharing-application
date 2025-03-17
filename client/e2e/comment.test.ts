import test, { expect, Page } from '@playwright/test'
import { fakeUserWithoutId } from 'utils/fakeData'

let page: Page

const dummyBookDetails = {
  isbn: '9781781100264',
  partialName: 'Harry Potter',
}

const comment = {
    original: "Loved the characters",
    edited: "Loved the characters! :)"
}

test.describe.serial('leave and edit a comment', () => {

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

  test('leave a comment on the book', async () => {
    const bookResultsWindow = page.locator('[data-testid="book-search-results"]')
    const bookSearchLink = page.locator('[data-testid="book-search-link"]')
    const commentLocator = page.locator('[data-testid="comment"]').filter({ hasText: comment.original })

    await page.goto('/home')
    await page.getByRole('tab', { name: 'ISBN' }).click()
    await page.getByRole('textbox', { name: 'Search books by isbn' }).fill(dummyBookDetails.isbn)
    await expect(bookResultsWindow).toBeVisible()
    await bookSearchLink.first().click()

    await page.getByRole('textbox', { name: 'Leave your comment' }).fill(comment.original)
    await page.getByRole('button', { name: 'Post comment' }).click()
    await expect(commentLocator).toBeVisible()
  })

  test('edit the comment', async () => {
    const commentLocator = page.locator('[data-testid="comment"]').filter({ hasText: comment.original });
    const editedCommentLocator = page.locator('[data-testid="comment"]').filter({ hasText: comment.edited });
    const editButtonLocator = commentLocator.locator('[data-testid="comment-edit-button"]');
    const saveChangesButtonLocator = commentLocator.locator('[data-testid="comment-save-changes-button"]');

    await editButtonLocator.click();
    const textarea = commentLocator.locator('textarea');
    await textarea.fill(comment.edited);
    await saveChangesButtonLocator.click();
    await expect(editedCommentLocator).toBeVisible();
  });

  test('delete the comment', async () => {
    const editedCommentLocator = page.locator('[data-testid="comment"]').filter({ hasText: comment.edited })
    const deletionButtonLocator = editedCommentLocator.locator('[data-testid="comment-delete-button"]')
    const deletionDialogLocator = page.locator('[data-testid="comment-deletion-dialog"]')
    const deletionDialogButtonLocator = deletionDialogLocator.locator('[data-testid="comment-deletion-dialog-button"]')

    await deletionButtonLocator.click()
    await expect(deletionDialogLocator).toBeVisible()
    await deletionDialogButtonLocator.click()
    await expect(editedCommentLocator).toBeHidden()
  })
})
