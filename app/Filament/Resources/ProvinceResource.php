<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProvinceResource\Pages;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ProvinceResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-globe-americas';

    protected static ?string $navigationLabel = 'Province';

    protected static ?string $modelLabel = 'Province';

    protected static ?string $pluralModelLabel = 'Provinces';

    protected static ?string $navigationGroup = 'User Management';

    protected static ?int $navigationSort = 5;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255)
                    ->label('Province Name'),

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
                    ->default(2)
                    ->disabled()
                    ->options([
                        2 => 'Province',
                    ]),

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
                        Forms\Components\Placeholder::make('municipalities_count')
                            ->label('Municipalities')
                            ->content(fn ($record) => $record ? $record->municipalities()->count() : '0'),

                        Forms\Components\Placeholder::make('stations_count')
                            ->label('PNP Stations')
                            ->content(fn ($record) => $record ? $record->provinceStations()->count() : '0'),

                        Forms\Components\Placeholder::make('barangays_count')
                            ->label('Barangays')
                            ->content(fn ($record) => $record ? $record->provinceBarangays()->count() : '0'),

                        Forms\Components\Placeholder::make('total_users_count')
                            ->label('Total Users Under Province')
                            ->content(fn ($record) => $record ? $record->provinceUsers()->count() : '0'),
                    ])
                    ->collapsible(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn (Builder $query) => $query->where('role', 2))
            ->columns([
                TextColumn::make('name')->searchable()->label('Province Name'),
                TextColumn::make('email')->searchable()->label('Email'),
                TextColumn::make('role')
                    ->label('Role')
                    ->formatStateUsing(fn ($state) => 'Province')
                    ->badge()
                    ->color('info'),
                
                // Hierarchy Columns
                TextColumn::make('municipalities_count')
                    ->label('Municipalities')
                    ->getStateUsing(fn ($record) => $record->municipalities()->count())
                    ->sortable()
                    ->alignCenter(),

                TextColumn::make('stations_count')
                    ->label('PNP Stations')
                    ->getStateUsing(fn ($record) => $record->provinceStations()->count())
                    ->sortable()
                    ->alignCenter(),

                TextColumn::make('barangays_count')
                    ->label('Barangays')
                    ->getStateUsing(fn ($record) => $record->provinceBarangays()->count())
                    ->sortable()
                    ->alignCenter(),

                TextColumn::make('total_users_count')
                    ->label('Total Users')
                    ->getStateUsing(fn ($record) => $record->provinceUsers()->count())
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
            'index' => Pages\ListProvinces::route('/'),
            'create' => Pages\CreateProvince::route('/create'),
            'edit' => Pages\EditProvince::route('/{record}/edit'),
        ];
    }

    public static function canAccessPanel(\Filament\Panel $panel): bool
    {
        return auth()->user()?->role === 1; // Super Admin only
    }
}
