document.addEventListener('DOMContentLoaded', () => {
  const songItems = document.querySelectorAll('.song-item');
  const artistsSection = document.querySelector('.artists');
  const audioPlayer = document.getElementById('audio-player');
  const currentPoster = document.getElementById('current-poster');
  const currentTitle = document.getElementById('current-title');
  const currentSinger = document.getElementById('current-singer');
  const playPauseButton = document.getElementById('play-pause-button');
  const progressBar = document.getElementById('progress-bar');
  const prevButton = document.getElementById('prev-button');
  const nextButton = document.getElementById('next-button');

  const leftSidebar = document.querySelector('.left');
  const closeLeftSidebarButton = document.getElementById('close-left-sidebar');
  const homeButton = document.getElementById('home-button');

  let currentSongIndex = 0;
  const songs = Array.from(songItems).map(item => ({
    audio: item.getAttribute('data-audio'),
    poster: item.getAttribute('data-poster'),
    title: item.getAttribute('data-title'),
    singer: item.getAttribute('data-singer')
  }));

  const loadSong = (index) => {
    const song = songs[index];
    audioPlayer.src = song.audio;
    currentPoster.src = song.poster;
    currentTitle.textContent = song.title;
    currentSinger.textContent = song.singer;
    audioPlayer.play();
    playPauseButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
   

    localStorage.setItem('currentSong', JSON.stringify({
      audio: song.audio,
      poster: song.poster,
      title: song.title,
      singer: song.singer,
      currentTime: audioPlayer.currentTime,
      isPlaying: true,
      artistsVisible: true
    }));
  };


  const loadCurrentSongFromLocalStorage = () => {
    const currentSong = JSON.parse(localStorage.getItem('currentSong'));
    if (currentSong) {
      audioPlayer.src = currentSong.audio;
      currentPoster.src = currentSong.poster;
      currentTitle.textContent = currentSong.title;
      currentSinger.textContent = currentSong.singer;
      audioPlayer.currentTime = currentSong.currentTime;
      if (currentSong.isPlaying) {
        audioPlayer.play();
        playPauseButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
      } else {
        playPauseButton.innerHTML = '<i class="fa-solid fa-play"></i>';
      }
      if (currentSong.artistsVisible) {
        leftSidebar.classList.add('show-menu');
      }
      currentSongIndex = songs.findIndex(song => song.audio === currentSong.audio);
    }
  };

  const deleteSong = (index) => {
    const savedSongs = JSON.parse(localStorage.getItem('savedSongs')) || [];
    savedSongs.splice(index, 1);
    localStorage.setItem('savedSongs', JSON.stringify(savedSongs));
    renderPlaylist();
  };

  const renderPlaylist = () => {
    const playlistElement = document.getElementById('playlist');
    playlistElement.innerHTML = '';

    const savedSongs = JSON.parse(localStorage.getItem('savedSongs')) || [];
    savedSongs.forEach((song, index) => {
      const li = document.createElement('li');
      li.classList.add('song-item');
      li.setAttribute('data-audio', song.audio);
      li.setAttribute('data-poster', song.poster);
      li.setAttribute('data-title', song.title);
      li.setAttribute('data-singer', song.singer);

      li.innerHTML = `
        <img src="${song.poster}" alt="Song Poster">
        <h2>${song.title}</h2>
        <button class="delete-button" data-index="${index}">Delete</button>
      `;
      playlistElement.appendChild(li);

      li.addEventListener('click', () => {
        currentSongIndex = index;
        loadSong(currentSongIndex);

        artistsSection.style.display = 'block';
        leftSidebar.classList.add('show-menu');
      });

      li.querySelector('.delete-button').addEventListener('click', (event) => {
        event.stopPropagation();
        const songIndex = event.target.getAttribute('data-index');
        deleteSong(songIndex);
      });
    });
  };

  document.addEventListener('DOMContentLoaded', renderPlaylist);

  playPauseButton.addEventListener('click', () => {
    if (audioPlayer.paused) {
      audioPlayer.play();
      playPauseButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else {
      audioPlayer.pause();
      playPauseButton.innerHTML = '<i class="fa-solid fa-play"></i>';
    }

    const currentSong = JSON.parse(localStorage.getItem('currentSong'));
    currentSong.isPlaying = !audioPlayer.paused;
    currentSong.currentTime = audioPlayer.currentTime;
    localStorage.setItem('currentSong', JSON.stringify(currentSong));
  });

  audioPlayer.addEventListener('timeupdate', () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.value = progress;

    const currentSong = JSON.parse(localStorage.getItem('currentSong'));
    currentSong.currentTime = audioPlayer.currentTime;
    localStorage.setItem('currentSong', JSON.stringify(currentSong));
  });

  progressBar.addEventListener('click', (e) => {
    const newTime = (e.offsetX / progressBar.offsetWidth) * audioPlayer.duration;
    audioPlayer.currentTime = newTime;

    const currentSong = JSON.parse(localStorage.getItem('currentSong'));
    currentSong.currentTime = newTime;
    localStorage.setItem('currentSong', JSON.stringify(currentSong));
  });

  prevButton.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex > 0) ? currentSongIndex - 1 : songs.length - 1;
    loadSong(currentSongIndex);
  });

  nextButton.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex < songs.length - 1) ? currentSongIndex + 1 : 0;
    loadSong(currentSongIndex);
  });



  homeButton.addEventListener('click', () => {
    leftSidebar.classList.remove('show-menu');
    localStorage.setItem('currentSong', JSON.stringify({
      ...JSON.parse(localStorage.getItem('currentSong')),
      artistsVisible: false
    }));
  });

  window.addEventListener('popstate', () => {
    loadCurrentSongFromLocalStorage();
  });
});





 // side-menu
  document.addEventListener('DOMContentLoaded', () => {
    const toggleMenuBtn = document.getElementById('toggle-menu-btn');
    const leftSide = document.querySelector('.left');
    const deleteIcon = document.getElementById('close-left-sidebar');

    toggleMenuBtn.addEventListener('click', () => {
      leftSide.classList.toggle('show-menu');
    });

    deleteIcon.addEventListener('click', () => {
      leftSide.classList.remove('show-menu');
    });
  });






//To fixed the song
const audioPlayer = document.getElementById('audio-player');
const playPauseButton = document.getElementById('play-pause-button');
const progressBar = document.getElementById('progress-bar');

// Function to save the current song state in localStorage
function saveCurrentSong() {
  const currentSong = {
    audio: audioPlayer.src,
    poster: document.getElementById('current-poster').src,
    title: document.getElementById('current-title').innerText,
    singer: document.getElementById('current-singer').innerText,
    currentTime: audioPlayer.currentTime,
    isPlaying: !audioPlayer.paused,
    artistsVisible: document.querySelector('.left').classList.contains('show-menu')
  };
  localStorage.setItem('currentSong', JSON.stringify(currentSong));
}

document.addEventListener('DOMContentLoaded', () => {
  // Load the current song state from localStorage
  const loadCurrentSongFromLocalStorage = () => {
    const currentSong = JSON.parse(localStorage.getItem('currentSong'));
    if (currentSong) {
      audioPlayer.src = currentSong.audio;
      document.getElementById('current-poster').src = currentSong.poster;
      document.getElementById('current-title').innerText = currentSong.title;
      document.getElementById('current-singer').innerText = currentSong.singer;
      audioPlayer.currentTime = currentSong.currentTime;
      if (currentSong.isPlaying) {
        audioPlayer.play();
        playPauseButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
      } else {
        playPauseButton.innerHTML = '<i class="fa-solid fa-play"></i>';
      }
      const leftSidebar = document.querySelector('.left');
      if (currentSong.artistsVisible) {
        leftSidebar.classList.add('show-menu');
      } else {
        leftSidebar.classList.remove('show-menu');
      }
    }
  };

  // Load the current song state when the page is loaded
  loadCurrentSongFromLocalStorage();

  // Event listener for the play/pause button
  playPauseButton.addEventListener('click', () => {
    if (audioPlayer.paused) {
      audioPlayer.play();
      playPauseButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else {
      audioPlayer.pause();
      playPauseButton.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
    saveCurrentSong();
  });

  // Event listener for the progress bar
  progressBar.addEventListener('input', () => {
    const newTime = (progressBar.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = newTime;
    saveCurrentSong();
  });

  // Update the progress bar while the song is playing
  audioPlayer.addEventListener('timeupdate', () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.value = progress;
    saveCurrentSong();
  });

  // Update the current song when it ends
  audioPlayer.addEventListener('ended', () => {
    playPauseButton.innerHTML = '<i class="fa-solid fa-play"></i>';
    progressBar.value = 0;
    saveCurrentSong();
  });
});

// Function to save the current song state before navigating to another page
const links = document.querySelectorAll('a');
links.forEach(link => {
  link.addEventListener('click', () => {
    saveCurrentSong();
  });
});





//left side songs display
// Function to handle song item click
document.querySelectorAll('.song-item').forEach(item => {
  item.addEventListener('click', function() {
    var audio = this.getAttribute('data-audio');
    var poster = this.getAttribute('data-poster');
    var title = this.getAttribute('data-title');
    var singer = this.getAttribute('data-singer');

    document.getElementById('current-title').innerText = title;
    document.getElementById('current-poster').src = poster;
    document.getElementById('current-singer').innerText = singer;
    document.getElementById('audio-player').src = audio;
  });
});

// Function to send data to playlist
function sendDataToPlaylist() {
  var title = document.getElementById('current-title').innerText;
  var poster = document.getElementById('current-poster').src;
  var singer = document.getElementById('current-singer').innerText;
  var audio = document.getElementById('audio-player').src;

  // Create an object to represent the song details
  var songData = {
    title: title,
    poster: poster,
    singer: singer,
    audio: audio
  };

  // Retrieve the saved songs array from localStorage
  var savedSongs = JSON.parse(localStorage.getItem('savedSongs')) || [];

  // Add the new song data to the array
  savedSongs.push(songData);

  // Save the updated array back to localStorage
  localStorage.setItem('savedSongs', JSON.stringify(savedSongs));

  // Show an alert message
  alert("Song '" + title + "' by " + singer + " is added to the playlist!");
}

// Function to filter and display search results
function filterSongs() {
  const searchInput = document.querySelector('.search-input');
  const searchValue = searchInput.value.trim().toLowerCase(); // Convert search input to lowercase for case-insensitive search
  const songItems = document.querySelectorAll('.song-item');
  const hiddenDivClasses = document.querySelectorAll('.artists .popular-song');

  // Check if the search input is empty
  if (searchValue === '') {
    songItems.forEach(songItem => {
      songItem.style.display = 'block'; // Show all song items if the search input is empty
    });
    hiddenDivClasses.forEach(div => {
      div.style.display = 'none'; // Hide all hidden div classes if the search input is empty
    });
    return; // Exit the function early if the search input is empty
  }

  let hasVisibleSongs = false;

  songItems.forEach(songItem => {
    const title = songItem.getAttribute('data-title').toLowerCase(); // Get the title of the song item
    if (title.includes(searchValue)) {
      songItem.style.display = 'block'; // Show the song item if it matches the search
      hasVisibleSongs = true;
    } else {
      songItem.style.display = 'none'; // Hide the song item if it does not match the search
    }
  });

  // Show or hide additional div classes based on search results
  hiddenDivClasses.forEach(div => {
    if (hasVisibleSongs) {
      div.style.display = 'block'; // Show the div if there are visible songs
    } else {
      div.style.display = 'none'; // Hide the div if there are no visible songs
    }
  });
}

// Add event listener to the search input
document.querySelector('.search-input').addEventListener('input', filterSongs);




//search-bar 

const searchInput = document.getElementById('search-input');
const songItems = document.querySelectorAll('.song-item');

searchInput.addEventListener('input', (e) => {
const searchTerm = e.target.value.toLowerCase();
songItems.forEach((songItem) => {
const songTitle = songItem.getAttribute('data-title').toLowerCase();
const songSinger = songItem.getAttribute('data-singer').toLowerCase();
if (songTitle.includes(searchTerm) || songSinger.includes(searchTerm)) {
  songItem.style.display = 'block';
} else {
  songItem.style.display = 'none';
}
});
});
