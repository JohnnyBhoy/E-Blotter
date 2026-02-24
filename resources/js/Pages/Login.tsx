import { useForm } from '@inertiajs/react';
import React, { FormEvent, useEffect, useState } from 'react';
import { Eye, EyeOff, Shield, Users, FileText, AlertTriangle } from 'lucide-react';

const Login = () => {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-black/20">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/svg%3E\')] opacity-20"></div>
            </div>

            <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-6xl">
                    <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                        <div className="grid md:grid-cols-2">
                            {/* Left Side - Branding */}
                            <div className="p-8 lg:p-12 bg-gradient-to-br from-blue-900/50 to-slate-900/50 border-r border-white/10">
                                <div className="h-full flex flex-col justify-center">
                                    <div className="text-center mb-8">
                                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
                                            <Shield className="w-10 h-10 text-white" />
                                        </div>
                                        <h1 className="text-4xl font-bold text-white mb-3">E-Blotter</h1>
                                        <p className="text-blue-200 text-lg">Barangay Realtime Blotter System</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                                <FileText className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold mb-1">Digital Record Management</h3>
                                                <p className="text-blue-200 text-sm">Streamlined blotter recording and retrieval system</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                                <Users className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold mb-1">Multi-Agency Integration</h3>
                                                <p className="text-blue-200 text-sm">Connect PNP, BFP, PCG, and Barangays</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                                <AlertTriangle className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold mb-1">Real-time Response</h3>
                                                <p className="text-blue-200 text-sm">Quick intervention and preventive measures</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Login Form */}
                            <div className="p-8 lg:p-12 bg-white/5 backdrop-blur-sm">
                                <div className="max-w-md mx-auto">
                                    <div className="text-center mb-8">
                                        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                                        <p className="text-blue-200">Sign in to access your dashboard</p>
                                    </div>

                                    {errors.email && (
                                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur-sm">
                                            <p className="text-red-200 text-sm">
                                                Incorrect email or password. Please try again.
                                            </p>
                                        </div>
                                    )}

                                    <form onSubmit={submit} className="space-y-6">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
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
                                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
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
                                                    className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white transition-colors"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="w-5 h-5" />
                                                    ) : (
                                                        <Eye className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <input
                                                    id="remember"
                                                    name="remember"
                                                    type="checkbox"
                                                    checked={data?.remember}
                                                    onChange={(e) => setData('remember', e.target.checked)}
                                                    className="w-4 h-4 bg-white/10 border-white/20 rounded focus:ring-2 focus:ring-blue-400 focus:ring-offset-0"
                                                />
                                                <label htmlFor="remember" className="ml-2 text-sm text-blue-200">
                                                    Remember me
                                                </label>
                                            </div>
                                            <a href="#" className="text-sm text-blue-300 hover:text-white transition-colors">
                                                Forgot password?
                                            </a>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                        >
                                            {processing ? (
                                                <div className="flex items-center justify-center space-x-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Signing in...</span>
                                                </div>
                                            ) : (
                                                'Sign In'
                                            )}
                                        </button>
                                    </form>

                                    <div className="mt-8 text-center">
                                        <p className="text-blue-200 text-sm">
                                            Don't have an account?{' '}
                                            <a href="#" className="text-white font-semibold hover:text-blue-300 transition-colors">
                                                Contact your administrator
                                            </a>
                                        </p>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-white/10">
                                        <div className="flex items-center justify-center space-x-6 text-xs text-blue-200">
                                            <span>Admin Access</span>
                                            <span>•</span>
                                            <span>Barangay Portal</span>
                                            <span>•</span>
                                            <span>PNP Dashboard</span>
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
};

export default Login;
