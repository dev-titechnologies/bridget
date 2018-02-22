 var assetPath ='http://bridget.com';
 // document.getElementById("bridget_container").classList.add("floating-chat");





 function getScript(url){
 	var script=document.createElement('script');
 	script.src=url;
 	var head=document.getElementsByTagName('head')[0];
 	done=false;
 	return new Promise(function(resolve) {
 		script.onload=script.onreadystatechange = function(){
 			if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') ) {
 				resolve();
 				script.onload = script.onreadystatechange = null;
 			}
 		};
 		head.appendChild(script);
 	});
 }

 promise1=null;
 promise2=null;

 if(typeof jQuery == 'undefined'){
 	promise1=getScript('http://code.jquery.com/jquery.min.js');
 }

 Promise.all([promise1, promise2]).then(function(values) {
       //write jquery
       $('head').append('<link rel="stylesheet" href="'+assetPath+'/css/bridget.css" type="text/css" />');

       var $html='<div class="floating-chat enter" style="display:none;">'+
       '<i class="fa fa-comments" aria-hidden="true"></i>'+
       '<div class="chat">'+
       '<div class="header">'+
       '<span class="title">'+
       'What do you think?'+
       '</span>'+
       '<button  class="close">'+
       '<i class="fa fa-times" aria-hidden="true"></i>'+
       '</button>'+
       '</div>'+
       '<div id="iframe-container"></div>'+
       '</div>'+
       '</div>';
       $('#bridget_container').html($html);

       $(document).ready(function(){
       	$('.floating-chat').show();
       })

       var selectedElement=null;

       var domElements=(function(){
       	return {       
       		'replayBtn':'.replay-btn',
       		'chatContainer':'.floating-chat',
       		'messagesContainer':'.messages',
       		'seeAllReplays':'.see-all-replay',
       		'childCommentContainer':'.child_comment_container',
       		'hideAllReplay':'.hide-all-replay',
       		'commentFooter':'.comment_footer',
       		'cancelReplayInput':'.cancel_input',
       		'userReplayInput':'.user-replay',
       		'sendMessageBtn':'#sendMessage',
       		'messageTextBox':'.comment-box',
       		'responseMessage':'#new-message',
       		'anonymousPostBtn':'.anonymous-post',
       		'userNameField':'.name_field',
       		'botContainer':'.bot-container'
       	}

       })();




       var element = $(domElements.chatContainer);

       setTimeout(function() {
       	element.addClass('enter');
       	$('.floating-chat').show();
       }, 1000);

       element.click(openElement);


       function openElement() { 
       	var messages = element.find('.messages');
       	var textInput = element.find(domElements.messageTextBox);
       	element.find('>i').hide();
       	element.addClass('expand');
       	element.find('.chat').addClass('enter');
       	element.off('click', openElement);
       	element.find('.header button').click(closeElement);
       	messages.scrollTop(messages.prop("scrollHeight"));









       	/*FRAME*/
       	var iFrame = document.createElement("iframe");
       	var url =window.location.href;
       	var bridgetFingerprint = localStorage.getItem('bridget-fingerprint');
       	var bridgetUsername = localStorage.getItem('bridget-username');
       	if(!bridgetFingerprint){
       		var bridgetFingerprint = new Date().getTime() + Math.random();
       		localStorage.setItem("bridget-fingerprint", bridgetFingerprint);   
       	}
       	iFrame.setAttribute("src", "http://bridget.com/bridget?bridget_url="+url+"&fingerPrint="+bridgetFingerprint);
       	iFrame.setAttribute("id", "bridget_maybe");
       	iFrame.setAttribute("frameBorder", 0);
       	iFrame.style.width = "100%";
       	iFrame.style.height = "100%";
       	document.getElementById('iframe-container').appendChild(iFrame);
	// document.getElementById('iframe_container').style.position="fixed";
	// document.getElementById('iframe_container').style.bottom="0";
	// document.getElementById('iframe_container').style.right="0";
	// document.getElementById("iframe_container").style.zIndex = "10000";























}

function closeElement() {
	
	var frame = document.getElementById("bridget_maybe");
	frame.parentNode.removeChild(frame);
	element.find('.chat').removeClass('enter').hide();
	element.find('>i').show();
	element.removeClass('expand');
	element.find('.header button').off('click', closeElement);
	setTimeout(function() {
		element.find('.chat').removeClass('enter').show()
		element.click(openElement);
	}, 500);

}

});

 function showMsg() {
 	$('#test').html('asdsa');
 }



 function myFunction(){

 	document.getElementById("bridget_container").style.height = "500";
 	document.getElementById("bridget_container").style.width = "600";
 }
 
