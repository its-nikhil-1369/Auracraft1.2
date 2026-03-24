"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

function ResetPasswordForm() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isValidToken, setIsValidToken] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            setError('Invalid or missing reset token.');
            setIsLoading(false);
            return;
        }

        setIsValidToken(true);
        setIsLoading(false);
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Your password has been reset successfully.');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setError(data.error || 'Failed to reset password.');
            }
        } catch (err: any) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    if (!isValidToken) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Invalid Reset Link</h1>
                    <p className="text-gray-500 mb-6">This reset link is invalid or has expired.</p>
                    <Link href="/forgot-password" className="text-blue-500 hover:underline">
                        Request a new reset link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex">
            {/* Left side: Form */}
            <div className="flex-1 flex flex-col justify-center px-8 md:px-24 bg-white dark:bg-[#0a0a0a]">
                <Link href="/login" className="mb-12 flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-red-500 transition-colors">
                    <ArrowLeft size={16} /> Back to Login
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full"
                >
                    <h1 className="text-5xl font-bold tracking-tighter mb-4 uppercase">New Password</h1>
                    <p className="text-gray-500 mb-10">Enter your new password below.</p>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-500 text-xs font-bold uppercase tracking-widest border border-red-100 dark:border-red-900/30">
                                {error}
                            </div>
                        )}
                        
                        {message && (
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-500 text-xs font-bold uppercase tracking-widest border border-green-100 dark:border-green-900/30">
                                {message}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em]">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-zinc-900 border-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em]">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-zinc-900 border-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            disabled={isSubmitting}
                            className="w-full bg-black text-white py-5 font-bold uppercase tracking-widest hover:bg-red-500 transition-all mt-8 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>

                    <div className="mt-10 text-center text-sm text-gray-500 uppercase tracking-widest text-[10px]">
                        Remember your password? <Link href="/login" className="font-bold text-black dark:text-white hover:text-red-500 transition-colors">Back to Sign In</Link>
                    </div>
                </motion.div>
            </div>

            {/* Right side: Image Decor */}
            <div className="hidden lg:block flex-1 relative bg-gray-100">
                <Image
                    src="https://images.unsplash.com/photo-1549037173-e3b717902c57?q=80&w=1200&auto=format&fit=crop"
                    alt="Reset Password Visual"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-20 left-20 right-20 text-white">
                    <h2 className="text-4xl font-bold tracking-tighter uppercase mb-4">Secure Your Account</h2>
                    <p className="max-w-sm opacity-80 leading-relaxed font-medium">Choose a strong password to protect your AURACRAFT account.</p>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
