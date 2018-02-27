var selectedElement=null;
var realTimeMsgCount=0;
var pageNum=0;


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
        'childComments':'.child-comments',
        'loadPreviousComment':'.load-previous-comments'
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
        reEnableTextBox();     
        if(getUserName()){
            $(domElements.messageTextBox).focus();
        }


    });

    request.fail(function(jqXHR, textStatus) {
       console.log( "Request failed: " + textStatus );
   });
}

function displayNewMessage(data)
{
    realTimeMsgCount++;
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
        updateScrollbar();
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
            '_token': getCsrfToken(),
            'parent_id':parentId,
            'comment':msg,
            'url':url,
            'fingerPrint':fingerPrint,
            'username':localStorage.getItem('bridget-username')?localStorage.getItem('bridget-username'):'Anonymous'
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

function getParentId(ele)
{
 return $(ele).attr('id').split('-')[1];
}

function updateScrollbar() {
    console.log('fired');
    $(domElements.messagesContainer).mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
        scrollInertia: 10,
        timeout: 0
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

function loadPreviousComment(pageNum)
{
    return $.ajax({
        url: baseUrl+'/bridget',
        type: "GET",
        data: {            
            'page_num':pageNum,
            'bridget_url':pageUrl,
            'real_time_offset':realTimeMsgCount
        },
        dataType: "json",
        beforeSend:function(){

        }
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
           reEnableTextBox();      
           $input.val('');
           $input.parent('div').find(domElements.childComments).append(response.message);
           $input.parent().parent().find('.see-all-replay').html(response.childCount);
           if(getUserName()){
            //
            $input.focus();
        }

    });

       request.fail(function(jqXHR, textStatus) {
          console.log( "Request failed: " + textStatus );
      }); 
   }


   $(document).on('click',domElements.anonymousPostBtn,function(e){
    localStorage.setItem('bridget-username','Anonymous');
    updateUserName('Anonymous');
    $(domElements.botContainer).hide();
    reEnableTextBox();
});

   $(document).on('click',domElements.seeAllReplays,function(e){
    var ele=$(this);
    var parentDiv=$(ele).parent().parent();
    var request =showChildComments(getParentId($(parentDiv)));

    request.done(function(response) {
        if($(parentDiv).is(':last-child')){
            updateScrollbar();
        }
        $(parentDiv).find(domElements.childCommentContainer).html(response.view);
        $(parentDiv).find(domElements.childCommentContainer).show();
        $(ele).hide();
        $(ele).next('div').show();
        $(parentDiv).find(domElements.userReplayInput).focus();
    });

    request.fail(function(jqXHR, textStatus) {
      console.log( "Request failed: " + textStatus );
  });

});
   $(document).on('click',domElements.hideAllReplay,function(e){
    $(this).hide();
    $(this).prev('div').show();
    var parentDiv=$(this).parent().parent();;
    $(parentDiv).find(domElements.childCommentContainer).hide();
});

   $(document).on('click',domElements.loadPreviousComment,function(e){  
    e.preventDefault();
    pageNum++;
    loadPreviousComment(pageNum).done(function(response){ 
        if(response.success){

         $(domElements.chatContainer).prepend(response.comments); 
         if(!response.showLoadMore){
            $(domElements.loadPreviousComment).hide();            
        }

    }


});
})


})();
