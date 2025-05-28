import { signIn } from "@/app/api/auth/[...nextauth]/route";

const SignIn = () => {
    return (
        <form
            action={async (formData) => {
                "use server"
                await signIn("resend", formData)
            }}
        >
            <input type="text" name="email" placeholder="Email" />
            <button type="submit">Signin with Resend</button>
        </form>
    )
}

export { SignIn };