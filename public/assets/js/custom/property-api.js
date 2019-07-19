$(document).ready(function(){
  
    // $(document).on('click', '.save-article-button', function() {
    //   // grab _id from saved data attribute
    //   var dbId = $(this).data('dbid');
    //   // ajax put method to articles/_id
    //   // send data { saved: true } back
    //   $.ajax({
    //     method: "PUT",
    //     url: "/articles/" + dbId,
    //     data: { saved: true }
    //     // when done, log it
    //   }).done(function(data) {
    //     console.log(data);
    //   });
    //   // update button html to article saved
    //   $(this).html("Article saved");
    // });
    
    // when delete from saved is clicked, update db to change saved to false
    
    // $(document).on('click', '.delete-from-saved-button', function() {
    //   var dbId = $(this).data('dbid');
    //   // ajax put method to articles/_id
    //   // send data { saved: false } back
    //   $.ajax({
    //     method: "PUT",
    //     url: "/articles/" + dbId,
    //     data: { saved: false }
    //   }).done(function(data) {
    //     // when done, reload page so article is removed from saved page
    //     location.reload();
    //   })
    // });
  
    // when view comments is clicked, pull in comments from db with ajax get req to articles/_id
    // $(document).on('click', '.view-comments-button', function() {
    //   var dbId = $(this).data('dbid');
    //   $("#comment-input").val('');
    //   $.ajax({
    //     method: "GET",
    //     url: "/articles/" + dbId
    //     // then, populate title, empty commend display root, add dbid attr to save comment button based on article dbid
    //     // then, if no comments exists, populate no comments message. if comments exists, populate a card for each comment
    //   }).done(function(data){
    //     console.log(data);
    //     $('.modal-title').html(data.title);
    //     $('.comment-display-root').empty();
    //     $('.save-comment-button').data('dbid', data._id);
    //     if (data.comments.length === 0) {
    //       $('.comment-display-root').html("No comments yet. Be the first to comment!");
    //     } else {
    //       for (var i = 0; i < data.comments.length; i++) {
    //         var newCard = 
    //           "<div class='card blue-grey darken-1'><div class='card-content white-text valign-wrapper'><p class='col s11 left-align'>" 
    //           + data.comments[i].body + "</p><button class='col s1 btn delete-comment-button' data-dbid='" + data.comments[i]._id + "'>X</button></div></div>";
    //         $('.comment-display-root').prepend(newCard);
    //       }
    //     }
    //   });
    // });
  
    // when save property is clicked, add property to db
    $(document).on('click', '#save-property-button', function(e) {
        e.preventDefault();
        console.log('save property');
    //   var dbId = $(this).data('dbid');
    var data = {
        address: $('#address').val(),
        propertyNumber: $('#property-number').val(),
        price: $('#property-price').val()
    }
    //   // grab id from data attr, use ajax post method to send comment from text-input val to the article
      $.ajax({
        method: "POST",
        url: "/submit-property",
        data: data
        // then log it and empty the input box
      }).done(function(data) {
        console.log(data);
        var html = `
            <div class="alert alert-success"  role="alert">
                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <strong>Well done!</strong> Property saved!
            </div>
        `;
        // TODO: clear form input fields

        // show user confirmation property has been submitted
        $('#submit-property-alert').append(html);
      })
    });

    // when edit property is clicked, take dbid and append as route to my-properties to edit property
    $(document).on('click', '.edit', function(e) {
        e.preventDefault();
        var dbId = $(this).data('dbid');
        console.log('edit property');
        console.log(dbId);
        window.location = `/edit-property/${dbId}`;
    });

    // when update property is clicked, update property to db
    $(document).on('click', '#update-property-button', function(e) {
        e.preventDefault();
        console.log('update property');
        var dbId = $(this).attr('dbid');
        //   console.log(dbId);
        var data = {
            address: $('#address').val(),
            propertyNumber: $('#property-number').val(),
            price: $('#property-price').val()
        }
    //   // grab id from data attr, use ajax post method to send comment from text-input val to the article
      $.ajax({
        method: "PUT",
        url: "/edit-property/" + dbId,
        data: data
        // then log it and empty the input box
      }).done(function(data) {
        console.log(data);
        var html = `
            <div class="alert alert-success"  role="alert">
                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <strong>Well done!</strong> Property saved!
            </div>
        `;
        // TODO: clear form input fields

        // show user confirmation property has been submitted
        $('#submit-property-alert').append(html);
      })
    });

    // when delete property button is clicked, remove the property from the db
    $(document).on('click', '.delete-property', function(e) {
        e.preventDefault();
      var dbId = $(this).data('dbid');
      console.log(dbId);
      $.ajax({
        method: "DELETE",
        url: "edit-property/" + dbId
      }).done(function(data) {
        console.log(data);
        location.reload();
      })
    });

  });