
			<div>
				<b>{{$comment->browser_fingerprint==Session::get('fingerPrint')?'Me':$comment->username}}:</b> {{ $comment->comment }}
				<br>
				<div class="replytime"> <span class="timeago" datetime="{{strtotime($comment->created_at)}}"></span></div>
			</div>
