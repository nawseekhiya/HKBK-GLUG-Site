import { config } from "../config/index.js";

const BASE_URL = `http://localhost:${config.port}/api/auth`;

const runVerification = async () => {
  console.log("Starting Auth Verification...");

  const testUser = {
    name: "Auth Test User",
    email: `authtest_${Date.now()}@example.com`,
    password: "password123",
  };

  try {
    // 1. Register User
    console.log("\n1. Testing Register...");
    const registerRes = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    });

    if (!registerRes.ok) {
      const text = await registerRes.text();
      throw new Error(`Register failed (${registerRes.status}): ${text}`);
    }

    const registerData = await registerRes.json();
    console.log("✅ User Registered:", registerData.data.user.email);

    // 2. Login User (Success)
    console.log("\n2. Testing Login (Success)...");
    const loginRes = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    if (!loginRes.ok) {
      const text = await loginRes.text();
      throw new Error(`Login failed (${loginRes.status}): ${text}`);
    }

    const loginData = await loginRes.json();
    console.log("✅ User Logged In:", loginData.data.user.email);

    // 3. Login User (Failure - Wrong Password)
    console.log("\n3. Testing Login (Failure - Wrong Password)...");
    const failLoginRes = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testUser.email,
        password: "wrongpassword",
      }),
    });

    if (failLoginRes.status === 401) {
      console.log("✅ Login Failed as expected (401)");
    } else {
      throw new Error(`Expected 401, got ${failLoginRes.status}`);
    }

    // 4. Register Duplicate User (Failure)
    console.log("\n4. Testing Register Duplicate (Failure)...");
    const dupRegisterRes = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    });

    if (dupRegisterRes.status === 409) {
      console.log("✅ Duplicate Register Failed as expected (409)");
    } else {
      throw new Error(`Expected 409, got ${dupRegisterRes.status}`);
    }

    console.log("\n🎉 All Auth Verification Tests Passed!");
  } catch (error) {
    console.error("\n❌ Verification Failed:", error.message);
    process.exit(1);
  }
};

runVerification();
