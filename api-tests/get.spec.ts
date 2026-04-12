import { test, expect } from '@playwright/test';

test('GET request to fetch posts', async ({ request }) => {
  // Ye test batata hai ki GET request kaise bhejte hain data retrieve karne ke liye API se (This test demonstrates how to send a GET request to retrieve data from an API)
  // Hum JSONPlaceholder API use kar rahe hain, jo fake data provide karta hai testing ke liye (We are using the JSONPlaceholder API, which provides fake data for testing purposes)
  // GET requests ka use hota hai server se data fetch karne ke liye bina modify kiye (GET requests are used to fetch data from the server without modifying it)

  // /posts endpoint pe GET request bhejo sare posts retrieve karne ke liye (Send a GET request to the /posts endpoint to retrieve all posts)
  const response = await request.get('https://jsonplaceholder.typicode.com/posts');

  // Assert karo ki HTTP status code 200 hai, jo successful response ka indication hai (Assert that the HTTP status code is 200, which indicates a successful response)
  // 200 range ke status codes ka matlab hota hai request successful tha (Status codes in the 200 range mean the request was successful)
  expect(response.status()).toBe(200);

  // Response body ko JSON ke roop mein parse karo data ke saath work karne ke liye (Parse the response body as JSON to work with the data)
  const posts = await response.json();

  // Assert karo ki response ek array hai (kyunki hum multiple posts fetch kar rahe hain) (Assert that the response is an array (since we're fetching multiple posts))
  expect(Array.isArray(posts)).toBe(true);

  // Assert karo ki hume kuch posts mile (array empty nahi hai) (Assert that we received some posts (the array is not empty))
  expect(posts.length).toBeGreaterThan(0);

  // Assert karo ki pehle post mein expected structure hai (Assert that the first post has the expected structure)
  // Har post mein id, title, body, aur userId hona chahiye (Each post should have an id, title, body, and userId)
  expect(posts[0]).toHaveProperty('id');
  expect(posts[0]).toHaveProperty('title');
  expect(posts[0]).toHaveProperty('body');
  expect(posts[0]).toHaveProperty('userId');

  // Additional assertion: id ek number hona chahiye (Additional assertion to check that the id is a number)
  expect(typeof posts[0].id).toBe('number');
});