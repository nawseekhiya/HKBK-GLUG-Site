import { config } from "../config/index.js";

const BASE_URL = `http://localhost:${config.port}/api/events`;

const runVerification = async () => {
  console.log("Starting Events CRUD Verification...");

  try {
    // 1. Create Event
    console.log("\n1. Testing Create Event...");
    const createRes = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Test Event",
        description: "This is a test event",
        date: new Date(Date.now() + 86400000).toISOString(),
        venue: "Test Venue",
        capacity: 100,
        tags: ["test", "verification"],
      }),
    });
    
    if (!createRes.ok) {
      const text = await createRes.text();
      throw new Error(`Create failed (${createRes.status}): ${text}`);
    }
    
    const createdEvent = await createRes.json();
    console.log("✅ Event Created:", createdEvent._id);

    // 2. List Events
    console.log("\n2. Testing List Events...");
    const listRes = await fetch(`${BASE_URL}?upcoming=true`);
    const listData = await listRes.json();
    console.log(`✅ Listed ${listData.data.length} upcoming events`);

    // 3. Get Event
    console.log("\n3. Testing Get Event...");
    const getRes = await fetch(`${BASE_URL}/${createdEvent._id}`);
    const getEvent = await getRes.json();
    if (getEvent._id !== createdEvent._id) throw new Error("Get event ID mismatch");
    console.log("✅ Get Event successful");

    // 4. Update Event
    console.log("\n4. Testing Update Event...");
    const updateRes = await fetch(`${BASE_URL}/${createdEvent._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Updated Test Event",
      }),
    });
    const updatedEvent = await updateRes.json();
    if (updatedEvent.title !== "Updated Test Event") throw new Error("Update failed");
    console.log("✅ Update Event successful");

    // 5. Delete Event
    console.log("\n5. Testing Delete Event...");
    const deleteRes = await fetch(`${BASE_URL}/${createdEvent._id}`, {
      method: "DELETE",
    });
    if (deleteRes.status !== 204) throw new Error("Delete failed");
    console.log("✅ Delete Event successful");

    // 6. Verify Soft Delete (Get should fail)
    console.log("\n6. Verifying Soft Delete...");
    const verifyDeleteRes = await fetch(`${BASE_URL}/${createdEvent._id}`);
    if (verifyDeleteRes.status !== 404) throw new Error("Soft delete verification failed (Event still accessible)");
    console.log("✅ Soft Delete verified (404 returned)");

    console.log("\n🎉 All Verification Tests Passed!");
  } catch (error) {
    console.error("\n❌ Verification Failed:", error.message);
    process.exit(1);
  }
};

runVerification();
