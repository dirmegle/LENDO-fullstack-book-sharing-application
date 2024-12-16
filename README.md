# Lendo - book sharing app

## About the project

Lendo is a fullstack book sharing application that's meant to foster the community of like-minded readers. People are able to create their network of friends, shares their insights on any book, create their personal libraries and reserve or lend their own books.

### Project justification

While there are many elaborate platforms to review books, there is a growing demand for intimate, community-driven tools that allow individuals to engage with their immediate networks in a meaningful and private way. This app fills a gap that larger, impersonal platforms cannot:

- **Making Books Accessible:** the app supports sustainable reading habits by promoting the reuse and circulation of physical books among friends. Instead of purchasing new books, users can borrow from one another’s collections, reducing waste and making books more accessible.
- **Promoting Private Discussions:** many readers value the opportunity to discuss books in a more personal and closed setting. By restricting access to comments and reviews to one's trusted network, the app encourages authentic and meaningful exchanges about books. Users have a chose whether they want to make their comments public or private.
- **Streamlined Book Reservation Management:** borrowing books from friends can sometimes lead to confusion or lost items. The app provides an intuitive way to track reservations, due dates, and lending history, helping lenders and lendees to stay organized.
- **Safe Space for Niche Communities:** for readers interested in niche genres or specialized topics, mainstream platforms may not offer a suitable audience. This app provides a tailored and safe environment for these readers to connect with like-minded friends and share unique insights.
- **All-in-one stop for book lovers:** although the app is only in early stages of development, the roadmap and planned features will make this THE platform for book lovers to connect with their friends, track their goals and look for the net perfect read.

### Application overview:

At the moment, the backend has been set to allow the user to:

- Create their profile
- Connect with friends
  - Send friendship requests
  - Accept or reject friendship requests
  - Delete friendship requests
  - In all cases, a notification for the other user is created.
- Search for books
  - By author, title or ISBN
- Add books to their personal library
- Create reservations for books owned ny friends:
  - See available reservation dates
  - Create reservation requests
  - Book owners can confirm or reject reservation requests
  - Book owners and book reservers can complete the request or cancel it
  - In all cases, a notification is creates for the other user
- Comment on books
  - Can choose to make their comments public or private (only available to friends)
  - Can edit their own comments

### Technologies used:

- **Backend:** RPC API, TypeScript, Node.js, Kysely, PostgreSQL, Google Books API
- **Frontend (planned):** React, TypeScript, Tailwind, shadcn/ui

### Database schema
https://dbdiagram.io/d/Lendo-66e83d9a6dde7f414941cc1f 

## Application roadmap

| No. | Feature                                                             | Frontend | Backend |
| --- | ------------------------------------------------------------------- | :------: | :-----: |
| 1.  | User profile creation and authorization                             |          |    ✓    |
| 2.  | Friendship between users                                            |          |    ✓    |
| 3.  | Book data retrieval using Google Books API                          |          |    ✓    |
| 4.  | Creation of personal book library                                   |          |    ✓    |
| 5.  | Book reservation system                                             |          |    ✓    |
| 6.  | Notification system                                                 |          |    ✓    |
| 7.  | Book commenting                                                     |          |    ✓    |
| 8.  | Direct messaging                                                    |          |         |
| 9.  | Friends activity display                                            |          |         |
| 10. | Evaluation system for books                                         |          |         |
| 11. | "Current read" and "Want to read" categories                        |          |         |
| 12. | User reading statistics, year read goal and progress tracking       |          |         |
| 13. | "Suggested read" feature constructed using user's prompt and OpenAI |          |         |

**Please note:** current project scope involves only features up until direct messaging (8).
The following features will be implemented in the near future.

### Planned feature improvements:

- **User profile creation and authorization:**

  - Implement connection with AWS S3 to allow users to upload their profile photos.
  - Implement refresh token to improve security
  - Add setting to update user profile information
  - Forgot password (update password) feature

- **Book reservation system:**
  - Ability to change reservation dates instead of deleting old reservation and creating a new one.

## How to run the application:

1. Clone the repository
2. Run `npm install`
3. Create a Postgre database called 'lendo'
4. Add env variables according to `.env.example` file inside the server directory
5. Run `npm run migrate:latest -w server` to run database migrations.
6. Run `npm run gen:types -w server` to generate types.
7. Run `npm run dev -w server` to start the server.
8. Access `http://localhost:3000/api/v1/trpc-panel` to test the procedures
