
			<div>
				<b>{{$comment->browser_fingerprint==Session::get('fingerPrint')?'Me':$comment->username}}:</b> {{ $comment->comment }}
				<br>
				<div class="replytime"> <span class="timeago" title="{{strtotime($comment->created_at)}}"></span></div>
			</div>
