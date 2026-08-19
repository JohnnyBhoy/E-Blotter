<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getCards(): array
    {
        return [
            Stat::make('Users', \App\Models\User::count())
                ->description('Total registered users')
                ->chart([5, 10, 20, 15])
                ->color('success'),

            Stat::make('Revenue', '$20,000')
                ->description('This month')
                ->color('primary'),
        ];
    }
}
