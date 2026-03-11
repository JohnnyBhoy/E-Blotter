<?php

namespace App\Http\Controllers;

use App\Models\Blotter;
use App\Models\Complainant;
use App\Models\ContactUs;
use App\Models\Incident;
use App\Models\IncidentReport;
use App\Models\User;
use App\Services\BlotterService;
use App\Services\IncidentService;
use App\Services\UserService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    protected $userService;
    protected $blotterService;
    protected $incidentService;
    protected $edit = 'Profile/Edit';

    /** Constructor */
    public function __construct(UserService $userService, BlotterService $blotterService, IncidentService $incidentService)
    {
        $this->userService = $userService;
        $this->blotterService = $blotterService;
        $this->incidentService = $incidentService;
    }

    /** Dashboard */
    public function dashboard()
    {
        return Inertia::render('Barangay/Dashboard');
    }

    /**
     * User profile index
     * @param \Illuminate\Http\Request $request The HTTP request
     */
    public function index(Request $request)
    {
        $userId = auth()->user()->id;

        try {
            $user = $this->userService->get($userId);

            return Inertia::render($this->edit, [
                'data' => $user
            ]);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th], 500);
        }
    }

    /**
     * User profile update
     * @param \Illuminate\Http\Request $request The HTTP request
     */
    public function update(Request $request)
    {
        $userId = auth()->user()->id;
        $user = $this->userService->get($userId);

        $allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];
        $allowedExtensions = ['jpg', 'jpeg', 'png'];

        try {
            if ($request->hasFile('banner')) {
                $image = $request->file('banner');
                $mime = $image->getMimeType();
                $extension = strtolower($image->getClientOriginalExtension());

                if (in_array($mime, $allowedMimes) && in_array($extension, $allowedExtensions) && $image->getSize() <= 5 * 1024 * 1024) {
                    $imageName = Str::uuid() . '.' . $extension;
                    $image->move(public_path('images/barangay_banner'), $imageName);
                    User::where('id', $userId)->update(['banner' => $imageName]);
                    $status = 'success';
                } else {
                    $status = 'failed';
                }
            } elseif ($request->hasFile('avatar')) {
                $image = $request->file('avatar');
                $mime = $image->getMimeType();
                $extension = strtolower($image->getClientOriginalExtension());

                if (in_array($mime, $allowedMimes) && in_array($extension, $allowedExtensions) && $image->getSize() <= 2 * 1024 * 1024) {
                    $imageName = Str::uuid() . '.' . $extension;
                    $image->move(public_path('images/barangay_avatar'), $imageName);
                    User::where('id', $userId)->update(['avatar' => $imageName]);
                    $status = 'success';
                } else {
                    $status = 'failed';
                }
            } else {
                $status = 'failed';
            }

            return Inertia::render($this->edit, [
                'status' => $status,
                'data' => $user,
            ]);
        } catch (\Throwable $th) {
            return Inertia::render($this->edit, [
                'status' => 'failed',
                'data' => $user,
            ]);
        }
    }

    /**
     * Method to send message from contact us
     * @param \Illuminate\Http\Request $request The HTTP request
     *
     * @return Response
     */
    public function sendMessageFromContactUs(Request $request)
    {
        $validated = $request->validate([
            'data.full_name'     => 'required|string|max:255',
            'data.email_address' => 'required|email|max:255',
            'data.subject'       => 'required|string|max:255',
            'data.message'       => 'required|string|max:5000',
        ]);

        try {
            ContactUs::create($validated['data']);

            return to_route('contact.us');
        } catch (\Throwable $th) {
            return back()->withErrors(['message' => 'Failed to send message. Please try again.']);
        }
    }
}
