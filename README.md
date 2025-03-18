# JEST tutorial for test-driven development
Learn how to write unit tests and other kinds of tests

# Setup

Install dependencies

`$ npm install`

Run tests

`$ NODE_ENV=test npx jest /path/to/test/file`

Run coverage

`$ NODE_ENV=test npx jest --coverage /path/to/test/file`

View coverage report in `coverage/lcov-report/index.html`

**Windows Note**: If you are on Windows and the above commands do not run
because of NODE_ENV not recognized then first set the environment variable from the terminal using `SET NODE_ENV=test` and then
run the jest command `npx jest --covereage /path/to/test/file`. The coverage is optional.

The followung database scripts are not necessary. If you still need
them for manual testing here they are:

`$ npx ts-node insert_sample_data.ts "mongodb://127.0.0.1:27017/my_library_db"`

Clean the database

`npx ts-node remove_db.ts "mongodb://127.0.0.1:27017/my_library_db"`

# Description

This repository illustrates how to use jest to write unit tests 
for a server in typescript. The examples are as follows:

- `tests/authorSchema.test.ts`: Unit tests to verify the schema of the authors colletion. 
- `tests/bookDetailsService.test.ts`: Unit tests to verify the behavior of the service that is used to retrieve the details of a particular book.
- `tests/createBookService.test.ts`: Unit tests to verify if a book is created successfully.

# For you to do

## Part 1

Write a unit test for the GET /authors service. 
The service should respond with a list of author names and lifetimes sorted by family name of the authors. It should respond
with a "No authors found" message when there are no authors in the database. If an error occurs when retrieving the authors then the
service responds with an error code of 500. The unit test
should be placed in `tests/authorService.test.ts`.

## Part 2: Limitation of `tests/authorSchema.test.ts`

The tests in `tests/authorSchema.test.ts` have the following limitations:

- **Incomplete Coverage of Virtual Properties**:  
  The tests do not validate the behavior of virtual properties:
  - `name`: Untested scenarios like missing `first_name` or `family_name`
  - `lifespan`: Untested edge cases (e.g., missing `date_of_birth`/`date_of_death`)

- **Untested Static Methods**:  
  Critical model methods remain untested:
  - `getAuthorCount`
  - `getAllAuthors`
  - `getAuthorIdByName`

- **Missing Edge Cases**:  
  No tests for:
  - Partial data (e.g., authors with only a first name)
  - Field interactions (e.g., invalid date combinations)

---

## Part 3: Improving Tests Using Coverage Report

### Process for Improvement

**Step 1: We generate the Coverage Report**  
```
NODE_ENV=test npx jest --coverage tests/authorService.test.ts
```
Output includes:
- Terminal summary (statements/branches/functions/lines coverage)
- Detailed HTML report at `coverage/lcov-report/index.html`

**Step 2: We analyze Coverage Gaps**  
From the HTML report:
- 🔴 **Red lines**: Untested code (e.g., error handling in `getAllAuthors`)
- 🟡 **Yellow lines**: Partially covered branches (e.g., `lifespan` logic)

**Step 3: Targeted Improvements**  

| Coverage Gap                | Action                               | Example Test Case                   |
|-----------------------------|--------------------------------------|--------------------------------------|
| Virtual properties           | Add tests for missing date scenarios | Author with only `date_of_birth`     |
| Static methods               | Test `getAuthorIdByName`             | Verify ID retrieval by full name    |
| Error handling branches      | Mock database failures               | Simulate MongoDB connection errors  |


**Summary**

- Use the HTML report’s color-coding to prioritize critical gaps
- Focus on testing business logic before trivial getters/setters
- Integrate coverage checks into development workflow (not just CI/CD)
