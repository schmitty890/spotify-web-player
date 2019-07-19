$(document).ready(function(){

    $(".date").flatpickr({
        enableTime: true,
        dateFormat: "Y-m-d"
    });


    // when update user is clicked, update property to db
    $(document).on('click', '#update-user', function(e) {
        e.preventDefault();
        console.log('update user');
        const dbId = $(this).data('dbid');
        console.log(dbId);


        const data = {
            adminVerified: $('#update-user-admin-verified').is(":checked"),
            rentAmount: $('#update-user-rent-amount').val(),
            unitNumber: $('#update-user-property-number').val(),
            leaseStart: $('#update-user-lease-start').val(),
            leaseEnd: $('#update-user-lease-end').val(),
            isAdmin: $('#update-user-is-admin').is(':checked'),
            paid: $('#update-user-paid').is(':checked')
        }
        // grab id from data attr, use ajax post method to send comment from text-input val to the article
        $.ajax({
            method: "PUT",
            url: "/my-tenants/" + dbId,
            data: data
            // then log it and empty the input box
        }).done(function(data) {
            console.log(data);
            var html = `
                <div class="alert alert-success"  role="alert">
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    User update saved!
                </div>
            `;
            // TODO: clear form input fields

            // show user confirmation property has been submitted
            $('#update-user-alert-message').append(html);
        });
    });





    // when admin user is clicks send email to tentant, send the subject and message to the tentants email
    $(document).on('click', '#my-tentants-details-email-send-message', function(e) {
        e.preventDefault();
        console.log('send email to tentant');

        const data = {
            tentantEmail: $(this).attr('data-tentant-email'),
            subject: $('#my-tentants-details-email-subject').val(),
            message: $('#my-tentants-details-email-message').val()
        }
        var html = `
            <div class="alert alert-info" role="alert">
                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                Sending email to ${data.tentantEmail}...
            </div>
        `;
        $('#update-admin-alert-message').append(html);
        console.log(data);
        $.ajax({
            method: "POST",
            url: "/my-tentants-detail-email-message",
            data: data
        }).done(function(resp) {
            console.log(resp);
            $('#update-admin-alert-message').html('');
            var html = `
                <div class="alert alert-success"  role="alert">
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    Email sent to ${data.tentantEmail}!
                </div>
            `;
            // TODO: clear form input fields

            // show user confirmation property has been submitted
            $('#update-admin-alert-message').append(html);
        });
    });





    // when admin user is clicks add note about tentant, save the note to the tentant model in our db
    $(document).on('click', '#my-tentants-details-note-add', function(e) {
        e.preventDefault();
        console.log('save note about tentant');
        const tentantId = $(this).attr('data-dbid');
        const data = {
            subject: $('#my-tentants-details-note-subject').val(),
            message: $('#my-tentants-details-note-message').val()
        }
        // console.log(data);
        $.ajax({
            method: "POST",
            url: "/my-tentants-detail-note/" + tentantId,
            data: data
        }).done(function(resp) {
            console.log(resp);
            $('#update-admin-alert-message').html('');
            var html = `
                <div class="alert alert-success"  role="alert">
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    Your note has been saved!
                </div>
            `;
            // TODO: clear form input fields

            // show user confirmation property has been submitted
            $('#update-admin-alert-message-note').append(html);
            location.reload();
        });
    });


    

  // when view comments is clicked, pull in comments from db with ajax get req to articles/_id
  $(document).on('click', '.get-notes', function(e) {
    //   e.preventDefault();
    var dbId = $('#my-tentants-details-note-add').data('dbid');
    // $("#comment-input").val('');
    $.ajax({
      method: "GET",
      url: "/my-tentants-detail-note/" + dbId
      // then, populate title, empty commend display root, add dbid attr to save comment button based on article dbid
      // then, if no comments exists, populate no comments message. if comments exists, populate a card for each comment
    }).done(function(data){
    //   console.log(data.notes);
      var notes = data.notes.reverse();
      if (data.notes.length === 0) { // if no notes, say no notes have been posted
        $('#my-tentants-notes-section').html("No notes about this tentant yet!");
      } else { // else make notes section from whats returned from db
        for (var i = 0; i < notes.length; i++) {
            var timeFromNow = moment(notes[i].createdAt).fromNow();
          var newNote = `
            <div class="media">
                <div class="media-body">
                    <h3 class="media-heading">${notes[i].subject} <i class="delete-note delete fa fa-trash-o" data-dbid="${notes[i]._id}"></i></h3>
                    <span style="font-size: 10px;">${timeFromNow}</span>
                    <p>${notes[i].message}</p>
                </div>
            </div>
          `;
          $('#my-tentants-notes-section').append(newNote);
        }
      }
    });
  });


  // when delete note icon is clicked, remove the note from the db
  $(document).on('click', '.delete-note', function() {
    var dbId = $(this).data('dbid');
    // console.log(dbId);
    $.ajax({
      method: "DELETE",
      url: "/my-tentants-detail-note/" + dbId
    }).done(function(data) {
      console.log(data);
      location.reload();
    })
  });



  // when save comment is clicked, add comment to db
//   $(document).on('click', '.save-comment-button', function() {
//     var dbId = $(this).data('dbid');
//     // grab id from data attr, use ajax post method to send comment from text-input val to the article
//     $.ajax({
//       method: "POST",
//       url: "/articles/" + dbId,
//       data: {
//         body: $("#comment-input").val()
//       }
//       // then log it and empty the input box
//     }).done(function(data) {
//       console.log(data);
//       $(this).html("Comment Saved")
//     })
//   });






});