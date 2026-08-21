<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class StaffAssignedNotification extends Notification
{
    use Queueable;

    public $type;
    public $identifier;
    public $url;

    /**
     * Create a new notification instance.
     */
    public function __construct($type, $identifier, $url = '#')
    {
        $this->type = $type;
        $this->identifier = $identifier;
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
            'message' => "You have been assigned to a new {$this->type}: {$this->identifier}",
            'url' => $this->url,
            'type' => strtolower(str_replace(' ', '_', $this->type)),
        ];
    }
}
