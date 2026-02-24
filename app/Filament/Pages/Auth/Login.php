<?php

namespace App\Filament\Pages\Auth;

use DanHarrin\LivewireRateLimiting\Exceptions\TooManyRequestsException;
use Filament\Facades\Filament;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Http\Responses\Auth\Contracts\LoginResponse;
use Filament\Pages\Auth\Login as BaseLogin;
use Illuminate\Validation\ValidationException;

class Login extends BaseLogin
{
    public function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('login')
                    ->label('Email Address')
                    ->required()
                    ->email()
                    ->autofocus()
                    ->extraInputAttributes(['tabindex' => 1])
                    ->placeholder('Enter your email address'),
                    
                TextInput::make('password')
                    ->label('Password')
                    ->required()
                    ->password()
                    ->extraInputAttributes(['tabindex' => 2])
                    ->placeholder('Enter your password'),
            ])
            ->statePath('data');
    }

    public function authenticate(): ?LoginResponse
    {
        try {
            $this->rateLimit(5);
        } catch (TooManyRequestsException $exception) {
            throw ValidationException::withMessages([
                'login' => __('filament::login.messages.throttled', [
                    'seconds' => $exception->secondsUntilAvailable,
                    'minutes' => ceil($exception->secondsUntilAvailable / 60),
                ]),
            ]);
        }

        $data = $this->form->getState();

        $login = $data['login'];
        $password = $data['password'];

        // Check if user exists and has admin access (role 1 or 2)
        $user = \App\Models\User::where('email', $login)->first();
        
        if (!$user || !in_array($user->role, [1, 2])) {
            throw ValidationException::withMessages([
                'login' => 'Only Super Admin and Province users can access the admin panel.',
            ]);
        }

        if (!Filament::auth()->attempt([
            'email' => $login,
            'password' => $password,
        ])) {
            throw ValidationException::withMessages([
                'login' => __('filament::login.messages.failed'),
            ]);
        }

        return app(LoginResponse::class);
    }

    protected function getCredentials(): array
    {
        return [
            'email' => $this->data['login'],
            'password' => $this->data['password'],
        ];
    }
}
