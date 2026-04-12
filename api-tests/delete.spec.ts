import { test, expect } from '@playwright/test';

test('DELETE request to remove a post', async ({ request }) => {
  // This test demonstrates how to send a DELETE request to remove a resource
  // DELETE requests are used to delete the specified resource from the server

  // Send a DELETE request to remove the post with id 1
  const response = await request.delete('https://jsonplaceholder.typicode.com/posts/1');

  // Assert that the HTTP status code is 200, indicating successful deletion
  // Some APIs return 204 (No Content) for successful deletions
  expect(response.status()).toBe(200);

  // For JSONPlaceholder, the response body is an empty object {}
  // In real APIs, the response might be empty or contain a confirmation message
  const result = await response.json();

  // Assert that the response is an object (empty in this case)
  expect(typeof result).toBe('object');

  // Note: JSONPlaceholder doesn't actually delete the resource (it's a mock API)
  // In a real API, subsequent GET requests to the same resource would return 404
  // But for testing purposes, we're verifying the request/response structure
});