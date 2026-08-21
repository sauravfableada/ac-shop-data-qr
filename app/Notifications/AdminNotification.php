<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AdminNotification extends Notification
{
    use Queueable;

    protected $action;
    protected $module;
    protected $message;
    protected $url;

    /**
     * Create a new notification instance.
     */
    public function __construct($action, $module, $message, $url)
    {
        $this->action = $action;
        $this->module = $module;
        $this->message = $message;
        $this->url = $url;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'action' => $this->action,
            'module' => $this->module,
            'message' => $this->message,
            'url' => $this->url,
            'type' => strtolower($this->module)
        ];
    }
}
