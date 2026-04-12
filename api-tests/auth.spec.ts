import { test, expect } from '@playwright/test';
import testData from './data/test-data.json';

test('Bearer token authentication and authorized request', async ({ request }) => {
  // Ye test dikhaata hai ki kaise hum token ko login request se lete hain (This test shows how to get a token from a login request)
  // Fir token ko next request me Authorization header me pass karte hain (Then pass the token in the next request Authorization header)
  // Aur finally response ko validate karte hain (And finally validate the response)

  // Step 1: Login request se token prapt karo (Get token from the login request)
  // reqres.in ek free testing API hai jo login request pe token return karta hai (reqres.in is a free test API that returns a token for the login request)
  // Test data ko separate JSON file se import kiya gaya hai (Test data is imported from a separate JSON file - best practice)
  const loginResponse = await request.post('https://reqres.in/api/login', {
    data: testData.auth.valid_credentials,
  });

  // Assert karo ki login request successful thi (Assert the login request was successful)
  expect(loginResponse.status()).toBe(200);

  // Login response se JSON parse karo aur token nikaalo (Parse JSON response and extract token)
  const loginBody = await loginResponse.json();
  expect(loginBody).toHaveProperty('token');
  expect(typeof loginBody.token).toBe('string');
  expect(loginBody.token.length).toBeGreaterThan(0);

  const bearerToken = loginBody.token;

  // Step 2: Protected resource ko authorize karke request bhejo (Send an authorized request to a protected resource)
  const protectedResponse = await request.get(`https://reqres.in/api/users/${testData.protected_resource.user_id}`, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  // Assert karo ki protected request successful hai (Assert the protected request is successful)
  expect(protectedResponse.status()).toBe(200);

  // Protected response ko parse karo aur data validate karo (Parse protected response and validate data)
  const protectedBody = await protectedResponse.json();
  expect(protectedBody).toHaveProperty('data');
  expect(protectedBody.data).toHaveProperty('id', testData.protected_resource.user_id);
  expect(protectedBody.data).toHaveProperty('email');
  expect(protectedBody.data.email).toBe(testData.protected_resource.expected_email);

  // Ye verify karta hai ki token sahi se use hua aur authorized response mila (This verifies the token was used and an authorized response was received)
});