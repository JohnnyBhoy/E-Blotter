<?php

namespace App\Filament\Widgets;

use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class UserOverviewWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        return [
            Stat::make('Super Admins', User::where('role', 1)->count())
                ->description('Total system administrators')
                ->descriptionIcon('heroicon-m-shield-check')
                ->color('danger')
                ->chart([7, 2, 10, 3, 15, 4, 17]),

            Stat::make('Provinces', User::where('role', 2)->count())
                ->description('Total province officers')
                ->descriptionIcon('heroicon-m-globe-americas')
                ->color('info')
                ->chart([7, 2, 10, 3, 15, 4, 17]),

            Stat::make('Municipalities', User::where('role', 3)->count())
                ->description('Total municipality officers')
                ->descriptionIcon('heroicon-m-building-office')
                ->color('warning')
                ->chart([7, 2, 10, 3, 15, 4, 17]),

            Stat::make('Stations', User::where('role', 4)->count())
                ->description('Total PNP stations')
                ->descriptionIcon('heroicon-m-shield-check')
                ->color('success')
                ->chart([7, 2, 10, 3, 15, 4, 17]),

            Stat::make('Barangays', User::where('role', 5)->count())
                ->description('Total barangay captains')
                ->descriptionIcon('heroicon-m-building-office-2')
                ->color('primary')
                ->chart([7, 2, 10, 3, 15, 4, 17]),
        ];
    }
}
