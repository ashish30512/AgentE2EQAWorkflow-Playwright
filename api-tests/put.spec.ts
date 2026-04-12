import { test, expect } from '@playwright/test';

test('PUT request to update a post completely', async ({ request }) => {
  // This test demonstrates how to send a PUT request to update an entire resource
  // PUT requests replace the entire resource with the new data provided
  // Unlike PATCH, PUT requires sending the complete updated object

  // Define the complete updated data for the post
  const updatedPost = {
    id: 1, // The id of the post to update
    title: 'Updated Post Title',
    body: 'This is the completely updated body of the post.',
    userId: 1,
  };

  // Send a PUT request to update the specific post (id: 1)
  const response = await request.put('https://jsonplaceholder.typicode.com/posts/1', {
    data: updatedPost, // Send the complete updated post data
  });

  // Assert that the HTTP status code is 200, indicating successful update
  // Some APIs might return 204 (No Content) for successful updates
  expect(response.status()).toBe(200);

  // Parse the response body as JSON
  const result = await response.json();

  // Assert that the response contains the updated data
  expect(result.title).toBe(updatedPost.title);
  expect(result.body).toBe(updatedPost.body);
  expect(result.userId).toBe(updatedPost.userId);
  expect(result.id).toBe(updatedPost.id);

  // Note: JSONPlaceholder returns the updated object, but in real APIs
  // the response might be different (e.g., just a success message)
});