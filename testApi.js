// Function to call the API using fetch
const API_LOCAL = "http://127.0.0.1:8080/api/login";
const API_PI5 = "http://27.75.108.177:8080/api/login";
const API_PI5_SUB = "http://27.75.108.177:8081/api/login";

async function callAPI() {
  try {
    const response = await fetch(API_PI5, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "admin@gmail.com",
        password: "admin",
      }),
    });

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();
    console.log("API Response:", data);
  } catch (error) {
    console.error("API Error:", error.message);
  }
}

// Loop to call the API 10000 times
async function callAPI10000Times() {
  for (let i = 0; i < 100000000000; i++) {
    console.log(`Call ${i + 1}/10000`);
    await callAPI(); // Wait for each API call to finish before proceeding to the next one
  }
}

// Start calling the API 10000 times
callAPI10000Times();
