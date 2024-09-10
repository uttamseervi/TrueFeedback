'use client'
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import * as z from "zod"
import { verifySchema } from '@/schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/apiResponse';
import { Form, FormField,FormItem,FormLabel, FormMessage, } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
function VerifyAccount() {

    const router = useRouter();
    const params = useParams<{ username: string }>();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {

        },
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code,
            })
            console.log(response)
            toast({
                title: "Success",
                description: response.data.message
            })
            router.replace("sign-in")
        } catch (error) {
            let axiosErr = error as AxiosError<ApiResponse>
            let errorMessage = axiosErr.response?.data.message
            toast({
                title: "Error while verifying the code",
                description: errorMessage,
                variant: "destructive"
            })
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4">Enter the verification code sent to your email</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <Input {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Verify</Button>
                    </form>
                </Form>
            </div>
        </div >
    )
}

export default VerifyAccount
