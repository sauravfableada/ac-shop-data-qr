<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserLog extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'module', 'action', 'message'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected static function booted()
    {
        static::created(function ($log) {
            $user = $log->user;
            // If the user who triggered this log is NOT an admin
            if ($user && !$user->roles()->where('name', 'admin')->exists()) {
                $admins = \App\Models\User::whereHas('roles', function($q) {
                    $q->where('name', 'admin');
                })->get();

                if ($admins->count() > 0) {
                    $url = '#';
                    $mod = strtolower($log->module);
                    if ($mod === 'customer') $url = '/customers';
                    elseif (str_contains($mod, 'ac')) $url = '/ac-units';
                    elseif (str_contains($mod, 'service')) $url = '/services';

                    \Illuminate\Support\Facades\Notification::send($admins, new \App\Notifications\AdminNotification(
                        $log->action,
                        $log->module,
                        $log->message . ' (by ' . $user->name . ')',
                        $url
                    ));
                }
            }
        });
    }
}
