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
				<div id="scroll-container">
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

					<input type="hidden" id="comment-ids" value="{{$commentIds}}">
				</div>
			</div> 

		</div>
		
		<div class="message-box">
			<textarea class="message-input comment-box add-comment-box" placeholder="Add a comment..." data-autoresize></textarea>
			<input type="hidden" id="old-comment-id">
			<textarea class="message-input edit-comment-box edit-ele" data-autoresize></textarea>			
			<button type="submit" class="message-submit" id="sendMessage">Send</button>	
		</div>
		<span class="edit-ele cancel-edit cursor_pointer">Cancel</span>
	</div>

</section>

<script type="text/javascript" src="<?php echo env('SOCKET_URL');?>/socket.io/socket.io.js"></script>

<script> 
	var socket = io('<?php echo env('SOCKET_URL');?>');
	var channel1 = "<?php echo $channelId; ?>:App\\Events\\SendMessage";
	socket.on(channel1, function(data){
		displayNewMessage(data.data);
	});
	var channel2 = "<?php echo $channelId; ?>:App\\Events\\UpdateUserName";
	socket.on(channel2, function(data){		
		displayNewName(data.data);
	});
	var channel3 = "<?php echo $channelId; ?>:App\\Events\\UpdateTypingStatus";
	socket.on(channel3, function(data){		
		displayTypingBar(data.data);
	});
	var channel4 = "<?php echo $channelId; ?>:App\\Events\\DeleteMessage";
	socket.on(channel4, function(data){		
		removeUserMessage(data.data);
	});
	var channel5 = "<?php echo $channelId; ?>:App\\Events\\EditMessage";
	socket.on(channel5, function(data){		
		showEditedMessage(data.data);
	});
</script>
<script type="text/javascript" src="{{ URL::asset('js/fingerprint.js') }}"></script>
<script>
	var pageUrl="<?php echo $param; ?>";
	var fingerprint = "<?php echo Session::get('fingerPrint');?>";
</script>
<script type="text/javascript" src="{{ URL::asset('js/bridget_script.js') }}"></script>
@stop