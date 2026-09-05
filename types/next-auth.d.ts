import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "CLIENT" | "ADMIN" | "DEVELOPER";
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    role: "CLIENT" | "ADMIN" | "DEVELOPER";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "CLIENT" | "ADMIN" | "DEVELOPER";
  }
}