import { test, expect } from '@playwright/test';

test('Combined API workflow: Create, Update, Delete', async ({ request }) => {
  // This test demonstrates a complete CRUD workflow: Create, Update, Delete
  // Note: Due to JSONPlaceholder's mock nature, we skip the Read step
  // In a real API, you would: Create -> Read -> Update -> Delete
  // Here we demonstrate: Create -> Update -> Delete

  // Step 1: CREATE - Post a new post
  const newPost = {
    title: 'Workflow Test Post',
    body: 'This post will go through Create, Update, Delete workflow.',
    userId: 1,
  };

  console.log('Step 1: Creating a new post...');
  const createResponse = await request.post('https://jsonplaceholder.typicode.com/posts', {
    data: newPost,
  });
  expect(createResponse.status()).toBe(201);

  const createdPost = await createResponse.json();
  expect(createdPost.title).toBe(newPost.title);
  expect(createdPost).toHaveProperty('id');

  const postId = createdPost.id; // Save the ID for subsequent operations
  console.log(`Created post with ID: ${postId}`);

  // Step 2: UPDATE - Update the post we just created using PUT
  const updatedData = {
    id: postId,
    title: 'Updated Workflow Test Post',
    body: 'This post has been updated in the workflow.',
    userId: 1,
  };

  console.log('Step 2: Updating the post...');
  const updateResponse = await request.put(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
    data: updatedData,
  });
  expect(updateResponse.status()).toBe(200);

  const updatedPost = await updateResponse.json();
  expect(updatedPost.title).toBe(updatedData.title);
  expect(updatedPost.body).toBe(updatedData.body);
  console.log('Successfully updated the post');

  // Step 3: DELETE - Delete the post
  console.log('Step 3: Deleting the post...');
  const deleteResponse = await request.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`);
  expect(deleteResponse.status()).toBe(200);

  console.log('Successfully deleted the post');

  // Note: JSONPlaceholder is a mock API that doesn't actually persist or delete data
  // In a real API, the full workflow would work with persistent data
});