import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextResponse } from "next/server";

// تعريف نوع بيانات المستخدم بناءً على البيانات الفعلية
export interface UserInfo {
    id: string;
    username: string;
    phone_number: string;
    is_superuser: boolean;
    is_staff: boolean;
}

// تعريف نوع المستخدم المخصص بناءً على الاستجابة الفعلية
export interface CustomUser {
    refresh: string;
    access: string;
    user: UserInfo;
}

// Extend the default NextAuth types
declare module "next-auth" {
    interface Session {
        user: CustomUser;
        access_token: string;
        refresh_token: string;
    }
    interface JWT {
        user: CustomUser;
        access_token: string;
        refresh_token: string;
    }
    interface User extends CustomUser {}
}

const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 24 hours
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {},
            async authorize(credentials: any, req): Promise<NextAuthUser | null> {
                try {
                    const { data } = credentials;
                    const userData: CustomUser = JSON.parse(data);
                    
                    if (!userData || !userData.user) {
                        throw new Error("Invalid user data");
                    }
                    
                    // إرجاع البيانات بالتنسيق المطلوب لـ NextAuth
                    return {
                        id: userData.user.id,
                        name: userData.user.username,
                        phone_number: userData.user.phone_number,
                        refresh: userData.refresh,
                        access: userData.access,
                        user: userData.user
                    } as NextAuthUser;
                    
                } catch (err) {
                    console.error("Authorization error:", err);
                    throw new Error("signIn Failed");
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const customUser = user as CustomUser;
                token.user = customUser;
                token.access_token = customUser.access;
                token.refresh_token = customUser.refresh;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token.user as CustomUser;
            session.access_token = token.access_token as string;
            session.refresh_token = token.refresh_token as string;
            return session;
        },
    },
    pages: {
        signIn: "/dashboard/auth/login",
    },
    debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST, authOptions };

// مثال على كيفية استخدام البيانات في مكونات أخرى
export const getUserFromSession = (session: any) => {
    return {
        id: session?.user?.user?.id,
        username: session?.user?.user?.username,
        phone_number: session?.user?.user?.phone_number,
        is_superuser: session?.user?.user?.is_superuser,
        is_staff: session?.user?.user?.is_staff,
        access_token: session?.access_token,
        refresh_token: session?.refresh_token
    };
};