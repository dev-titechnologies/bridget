<?php
use App\BridgetComments;
?>
@extends('layouts.bridget')
@section('content')
<section class="avenue-messenger">
	<div class="chat">

		<div class="messages">
			<div class="messages-content">
				@if(!count($parentComments))
				<div class="no-comments"><b>No comments yet.Be the first to review this product</b></div>	
				@endif
				@if(BridgetComments::getParentsCommentCount($param)>BridgetComments::COMMENTLIMIT)
				
				<a href="#" class="load-previous-comments">Load Prevous Comments</a>
				@endif
				<div class="chat-content">

					@include('bridget.parentComments',['comments' => $parentComments])

				</div>

				<div class="message bot">
					<figure class="avatar">
						<img src="img/bot.png">
					</figure>
					<div  class="bot-response">
						
					</div>
				</div>

			</div> 

		</div>
		
		<div class="message-box">
			<textarea class="message-input comment-box" placeholder="Add a comment..." data-autoresize></textarea>
			<button type="submit" class="message-submit" id="sendMessage">Send</button>
		</div>
	</div>

</section>

<script type="text/javascript" src="<?php echo env('SOCKET_URL');?>/socket.io/socket.io.js"></script>

<script> 
	var socket = io('<?php echo env('SOCKET_URL');?>');
	var channel = "<?php echo $channelId; ?>:App\\Events\\SendMessage";
	socket.on(channel, function(data){

		displayNewMessage(data.data);
	});
	var channel = "<?php echo $channelId; ?>:App\\Events\\UpdateUserName";
	socket.on(channel, function(data){		
		displayNewName(data.data);
	});
	var channel = "<?php echo $channelId; ?>:App\\Events\\UpdateTypingStatus";
	socket.on(channel, function(data){		
		displayTypingBar(data.data);
	});
</script>
<script type="text/javascript" src="{{ URL::asset('js/fingerprint.js') }}"></script>
<script>
	var pageUrl="<?php echo $param; ?>";
	var fingerprint = "<?php echo Session::get('fingerPrint');?>";
</script>
<script type="text/javascript" src="{{ URL::asset('js/bridget_script.js') }}"></script>
@stop