export interface User {
    id: number;
    username: string;
    email: string;
    role: "Admin" | "SimpleUser";
    banned?: boolean;
    createdAt?: string;
    updatedAt?: string;
  }
  