<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * GET /api/users
     */
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->filled('recherche')) {

            $recherche = $request->recherche;

            $query->where(function ($q) use ($recherche) {

                $q->where('nom', 'like', "%{$recherche}%")
                  ->orWhere('prenom', 'like', "%{$recherche}%")
                  ->orWhere('email', 'like', "%{$recherche}%")
                  ->orWhere('role', 'like', "%{$recherche}%");

            });

        }

        return response()->json(

            $query
                ->orderBy('nom')
                ->orderBy('prenom')
                ->get()

        );
    }

    /**
     * POST /api/users
     */
    public function store(Request $request)
    {
        $data = $request->validate([

            'nom' => ['required','string','max:255'],

            'prenom' => ['required','string','max:255'],

            'email' => ['required','email','unique:users,email'],

            'password' => ['required','confirmed','min:8'],

            'role' => [
                'required',
                Rule::in([
                    'etudiant',
                    'enseignant',
                    'logistique',
                    'administrateur'
                ])
            ]

        ]);

        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);

        return response()->json($user,201);
    }

    /**
     * PUT /api/users/{user}
     */
    public function update(Request $request, User $user)
    {
        $data = $request->validate([

            'nom' => ['required','string','max:255'],

            'prenom' => ['required','string','max:255'],

            'email' => [

                'required',

                'email',

                Rule::unique('users')->ignore($user->id)

            ],

            'password' => ['nullable','confirmed','min:8'],

            'role' => [

                'required',

                Rule::in([
                    'etudiant',
                    'enseignant',
                    'logistique',
                    'administrateur'
                ])

            ]

        ]);

        if(!empty($data['password'])){

            $data['password']=Hash::make($data['password']);

        }else{

            unset($data['password']);

        }

        $user->update($data);

        return response()->json($user);
    }

    /**
     * DELETE /api/users/{user}
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json(null,204);
    }
}