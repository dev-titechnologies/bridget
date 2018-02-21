<?php 
namespace App\Events;

use App\Events\Event;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class EventName implements ShouldBroadcast
{
    use SerializesModels;

    public $data;
    public $channel;

    public function __construct($message,$channel)
    {
        $this->data = array(
            'message'=> $message
        );
        $this->channel=$channel;
    }

    public function broadcastOn()
    {
        return [$this->channel];
    }
}