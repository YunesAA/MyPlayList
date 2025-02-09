function getSong() {



    let songTitle = document.getElementById('songTitleTextField').value.trim();
    console.log('songTitle: ' + songTitle);
    if(songTitle === '') {
        return alert('Please enter a Song Title');
    }
  
    let songsDiv = document.getElementById('songs_div');
    songsDiv.innerHTML = '';
  
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {

            document.getElementById('Title').style.display = 'none' //none or block
            document.getElementById('songTitleTextField').style.display = 'none' //none or block
            document.getElementById('submit_button').style.display = 'none' //none or block

            let response = JSON.parse(xhr.responseText);
            let htmlContent = `<h2>Press the song's picture to add to favorites <br></br></br> </h2>`;
            
            // Loop through each song and show information about each one
            response.results.forEach(song => {
                htmlContent += `
                    <div class="song text-center" style="width: 100%;">
                        <div class="wrapper" style="display: inline-block;">
                            <a href="/song/${song.trackId}">
                                <img src="${song.artworkUrl100}" style=" height: auto; display: block; margin-left: auto; margin-right: auto;">
                            </a><br>
                            <p>${song.trackName} by ${song.artistName}</p>
                            <br><br><br>

                        </div>
                    </div>
                `;
            });
            
  
            songsDiv.innerHTML = htmlContent;
        }
    };
    xhr.open('GET', `/songs?title=${songTitle}`, true);
    xhr.send();
  }
  
  //Attach Enter-key Handler
  const ENTER=13;
  
  function handleKeyUp(event) {
      event.preventDefault();
      if (event.keyCode === ENTER) {
          document.getElementById("submit_button").click();
      }
  }
  
  document.addEventListener('DOMContentLoaded', function() {
      document.getElementById('submit_button').addEventListener('click', getSong);
  
      //add key handler for the document as a whole, not separate elements.
      document.addEventListener('keyup', handleKeyUp);
  });
