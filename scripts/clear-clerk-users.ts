import { clerkClient } from "@clerk/nextjs/server";

async function main() {
  console.log("Deleting users...");

  const client = await clerkClient();
  const users = await client.users.getUserList({ limit: 100 });
  for (const user of users.data) {
    await client.users.deleteUser(user.id);
  }
  console.log("Users deleted!");
}

main();
