"use client"
import React, { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/apiResponse"
import { Form } from "@/components/ui/form"





/*
In this scenario, we need to ensure that the username is unique. 
To check if the username is unique, we could send a request to the backend as the user types each letter. 
However, sending many requests for each keystroke is inefficient and can degrade performance. 
A better approach is to use a custom React hook with debouncing, which delays the backend request until the user has stopped typing for a short period.
*/



function Page() {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [checkingUsername, setCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { toast } = useToast()
    const debouncedUsername = useDebounceValue(username, 300)
    const router = useRouter();


    /*
        Zod Implementation:
        The useForm hook supports schema-based validation through built-in resolvers.
        We can use Zod (or other validation libraries) to define a validation schema and integrate it with useForm
        by using the zodResolver to validate the form inputs.
    */
    // the below line type declaration is completely optional
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        }
    });
    useEffect(() => {
        const checkUsernameUniqueness = async () => {
            if (debouncedUsername) {
                setCheckingUsername(true);
                setUsernameMessage('');
                try {
                    const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)
                    setUsernameMessage(response.data.message)
                } catch (error) {
                    const axiosErr = error as AxiosError<ApiResponse>
                    setUsernameMessage(
                        axiosErr.response?.data.message ?? "Error while checking username"
                    )
                } finally {
                    setCheckingUsername(false)
                }
            }
        }
        checkUsernameUniqueness()
    }, [debouncedUsername])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>("/api/sign-up",
                data
            )
            toast({
                title: "Sign up successful",
                description: response.data.message,
            })
            router.replace(`verify/${username}`)
            setIsSubmitting(false);
        } catch (error) {
            console.error("Error in sign up user");
            const axiosErr = error as AxiosError<ApiResponse>
            let errorMessage = axiosErr.response?.data.message
            toast({
                title: "Error in sign up",
                description: errorMessage ?? "Error while signing up",
                variant: "destructive"
            })

        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join True Feedback
                    </h1>
                    <p className="mb-4">Sign up to start your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <Input
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setUsername(e.target.value);
                                        }}
                                    />
                                    {isCheckingUsername && <Loader2 className="animate-spin" />}
                                    {!isCheckingUsername && usernameMessage && (
                                        <p
                                            className={`text-sm ${usernameMessage === 'Username is unique'
                                                    ? 'text-green-500'
                                                    : 'text-red-500'
                                                }`}
                                        >
                                            {usernameMessage}
                                        </p>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <Input {...field} name="email" />
                                    <p className='text-muted text-gray-400 text-sm'>We will send you a verification code</p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <Input type="password" {...field} name="password" />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className='w-full' disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Already a member?{' '}
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Page
