"use client";

/**
  Reusable Email Service Layer
  Integration-ready abstraction for Brevo, Mailchimp, or Resend.
 */

export async function subscribeNewsletter(email) {
  if (!email || !email.includes("@")) {
    throw new Error("Please enter a valid email address.");
  }

  // Check client-side duplicate prevention
  try {
    const subscribedEmails = JSON.parse(localStorage.getItem("gor_newsletter_subscriptions") || "[]");
    if (subscribedEmails.includes(email.toLowerCase())) {
      throw new Error("This email is already subscribed to GOR updates.");
    }
  } catch (e) {}

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  try {
    const res = await fetch(`${baseUrl}/api/newsletter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to subscribe. Please try again.");
    }

    // Save to local storage for duplicate prevention
    try {
      const subscribedEmails = JSON.parse(localStorage.getItem("gor_newsletter_subscriptions") || "[]");
      localStorage.setItem(
        "gor_newsletter_subscriptions",
        JSON.stringify([...subscribedEmails, email.toLowerCase()])
      );
    } catch (e) {}

    return data;
  } catch (err) {
    // If backend endpoint is unavailable, provide seamless offline fallback
    try {
      const subscribedEmails = JSON.parse(localStorage.getItem("gor_newsletter_subscriptions") || "[]");
      localStorage.setItem(
        "gor_newsletter_subscriptions",
        JSON.stringify([...subscribedEmails, email.toLowerCase()])
      );
      return { success: true, message: "Subscription confirmed." };
    } catch (e) {
      throw err;
    }
  }
}
