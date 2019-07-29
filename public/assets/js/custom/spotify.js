(function($) {
    // when search is entered, search spotify api and return results on the page so user can add to playlists or view more detail
    $(document).on('click', '#search-that-info', function(e) {
        e.preventDefault();
        console.log('search info');
        var data = {
            info: $('#search-result-bar').val()
        }
        // console.log(data);
        $.ajax({
          method: "POST",
          url: "/spotify-search",
          data: data
          // then log it and empty the input box
        }).done(function(data) {
          $('#search-result').removeClass('hide');
          console.log(data);
          var html = `
    
          `;

          if(data.statusCode === 401) {
            //   console.log('tell jason to refresh the token');
              html += `<div>Tell Jason to refresh the token!</div>`;
          }else {
            for(var i = 0; i < data.items.length; i++) {
                html += `
                <div class="col-xs-12 ${data.items[i].id}">
                  <div class="item r" data-id="item-5" data-src="http://streaming.radionomy.com/JamendoLounge">
                    <div class="item-media ">
                      <a href="track.detail.html" class="item-media-content" style="background-image: url(${data.items[i].album.images[0].url});"></a>
                    </div>
                    <div class="item-info">
                      <div class="item-title text-ellipsis">
                        <a href="track.detail.html">${data.items[i].name}</a>
                      </div>
                      <div class="item-author text-sm text-ellipsis ">
                        <a href="artist.detail.html" class="text-muted">${data.items[i].artists[0].name}</a>
                      </div>
                      <div class="item-action m-b" style="margin-top: 10px;">
                        <span spotify-song-id='${data.items[i].id}' class="btn btn-sm rounded primary add-to-playlist">Add to playlist</span>
                      </div>
                      <div class="item-meta text-sm text-muted">
                          </div>
                    </div>
                  </div>
                </div>
                `;
              }
          }
    
          $('#song-results').html(html);
        })
      });
    
    
    
      // when users click add to playlist button, send the song id to spotify api to add to our playlist
      $(document).on('click', '.add-to-playlist', function(e) {
        e.preventDefault();
        console.log('add to playlist');
        var data = {
            info: $(this).attr('spotify-song-id')
        }
        // console.log(data);
    
        $.ajax({
          method: "POST",
          url: "/spotify-add-to-playlist",
          data: data
        }).done(function(data) {
            console.log(data);
            $('.' + data).find('.add-to-playlist').text('Added!');
        })
      });


      // when users click add to playlist button, send the song id to spotify api to add to our playlist
      $(document).on('click', '.delete-this-song', function(e) {
        e.preventDefault();
        console.log('remove from playlist');
        var data = {
            info: $(this).attr('data-spotify-id')
        }
        console.log(data);
    
        $('.remove-from-playlist').attr('data-spotify-id', data.info);
      });

      // when users click add to playlist button, send the song id to spotify api to add to our playlist
      $(document).on('click', '.remove-from-playlist', function(e) {
        e.preventDefault();
        console.log('remove from playlist');
        var data = {
            info: $(this).attr('data-spotify-id')
        }
        console.log(data);
    
        $.ajax({
          method: "POST",
          url: "/remove-from-playlist",
          data: data
        }).done(function(data) {
            console.log('our data')
            console.log(data);
            $('.' + data).hide();
        //   window.location.href = window.location.href;
        })
      });


      //make api call to get current playing song info
      setInterval(function(){
        $.ajax({
            method: "GET",
            url: "/currently-playing"
          }).done(function(data) {
              console.log('our data');
              console.log(data);
            //   console.log(Object.keys(data).length);
              if(Object.keys(data).length === 0) { // if no song is paying
                $('.mejs-track-title a').text('no song is currently playing');
                $('.mejs-track-author a').text('');
              } else { // if song is playing
                //   $('.' + data).hide();
                $('.mejs-track-title a').text(data.item.name);
                $('.mejs-track-author a').text(data.item.artists[0].name);
                $('.mejs-track-artwork').css('background-image', 'url(' + data.item.album.images[0].url + ')')
                var millisToMinutesAndSeconds = function (millis) {
                    var minutes = Math.floor(millis / 60000);
                    var seconds = ((millis % 60000) / 1000).toFixed(0);
                    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
                }
                $('.mejs-currenttime').text(millisToMinutesAndSeconds(data.progress_ms));
                $('.mejs-duration').text(millisToMinutesAndSeconds(data.item.duration_ms));
                var totalSongTime = data.item.duration_ms;
                var currentSongTime = data.progress_ms;
                var percentPlayed = (currentSongTime / totalSongTime) * 100;
                console.log(percentPlayed);
                // $('.mejs-time-rail').css({'background': 'red'});
                // $('.mejs-time-rail').css({'width': percentPlayed + '% !important'});
                $('.mejs-time-rail').attr('style', 'width: '+ percentPlayed +'% !important');
                $('.mejs-time-rail').css({'background': '#02b875'});
                $('.btn-favorite.mejs-like-button').attr('data-spotify-song-title', data.item.name);
                $('.btn-favorite.mejs-like-button').attr('data-spotify-track-id', data.item.id);
                $('.btn-favorite.mejs-like-button').attr('data-spotify-image', data.item.album.images[0].url);
                // title: $(this).attr('data-spotify-song-title'),
                // songID: $(this).attr('data-spotify-track-id'),
                image: $(this).attr('data-spotify-image')
                // $('.mejs-shuffle-button, .mejs-repeat-button, .mejs-volume-button, .mejs-playpause-button, .mejs-previous-button, .mejs-next-button').hide();

                // $('.mejs-time-rail').css("width: " + percentPlayed + "% !important;");
                // $('.mejs-time-rail').width(percentPlayed);

            //   window.location.href = window.location.href;
              }

          })          
      }, 5000);

      $('.mejs-button').hide();





      // when users click add to playlist button, send the song id to spotify api to add to our playlist
      $(document).on('click', '.btn-favorite', function(e) {
        e.preventDefault();
        console.log('liked song!');
        var data = {
            title: $(this).attr('data-spotify-song-title'),
            songID: $(this).attr('data-spotify-track-id'),
            image: $(this).attr('data-spotify-image')
        }
    
        $.ajax({
          method: "POST",
          url: "/like-song",
          data: data
        }).done(function(data) {
            console.log('our data')
            console.log(data);
            // $('.' + data).hide();
        //   window.location.href = window.location.href;
        });

        var dbId = $(this).data('dbid');
        var data = {
            user: $('#app').data('dbid'),
            title: $(this).attr('data-spotify-song-title'),
            songID: $(this).attr('data-spotify-track-id'),
            image: $(this).attr('data-spotify-image')
        }
        // grab id from data attr, use ajax post method to send comment from text-input val to the article
        $.ajax({
            method: "POST",
            url: "/like-song-by-user",
            data: data
            // then log it and empty the input box
            }).done(function(data) {
            console.log(data);
            // $(this).html("Comment Saved")
        });
      });

      //make api call to get current playing song info
      setInterval(function(){
        $.ajax({
            method: "GET",
            url: "/lastestLikedSongs"
          }).done(function(data) {
              console.log('our data');
              console.log(data);
          })
      }, 5000);


      setTimeout(function() {
        var dbId = $('#app').data('dbid');
        //   $("#comment-input").val('');
          $.ajax({
            method: "GET",
            url: "/liked-songs/" + dbId
            // then, populate title, empty commend display root, add dbid attr to save comment button based on article dbid
            // then, if no comments exists, populate no comments message. if comments exists, populate a card for each comment
          }).done(function(data){
            console.log(data);

            var html = '';

            for(var i = 0; i < data.likedSongs.length; i++) {
                var createdAt = moment(data.likedSongs[i].createdAt).fromNow();
                html += `
                    <div class="col-xs-4 col-sm-4 col-md-3">
                        <div class="item r" data-id="item-10" data-src="http://api.soundcloud.com/tracks/237514750/stream?client_id=a10d44d431ad52868f1bce6d36f5234c">
                            <div class="item-media ">
                                <a href="track.detail.html" class="item-media-content" style="background-image: url(${data.likedSongs[i].image});"></a>
                            </div>
                            <div class="item-info">
                                <div class="item-title text-ellipsis">
                                    <a href="track.detail.html">${data.likedSongs[i].title}</a>
                                </div>
                                <div class="item-title text-ellipsis">
                                    <a href="track.detail.html">Liked ${createdAt}</a>
                                </div>
                                <div class="item-author text-sm text-ellipsis hide">
                                    <a href="artist.detail.html" class="text-muted">Postiljonen</a>
                                </div>
                                <div class="item-meta text-sm text-muted">
                                </div>
                            </div>
                        </div>
                    </div>
                `
            }
            $('#liked-song-count').text(data.likedSongs.length);
            $('#liked-songs-profile').append(html);
          });
      }, 3000);




  })(jQuery);
  
  

  
  
    