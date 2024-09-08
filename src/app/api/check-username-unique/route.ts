import dbConnect from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod"
import UserModel from "@/models/User";
import { usernameValidation } from "@/schemas/signUpSchema"
import { NextRequest } from "next/server";

/*In order to use Zod schemas, first define a schema in a separate file, typically in a schema folder. Once the schema is defined, you can use the `safeParse` method to validate and parse data against the schema.*/

const usernameQuerySchema = z.object({
    username: usernameValidation
})


export async function GET(request: Request) {
    await dbConnect();
    if (request.method !== 'GET') {
        return Response.json({ success: false, message: "We are handling only get request here" }, { status: 405 })
    }

    try {
        /* the below line is to extract the query from the url*/
        const { searchParams } = new URL(request.url)
        const queryParams = {
            username: searchParams.get('username')
        }
        //validate the username with zod
        const result = usernameQuerySchema.safeParse(queryParams)
        console.log("The result from the unique username is : ", result)

        if (!result.success) {
            const usernameErrors = result.error.format().
                username?._errors || []
            return Response.json({ success: false, message: "Invalid username", errors: usernameErrors }, { status: 400 })
        }

        const { username } = result.data

        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true
        });

        if (existingVerifiedUser) {
            return Response.json({ success: false, message: "Username already exists" }, { status: 400 })
        }
        return Response.json({ success: true, message: "Username is unique" }, { status: 400 })
    } catch (error) {
        console.error("Error while checking for unique username", error);
        return Response.json({ success: false, message: "Error checking username" }, { status: 500 })
    }
}