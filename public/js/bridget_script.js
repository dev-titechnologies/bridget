var selectedElement=null;
var anonymousCommentId=null;
var CSRF_TOKEN = $('meta[name="csrf-token"]').attr('content');

var domElements=(function(){
    return {  

        'replayBtn':'.replay-btn',
        'chatContainer':'.floating-chat',
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
        'childComments':'.child-comments'
    }

})();

var storage=(function(){
    getItem=function(item){
       return localStorage.getItem(item);
   }
   setItem=function(item,value){
    localStorage.setItem(item,$(this).val()); 
    return true;  
}
removeItem=function(){

}
return {
    getItem:getItem,
    setItem:setItem,
    removeItem:removeItem
}

})();

function sendNewMessage() 
{

    var userInput = $(domElements.messageTextBox);
    var newMessage = userInput.val();

    if (!newMessage) {
        return;
    }   

    var request =sendMsg(null,newMessage,pageUrl,fingerprint);
    ajaxSuccessComment(request);

}

function ajaxSuccessComment(request)
{
    request.done(function(response){ 
        anonymousCommentId=response._id;     
        getUserName();      

    });

    request.fail(function(jqXHR, textStatus) {
     alert( "Request failed: " + textStatus );
 });
}

function displayNewMessage(data)
{

    $(domElements.noComments).hide();
    $(domElements.chatContainer).append(data.message); 
    if(fingerprint!=data.commentFingerPrint){
        $('#commentuser-'+data.commentId).html(data.username);
        $('#comment-'+data.commentId).find('.message').removeClass('message-personal');
    }   

    $(domElements.messageTextBox).val('');
    updateScrollbar();
}

function displayNewName(data)
{
   $('#commentuser-'+data.commentId).html(data.username); 
}

function getUserName()
{   

    var bridgetUsername = localStorage.getItem('bridget-username');

    if(!bridgetUsername){

        $(domElements.botContainer).show();
        $(domElements.userNameField).focus();
        return;
    }
    return bridgetUsername;
}



function onMetaAndEnter(event) {
    if ((event.metaKey || event.ctrlKey) && event.keyCode == 13) {
        sendNewMessage();
    }
}

function sendMsg(parentId,msg,url,fingerPrint)
{   

    return $.ajax({
        url: baseUrl+'/add-message',
        type: "POST",
        data: {
            '_token': CSRF_TOKEN,
            'parent_id':parentId,
            'comment':msg,
            'url':url,
            'fingerPrint':fingerPrint,
            'username':localStorage.getItem('bridget-username')?localStorage.getItem('bridget-username'):'Anonymous'
        },
        dataType: "json"
    });
}

function showChildComments(parentId)
{

    return $.ajax({
        url: baseUrl+'/child-comments',
        type: "POST",
        data: {
            '_token': CSRF_TOKEN,
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
        '_token': CSRF_TOKEN,
        'username':username
    },
    dataType: "json",
    beforeSend:function(){
     $(domElements.messageTextBox).attr('disabled',true);
     $(domElements.userReplayInput).attr('disabled',true);
 }
});
}

function getParentId(ele)
{
   return $(ele).attr('id').split('-')[1];
}

function updateScrollbar() {

    $(domElements.messagesContainer).mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
        scrollInertia: 10,
        timeout: 0
    });
}

(function(){

    $(domElements.messagesContainer).mCustomScrollbar();
    updateScrollbar();

    $(document).on('click',domElements.sendMessageBtn,function(){

     sendNewMessage();
 })



    $(document).on('keypress',domElements.userNameField,function(e){
        var keycode = (e.keyCode ? e.keyCode : e.which);
        if(keycode == '13' && $(this).val()!=''){            
            updateUserName($(this).val());     
            localStorage.setItem('bridget-username',$(this).val());   
            $(domElements.botResponse).html('Thank you'+' '+$(this).val());     
            $(domElements.botResponse).addClass('new');     
            
            setTimeout(function(){ $(domElements.botContainer).hide(); }, 3000);
            $(domElements.messageTextBox).attr('disabled',false); 
            $(domElements.userReplayInput).attr('disabled',false);

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

        if(keycode == '13'){
            sendNewMessage();
        }
    });

    $(document).on('keypress',domElements.userReplayInput,function(e){    
        var keycode = (e.keyCode ? e.keyCode : e.which);
        if(keycode == '13'){
           var $input=$(this);  

           if(!$input.val()){
            return;
        }

        var parentId=getParentId($(this).parent().parent());


        var request =sendMsg(parentId,$input.val(),pageUrl,fingerprint);

        ajaxSuccessReplay(request,$input);


    }
});

    function ajaxSuccessReplay(request,$input)
    {
     request.done(function(response) {       
        $input.val('');
        $input.parent('div').find(domElements.childComments).append(response.message);
        $input.parent().parent().find('.see-all-replay').html(response.childCount);
        getUserName();
    });

     request.fail(function(jqXHR, textStatus) {
      alert( "Request failed: " + textStatus );
  }); 
 }


 $(document).on('click',domElements.anonymousPostBtn,function(e){
    localStorage.setItem('bridget-username','Anonymous');
    updateUserName('Anonymous');
    $(domElements.botContainer).hide();
    $(domElements.messageTextBox).attr('disabled',false); 
    $(domElements.userReplayInput).attr('disabled',false);
});

 $(document).on('click',domElements.seeAllReplays,function(e){
    var ele=$(this);
    var parentDiv=$(ele).parent().parent();
    var request =showChildComments(getParentId($(parentDiv)));

    request.done(function(response) {
        $(parentDiv).find(domElements.childCommentContainer).html(response.view);
        $(parentDiv).find(domElements.childCommentContainer).show();
        $(ele).hide();
        $(ele).next('div').show();
    });

    request.fail(function(jqXHR, textStatus) {
      alert( "Request failed: " + textStatus );
  });

});
 $(document).on('click',domElements.hideAllReplay,function(e){
    $(this).hide();
    $(this).prev('div').show();
    var parentDiv=$(this).parent().parent();;
    $(parentDiv).find(domElements.childCommentContainer).hide();
});


})();
