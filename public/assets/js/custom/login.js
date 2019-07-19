// when save comment is clicked, add comment to db
$(document).on('click', '#login', function() {
  // console.log('story-post save clicked');
  // grab id from data attr, use ajax post method to send comment from text-input val to the article
  $.ajax({
    method: "POST",
    url: "/login",
    data: {
      email: $("#email").val(),
      password: $("#password").val()
    }
    // then log it and empty the input box
  }).done(function(data) {
    console.log(data);
    window.location = '/';
    // $(this).html("Comment Saved")
  })
});
