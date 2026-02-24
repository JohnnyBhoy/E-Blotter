<?php

namespace App\Filament\Resources;

use App\Filament\Resources\StationResource\Pages;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class StationResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-shield-check';

    protected static ?string $navigationLabel = 'Station';

    protected static ?string $modelLabel = 'Station';

    protected static ?string $pluralModelLabel = 'Stations';

    protected static ?string $navigationGroup = 'User Management';

    protected static ?int $navigationSort = 4;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255)
                    ->label('Station Name'),

                Forms\Components\TextInput::make('email')
                    ->email()
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->label('Email Address'),

                Forms\Components\TextInput::make('password')
                    ->password()
                    ->required(fn(string $context) => $context === 'create')
                    ->dehydrated(fn($state) => filled($state))
                    ->dehydrateStateUsing(fn($state) => bcrypt($state)),

                Forms\Components\Select::make('role')
                    ->label('Role')
                    ->default(4)
                    ->disabled()
                    ->options([
                        4 => 'Station',
                    ]),

                // Parent Selection
                Forms\Components\Select::make('province_id')
                    ->label('Province')
                    ->relationship('province', 'name')
                    ->searchable()
                    ->preload()
                    ->required()
                    ->hint('Select the province this station belongs to'),

                Forms\Components\TextInput::make('lat')
                    ->numeric()
                    ->label('Latitude')
                    ->step(0.000001),

                Forms\Components\TextInput::make('lang')
                    ->numeric()
                    ->label('Longitude')
                    ->step(0.000001),

                // Hierarchy Information (Read-only)
                Forms\Components\Section::make('Hierarchy Information')
                    ->schema([
                        Forms\Components\Placeholder::make('barangays_count')
                            ->label('Barangays Under Station')
                            ->content(fn ($record) => $record ? $record->stationBarangays()->count() : '0'),

                        Forms\Components\Placeholder::make('total_users_count')
                            ->label('Total Users Under Station')
                            ->content(fn ($record) => $record ? $record->stationUsers()->count() : '0'),
                    ])
                    ->collapsible(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn (Builder $query) => $query->where('role', 4))
            ->columns([
                TextColumn::make('name')->searchable()->label('Station Name'),
                TextColumn::make('email')->searchable()->label('Email'),
                TextColumn::make('province.name')
                    ->label('Province')
                    ->sortable()
                    ->badge()
                    ->color('info'),
                TextColumn::make('role')
                    ->label('Role')
                    ->formatStateUsing(fn ($state) => 'Station')
                    ->badge()
                    ->color('danger'),
                
                // Hierarchy Columns
                TextColumn::make('barangays_count')
                    ->label('Barangays')
                    ->getStateUsing(fn ($record) => $record->stationBarangays()->count())
                    ->sortable()
                    ->alignCenter(),

                TextColumn::make('total_users_count')
                    ->label('Total Users')
                    ->getStateUsing(fn ($record) => $record->stationUsers()->count())
                    ->sortable()
                    ->alignCenter()
                    ->weight('bold'),

                TextColumn::make('created_at')->dateTime()->label('Created')->sortable(),
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
            'index' => Pages\ListStations::route('/'),
            'create' => Pages\CreateStation::route('/create'),
            'edit' => Pages\EditStation::route('/{record}/edit'),
        ];
    }

    public static function canAccessPanel(\Filament\Panel $panel): bool
    {
        return auth()->user()?->role === 1; // Super Admin only
    }
}
