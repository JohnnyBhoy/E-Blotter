<?php

namespace App\Http\Controllers;

use App\Models\ContactUs;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    protected $userService;
    protected $edit = 'Profile/Edit';

    /**
     * The blotter console moved to ConsoleController, which serves every role
     * from one page. What is left here is the account itself: profile and the
     * public contact form.
     */
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
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

            // The barangay console opens the profile in a modal, so the same
            // action answers XHR with JSON instead of a page of its own.
            if ($this->wantsJson($request)) {
                return response()->json(['data' => $user]);
            }

            return Inertia::render($this->edit, [
                'data' => $user
            ]);
        } catch (\Throwable $th) {
            report($th);

            return response()->json(['message' => 'The profile could not be loaded.'], 500);
        }
    }

    /**
     * Whether the caller is the console panel asking over XHR rather than a
     * browser visit or an Inertia navigation.
     */
    private function wantsJson(Request $request): bool
    {
        return $request->wantsJson() && !$request->header('X-Inertia');
    }

    /**
     * User profile update
     * @param \Illuminate\Http\Request $request The HTTP request
     */
    public function update(Request $request)
    {
        $userId = auth()->user()->id;

        $request->validate([
            'banner' => 'nullable|image|mimes:jpg,jpeg,png|max:10240',
            'avatar' => 'nullable|image|mimes:jpg,jpeg,png|max:10240',
        ]);

        $status = 'failed';

        try {
            // Previously the column was written even when the MIME check failed,
            // storing an undefined variable (null) over the existing image.
            foreach (['banner' => 'barangay_banner', 'avatar' => 'barangay_avatar'] as $field => $folder) {
                if (!$request->hasFile($field)) {
                    continue;
                }

                $image = $request->file($field);

                // Extension from the detected MIME type, plus a unique prefix so
                // two uploads in the same second don't overwrite one another.
                $imageName = uniqid("{$field}_", true) . '.' . $image->extension();

                $image->move(public_path("images/{$folder}"), $imageName);

                User::where('id', $userId)->update([$field => $imageName]);

                $status = 'success';
            }

            $user = $this->userService->get($userId);

            if ($this->wantsJson($request)) {
                return response()->json(['status' => $status, 'data' => $user]);
            }

            return Inertia::render($this->edit, [
                'status' => $status,
                'data' => $user,
            ]);
        } catch (\Throwable $th) {
            report($th);

            if ($this->wantsJson($request)) {
                return response()->json(['message' => 'The image could not be saved.'], 500);
            }

            return Inertia::render($this->edit, [
                'status' => 'failed',
                'data' => $this->userService->get($userId),
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
        // Public route — validate the nested payload instead of mass-assigning it.
        $validated = $request->validate([
            'data' => 'required|array',
            'data.full_name' => 'required|string|max:255',
            'data.email_address' => 'required|email|max:255',
            'data.subject' => 'required|string|max:255',
            'data.message' => 'required|string|max:5000',
        ]);

        ContactUs::create($validated['data']);

        return back()->with('success', 'Your message has been sent.');
    }
}
