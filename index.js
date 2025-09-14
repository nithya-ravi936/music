const image = document.getElementById('cover'),
    title = document.getElementById('music-title'),
    artist = document.getElementById('music-artist'),
    currentTimeEl = document.getElementById('current-time'),
    durationEl = document.getElementById('duration'),
    progress = document.getElementById('progress'),
    playerProgress = document.getElementById('player-progress'),
    prevBtn = document.getElementById('prev'),
    nextBtn = document.getElementById('next'),
    playBtn = document.getElementById('play'),
    background = document.getElementById('bg-img');

const music = new Audio();

const songs = [
    {
        path: 'assets/1.mp3',
        displayName: 'Nilavu Thoongum Neram',
        cover: 'assets/1.jpg',
        artist: 'Mohan',
    },
    {
        path: 'assets/2.mp3',
        displayName: 'Pookal Pookum Tharunam',
        cover: 'assets/2.jpg',
        artist: 'G.V.Prakash',
    },
    {
        path: 'assets/3.mp3',
        displayName: 'Kangal Irandal',
        cover: 'assets/3.jpg',
        artist: ' James Vasanthan',
    },
    {
        path: 'assets/4.mp3',
        displayName: 'Nenjame Nenjame',
        cover: 'assets/4.jpg',
        artist: 'Vijay Yesudas',
    },
    {
        path: 'assets/5.mp3',
        displayName: 'Kadhalikka Neramillai',
        cover: 'assets/5.jpg',
        artist: 'Vijay Antony',
    },
    {
        path: 'assets/6.leelai-oru-kili-oru-kili.mp3',
        displayName: 'Oru Kili Oru Kili',
        cover: 'assets/6.jpg',
        artist: 'Shreya Ghoshal',
    },
    {
        path: 'assets/7.muzhumadhi.mp3',
        displayName: 'Muzhumadhi',
        cover: 'assets/7.jpg',
        artist: 'A.R.Rahman',
    },
    {
        path: 'assets/8.endhan-nenjil-neengadha.mp3',
        displayName: 'Endhan Nenjil',
        cover: 'assets/8.jpg',
        artist: ' K.J.Yesudas',
    },
    {
        path: 'assets/9.ennai-thedi-kadhal-90s.mp3',
        displayName: 'Kadhalikka Neramillai',
        cover: 'assets/5.jpg',
        artist: 'Vijay Antony',
    },
    {
        path: 'assets/10.Dude.mp3',
        displayName: 'Oorum Blood',
        cover: 'assets/10.jpg',
        artist: 'Sai Abhyankkar',
    },
    {
        path: 'assets/11.pothavillaye.mp3',
        displayName: 'Pothavillaye',
        cover: 'assets/11.jpg',
        artist: 'Shreya Ghoshal',
    },
    {
        path: 'assets/12.ni-sa.mp3',
        displayName: 'Ni Sa Gari Sa',
        cover: 'assets/12.jpg',
        artist: 'Naresh Iyer',
    }

];

let musicIndex = 0;
let isPlaying = false;

function togglePlay() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function playMusic() {
    isPlaying = true;
    // Change play button icon
    playBtn.classList.replace('fa-play', 'fa-pause');
    // Set button hover title
    playBtn.setAttribute('title', 'Pause');
    music.play();
}

function pauseMusic() {
    isPlaying = false;
    // Change pause button icon
    playBtn.classList.replace('fa-pause', 'fa-play');
    // Set button hover title
    playBtn.setAttribute('title', 'Play');
    music.pause();
}

function loadMusic(song) {
    music.src = song.path;
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    image.src = song.cover;
    background.src = song.cover;
}

function changeMusic(direction) {
    musicIndex = (musicIndex + direction + songs.length) % songs.length;
    loadMusic(songs[musicIndex]);
    playMusic();
}

// 🔹 Updated function
function updateProgressBar() {
    const { duration, currentTime } = music;

    // avoid division by zero or NaN
    if (!duration || isNaN(duration)) return;

    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${String(seconds).padStart(2, '0')}`;
    };

    durationEl.textContent = formatTime(duration);
    currentTimeEl.textContent = formatTime(currentTime);
}

function setProgressBar(e) {
    const width = playerProgress.clientWidth;
    const clickX = e.offsetX;
    music.currentTime = (clickX / width) * music.duration;
}

playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => changeMusic(-1));
nextBtn.addEventListener('click', () => changeMusic(1));
music.addEventListener('ended', () => changeMusic(1));
music.addEventListener('timeupdate', updateProgressBar);
playerProgress.addEventListener('click', setProgressBar);

// 🔹 Added volume control
const volumeSlider = document.getElementById('volume');
if (volumeSlider) {
    // initialize audio volume from slider value (fallback to 1 if missing)
    music.volume = (parseFloat(volumeSlider.value) || 1);

    // Helper sets volume safely between 0 and 1
    function updateVolume(e) {
        let raw;
        if (e && e.target && e.target.value !== undefined) {
            raw = e.target.value;
        } else if (typeof e === 'number') {
            raw = e;
        } else {
            return;
        }
        const v = parseFloat(raw);
        if (!isNaN(v)) music.volume = Math.max(0, Math.min(1, v));
    }

    // Use both input and change for broader compatibility (mobile & desktop)
    volumeSlider.addEventListener('input', updateVolume);
    volumeSlider.addEventListener('change', updateVolume);

    // Support pointer/touch events for some mobile browsers
    try {
        volumeSlider.addEventListener('pointermove', updateVolume);
    } catch (err) { /* ignore if not supported */ }

    try {
        volumeSlider.addEventListener('touchmove', updateVolume, { passive: true });
    } catch (err) { /* ignore if not supported */ }
}


loadMusic(songs[musicIndex]);
