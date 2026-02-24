<?php

namespace App\Filament\Pages;

use App\Filament\Widgets\UserOverviewWidget;
use App\Filament\Widgets\UserStatsWidget;
use App\Models\IncidentReport;
use Filament\Pages\Page;

class Dashboard extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-home';
    protected static string $view = 'filament.pages.dashboard';

    // Add this to prevent navigation title duplication
    protected static ?string $navigationLabel = 'Dashboard';
    protected static ?string $title = 'Dashboard';

    public $latestIncidentReports;
    public $totalIncidentReports;
    public $activeIncidentReports;

    public function mount(): void
    {
        $this->latestIncidentReports = IncidentReport::latest()->take(5)->get();
        $this->totalIncidentReports = IncidentReport::count();
        $this->activeIncidentReports = IncidentReport::where('status',1)->count(); // example logic
    }

   protected function getHeaderWidgets(): array
    {
        return [
            UserOverviewWidget::class,
            UserStatsWidget::class,
        ];
    }
}
