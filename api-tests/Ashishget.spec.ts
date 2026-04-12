import { test, expect } from '@playwright/test';

test('GET request example', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts');
    expect(response.status()).toBe(200);
    const data = await response.json();
    console.log(data);expect(data.length).toBeGreaterThan(1);
    const post = data.find((item: any) => item.id === 96);
    if (post) {
        console.log(post.title);
    }
    expect(data[0]).toHaveProperty('id');
  expect(data[0]).toHaveProperty('title');
  expect(data[0]).toHaveProperty('body');
  expect(data[0]).toHaveProperty('userId');

  // Additional assertion: id ek number hona chahiye (Additional assertion to check that the id is a number)
  expect(typeof data[0].id).toBe('number');
});
