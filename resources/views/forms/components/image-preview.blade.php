@php
$path = $getRecord()?->file;
$url = $path ? asset('storage/incident_files/' . basename($path)) : null;
@endphp

@if ($url)
<img
    src="{{ $url }}"
    alt="Uploaded image"
    style="max-width: 100%; border-radius: 6px; box-shadow: 0 1px 5px rgba(0,0,0,0.1);" />
@else
<p>No image uploaded.</p>
@endif