<?php
use App\BridgetComments;
?>
@extends('layouts.bridget')
@section('content')
<div id="test-123"></div>

<div class="floating-chat enter">
	<i class="fa fa-comments" aria-hidden="true"></i>
	<div class="chat">
		<div class="header">
			<span class="title">
				What do you think?
			</span>
			<button  class="close">
				<i class="fa fa-times" aria-hidden="true"></i>
			</button>

		</div>
		<ul class="messages">
			@if(!count($parentComments))
			<li class="no-comments"><b>No comments yet.Be the first to review this product</b></li>	
			@endif
			@foreach($parentComments as $parentComment)
			@include('bridget.comment',['comment' => $parentComment])			
			@endforeach	
			<span id="new-message"></span>	
		</ul>
		<div class="bot-response"></div>

		

		<div class="bot-container">
			<div class="other bot other-bot">
				My name’s Bridgit, what can I call you?
			</div>
			<div class="name_input">
				<div>
					<div class="">
						<input class="name_field" type="text" placeholder='Enter your name here'>
					</div> 
					<div>
						<span class="sub_text_time anonymous link pull-left anonymous-post-btn">Or Post as anonymous.</span>
						<span class="sub_text_time pull-right m-minus ">Press enter to send.</span>
					</div> 
				</div> 
			</div>
		</div>

		<div class="footer">
			<input class="comment-box">
			<button id="sendMessage">Add </button>
		</div>
	</div>
</div>
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
</script>
<script type="text/javascript" src="{{ URL::asset('js/fingerprint.js') }}"></script>
<script>
	var pageUrl="<?php echo $param; ?>";
	var fingerprint = "<?php echo Session::get('fingerPrint');?>";
</script>
<script type="text/javascript" src="{{ URL::asset('js/bridget_script.js') }}"></script>
@stop