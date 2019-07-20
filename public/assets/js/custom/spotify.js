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
                        <span class="btn btn-sm rounded white">More info</span>
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
  })(jQuery);
  
  

  
  
    