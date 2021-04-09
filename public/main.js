



function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/loginGG');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
    console.log('Signed in as: ' + xhr.responseText);
    if(xhr.responseText=="success"){
        signOut();
        location.assign('/')
    }
    else 
    { 
        signOut();
        console.log("da vao day");
        location.assign('/login')
        
    }

    };
    xhr.send(JSON.stringify({token:id_token}));
}

function signOut() {
var auth2 = gapi.auth2.getAuthInstance();
auth2.signOut().then(function () {
console.log('User signed out.');
});
}


$(document).ready(function(){
    // hàm dùng đẻ tạo nhiều attribute trong 1 lần 
    function setAttributes(el, attrs) {
        for(var key in attrs) {
          el.setAttribute(key, attrs[key]);
        }
      }

    $("#btnPosted").click((e)=>{
        
        e.preventDefault();
        
        var nameUser =document.getElementById("recipient-name").value
        // đây là ảnh đại diện của người dùng đang đăng bài
        var hiddenPicture = document.getElementById("hiddenPicture").value
        // dòng 119 index.ejs
        var messageText= document.getElementById("message-text").value
        var hiddenEmailOfPost= document.getElementById("hiddenEmailOfPost").value
        
        var inputImage = document.getElementById("image_uploads") 
       
        // ảnh người dùng đăng lên
        var file = inputImage.files;
        var formData = new FormData();
        formData.append("nameUser",nameUser)
        formData.append("hiddenPicture",hiddenPicture)
        formData.append("messageText",messageText)
        formData.append("hiddenEmailOfPost",hiddenEmailOfPost)
        //formData.append("file",$("#image_uploads")[0].files[0]) single upload
        for (var i =0;i<=file.length;i++){
          formData.append("file",file[i])
        }
        for (var value of formData.values()) {
            console.log("value",value);
        }

        $('#myModal').hide();
        $('.modal-backdrop').hide();
        $.ajax({
            url: 'http://localhost:3000/insertPost/',
            type: 'POST',
            dataType: 'JSON',
            enctype:"multipart/form-data",
            contentType: false,
            processData: false,
            data: formData
        }).done(function(ketqua) {

            console.log("ketqua",ketqua.data);
            if(ketqua.code===0){
                console.log(" da vao day ");
                var parentMedia = document.getElementById("parentMedia")
                var parentMediaBody= document.getElementById("parentMediaBody")
                var imageUser = document.createElement("img")
                //set ảnh đại diện
                setAttributes(imageUser,{"src":ketqua.data.imageUser,"class":"rounded-circle mr-3","width":"56", "height":"56"})
                parentMedia.appendChild(imageUser)

                // thiết lập bên trong của thẻ media-body
                //thời gian tạo bài viết
                // tên người đăng mới
                var ptag= document.createElement("p")
                setAttributes(ptag,{"class":"mb-2", "id":"parentOfStrong"})
            
                var strongTag = document.createElement("strong")
                var node = document.createTextNode(ketqua.data.name);
              
                strongTag.appendChild(node)
                ptag.appendChild(strongTag)
                parentMediaBody.appendChild(ptag)
                // mess mới đăng
                var p2 = document.createElement("p")
                var nodeMess = document.createTextNode(ketqua.data.message);
                p2.appendChild(nodeMess)
                parentMediaBody.appendChild(p2)
                
                // hình ảnh sau khi đăng 127
                imageRecieveFromServer = JSON.parse(ketqua.data.image)
                console.log("imageRecieveFromServer",imageRecieveFromServer);
                var divTagsubParentImage =document.createElement("div")
                setAttributes(divTagsubParentImage,{"class":"row no-gutters mt-1"})
                for(var i=0;i<imageRecieveFromServer.length;i++){
                    var divTagChild= document.createElement("div")
                    setAttributes(divTagChild,{"class":"col-6"})
                    var imageUpload= document.createElement("img")
                    setAttributes(imageUpload,{"src":imageRecieveFromServer[i],"class":"img-fluid pr-1"})
                    divTagChild.appendChild(imageUpload)
                    divTagsubParentImage.appendChild(divTagChild)
                    parentMediaBody.appendChild(divTagsubParentImage)
                    }
                    
                //thời gian tạo bài đăng
                var smallTag = document.createElement("small")
                setAttributes(smallTag,{"class":"text-muted"})
                var nodeSmallTimeCreate = document.createTextNode("now")
                smallTag.appendChild(nodeSmallTimeCreate)
                parentMediaBody.appendChild(smallTag)

                var br = document.createElement("br")
                parentMediaBody.appendChild(br)
                //nút like 
                var aTag = document.createElement("a")
                var nodeATag = document.createTextNode("Like")
                setAttributes(aTag,{"href":"#","class":"btn btn-sm btn-danger mt-1"})
                var iTagIconLike = document.createElement("i")
                setAttributes(iTagIconLike,{"class":"fa fa-heart-o"})
          
                aTag.appendChild(iTagIconLike)
                aTag.appendChild(nodeATag)
                parentMediaBody.appendChild(aTag)
                
                //dòng bình luận
                /*var mediaComment= document.getElementById("mediaComment")
                var aTagComment = document.createElement("a")
                setAttributes(aTagComment,{"class":"pr-2", "href":"#"})
                var imageUserInComment= document.createElement("img")
                setAttributes(imageUserInComment,{"src":"" width="36" height="36" class="rounded-circle mr-2" alt="Stacie Hall"})
                
                var divTag= document.createElement("div")
                setAttributes(divTag,{"class":"media-body"})*/

                // khung binh luận
                var hr = document.createElement("hr")
                parentMediaBody.appendChild(hr)
                
                //div nay dòng 164
                //div nayf div tổng chir đưng sau parentMediaBody
                var divTagParent= document.createElement("div")
                setAttributes(divTagParent,{"class":"row"})
                var divTagsubParent= document.createElement("div")
                setAttributes(divTagsubParent,{"class":"col-auto"})

                //div dòng 168
                var divTag= document.createElement("div")
                setAttributes(divTag,{"class":"avatar avatar-sm"})
                var imageUserInComment = document.createElement("img")
                //set ảnh đại diện  trong comment
                setAttributes(imageUserInComment,{"src":ketqua.data.imageUser,"class":"rounded-circle mr-2","width":"36", "height":"36"})
                divTag.appendChild(imageUserInComment)
                divTagsubParent.appendChild(divTag)
                divTagParent.appendChild(divTagsubParent)
                parentMediaBody.appendChild(divTagParent)

                // set khung input nhập comment
                //div dòng 173
                var divTagsubParentCommentInput= document.createElement("div")
                setAttributes(divTagsubParentCommentInput,{"class":"col ml-n2"})
                var formInputComment= document.createElement("form")
                setAttributes(formInputComment,{"class":"mt-1"})
                var label= document.createElement("label")
                setAttributes(label,{"class":"sr-only"})
                var nodeTextLabel = document.createTextNode("Leave a commnent")
                var textareaCommentInput= document.createElement("textarea")
                setAttributes(textareaCommentInput,{"class":"form-control form-control-flush", "data-toggle":"autosize", "rows":"1", "placeholder":"Leave a comment","id":"styleInputComment"})
                
                label.appendChild(nodeTextLabel)
                formInputComment.appendChild(label)
                formInputComment.appendChild(textareaCommentInput)
                divTagsubParentCommentInput.appendChild(formInputComment)
                divTagParent.appendChild(divTagsubParentCommentInput)
                parentMediaBody.appendChild(divTagParent)

                //div dòng 184
                var divTagsubParentIconComment= document.createElement("div")
                setAttributes(divTagsubParentIconComment,{"class":"col-auto align-self-end"})
                var divtagicon= document.createElement("div")
                setAttributes(divtagicon,{"class":"input-container mb-2"})
                // icon mays anhr
                var aTagIconCamera = document.createElement("a")
                setAttributes(aTagIconCamera,{"class":"text-reset mr-3", "href":"#!", "type":"file", "data-toggle":"tooltip" ,"title":"", "data-original-title":"Add photo"})
                var iTagIconCamera= document.createElement("i")
                setAttributes(iTagIconCamera,{"class":"fa fa-camera"})
                
                aTagIconCamera.appendChild(iTagIconCamera)
                // icon kẹp giaays
                var aTagIconPaperclip = document.createElement("a")
                setAttributes(aTagIconPaperclip,{"class":"text-reset mr-3", "href":"#!",  "data-toggle":"tooltip" ,"title":"", "data-original-title":"Attach file"})
                var iTagIconPaperclip= document.createElement("i")
                setAttributes(iTagIconPaperclip,{"class":"fa fa-paperclip"})
                aTagIconPaperclip.appendChild(iTagIconPaperclip)
                
                divtagicon.appendChild(aTagIconCamera)
                divtagicon.appendChild(aTagIconPaperclip)
                divTagsubParentIconComment.appendChild(divtagicon)
                divTagParent.appendChild(divTagsubParentIconComment)
                parentMediaBody.appendChild(divTagParent)


                parentMedia.appendChild(parentMediaBody)
        
            }
        });
        
    });

    $(".btnDelete").click(e=>{
      e.preventDefault();
      $("#confirmDelete").modal("show")
      var btn = e.target
      var id=btn.dataset.id
      $("#modalBtnDelete").attr('data-id',id)
      //console.log(id);

    
    })
    $("#modalBtnDelete").click(e=>{
      $("#confirmDelete").modal("hide")
      
      var btn = e.target
      var id=btn.dataset.id
     // console.log(id);
    $.ajax({
      url: 'http://localhost:3000/deletePost',
      type: 'POST',
      data: {
        id:JSON.stringify(id)
      }
     }).done(function(ketqua) {
          if(ketqua.code===0){
            console.log(ketqua.data.id);
            document.getElementById(ketqua.data.id).remove()
          }
      })
    })

$('.btnUpdate').click(e=>{
  var btn = e.target
  console.log(e);
  var id = btn.dataset.id
  var name= btn.dataset.name
  var imageUser = btn.dataset.imageuser// chỗ này nếu truyền vào imageUser thì trong targer cũng thành imageuser
  var message = btn.dataset.message
  
  $("#recipient-name").val(name)
  $("#message-text").html(message)
  $("#btnChange").attr("data-id", id)
  $("#btnChange").attr("data-imageuser",imageUser )
})


$("#btnChange").click(e=>{
  var btn = e.target
  var id = btn.dataset.id
  //var imageUser = btn.dataset.imageuser
  //var name=document.getElementById("recipient-name").value
  var message=document.getElementById("message-text").value
  //console.log( message, id);
  var inputImage = document.getElementById("image_uploads")    
        // ảnh người dùng update lên
  var file = inputImage.files;
  var formData = new FormData();
  formData.append("message",message)
  formData.append("id",id)
  for (var i =0;i<=file.length;i++){
    formData.append("file",file[i])
  }
  for (var value of formData.values()) {
      console.log("value",value);
  }

  $('#myModal').hide();
  $('.modal-backdrop').hide();
  $.ajax({
    url: 'http://localhost:3000/updatePost',
    type: 'POST',
    dataType: 'JSON',
    enctype:"multipart/form-data",
    contentType: false,
    processData: false,
    data: formData
  
}).done(ketqua=>{
  if(ketqua.code===0){
    updatedMessage = ketqua.data.message
    updatedImage= ketqua.data.image
    id= ketqua.data.id
    //console.log(id,updatedMessage, updatedImage);
    document.getElementsByClassName(id)[1].remove()
    // vì class có thể lấy nhiều nên sẽ tạo thành mảng và lấy cái đầu tiên vì trong mảng chỉ có 1 phần tử giống id truyền vào
    var divParentOfcontentUpdate= document.getElementsByClassName(id)[0]
    //console.log("divParentOfcontentUpdate",divParentOfcontentUpdate);
      // mess mới update
 
    var divId = document.createElement("div")// div này dùng để remove() nếu cập nhật lại lần nữa
    setAttributes(divId,{"id":id})
    var p2 = document.createElement("p")
    var nodeMess = document.createTextNode(updatedMessage);
    p2.appendChild(nodeMess)
    divId.appendChild(p2)
    divParentOfcontentUpdate.appendChild(divId)

    //hình ảnh sau khi update
   
    //console.log("imageRecieveFromServer",updatedImage);
    var divTagsubParentImage =document.createElement("div")
    setAttributes(divTagsubParentImage,{"class":"row no-gutters mt-1"})
    for(var i=0;i<updatedImage.length;i++){
        var divTagChild= document.createElement("div")
        setAttributes(divTagChild,{"class":"col-6"})
        var imageUpload= document.createElement("img")
        setAttributes(imageUpload,{"src":updatedImage[i],"class":"img-fluid pr-1"})
        divTagChild.appendChild(imageUpload)
        divTagsubParentImage.appendChild(divTagChild)
        divId.appendChild(divTagsubParentImage)
    
        }
            // thời gian cập nhật 
        var smallTag = document.createElement("small")
        setAttributes(smallTag,{"class":"text-muted"})
        var nodeSmallTimeCreate = document.createTextNode("now")
        smallTag.appendChild(nodeSmallTimeCreate)
        divId.appendChild(smallTag)
        var br = document.createElement("br")
        divId.appendChild(br)
  }
    

})
})

$(".classComment").keyup(event=>{
  //console.log(event);
  if (event.keyCode === 13) {
    event.preventDefault();
    var comment 
   var contentComment= document.getElementsByClassName("classComment")
   var btn = event.target
   var id = btn.dataset.id
   console.log(id);
  for ( var i =0;i <contentComment.length;i++){
    if(contentComment[i].value!==""){
     comment=contentComment[i].value
  
     var imageUserComment = document.getElementById("hiddenPicture").value
     var emailUserComment = document.getElementById("hiddenEmailOfPost").value
     var nameUserComment = document.getElementById("hiddenFullname").value
     //console.log(comment,imageUserComment,nameUserComment,emailUserComment);
     
     var data={
      id:id,
      imageUserComment:imageUserComment,
      emailUserComment:emailUserComment,
      nameUserComment:nameUserComment,
      comment:comment
     }
    // comment=contentComment[i].textContent=""
     $.ajax({
      url: 'http://localhost:3000/commentPost',
      type: 'POST',
      dataType: 'JSON',
      data:data
    
      }).done(ketqua=>{
        if(ketqua.code===0){
          var imageUserCommentFS= ketqua.data.imageUserComment
          var nameUserCommentFS= ketqua.data.nameUserComment
          var content= ketqua.data.content
          var id = ketqua.data.id
          console.log(imageUserCommentFS,nameUserCommentFS,content);
          
          // ảnh đại diện của người comment
         
          var parentDiv = document.getElementById(id)
          var divComment= document.createElement("div")
          setAttributes(divComment,{"class":"media mt3"})
          var aTag = document.createElement("a")
          setAttributes(aTag,{"class":"pr-2"})
          var pictureComment=document.createElement("img")
          setAttributes(pictureComment,{"src":imageUserCommentFS,"width":"36", "height":"36", "class":"rounded-circle mr-2"})
          aTag.appendChild(pictureComment)
          divComment.appendChild(aTag)
          parentDiv.appendChild(document.createElement("br"))
         

          // nội dung tin comment
          var divOfComment = document.createElement("div")
          setAttributes(divOfComment,{"class":"media-body"})
          var pTagOfcomment = document.createElement("p")
          setAttributes(pTagOfcomment,{"class":"text-muted"})
          var nodeContentComment = document.createTextNode(content)
         // console.log("nodeContentComment",nodeContentComment);
          var strongOfP = document.createElement("strong")
          var nodeStrongOfP = document.createTextNode(nameUserCommentFS)
          strongOfP.appendChild(nodeStrongOfP)
          pTagOfcomment.appendChild(strongOfP)
          pTagOfcomment.appendChild(document.createTextNode(": "))
          pTagOfcomment.appendChild(nodeContentComment)
        
          // đây là div của phần name và content
          divOfComment.appendChild(pTagOfcomment)
          // đây là div tổng của toàn bộ phần comment 
          divComment.appendChild(divOfComment)


          parentDiv.appendChild(divComment)

        }
      })

  }

 
   } 
  }
})

    $(function () {
        'use strict'
  
        $('[data-toggle="offcanvas"]').on('click', function () {
          $('.offcanvas-collapse').toggleClass('open')
        })
      })
  
    /*$('#my-button').click(function(){
        $('#my-file').click();
    });*/


})
