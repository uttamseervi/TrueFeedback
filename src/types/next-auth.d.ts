import { DefaultSession } from "next-auth";
import "next-auth/next";

/*
This comment refers to the NextAuth user object, specifically inside the callback functions for token and session. By default, the user object in NextAuth only includes basic fields like email or id. 
If we want to extend the user object with additional fields (such as isVerified, username, etc.), we need to modify the types used in the NextAuth package.
The code below demonstrates how to extend the default User interface to include custom fields by declaring a module augmentation.
This change reflects in the file: auth/[...nextJS]/options.
*/
/*
for the session interface 
The above line merges the custom fields (_id, isVerified, isAcceptingMessages, username) with the default fields from the DefaultSession['user'] interface. 
This ensures that the default user fields provided by NextAuth are preserved while adding new custom fields.
The default user in the session object will still include required fields (like name, email, etc.) from the DefaultSession['user'] type.
*/

declare module 'next-auth' {
    interface User {
        _id?: string,
        email?: string,
        isVerified?: boolean,
        isAcceptingMessages?: boolean,
        username?: string,

    }
    interface Session {
        user: {
            _id?: string,
            email?: string,
            isVerified?: boolean,
            isAcceptingMessages?: boolean,
            username?: string,
        } & DefaultSession['user']

    }
}

// one more way to do we can directly target the thing we want to modify
declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string,
        email?: string,
        isVerified?: boolean,
        isAcceptingMessages?: boolean,
        username?: string,
    }
}
