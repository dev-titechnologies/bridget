@foreach($comments as $comment)
@include('bridget.comment',['comment' => $comment])			
@endforeach