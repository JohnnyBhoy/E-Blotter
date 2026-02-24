@extends('filament::auth.base')

@section('content')
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <!-- Background Pattern -->
        <div class="absolute inset-0 bg-black/20">
            <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 40px 40px;"></div>
        </div>

        <div class="relative min-h-screen flex items-center justify-center px-4 py-12">
            <div class="w-full max-w-6xl">
                <div class="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                    <div class="grid md:grid-cols-2">
                        <!-- Left Side - Branding -->
                        <div class="p-8 lg:p-12 bg-gradient-to-br from-blue-900/50 to-slate-900/50 border-r border-white/10">
                            <div class="h-full flex flex-col justify-center">
                                <div class="text-center mb-8">
                                    <div class="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
                                        <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                        </svg>
                                    </div>
                                    <h1 class="text-4xl font-bold text-white mb-3">E-Blotter</h1>
                                    <p class="text-blue-200 text-lg">Admin Panel</p>
                                </div>

                                <div class="space-y-6">
                                    <div class="flex items-start space-x-4">
                                        <div class="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 class="text-white font-semibold mb-1">System Administration</h3>
                                            <p class="text-blue-200 text-sm">Complete control over user management and system settings</p>
                                        </div>
                                    </div>

                                    <div class="flex items-start space-x-4">
                                        <div class="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 class="text-white font-semibold mb-1">User Management</h3>
                                            <p class="text-blue-200 text-sm">Manage provinces, municipalities, stations, and barangays</p>
                                        </div>
                                    </div>

                                    <div class="flex items-start space-x-4">
                                        <div class="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 class="text-white font-semibold mb-1">Analytics Dashboard</h3>
                                            <p class="text-blue-200 text-sm">Real-time statistics and reporting for all user types</p>
                                        </div>
                                    </div>

                                    <!-- Admin Access Information -->
                                    <div class="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <h4 class="text-white font-semibold mb-3 flex items-center">
                                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                            </svg>
                                            Admin Access
                                        </h4>
                                        <div class="space-y-2 text-xs">
                                            <div class="flex items-center text-blue-200">
                                                <svg class="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                                <span>Super Admin - Full system access</span>
                                            </div>
                                            <div class="flex items-center text-blue-200">
                                                <svg class="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                                <span>Province - Provincial oversight</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right Side - Login Form -->
                        <div class="p-8 lg:p-12 bg-white/5 backdrop-blur-sm">
                            <div class="max-w-md mx-auto">
                                <div class="text-center mb-8">
                                    <h2 class="text-3xl font-bold text-white mb-2">Admin Login</h2>
                                    <p class="text-blue-200">Sign in to access the admin panel</p>
                                </div>

                                @if (Filament::auth()->check())
                                    <div class="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm">
                                        <p class="text-green-200 text-sm">
                                            You are already logged in. Redirecting to dashboard...
                                        </p>
                                    </div>
                                    <script>
                                        setTimeout(() => {
                                            window.location.href = '{{ route('filament.admin.pages.dashboard') }}';
                                        }, 2000);
                                    </script>
                                @endif

                                <form wire:submit="authenticate" class="space-y-6">
                                    <!-- Email Field -->
                                    <div>
                                        <label for="data.login" class="block text-sm font-medium text-white mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="data.login"
                                            wire:model="data.login"
                                            required
                                            autofocus
                                            tabindex="1"
                                            placeholder="Enter your email address"
                                            class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all"
                                        />
                                        @error('data.login')
                                            <p class="mt-2 text-sm text-red-300">{{ $message }}</p>
                                        @enderror
                                    </div>

                                    <!-- Password Field -->
                                    <div>
                                        <label for="data.password" class="block text-sm font-medium text-white mb-2">
                                            Password
                                        </label>
                                        <div class="relative">
                                            <input
                                                type="password"
                                                id="data.password"
                                                wire:model="data.password"
                                                required
                                                tabindex="2"
                                                placeholder="Enter your password"
                                                class="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all"
                                            />
                                            <button
                                                type="button"
                                                onclick="togglePassword()"
                                                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white transition-colors"
                                            >
                                                <svg id="passwordToggle" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                </svg>
                                            </button>
                                        </div>
                                        @error('data.password')
                                            <p class="mt-2 text-sm text-red-300">{{ $message }}</p>
                                        @enderror
                                    </div>

                                    <!-- Remember Me -->
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center">
                                            <input
                                                id="remember"
                                                name="remember"
                                                type="checkbox"
                                                wire:model="remember"
                                                class="w-4 h-4 bg-white/10 border-white/20 rounded focus:ring-2 focus:ring-blue-400 focus:ring-offset-0"
                                            />
                                            <label for="remember" class="ml-2 text-sm text-blue-200">
                                                Remember me
                                            </label>
                                        </div>
                                        <a href="#" class="text-sm text-blue-300 hover:text-white transition-colors">
                                            Forgot password?
                                        </a>
                                    </div>

                                    <!-- Submit Button -->
                                    <button
                                        type="submit"
                                        wire:loading.attr="disabled"
                                        wire:target="authenticate"
                                        class="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        <span wire:loading.remove wire:target="authenticate">Sign In</span>
                                        <span wire:loading wire:target="authenticate">
                                            <div class="flex items-center justify-center space-x-2">
                                                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Authenticating...</span>
                                            </div>
                                        </span>
                                    </button>
                                </form>

                                <div class="mt-8 text-center">
                                    <p class="text-blue-200 text-sm">
                                        Need admin access?{' '}
                                        <a href="#" class="text-white font-semibold hover:text-blue-300 transition-colors">
                                            Contact Super Administrator
                                        </a>
                                    </p>
                                </div>

                                <div class="mt-6 pt-6 border-t border-white/10">
                                    <div class="flex items-center justify-center space-x-6 text-xs text-blue-200">
                                        <span>Super Admin</span>
                                        <span>•</span>
                                        <span>Province</span>
                                        <span>•</span>
                                        <span>System Control</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        function togglePassword() {
            const passwordInput = document.getElementById('data.password');
            const toggleIcon = document.getElementById('passwordToggle');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleIcon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                `;
            } else {
                passwordInput.type = 'password';
                toggleIcon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                `;
            }
        }
    </script>
@endsection
