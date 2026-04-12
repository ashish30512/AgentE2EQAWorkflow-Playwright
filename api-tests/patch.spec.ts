import { test, expect } from '@playwright/test';

test('PATCH request to partially update a post', async ({ request }) => {
  // This test demonstrates how to send a PATCH request to update part of a resource
  // PATCH requests are used for partial updates, modifying only the specified fields
  // Unlike PUT, PATCH doesn't require sending the complete object

  // Define only the fields we want to update
  const partialUpdate = {
    title: 'Partially Updated Title', // Only updating the title
  };

  // Send a PATCH request to update only the title of post with id 1
  const response = await request.patch('https://jsonplaceholder.typicode.com/posts/1', {
    data: partialUpdate, // Send only the fields to update
  });

  // Assert that the HTTP status code is 200, indicating successful partial update
  expect(response.status()).toBe(200);

  // Parse the response body as JSON
  const result = await response.json();

  // Assert that the title was updated
  expect(result.title).toBe(partialUpdate.title);

  // Assert that other fields remain unchanged (JSONPlaceholder returns the full object)
  expect(result).toHaveProperty('body'); // Original body should still be there
  expect(result).toHaveProperty('userId'); // Original userId should still be there
  expect(result).toHaveProperty('id'); // id should remain 1

  // Note: In real APIs, PATCH responses might vary
  // Some return the updated object, others return just a success status
});