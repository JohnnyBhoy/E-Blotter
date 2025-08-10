<x-filament::page>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <x-filament::card>
            <h2 class="text-lg font-semibold">Total IncidentReports</h2>
            <p class="text-2xl">{{ $totalIncidentReports }}</p>
        </x-filament::card>

        <x-filament::card>
            <h2 class="text-lg font-semibold">Active IncidentReports</h2>
            <p class="text-2xl">{{ $activeIncidentReports }}</p>
        </x-filament::card>

        <x-filament::card>
            <h2 class="text-lg font-semibold">New IncidentReports</h2>
            <p class="text-2xl">{{ $latestIncidentReports->count() }}</p>
        </x-filament::card>
    </div>

    <x-filament::card>
        <h2 class="text-lg font-semibold mb-4">Latest IncidentReports</h2>
        <table class="w-full table-auto text-sm">
            <thead class="text-left">
                <tr>
                    <th>Incident Type</th>
                    <th>Location</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($latestIncidentReports as $user)
                    <tr class="border-t">
                        <td class="py-2">{{ ($user->incidentTypes == 1  ? 'Crime'
                        : $user->incidentTypes == 2 ) ? 'Fire'
                        :  ($user->incidentTypes == 3  ? 'Medical'
                        : 'Disaster') }}</td>
                        <td class="py-2">{{ $user->location }}</td>
                        <td class="py-2">{{ ($user->status == 1  ? 'In Progress'
                        : $user->status == 2 ) ? 'On the way'
                        :  ($user->status == 3  ? 'Arrive at the area'
                        : 'Completed') }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </x-filament::card>
</x-filament::page>
