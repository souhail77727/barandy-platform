require("dotenv").config({ path: ".env.local" });

const publishable = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const secret = process.env.CLERK_SECRET_KEY;

console.log("Publishable key:", {
  exists: !!publishable,
  prefix: publishable?.slice(0, 8),
  length: publishable?.length,
});

console.log("Secret key:", {
  exists: !!secret,
  prefix: secret?.slice(0, 8),
  length: secret?.length,
});