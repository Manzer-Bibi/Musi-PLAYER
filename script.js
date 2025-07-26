// Music Player Logic
const audio = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const loopBtn = document.getElementById('loop-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const seekSlider = document.getElementById('seek-slider');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volume-slider');
const muteBtn = document.getElementById('mute-btn');
const playlistTabs = document.querySelectorAll('.playlist-tab');
const playlistCategories = document.querySelectorAll('.playlist-category');
const playlistItems = document.querySelectorAll('.playlist-item');
const albumArt = document.querySelector('.album-art');
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const themeToggle = document.getElementById('theme-toggle');

let isPlaying = false;
let isLoop = false;
let isShuffle = false;
let lastVolume = 1;
let currentCategory = 'bollywood';
let currentIndex = 0;

// Playlists
const playlists = {
  bollywood: [
    {
      src: 'assets/songs/Title Track Saiyaara 320 Kbps.mp3',
      title: 'Saiyaara',
      artist: 'Faheem Abdullah',
      art: 'assets/images/Saiyaara-1.jpg',
    },
    {
      src: 'assets/songs/Aasan Nahin Yahan Aashiqui 2 320 kbps.mp3',
      title: 'Asaan nahi Yahan',
      artist: 'Arijit Singh',
      art: 'assets/images/ashqui2.jpeg',
    },
    {
      src: 'assets/songs/Piya Aaye Na Aashiqui 2 320 kbps.mp3', 
      title: 'Piya Aye Na',
      artist: 'KK',
      art: 'assets/images/ashqui2.jpeg',
    },
    {
      src: 'assets/songs/Humsafar Saiyaara 320 kbps.mp3',
      title: 'Humsafar Saiyaara',
      artist: 'Irshad Kamil, Sachet–Parampara, Parampara Thakur, Sachet Tandon',
      art: 'assets/images/humsafar.jpg',
    },
  ],
  pakistani: [
    {
      src: 'assets/songs/09 - Mann Mayal - OST - HumTV (ApniISP.Com).mp3',
      title: 'Mann Mayal',
      artist: 'Qurat-Ul-Ain Baloch',
      art: 'assets/images/man mayal.jpeg',
    },
    {
      src: 'assets/songs/Meem Se Mohabbat OST Mp3 Download - Asim Azhar.mp3',
      title: 'Meem Se Mohabbat',
      artist: 'Asim Azhar & Qirat Haider',
      art: 'assets/images/meem se.jpg',
    },
    {
      src: 'assets/songs/61 - Dobara - OST - HUM TV (ApniISP.Com).mp3',
      title: 'Dubara',
      artist: 'Sehar Gul Khan & Shuja Haider',
      art: 'assets/images/dubara.jpeg',
    },
    {
      src: 'assets/songs/Mein Ost.mp3',
      title: 'Mein',
      artist: 'Pakistani',
      art: 'assets/images/Mein.jpg',
    },
    {
      src: 'assets/songs/67 - Ishq Murshid - OST - HUM TV (ApniISP.Com).mp3',
      title: 'Ishq Murshid',
      artist: 'Ahmed Jahanzeb',
      art: 'assets/images/ishq murshid.jpeg',
    },
  ],
};

function loadSong(index) {
  const song = playlists[currentCategory][index];
  audio.src = song.src;
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  albumArt.src = song.art;
  
  // Update active playlist item
  updateActivePlaylistItem(index);
  
  // Update URL hash
  window.location.hash = `${currentCategory}-${index}`;
  
  // Load and play if already playing
  if (isPlaying) {
    audio.play().catch(e => console.log('Auto-play prevented:', e));
  }
}

function updateActivePlaylistItem(index) {
  // Remove active class from all items in all categories
  document.querySelectorAll('.playlist-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Add active class to the current item in the current category
  const currentCategoryItems = document.querySelectorAll(`.playlist-category[data-category="${currentCategory}"] .playlist-item`);
  if (currentCategoryItems[index]) {
    currentCategoryItems[index].classList.add('active');
  }
}

function playSong() {
  audio.play()
    .then(() => {
      isPlaying = true;
      playPauseBtn.textContent = '⏸️';
    })
    .catch(e => {
      console.log('Playback failed:', e);
      // Handle play error (like showing a message to user)
    });
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playPauseBtn.textContent = '▶️';
}

// Play/Pause button
playPauseBtn.addEventListener('click', () => {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// Previous button
prevBtn.addEventListener('click', () => {
  if (isShuffle) {
    currentIndex = Math.floor(Math.random() * playlists[currentCategory].length);
  } else {
    currentIndex = (currentIndex - 1 + playlists[currentCategory].length) % playlists[currentCategory].length;
  }
  loadSong(currentIndex);
  playSong();
});

// Next button
nextBtn.addEventListener('click', () => {
  if (isShuffle) {
    currentIndex = Math.floor(Math.random() * playlists[currentCategory].length);
  } else {
    currentIndex = (currentIndex + 1) % playlists[currentCategory].length;
  }
  loadSong(currentIndex);
  playSong();
});

// Loop button
loopBtn.addEventListener('click', () => {
  isLoop = !isLoop;
  audio.loop = isLoop;
  loopBtn.style.color = isLoop ? '#00fff7' : '';
});

// Shuffle button
shuffleBtn.addEventListener('click', () => {
  isShuffle = !isShuffle;
  shuffleBtn.style.color = isShuffle ? '#00fff7' : '';
});

audio.addEventListener('ended', () => {
  if (!isLoop) {
    nextBtn.click();
  }
});

audio.addEventListener('loadedmetadata', () => {
  seekSlider.max = Math.floor(audio.duration);
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
  seekSlider.value = Math.floor(audio.currentTime);
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

seekSlider.addEventListener('input', () => {
  audio.currentTime = seekSlider.value;
});

volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value;
  if (audio.volume === 0) {
    muteBtn.textContent = '🔇';
  } else {
    muteBtn.textContent = '🔊';
  }
  lastVolume = audio.volume;
});

muteBtn.addEventListener('click', () => {
  if (audio.volume > 0) {
    lastVolume = audio.volume;
    audio.volume = 0;
    volumeSlider.value = 0;
    muteBtn.textContent = '🔇';
  } else {
    audio.volume = lastVolume || 1;
    volumeSlider.value = audio.volume;
    muteBtn.textContent = '🔊';
  }
});

// Playlist tabs
playlistTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    playlistTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentCategory = tab.dataset.category;
    
    // Show the selected category and hide others
    playlistCategories.forEach(cat => {
      cat.style.display = cat.dataset.category === currentCategory ? 'block' : 'none';
    });
    
    // Reset to first song in the new category
    currentIndex = 0;
    loadSong(currentIndex);
    
    // Update URL hash
    window.location.hash = currentCategory;
  });
});

// Playlist items
document.querySelectorAll('.playlist-category').forEach(category => {
  const items = category.querySelectorAll('.playlist-item');
  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentCategory = category.dataset.category;
      currentIndex = index;
      loadSong(currentIndex);
      playSong();
    });
  });
});

function formatTime(sec) {
  if (isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// Theme toggle
function setTheme(theme) {
  document.body.classList.toggle('light', theme === 'light');
  localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// Initialize the player
window.addEventListener('DOMContentLoaded', () => {
  // Set theme
  const theme = localStorage.getItem('theme') || 'dark';
  setTheme(theme);
  
  // Handle hash URL
  let hash = window.location.hash.replace('#', '');
  let hashParts = hash.split('-');
  
  if (hashParts.length === 2 && playlists[hashParts[0]] && hashParts[1] < playlists[hashParts[0]].length) {
    // Category and song index specified
    currentCategory = hashParts[0];
    currentIndex = parseInt(hashParts[1], 10);
  } else if (hash && playlists[hash]) {
    // Only category specified
    currentCategory = hash;
    currentIndex = 0;
  }
  
  // Activate the correct tab
  playlistTabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.category === currentCategory);
  });
  
  // Show the correct category
  playlistCategories.forEach(cat => {
    cat.style.display = cat.dataset.category === currentCategory ? 'block' : 'none';
  });
  
  // Load the song
  loadSong(currentIndex);
});
