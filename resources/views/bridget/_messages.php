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
					@foreach($parentComments as $parentComment)
						<li id="comment-{{$parentComment->_id}}">
							<b>{{ $parentComment->username }}: </b> {{ $parentComment->comment }} <br>

							<div class="child_comment_container">
								
									
							</div>
							<div class="comment_footer">

								<span class="sub_text see-all-replay">View Replies.</span>
								<span class="sub_text">Reply.</span>
								<span class="sub_text_time">{{ $parentComment->created_at }}</span><br>
							 
								<div class="reply_input"  style="display: none;">
									<input type="text">
									<span class="sub_text">Cancel</span>
									<span class="sub_text_time2">Press enter to add comment</span>
								</div> 
							</div>
						</li>
					@endforeach	
				</ul>
				<div class="footer">
					<div class="text-box" contenteditable="true" disabled="true"></div>
					<button id="sendMessage">Add </button>
				</div>
			</div>
	</div>


<!-- 	<span class="child_comment">Sachin : Yees. I love dit tooo Sokju.<br>
										<span class="sub_text_time">3 Days ago.</span><br>
									</span>

									<br>
								 
									<span class="child_comment">Sachin : Yees. I love dit tooo Sokju.<br>
										<span class="sub_text_time">{{ $parentComment->created_at }}</span><br>
									</span> -->



<!-- <div class="floating-chat enter">
	<i class="fa fa-comments" aria-hidden="true"></i>
	<div class="chat">
		<div class="header">
			<span class="title">
				What do you think?
			</span>
			<button>
				<i class="fa fa-times" aria-hidden="true"></i>
			</button>

		</div>
		<ul class="messages">
			@foreach($parentComments as $parentComment)
			<li class="" id="comment-{{$parentComment->_id}}">{{ $parentComment->comment }}
				<a href="#" style="display: block;" class="replay-comment">Replay</a>
				<a href="#" class="see-all-replay">See All Replays</a>
				<div style="display: none;">
					<input type="text" style="width: 60%;">
					<button type="button" class="replay-btn" id="replay-{{$parentComment->_id}}" style="border: 1px solid red;background: red;">Replay</button>
				</div>
			</li>			  
			@endforeach	
		</ul>



		<div class="footer">
			<div class="text-box" contenteditable="true" disabled="true"></div>
			<button id="sendMessage">send</button>
		</div>
	</div>
</div> -->

<script type="text/javascript" src="{{ URL::asset('js/fingerprint.js') }}"></script>
<script>
	var pageUrl="<?php echo $param; ?>";
	var fingerprint = new Fingerprint().get();
</script>
<script type="text/javascript" src="{{ URL::asset('js/bridget_script.js') }}"></script>
@stop
<?php
//@include('bridget.manageChild',['childs' => BridgetComments::getChildrens($parentComment->_id)])
?>











<!-- <div class="floating-chat enter">
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
			@foreach($parentComments as $parentComment)
			<li id="comment-{{$parentComment->_id}}"><b>Arunlal S : </b>{{ $parentComment->comment }}<br>
				<div class="comment_footer">
					<span class="sub_text">See Replies.</span>
					<span class="sub_text">Reply.</span>
					<span class="sub_text_time">2 Days ago.</span>
				</div>
			</li>			  
			@endforeach	
		</ul>
		<ul class="messages">
			<li>
				<b>Arunlal S : </b> Yay!!.....cool colour  loved it.!Yay!!.....cool colour  loved it.!<br>
				<div class="comment_footer">
					<span class="sub_text">See Replies.</span>
					<span class="sub_text">Reply.</span>
					<span class="sub_text_time">2 Days ago.</span>
					<div class="reply_input">
						<input type="text">
					</div> 
					<span class="sub_text">Cancel</span>
					<span class="sub_text_time2">Press enter to add comment</span>
				</div>
				<div class="child_comment_container">


					<span class="child_comment">Sachin : Yees. I love dit tooo Sokju.<br>
						<span class="sub_text_time">3 Days ago.</span><br>
					</span>

					<br>

					<span class="child_comment">Sachin : Yees. I love dit tooo Sokju.<br>
						<span class="sub_text_time">3 Days ago.</span><br>
					</span>

				</div>
			</li>
		</ul>
		<div class="footer">
			<div class="text-box" contenteditable="true" disabled="true"></div>
			<button id="sendMessage">Add </button>
		</div>
	</div>
</div> -->

	<!-- 	<a href="#" style="display: block;" class="replay-comment">Replay</a>
				<a href="#" class="see-all-replay">See All Replays</a>
				<div style="display: none;">
					<input type="text" style="width: 60%;">
					<button type="button" class="replay-btn" id="replay-{{$parentComment->_id}}" style="border: 1px solid red;background: red;">Replay</button>
				</div> -->