/*
zod is a typescript schema declaration and validation library.It is used to define the shape of the data objects
we use zod for the client side verification of the data..
in backend it is done by mongodb but just for safety we put a check in the client side only using zod

*/
import { boolean, z } from "zod"

export const acceptingMessageSchema = z.object({
    acceptMessage: z.boolean()
})


