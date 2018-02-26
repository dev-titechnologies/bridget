
			<div>
				<b>{{$comment->browser_fingerprint==Session::get('fingerPrint')?'Me':$comment->username}}:</b> {{ $comment->comment }}
				<br>
				<div class="replytime"> {{$comment->created_at->diffForHumans()}}</div>
			</div>
