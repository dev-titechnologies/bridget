@extends('layouts.master')

@section('content')
    <p id="power">0</p>
@stop

@section('footer')
    <script src="socket.io.js"></script>
    <script> 
        var socket = io('http://192.168.1.57:3000');
        var channel = "test-channel1:App\\Events\\EventName";
        socket.on(channel, function(message){
           $('#power').html(message.data.message);
        });
    </script>
@stop