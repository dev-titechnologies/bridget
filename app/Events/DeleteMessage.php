<?php 
namespace App\Events;

use App\Events\Event;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class DeleteMessage implements ShouldBroadcast
{
    use SerializesModels;

    public $data;
    public $channel;

    public function __construct($commentData,$channel)
    {
        $this->data = $commentData;
        $this->channel=$channel;
    }

    public function broadcastOn()
    {
        return [$this->channel];
    }
}

