import { useForm } from '@inertiajs/react';
import React, { FormEvent, useEffect, useState } from 'react';
import { Eye, EyeOff, Shield, Users, FileText, AlertTriangle, Building2, UserCheck } from 'lucide-react';
import { PageProps } from "./types";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{
    laravelVersion: string;
    phpVersion: string;
    auth?: {
        user?: User;
    };
}>) {
    useEffect(() => {
        if (auth?.user && auth.user.role) {
            const userRole = auth.user.role;
            switch (userRole) {
                case 1: case '1': case 'superadmin': case 'Super Admin':
                    window.location.href = '/admin-dashboard'; break;
                case 2: case '2': case 'province': case 'Province':
                    window.location.href = '/province-dashboard'; break;
                case 3: case '3': case 'municipality': case 'Municipality':
                    window.location.href = '/municipal-dashboard'; break;
                case 4: case '4': case 'station': case 'Station':
                    window.location.href = '/station/dashboard'; break;
                case 5: case '5': case 'barangay': case 'Barangay':
                    window.location.href = '/barangay/dashboard'; break;
                default:
                    window.location.href = '/';
            }
        }
    }, [auth]);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);

    useEffect(() => {
        return () => { reset('password'); };
    }, []);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen bg-[#1a1a1a]">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                    }}
                />
                {/* Soft accent glow */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d4622a]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#d4622a]/5 rounded-full blur-3xl" />
            </div>

            <div className="relative min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
                <div className="w-full max-w-6xl">
                    <div className="bg-[#262626] rounded-2xl shadow-2xl overflow-hidden border border-[#3a3a3a]">
                        <div className="grid md:grid-cols-1 lg:grid-cols-2">

                            {/* ── Right: Login Form (first on mobile) ── */}
                            <div className="order-1 lg:order-2 p-6 sm:p-8 lg:p-12 bg-[#262626]">
                                <div className="max-w-md mx-auto">
                                    <div className="text-center mb-6 sm:mb-8">
                                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Welcome Back</h2>
                                        <p className="text-[#9b9b9b] text-sm sm:text-base">Sign in to access your dashboard</p>
                                    </div>

                                    {errors.email && (
                                        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                                            <p className="text-red-300 text-xs sm:text-sm">
                                                Incorrect email or password. Please try again.
                                            </p>
                                        </div>
                                    )}

                                    <form onSubmit={submit} className="space-y-5">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-[#ececec] mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={data?.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                                autoComplete="email"
                                                placeholder="Enter your email address"
                                                className="w-full px-4 py-3 bg-[#2d2d2d] border border-[#3a3a3a] rounded-lg text-[#ececec] placeholder-[#9b9b9b] focus:outline-none focus:ring-1 focus:ring-[#d4622a]/50 focus:border-[#d4622a]/50 transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="password" className="block text-sm font-medium text-[#ececec] mb-2">
                                                Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="password"
                                                    name="password"
                                                    type={showPassword ? "text" : "password"}
                                                    value={data?.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    required
                                                    autoComplete="current-password"
                                                    placeholder="Enter your password"
                                                    className="w-full px-4 py-3 pr-12 bg-[#2d2d2d] border border-[#3a3a3a] rounded-lg text-[#ececec] placeholder-[#9b9b9b] focus:outline-none focus:ring-1 focus:ring-[#d4622a]/50 focus:border-[#d4622a]/50 transition-all"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9b9b9b] hover:text-[#ececec] transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                                            <div className="flex items-center">
                                                <input
                                                    id="remember"
                                                    name="remember"
                                                    type="checkbox"
                                                    checked={data?.remember}
                                                    onChange={(e) => setData('remember', e.target.checked)}
                                                    className="w-4 h-4 bg-[#2d2d2d] border-[#3a3a3a] rounded focus:ring-1 focus:ring-[#d4622a] focus:ring-offset-0 accent-[#d4622a]"
                                                />
                                                <label htmlFor="remember" className="ml-2 text-sm text-[#9b9b9b]">
                                                    Remember me
                                                </label>
                                            </div>
                                            <a href="#" className="text-sm text-[#d4622a] hover:text-[#e8743a] transition-colors">
                                                Forgot password?
                                            </a>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full py-3 px-4 bg-[#d4622a] hover:bg-[#e8743a] text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? (
                                                <div className="flex items-center justify-center space-x-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    <span>Signing in...</span>
                                                </div>
                                            ) : 'Sign In'}
                                        </button>
                                    </form>

                                    <div className="mt-6 sm:mt-8 text-center">
                                        <p className="text-[#9b9b9b] text-xs sm:text-sm">
                                            Don't have an account?{' '}
                                            <a href="#" className="text-[#ececec] font-semibold hover:text-[#d4622a] transition-colors">
                                                Contact your administrator
                                            </a>
                                        </p>
                                    </div>

                                    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-[#3a3a3a]">
                                        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-[#9b9b9b]">
                                            <span>Super Admin</span>
                                            <span className="hidden sm:inline opacity-40">•</span>
                                            <span>Province</span>
                                            <span className="hidden sm:inline opacity-40">•</span>
                                            <span>Municipality</span>
                                            <span className="hidden sm:inline opacity-40">•</span>
                                            <span>Station</span>
                                            <span className="hidden sm:inline opacity-40">•</span>
                                            <span>Barangay</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Left: Branding (second on mobile) ── */}
                            <div className="order-2 lg:order-1 p-6 sm:p-8 lg:p-12 bg-[#1f1f1f] border-t lg:border-t-0 lg:border-r border-[#3a3a3a]">
                                <div className="h-full flex flex-col justify-center">
                                    <div className="text-center mb-6 sm:mb-8">
                                        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-[#d4622a]/20 rounded-full mb-4 sm:mb-6">
                                            <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-[#d4622a]" />
                                        </div>
                                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-3">E-Blotter</h1>
                                        <p className="text-[#9b9b9b] text-base sm:text-lg">Barangay Realtime Blotter System</p>
                                    </div>

                                    <div className="space-y-4 sm:space-y-6">
                                        <div className="flex items-start space-x-3 sm:space-x-4">
                                            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-[#d4622a]/20 rounded-lg flex items-center justify-center">
                                                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4622a]" />
                                            </div>
                                            <div>
                                                <h3 className="text-[#ececec] font-semibold mb-1 text-sm sm:text-base">Digital Record Management</h3>
                                                <p className="text-[#9b9b9b] text-xs sm:text-sm">Streamlined blotter recording and retrieval system</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3 sm:space-x-4">
                                            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-[#d4622a]/20 rounded-lg flex items-center justify-center">
                                                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4622a]" />
                                            </div>
                                            <div>
                                                <h3 className="text-[#ececec] font-semibold mb-1 text-sm sm:text-base">Multi-Agency Integration</h3>
                                                <p className="text-[#9b9b9b] text-xs sm:text-sm">Connect PNP, BFP, PCG, and Barangays</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3 sm:space-x-4">
                                            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-[#d4622a]/20 rounded-lg flex items-center justify-center">
                                                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4622a]" />
                                            </div>
                                            <div>
                                                <h3 className="text-[#ececec] font-semibold mb-1 text-sm sm:text-base">Real-time Response</h3>
                                                <p className="text-[#9b9b9b] text-xs sm:text-sm">Quick intervention and preventive measures</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Role-based access card */}
                                    <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-[#262626] rounded-xl border border-[#3a3a3a]">
                                        <h4 className="text-[#ececec] font-semibold mb-2 sm:mb-3 flex items-center text-sm">
                                            <UserCheck className="w-3.5 h-3.5 mr-2 text-[#d4622a]" />
                                            Role-Based Access
                                        </h4>
                                        <div className="space-y-1.5 text-xs">
                                            {[
                                                "Super Admin — Full system access",
                                                "Province — Provincial oversight",
                                                "Municipality — Municipal management",
                                                "Station — PNP Station dashboard",
                                                "Barangay — Local blotter management",
                                            ].map((role) => (
                                                <div key={role} className="flex items-center text-[#9b9b9b]">
                                                    <Building2 className="w-3 h-3 mr-2 text-[#d4622a]/60 flex-shrink-0" />
                                                    <span>{role}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
