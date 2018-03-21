var selectedElement=null;
var deleteMsgCount=0;
var currentTime=new Date().getTime();


var domElements=(function(){
	return {  

		'replayBtn':'.replay-btn',
		'messagesContainer':'.messages-content',
		'mCSBContainer':'#mCSB_1_container',
		'chatContainer':'.chat-content',
		'seeAllReplays':'.see-all-replay',
		'childCommentContainer':'.child_comment_container',
		'hideAllReplay':'.hide-all-replay',
		'commentFooter':'.comment_footer',
		'cancelReplayInput':'.cancel_input',
		'userReplayInput':'.user-replay',
		'sendMessageBtn':'#sendMessage',
		'messageTextBox':'.comment-box',
		'responseMessage':'#new-message',
		'anonymousPostBtn':'.anonymous-post-btn',
		'userNameField':'.name_field',
		'botContainer':'.bot',
		'botResponse':'.bot-response',
		'noComments':'.no-comments',
		'childComments':'.child-comments',
		'loadPreviousComment':'.load-previous-comments',
		'typingBar':'#typing-bar',
		'typingUser':'.typing-user',
		'typingMessageArea':'.typing-area',
		'deleteMyComment':'.delete-my-comment',
		'deleteMyReply':'.delete-my-reply',
		'editMyComment':'.edit-my-comment',
		'editCommentBox':'.edit-comment-box',
		'addCommentBox':'.add-comment-box',
		'commentIds':'#comment-ids',
		'userAction':'.user-action',
		'toggleCommentBox':'.toggle-comment-box',
		'editElements':'.edit-ele',
		'cancelEdit':'.cancel-edit',
		'oldCommentId':'.old-comment-id',
		'editMyReply':'.edit-my-reply',
		'pageLoader':'#page-loader',
		'contentWrapper':'#content-wrapper',
		'pinnedMsg':'#pinned-msg',
		'pinnedMsgContainer':'.pinned-msg-container',
		'messageWrapper':'.message',
		'editedLabel':'.edited-label',
		'userComment':'.user-comment',
		'commentReply':'.comment-reply',
		'userEditReplyBox':'.user-edit-replay',
		'commentReplyContainer':'.comment-reply-container',
		'cancelEditReply':'.cancel-edit-reply'
	}

})();



var storage=(function(){
	getItem=function(item){
		return localStorage.getItem(item);
	}
	setItem=function(item,value){
		localStorage.setItem(item,value); 
		return true;  
	}
	removeItem=function(item){
		localStorage.removeItem(item); 
	}
	return {
		getItem:getItem,
		setItem:setItem,
		removeItem:removeItem
	}

})();

var bridgetLoader=(function(){

	var element;
	var cachedHtml;
	init=function(ele){
		element=$(ele);
		cachedHtml=$(ele).text();
		$(element).html('<i class="fa fa-circle-o-notch fa-spin"></i>');
	}
	end=function(){
		setTimeout(function(){ $(element).text(cachedHtml); }, 500);       
	}

	return {
		init:init,
		end:end
	}

})();


var jsonStorage=(function(){
	init=function(item){		

	}
	setStorage=function(value,item){
		object=JSON.parse(storage.getItem(item))?JSON.parse(storage.getItem(item)):[];
		object.push(value);
		storage.setItem(item,JSON.stringify(object)); 
	}
	getStorage=function(item){
		return JSON.parse(storage.getItem(item));
	},
	updateByKey=function(item,key,status){
		if(!storage.getItem(item)){
			object={};
			object[pageUrl] = status;
			storage.setItem(item,JSON.stringify(object))
		}else{
			jsonObject=JSON.parse(storage.getItem(item));
			jsonObject[key]=status;
			storage.setItem(item,JSON.stringify(jsonObject)); 
		}		
	}
	getByKey=function(item,key){
		if(!storage.getItem(item)){
			return false;
		}
		return JSON.parse(storage.getItem(item))[key];
	}
	return {
		init:init,
		setStorage:setStorage,
		getStorage:getStorage,
		updateByKey:updateByKey,
		getByKey:getByKey
	}

})();

var userTypeStatus=(function(){

	var userTouchedBridgit=false;

	updateUserTouchStatus=function(status){
		userTouchedBridgit=status;
	}
	getUserTouchStatus=function(){
		return userTouchedBridgit;
	}

	return {
		updateUserTouchStatus:updateUserTouchStatus,
		getUserTouchStatus:getUserTouchStatus
	}
})();



$.fn.focusToEnd = function() {
	return this.each(function() {
		var v = $(this).val();
		$(this).focus().val("").val(v);
	});
};

var typingMsg=(function(){
	var uniqueUsers=[];
	var users=[];
	const TYPINGNAMEDISPLAYLIMIT = 3;
	init=function(){ 

	}
	removeTypingMsg=function(){
		users=[];
		$('.typed-user').html('');
		$('.type-msg').html('');
	}
	showTypingUser=function(user){
		users.push(user);
		uniqueUsers = users.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
		if(uniqueUsers.length>TYPINGNAMEDISPLAYLIMIT){
			$('.typed-user').html(uniqueUsers.length);
		}else{
			$('.typed-user').html(uniqueUsers.toString()+'&nbsp');
		}        
		$('.type-msg').html("is typing...");
	}
	return {
		init:init,
		removeTypingMsg:removeTypingMsg,
		showTypingUser:showTypingUser
	}
})();

var Bridgit=(function(){

	init=function(){

	}
	botResponse=function(){
		$(domElements.pinnedMsg).html(bridgitQuestion);
		$(domElements.pinnedMsgContainer).show();
	}
	return {
		init:init,
		botResponse:botResponse
	}

})();


function userNameFormHtml()
{
	return 'My name is '+bridgitName+', what can I call you?<br>'+
	'<input class="name_field" type="text" placeholder="Enter name...">'+
	'<div class="timestamp"></div>'+
	'<span class="cursor_pointer anonymous-post-btn">Or Post as anonymous</span>';
}


function displayTypingBar(data)
{    
    //typingMsg.removeTypingMsg();
    if(fingerprint!=data.fingerprint){      
    	typingMsg.init();
    	typingMsg.showTypingUser(data.username);
    	updateScrollbar();
    }
}


function sendNewMessage() 
{

	var userInput = $(domElements.messageTextBox);
	var newMessage = userInput.val();

	if (!newMessage.trim()) {
		return;
	}   

	var request =sendMsg(null,newMessage,pageUrl,fingerprint);
	ajaxSuccessComment(request);

}

function ajaxSuccessComment(request)
{
	request.done(function(response){ 
		reEnableTextBox();     
		if(getUserName()){
			$(domElements.messageTextBox).focus();
		}else{
			jsonStorage.setStorage(response._id,'myCommentIds');
		}


	});

	request.fail(function(jqXHR, textStatus) {
		console.log( "Request failed: " + textStatus );
	});
}

function displayNewMessage(data)
{  
	typingMsg.removeTypingMsg();
	$(domElements.noComments).hide();
	var msg=data.message;
	msg_other=msg.replace(/((http|https)\:\/\/)?[a-zA-Z0-9\.\/\?\:@\-_=#]+\.([a-zA-Z0-9\&\.\/\?\:@\-_=#])*/,'');
	
	$(domElements.pinnedMsgContainer).hide();
	if(fingerprint!=data.commentFingerPrint){
		$(domElements.chatContainer).append(msg_other);
		$('#commentuser-'+data.commentId).html(data.username);
		$('#comment-'+data.commentId).find('.message').removeClass('message-personal');
		$('#comment-'+data.commentId).find('.user-action').remove();
	}else{  
		$(domElements.chatContainer).append(msg);      
		$(domElements.messageTextBox).val('');
		$(domElements.messageTextBox).keyup();
	}
	updateCommentIds(data.commentId);
    //$(domElements.messageTextBox).keyup();
    updateScrollbar();
}

function displayNewName(data)
{
	var commentIds=data.commentIds;
	if(fingerprint!=data.fingerprint){
		for (var key in commentIds) {
			$('#commentuser-'+commentIds[key]).html(data.username);      
		}
	}
	storage.removeItem('myCommentIds');

}

function getUserName()
{   
	var bridgetUsername = storage.getItem('bridget-username');

	if(!bridgetUsername){
		$(domElements.pinnedMsgContainer).hide();
		$(domElements.botResponse).html(userNameFormHtml());
		$(domElements.botContainer).show();
		$(domElements.userNameField).focus();
		updateScrollbar();
		return;
	}
	return bridgetUsername;
}


function sendMsg(parentId,msg,url,fingerPrint)
{   

	return $.ajax({
		url: baseUrl+'/add-message',
		type: "POST",
		data: {
			'_token': getCsrfToken(),
			'parent_id':parentId,
			'comment':msg,
			'url':url,
			'fingerPrint':fingerPrint,
			'username':storage.getItem('bridget-username')?storage.getItem('bridget-username'):'Anonymous'
		},
		dataType: "json",
		beforeSend:function(){
			disableTextBox();
		}
	});
}

function sendEditedMessage(commentId,comment)
{   

	return $.ajax({
		url: baseUrl+'/edit-message',
		type: "POST",
		data: {
			'_token': getCsrfToken(),
			'bridget_url':pageUrl,
			'_id':commentId,
			'edited_comment':comment

		},
		dataType: "json",
		beforeSend:function(){
			disableTextBox();
		}
	});
}

function sendEditedReply(id,comment)
{
	return $.ajax({
		url: baseUrl+'/edit-message',
		type: "POST",
		data: {
			'_token': getCsrfToken(),
			'bridget_url':pageUrl,
			'_id':id,
			'edited_comment':comment

		},
		dataType: "json",
		beforeSend:function(){
			disableTextBox();
		}
	}); 
}

function showChildComments(parentId)
{

	return $.ajax({
		url: baseUrl+'/child-comments',
		type: "POST",
		data: {
			'_token': getCsrfToken(),
			'parent_id':parentId
		},
		dataType: "json"
	});
}

function updateUserName(username)
{
	return $.ajax({
		url: baseUrl+'/update-username',
		type: "POST",
		data: {
			'_token': getCsrfToken(),
			'username':username
		},
		dataType: "json",
		beforeSend:function(){
			disableTextBox();
		}
	});
}

function updateDisplayName(comments,username)
{
	return $.ajax({
		url: baseUrl+'/update-display-name',
		type: "POST",
		data: {
			'_token': getCsrfToken(),
			'username':username,
			'comments':comments,
			'url':pageUrl
		},
		dataType: "json",
		beforeSend:function(){

		}
	});
}

function sendTypingProgress(username)
{
	return $.ajax({
		url: baseUrl+'/update-typing-status',
		type: "POST",
		data: {
			'_token': getCsrfToken(),
			'username':username,
			'url':pageUrl
		},
		dataType: "json",
		beforeSend:function(){

		}
	}); 
}

function getParentId(ele)
{
	return $(ele).attr('id').split('-')[1];
}

function updateScrollbar(position='bottom') 
{
	$(domElements.messagesContainer).mCustomScrollbar("update").mCustomScrollbar('scrollTo', position, {
		scrollInertia: 0,
		timeout: 0,
		scrollEasing: "linear"
	});
}

function disableTextBox()
{
	$(domElements.messageTextBox).attr('disabled',true);
	$(domElements.userReplayInput).attr('disabled',true);
}

function reEnableTextBox()
{
	$(domElements.messageTextBox).attr('disabled',false);
	$(domElements.userReplayInput).attr('disabled',false);
}

function getCsrfToken()
{
	return $('meta[name="csrf-token"]').attr('content');
}

function loadPreviousComment(excludedid)
{
	return $.ajax({
		url: baseUrl+'/bridget',
		type: "POST",
		data: {  
			'_token': getCsrfToken(),         
			'bridget_url':pageUrl,
			'excluded_ids':excludedid
		},
		dataType: "json",
		beforeSend:function(){

		}
	});
}

function deleteComment(commentid)
{
	return $.ajax({
		url: baseUrl+'/delete-my-comment',
		type: "POST",
		data: { 
			'_token': getCsrfToken(),           
			'_id':commentid,
			'bridget_url':pageUrl,
		},
		dataType: "json",
		beforeSend:function(){

		}
	});
}

function removeUserMessage(data)
{
	updateCommentIds(data.commentId);
	$('#comment-'+data.commentId).remove(); 
}

function updateCommentIds(newCommentId)
{
	var oldComment=$(domElements.commentIds).val();
	var newComment=oldComment?oldComment+','+newCommentId:newCommentId; 
	$(domElements.commentIds).val(newComment);
}

function getOriginalComment(commentId)
{
	return $.ajax({
		url: baseUrl+'/original-message',
		type: "POST",
		data: { 
			'_token': getCsrfToken(),           
			'_id':commentId
		},
		dataType: "json",
		beforeSend:function(){

		}
	}); 
}

function editComment(commentId)
{
	getOriginalComment(commentId).done(function(response) {     
		$('#comment-'+commentId).find(domElements.editElements).show();
		$('#edit-'+commentId).val(response.comment);
		$('#edit-'+commentId).focusToEnd();	
		$('#edit-'+commentId).keyup();
	});
}
function showEditedMessage(data)
{    
	//data.userComment
	$('#comment-'+data.commentId).find('.user-comment').html(data.newComment);
	$('#comment-'+data.commentId).find('.edited-label').html('Edited');
	reEnableTextBox();
}

function resizeTextarea(el,offset)
{
	jQuery(el).css('height', 'auto').css('height', el.scrollHeight + offset);
}


function ajaxSuccessReplay(request,$input)
{
	request.done(function(response) { 
		reEnableTextBox();      
		$input.val('');
		$input.keyup();
		$input.parent('div').find(domElements.childComments).append(response.message);
		$input.parent().parent().find('.see-all-replay').html(response.childCount);
		$input.css({'height':35});
		if(getUserName()){
            //
            $input.focus();
        }

    });

	request.fail(function(jqXHR, textStatus) {
		console.log( "Request failed: " + textStatus );
	}); 
}

function getUrlVar() 
{
	var result = {};
	var location = window.location.href.split('#');
	var parts = location[0].replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		result [key] = value;
	});
	return result;
}

function checkScrollTop(el)
{

	if(el.mcs.top==0){
		var firstChild=$('.chat-content').children(":first")
		var ele=$(domElements.loadPreviousComment);  
		bridgetLoader.init($(ele));    
		loadPreviousComment($(domElements.commentIds).val()).done(function(response){ 
			if(response.success){ 
				bridgetLoader.end();  
				$(domElements.commentIds).val(response.commentIds);
				$(domElements.chatContainer).prepend(response.comments); 
				if(!response.showLoadMore){                    
					$(domElements.loadPreviousComment).hide();            
				}else{
					$('.chat-content').find('.message').removeClass('new');
					updateScrollbar($(firstChild).find('.message').offset().top-200);
				}

			}
		});
	}
}

function typingtimeoutFunction()
{
	setInterval(function(){
		typingMsg.removeTypingMsg();
	},6000);
}

function isUrlNotInArray()
{
	//undefined or false case
	if(!jsonStorage.getByKey('wdyt',pageUrl)){
		return true;		
	}
}

function textAreaResize()
{
	jQuery.each(jQuery('textarea[data-autoresize]'), function() {
		var offset = this.offsetHeight - this.clientHeight;
		jQuery(this).on('keyup input', function() { resizeTextarea(this,offset); }).removeAttr('data-autoresize');
	});
}

function getId(ele)
{
	return ele.split('-')[1];
}

function toggleEditBox(pk)
{
	$('#comment-'+pk).find(domElements.messageWrapper).toggle();  
	$('#comment-'+pk).find(domElements.editElements).toggle(); 
}

function toggleReplyBox(pk)
{
	$('#reply-'+pk).find(domElements.commentReplyContainer).toggle(); 
	$('#reply-'+pk).find(domElements.editElements).toggle(); 
}


(function(){

	textAreaResize();
	$(domElements.pageLoader).hide();
	$(domElements.contentWrapper).show();
	

	//display what do you think?
	if(isUrlNotInArray() || !storage.getItem('bridget-username')){
		jsonStorage.updateByKey('wdyt',pageUrl,true);
		if($(domElements.commentIds).val()==''){
			typingMsg.init();
			typingMsg.showTypingUser('Bridgit');
			setTimeout(function(){
				typingMsg.removeTypingMsg();
				if(!userTypeStatus.getUserTouchStatus()){
					Bridgit.botResponse();
				}
				typingtimeoutFunction();
			}, 1000);  
		}else{
			// show after 5 sec
			setTimeout(function(){
				typingMsg.init();
				typingMsg.showTypingUser('Bridgit');
				setTimeout(function(){
					typingMsg.removeTypingMsg();
					if(!userTypeStatus.getUserTouchStatus()){
						Bridgit.botResponse();
					}					
					typingtimeoutFunction();
				}, 1000); 
			}, 5000);   
		}
	}else{
		typingtimeoutFunction();
	}

	$(domElements.messagesContainer).mCustomScrollbar({
		callbacks:{
			onScroll:function(){
				checkScrollTop(this);
			},
		},
	});	


	updateScrollbar();

	$(document).on('click',domElements.sendMessageBtn,function(){
		userTypeStatus.updateUserTouchStatus(true);
		sendNewMessage();
	})
    //userAction
    $(document).on('click',domElements.userAction,function(event){
    	event.stopPropagation();
    	$(domElements.userAction).next('ul').hide();
    	$(this).next('ul').toggle();
    })

    $(document).on('click',domElements.deleteMyComment,function(){
    	$(this).parents('ul').hide();
    	deleteComment($(this).data('pk')).done(function(response) { 

    	});
    });

    $(document).on('click',domElements.deleteMyReply,function(){
    	var pk=$(this).data('pk');       
    	deleteComment(pk).done(function(response) { 
    		$('#reply-'+pk).remove();
    	});

    });

    $(document).on('keypress input',domElements.messageTextBox,function(){
    	userTypeStatus.updateUserTouchStatus(true);
    	if(!storage.getItem('bridget-username')){
    		var userName='someone';
    	}else{
    		var userName=storage.getItem('bridget-username');
    	}
    	if (!$(this).val().trim()) {
    		return;
    	}    
    	sendTypingProgress(userName);
    })

    $(document).on('keypress',domElements.userNameField,function(e){
    	var keycode = (e.keyCode ? e.keyCode : e.which);
    	if(keycode == '13' && $(this).val()!=''){            
    		updateUserName($(this).val()); 
    		updateDisplayName(jsonStorage.getStorage('myCommentIds'),$(this).val());
    		storage.setItem('bridget-username',$(this).val());
    		$(domElements.botResponse).html('Thank you'+' '+$(this).val());     
    		$(domElements.botResponse).addClass('new'); 
    		setTimeout(function(){ $(domElements.botContainer).hide(); }, 3000);
    		reEnableTextBox();

    	}   
    });

    $(document).on('click',domElements.replayBtn,function(e){
    	selectedElement=$(this);        
    	$(this).parent('.comment_footer').find('.reply_input').show();
    	$(this).parent('.comment_footer').find('.user-replay').focus();

    });

    $(document).on('click',domElements.cancelReplayInput,function(e){
    	$(this).parent('.reply_input').hide();
    });
    //comment-box
    $(document).on('keypress',domElements.messageTextBox,function(e){ 

    	var keycode = (e.keyCode ? e.keyCode : e.which);
    	if (keycode == 13 && e.shiftKey) {        
    		e.stopPropagation();
    	}
    	else if(keycode == '13'){
    		sendNewMessage();
    	}
    });
    /*=========================================*/
    /*Edit Parent Comment Event Listner Start*/
    $(document).on('keypress',domElements.editCommentBox,function(e){ 
    	var cachedId=$(this).prev(domElements.oldCommentId).val();
    	var keycode = (e.keyCode ? e.keyCode : e.which);
    	if (keycode == 13 && e.shiftKey) {        
    		e.stopPropagation();
    	}
    	else if(keycode == '13'){
    		
    		sendEditedMessage(cachedId,$(this).val())
    		.done(function(response){
    			reEnableTextBox();
    			toggleEditBox(cachedId);
    		});
    	}else if (keycode == '27') { 
    		toggleEditBox(cachedId);
    	}
    });


    $(document).on('click',domElements.cancelEdit,function(e){  	
    	toggleEditBox(getId($(this).attr('id')));
    });

    $(document).on('click',domElements.editMyComment,function(){
    	pk=$(this).data('pk');
    	toggleEditBox(pk);    	
    	editComment(pk);
    });

    $(document).on('keyup',domElements.editCommentBox,function(e){ 
    	var keycode = (e.keyCode ? e.keyCode : e.which);
    	var cachedId=$(this).prev(domElements.oldCommentId).val();
    	if (keycode == '27') { 
    		toggleEditBox(pk);    
    	}
    });
    /*Edit Parent Comment Event Listner End*/
    /*=========================================*/

    /*=========================================*/
    /*Edit child Comment Event Listner Start*/
    $(document).on('keypress',domElements.userEditReplyBox,function(e){ 

    	var keycode = (e.keyCode ? e.keyCode : e.which);
    	var commentId=$(this).prev('.old-reply-id').val();
    	if (keycode == 13 && e.shiftKey) {        
    		e.stopPropagation();
    	}
    	else if(keycode == '13'){
    		var ele=$(this);
    		
    		var comment=$(this).val();
    		sendEditedReply(commentId,comment)
    		.done(function(response){
    			reEnableTextBox();
    			toggleReplyBox(commentId);
    			$('#reply-'+commentId).find('.comment-reply').html(response.newComment);
    			$('#reply-'+commentId).find('.edited-label').html('Edited');
    		});
    	}
    });

    $(document).on('keyup',domElements.userEditReplyBox,function(e){ 
    	var keycode = (e.keyCode ? e.keyCode : e.which);
    	var commentId=$(this).prev('.old-reply-id').val();
    	if (keycode == '27') { 
    		toggleReplyBox(commentId);
    	}
    });

    $(document).on('click',domElements.editMyReply,function(e){
    	var ele=$(this);
    	getOriginalComment($(this).data('pk')).done(function(response) { 
    		toggleReplyBox($(ele).data('pk'));
    		$(ele).parents('#reply-'+$(ele).data('pk')).find(domElements.userEditReplyBox).val(response.comment);
    		$(ele).parents('#reply-'+$(ele).data('pk')).find('.user-edit-replay').focusToEnd();
    		$(ele).parents('#reply-'+$(ele).data('pk')).find('.user-edit-replay').keyup();
    	});
    });

    $(document).on('click',domElements.cancelEditReply,function(e){
    	var ele=$(this); 
    	toggleReplyBox(getId($(this).attr('id'))); 
    });
    /*=========================================*/
    /*Edit child Comment Event Listner End*/

    $(document).on('keypress',domElements.userReplayInput,function(e){   

    	var keycode = (e.keyCode ? e.keyCode : e.which);
    	if (keycode == 13 && e.shiftKey) {          
    		e.stopPropagation();
    	}
    	else if(keycode == '13'){
    		var $input=$(this);  

    		if(!$input.val().trim()){
    			return;
    		}

    		var parentId=getParentId($(this).parent().parent());


    		var request =sendMsg(parentId,$input.val(),pageUrl,fingerprint);

    		ajaxSuccessReplay(request,$input);


    	}
    });

    $(document).on('click',domElements.anonymousPostBtn,function(e){
    	storage.setItem('bridget-username','Anonymous');
    	updateUserName('Anonymous');
    	$(domElements.botContainer).hide();
    	reEnableTextBox();
    });

    $(document).on('click',domElements.seeAllReplays,function(e){
    	var ele=$(this);
    	var parentDiv=$(ele).parent().parent();
    	$(parentDiv).find(domElements.childCommentContainer).show();
    	$(ele).hide();
    	$(parentDiv).find(domElements.userReplayInput).focus();


    });
    $(document).on('click',domElements.hideAllReplay,function(e){
    	$(this).hide();
    	$(this).prev('div').show();
    	var parentDiv=$(this).parent().parent();;
    	$(parentDiv).find(domElements.childCommentContainer).hide();
    });

    $(window).click(function() {
    	$('.user-action').next('ul').hide();
    });

    $(document).on('click',domElements.loadPreviousComment,function(e){ 

    	e.preventDefault();
    	var ele=$(this);  
    	bridgetLoader.init($(ele));    
    	loadPreviousComment($(domElements.commentIds).val()).done(function(response){ 
    		if(response.success){ 
    			bridgetLoader.end();  
    			$(domElements.commentIds).val(response.commentIds);
    			$(domElements.chatContainer).prepend(response.comments); 
    			if(!response.showLoadMore){
    				$(domElements.loadPreviousComment).hide();            
    			}
    		}
    	});
    });


})();
