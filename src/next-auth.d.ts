import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      role: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    username: string;
    role: string;
  }

  interface Report {
    _id: string;
    title: string;
    location: string;
    description: string;
    date: string;
    riskLevel: number;
    username: string;
    status: string;
  }
}
