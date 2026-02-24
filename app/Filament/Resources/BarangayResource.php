<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BarangayResource\Pages;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class BarangayResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-building-office-2';

    protected static ?string $navigationLabel = 'Barangay';

    protected static ?string $modelLabel = 'Barangay';

    protected static ?string $pluralModelLabel = 'Barangays';

    protected static ?string $navigationGroup = 'User Management';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255)
                    ->label('Barangay Name'),

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
                    ->default(5)
                    ->disabled()
                    ->options([
                        5 => 'Barangay',
                    ]),

                // Parent Selection
                Forms\Components\Grid::make(2)
                    ->schema([
                        Forms\Components\Select::make('province_id')
                            ->label('Province')
                            ->relationship('province', 'name')
                            ->searchable()
                            ->preload()
                            ->required()
                            ->hint('Select the province this barangay belongs to'),

                        Forms\Components\Select::make('municipality_id')
                            ->label('Municipality')
                            ->relationship('municipality', 'name')
                            ->searchable()
                            ->preload()
                            ->required()
                            ->hint('Select the municipality this barangay belongs to'),
                    ]),

                Forms\Components\Select::make('station_id')
                    ->label('PNP Station')
                    ->relationship('station', 'name')
                    ->searchable()
                    ->preload()
                    ->hint('Optional: Select the PNP station serving this barangay'),

                Forms\Components\TextInput::make('lat')
                    ->numeric()
                    ->label('Latitude')
                    ->step(0.000001),

                Forms\Components\TextInput::make('lang')
                    ->numeric()
                    ->label('Longitude')
                    ->step(0.000001),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn (Builder $query) => $query->where('role', 5))
            ->columns([
                TextColumn::make('name')->searchable()->label('Barangay Name'),
                TextColumn::make('email')->searchable()->label('Email'),
                TextColumn::make('province.name')
                    ->label('Province')
                    ->sortable()
                    ->badge()
                    ->color('info'),
                TextColumn::make('municipality.name')
                    ->label('Municipality')
                    ->sortable()
                    ->badge()
                    ->color('warning'),
                TextColumn::make('station.name')
                    ->label('PNP Station')
                    ->sortable()
                    ->badge()
                    ->color('danger')
                    ->default('N/A'),
                TextColumn::make('role')
                    ->label('Role')
                    ->formatStateUsing(fn ($state) => 'Barangay')
                    ->badge()
                    ->color('success'),
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
            'index' => Pages\ListBarangays::route('/'),
            'create' => Pages\CreateBarangay::route('/create'),
            'edit' => Pages\EditBarangay::route('/{record}/edit'),
        ];
    }

    public static function canAccessPanel(\Filament\Panel $panel): bool
    {
        return auth()->user()?->role === 1; // Super Admin only
    }
}
