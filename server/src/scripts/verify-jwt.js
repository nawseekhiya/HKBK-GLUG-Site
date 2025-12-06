import { config } from "../config/index.js";

const BASE_URL = `http://localhost:${config.port}/api/auth`;

const runVerification = async () => {
  console.log("Starting JWT Verification...");

  const testUser = {
    name: "JWT Test User",
    email: `jwttest_${Date.now()}@example.com`,
    password: "password123",
  };

  try {
    // 1. Register
    console.log("\n1. Registering...");
    const regRes = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    });
    if (!regRes.ok) throw new Error(await regRes.text());
    console.log("✅ Registered");

    // 2. Login
    console.log("\n2. Logging in...");
    const loginRes = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testUser.email, password: testUser.password }),
    });
    if (!loginRes.ok) throw new Error(await loginRes.text());
    const loginData = await loginRes.json();
    const { accessToken, refreshToken } = loginData.data;
    
    if (!accessToken || !refreshToken) throw new Error("Tokens missing in login response");
    console.log("✅ Logged in. Got Tokens.");

    // 3. Access Protected Route (/me)
    console.log("\n3. Accessing Protected Route (/me)...");
    const meRes = await fetch(`${BASE_URL}/me`, {
      headers: { "Authorization": `Bearer ${accessToken}` },
    });
    if (!meRes.ok) throw new Error(await meRes.text());
    const meData = await meRes.json();
    console.log("✅ Accessed /me. User ID:", meData.data.user.sub);

    // 4. Access Protected Route (No Token)
    console.log("\n4. Accessing Protected Route (No Token)...");
    const noTokenRes = await fetch(`${BASE_URL}/me`);
    if (noTokenRes.status === 401) {
      console.log("✅ Access Denied (401) as expected");
    } else {
      throw new Error(`Expected 401, got ${noTokenRes.status}`);
    }

    // 5. Refresh Token
    console.log("\n5. Refreshing Token...");
    const refreshRes = await fetch(`${BASE_URL}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!refreshRes.ok) throw new Error(await refreshRes.text());
    const refreshData = await refreshRes.json();
    const newAccessToken = refreshData.data.accessToken;
    const newRefreshToken = refreshData.data.refreshToken;
    
    if (!newAccessToken || !newRefreshToken) throw new Error("Tokens missing in refresh response");
    console.log("✅ Token Refreshed.");

    // 6. Access /me with New Token
    console.log("\n6. Accessing /me with New Token...");
    const meRes2 = await fetch(`${BASE_URL}/me`, {
      headers: { "Authorization": `Bearer ${newAccessToken}` },
    });
    if (!meRes2.ok) throw new Error(await meRes2.text());
    console.log("✅ Accessed /me with new token.");

    // 7. Logout
    console.log("\n7. Logging out...");
    const logoutRes = await fetch(`${BASE_URL}/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: newRefreshToken }),
    });
    if (!logoutRes.ok) throw new Error(await logoutRes.text());
    console.log("✅ Logged out.");

    // 8. Try Refresh with Logged Out Token (Should Fail)
    console.log("\n8. Refreshing with Revoked Token...");
    const failRefreshRes = await fetch(`${BASE_URL}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: newRefreshToken }),
    });
    if (failRefreshRes.status === 401) {
      console.log("✅ Refresh Denied (401) as expected (Revoked)");
    } else {
      throw new Error(`Expected 401 for revoked token, got ${failRefreshRes.status}`);
    }

    console.log("\n🎉 All JWT Verification Tests Passed!");
  } catch (error) {
    console.error("\n❌ Verification Failed:", error.message);
    process.exit(1);
  }
};

runVerification();
