// import { FetchArgs, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { getSession, signOut } from 'next-auth/react';
// import Router from 'next/router';

// export const BASE_URL = process.env.NEXT_PUBLIC_BASIC_URL;

// const baseQuery = fetchBaseQuery({
//     baseUrl: BASE_URL,
//     credentials: 'include',

//     prepareHeaders: async (headers: Headers) => {
//         const session = await getSession();
//         const token = session?.user?.access|| "";
//         if (token) {
//             headers.set('Authorization', `Bearer ${token}`);
//         }
//         return headers;
//     },
// });

// const baseQueryWithReauth = async (args: string | FetchArgs, api: any, extraOptions: any) => {
//     const result = await baseQuery(args, api, extraOptions);

//     // تحقق من وجود خطأ بالمصادقة
//     if (
//  result.error &&
//   (result.error.status === 401 ||
//   ((result.error.data as { message?: string })?.message === 'unauthenticated'))    
//     ) {
//         // مسح السشن والكوكيز
//         await signOut({ redirect: false });

//         // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول
//         Router.replace('/dashboard/auth/login');  // عدل حسب مسار صفحة تسجيل الدخول عندك
//     }

//     return result;
// };

// export const api = createApi({
//     reducerPath: 'api',
//     baseQuery: baseQueryWithReauth,
//     tagTypes: [
//         "login",
//         "logout",
//         "Countries",
//         "Universities",
//         "NewsTypes",
//         "News",
//         "NewsImages",
//         "ApplicationForms",
//         "ApplicationStats",
//         "ApplicationImages",
//         "FormKinds",
//         "Users",
//         "Forms",
//     ],
//     endpoints: (build) => ({}),
// });


import { FetchArgs, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession, signOut } from 'next-auth/react';
import Router from 'next/router';

export const BASE_URL = process.env.NEXT_PUBLIC_BASIC_URL;

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',

    prepareHeaders: async (headers: Headers) => {
        const session = await getSession();
        const token = session?.user?.access || "";
        
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        
        // ⚠️ المهم جداً: احذف Content-Type لأن FormData يضبطه تلقائياً
        // هذا يسمح للمتصفح بإضافة boundary الصحيح
        headers.delete('Content-Type');
        
        return headers;
    },
});

const baseQueryWithReauth = async (args: string | FetchArgs, api: any, extraOptions: any) => {
    const result = await baseQuery(args, api, extraOptions);

    // تحقق من وجود خطأ بالمصادقة
    if (
        result.error &&
        (result.error.status === 401 ||
        ((result.error.data as { message?: string })?.message === 'unauthenticated'))    
    ) {
        // مسح السشن والكوكيز
        await signOut({ redirect: false });

        // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول
        Router.replace('/dashboard/auth/login');
    }

    return result;
};

export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        "login",
        "logout",
        "Countries",
        "Universities",
        "NewsTypes",
        "News",
        "NewsImages",
        "ApplicationForms",
        "ApplicationStats",
        "ApplicationImages",
        "FormKinds",
        "Users",
        "Forms",
    ],
    endpoints: (build) => ({}),
});