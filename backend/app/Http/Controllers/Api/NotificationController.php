<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Liste des notifications de l'utilisateur connecté
    |--------------------------------------------------------------------------
    */
    public function index(Request $request)
    {
        return response()->json(

            Notification::where("user_id",$request->user()->id)
                ->latest()
                ->get()

        );
    }

    /*
    |--------------------------------------------------------------------------
    | Marquer une notification comme lue
    |--------------------------------------------------------------------------
    */
    public function read(Request $request, Notification $notification)
    {
        if($notification->user_id!=$request->user()->id){

            return response()->json([
                "message"=>"Accès refusé."
            ],403);

        }

        $notification->update([
            "lue"=>true
        ]);

        return response()->json([
            "message"=>"Notification mise à jour."
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Marquer toutes les notifications comme lues
    |--------------------------------------------------------------------------
    */
    public function readAll(Request $request)
    {
        Notification::where(
            "user_id",
            $request->user()->id
        )->update([
            "lue"=>true
        ]);

        return response()->json([
            "message"=>"Toutes les notifications sont lues."
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Supprimer une notification
    |--------------------------------------------------------------------------
    */
    public function destroy(Request $request, Notification $notification)
    {
        if($notification->user_id!=$request->user()->id){

            return response()->json([
                "message"=>"Accès refusé."
            ],403);

        }

        $notification->delete();

        return response()->json(null,204);
    }
}