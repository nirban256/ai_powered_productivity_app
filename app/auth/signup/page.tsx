'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SignUpPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true);

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })

            if (res.status === 201) {
                setSuccess('Account created! Redirecting...')
                setTimeout(() => router.push('/auth/signin'), 1500)
            }
            else if (res.status === 409) {
                setError('Account already exists! Redirecting...')
                setTimeout(() => router.push('/auth/signin'), 1500)
            }
            else {
                const msg = await res.text()
                setError(msg)
            }
        } catch (error) {
            console.error("Error signing up ", error);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md bg-white shadow-md rounded-xl p-6 space-y-4"
                >
                    <h2 className="text-2xl font-semibold text-center">Create an account</h2>

                    {error && <p className="text-red-500 text-sm text-center">Error signing up</p>}
                    {success && <p className="text-green-500 text-sm text-center">{success}</p>}

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />

                    <Button
                        type="submit"
                        aria-busy={loading}
                        aria-disabled={loading}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                        variant={'secondary'}
                    >
                        {
                            loading ? (
                                <div className='flex items-center justify-center gap-2'>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Signing up...
                                </div>
                            ) : (
                                "Sign Up"
                            )
                        }
                    </Button>
                </form>
                <p className="text-sm text-center mt-2">
                    Already have an account?{' '}
                    <Link href="/auth/signin" className="text-blue-600 underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}
