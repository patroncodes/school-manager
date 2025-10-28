import { createYoga } from "graphql-yoga";
import { schema } from "@/lib/pothos/schema";
import { auth } from "@clerk/nextjs/server";
import { RoleAccessLevel } from "@/types";

const yoga = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },

  cors: {
    origin: process.env.NEXT_PUBLIC_BASE_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Type", "Authorization"],
  },

  context: async () => {
    const { userId, sessionClaims } = await auth();

    const user = sessionClaims?.metadata as {
      accessLevel?: RoleAccessLevel;
      schoolId?: string;
    };

    if (!user) return null;

    return {
      userId,
      schoolId: user.schoolId,
      accessLevel: user.accessLevel,
    };
  },
});

export async function GET(request: Request) {
  return yoga.handleRequest(request, {});
}

export async function POST(request: Request) {
  return yoga.handleRequest(request, {});
}
