<?php

namespace App\Filament\Resources;

use App\Filament\Resources\IncidentReportResource\Pages;
use App\Filament\Resources\IncidentReportResource\RelationManagers;
use App\Models\IncidentReport;
use Filament\Forms;
use Filament\Forms\Components\Component;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\ViewField;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\TextColumn\TextColumnSize;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class IncidentReportResource extends Resource
{
    protected static ?string $model = IncidentReport::class;

    protected static ?string $navigationIcon = 'heroicon-o-cursor-arrow-ripple';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                ViewField::make('coordinates')
                    ->label('Location on Map')
                    ->view('forms.components.leaflet-map')
                    ->columnSpanFull(),

                //FileUpload::make('file')
                //    ->label('Upload File')
                //    ->directory('incident_reports')
                //    ->preserveFilenames()
                //    ->imagePreviewHeight('100')
                //    ->downloadable()
                //    ->openable()
                //    ->columnSpan('full'),

                TextInput::make('location')
                    ->required()
                    ->maxLength(255),

                Select::make('incidentTypes')
                    ->label('Incident Type')
                    ->options([
                        1 => 'CRIME',
                        2 => 'FIRE',
                        3 => 'MEDICAL',
                        4 => 'DISASTER',
                    ])
                    ->required()
                    ->native(false)
                    ->searchable()
                    ->preload()
                    ->default(1),

                Select::make('status')
                    ->label('Status of the Report')
                    ->options([
                        1 => 'In Progress',
                        2 => 'Help on the way',
                        3 => 'Arrive at Incident are',
                        4 => 'Completed',
                    ])
                    ->required()
                    ->native(false)
                    ->searchable()
                    ->preload()
                    ->default(1),

                TextInput::make('coordinates')
                    ->required()
                    ->maxLength(255),

                ViewField::make('file')
                    ->label('Uploaded Image')
                    ->view('forms.components.image-preview')
                    ->maxWidth(250)
                    ->visible(fn($livewire) => filled($livewire->record?->file)),

                Textarea::make('description')
                    ->label('Description')
                    ->rows(5)
                    ->maxLength(1000),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')->sortable(),

                TextColumn::make('location')
                    ->limit(25)
                    ->sortable()
                    ->searchable(),

                TextColumn::make('incidentTypes')
                    ->label('Incident Type')
                    ->formatStateUsing(fn($state) => match ((int) $state) {
                        1 => 'CRIME',
                        2 => 'FIRE',
                        3 => 'MEDICAL',
                        4 => 'DISASTER',
                        default => 'Unknown',
                    })
                    ->sortable(),

                BadgeColumn::make('status')
                    ->formatStateUsing(fn($state) => match ((int) $state) {
                        1 => 'In Progress',
                        2 => 'On the way',
                        3 => 'Arrive at area',
                        4 => 'Completed',
                        default => 'In Progress',
                    })
                    ->colors([
                        'warning' => 'pending',
                        'info' => 'reviewed',
                        'success' => 'resolved',
                    ])
                    ->sortable(),

                TextColumn::make('created_at')
                    ->label('Reported At')
                    ->dateTime('M d, Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListIncidentReports::route('/'),
            'create' => Pages\CreateIncidentReport::route('/create'),
            'edit' => Pages\EditIncidentReport::route('/{record}/edit'),
        ];
    }
}
