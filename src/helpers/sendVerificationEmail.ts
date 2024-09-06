import { resend } from '@/lib/resend'
import VerificationEmail from '../../emails/verificationEmail'
import { ApiResponse } from '@/types/apiResponse'


export async function sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse> {
    try {
        const recipientEmail = process.env.NODE_ENV === 'production' ? email : 'seerviu690@gmail.com';

        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: recipientEmail,
            subject: 'True feedback verification  code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        console.log("The response from the resend email is ", data);
        if (error) console.log("the error from the resend email is", error);
        return { success: true, message: "Verification email sent successfully" }
    } catch (emailError) {
        console.log("Error sending verification email", emailError)
        return { success: false, message: "Failed to send verification email" }
    }
}

