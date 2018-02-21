@foreach($childComments as $child)
@include('bridget.childComment',['comment' => $child])
@endforeach