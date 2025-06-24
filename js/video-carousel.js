let videoSources = [
  'video/hero-1.mp4',
  'video/hero-2.mp4',
  'video/hero-3.mp4',
  'video/hero-4.mp4',
  'video/hero-5.mp4',
];

if (window.location.pathname.includes('/ru') || window.location.pathname.includes('/ua') || window.location.pathname.includes('/es')) {
  videoSources = [
    '../video/hero-1.mp4',
    '../video/hero-2.mp4',
    '../video/hero-3.mp4',
    '../video/hero-4.mp4',
    '../video/hero-5.mp4',
  ];
}

const videoCarouselConfig = {
  videoDuration: 6000,
  transitionDuration: 500,
  enableLogging: false,
  autoStart: true,
  pauseOnHover: false
};

let currentVideoIndex = 0;
let videoInterval = null;
let isTransitioning = false;
let isPaused = false;
let isIOS = false;
let videoObserver = null;
let hasUserInteracted = false;

// Визначення iOS пристрою
function detectIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

// Функція для тестування можливості автопрогравання
function testAutoplaySupport() {
  return new Promise(resolve => {
    const video = document.createElement('video');
    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;
    video.src = 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMWZwNDEAAACcbW9vdgAAAGxtdmhkAAAAAM3ZE5DM2ROQAAu4AABFRAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACd3RyYWsAAABcdGtoZAAAAAHM2ROQzNkTkAAAAHAAAACcAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAyAAAAMgAAAAALgAACJZFjdaU7ZfowEHj/vhFRPc7sJojduwcxRTQhPMSQOX/jDbSjU/++8YpR8Glt1LTQ==';

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => resolve(true))
        .catch(() => resolve(false));
    } else {
      resolve(false);
    }
  });
}

class VideoCarousel {
  constructor(config) {
    this.config = { ...videoCarouselConfig, ...config };
    this.video = null;
    this.videoSource = null;
    this.fallbackElement = null;
    this.canAutoplay = false;
    this.retryCount = 0;
    this.maxRetries = 3;
    this.init();
  }

  async init() {
    isIOS = detectIOS();
    this.canAutoplay = await testAutoplaySupport();

    this.video = document.getElementById('heroVideo');
    this.videoSource = document.getElementById('videoSource');
    this.fallbackElement = document.querySelector('.video-fallback');

    if (!this.video || !this.videoSource) {
      this.log('Video elements not found in DOM', 'error');
      this.showFallbackImage();
      return false;
    }

    if (videoSources.length <= 1) {
      this.log('Not enough videos for carousel (minimum 2)', 'warn');
      return false;
    }

    // Додаємо атрибути для iOS
    if (isIOS) {
      this.video.setAttribute('webkit-playsinline', 'true');
      this.video.setAttribute('playsinline', 'true');
      this.video.muted = true;
      this.video.defaultMuted = true;
      this.video.setAttribute('muted', 'true');
    }

    this.setupEventListeners();
    this.setupIntersectionObserver();

    // Додаємо обробник кліку для iOS
    if (isIOS && !this.canAutoplay) {
      this.addClickToPlayForIOS();
    }

    if (this.config.autoStart) {
      this.start();
    }

    this.log(`Carousel initialized with ${videoSources.length} videos (iOS: ${isIOS}, Autoplay: ${this.canAutoplay})`);
    return true;
  }

  setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.tryPlayVideo();
          } else {
            this.pauseVideo();
          }
        });
      }, {
        threshold: 0.25 // Відео вважається видимим коли 25% на екрані
      });

      videoObserver.observe(this.video);
    }
  }

  addClickToPlayForIOS() {
    const playButton = document.createElement('div');
    playButton.className = 'ios-play-button';
    playButton.innerHTML = `
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.7);
        color: white;
        border-radius: 50%;
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 1000;
        font-size: 24px;
      ">
        ▶
      </div>
    `;

    playButton.addEventListener('click', () => {
      hasUserInteracted = true;
      this.tryPlayVideo();
      playButton.style.display = 'none';
    });

    this.video.parentNode.appendChild(playButton);

    // Приховуємо кнопку після успішного відтворення
    this.video.addEventListener('play', () => {
      playButton.style.display = 'none';
    });
  }

  async tryPlayVideo() {
    try {
      if (this.video.paused) {
        const playPromise = this.video.play();
        if (playPromise !== undefined) {
          await playPromise;
          this.retryCount = 0; // Скидаємо лічильник після успішного відтворення
        }
      }
    } catch (error) {
      this.log(`Error playing video: ${error.message}`, 'warn');

      if (isIOS && this.retryCount < this.maxRetries) {
        this.retryCount++;
        setTimeout(() => this.tryPlayVideo(), 1000);
      }
    }
  }

  pauseVideo() {
    if (!this.video.paused) {
      this.video.pause();
    }
  }

  setupEventListeners() {
    // Загрузка відео
    this.video.addEventListener('loadeddata', () => {
      this.hideFallbackImage();
      this.tryPlayVideo();
    });

    // Успішне відтворення
    this.video.addEventListener('playing', () => {
      this.hideFallbackImage();
      this.log('Video playing successfully');
    });

    // Помилка завантаження
    this.video.addEventListener('error', (e) => {
      this.log(`Error loading video: ${e.message}`, 'error');
      this.showFallbackImage();
      setTimeout(() => this.skipToNext(), 2000);
    });

    // Зупинка відео (iOS може зупиняти)
    this.video.addEventListener('pause', () => {
      if (!isPaused && !isTransitioning) {
        this.log('Video paused unexpectedly, trying to resume', 'warn');
        setTimeout(() => this.tryPlayVideo(), 500);
      }
    });

    // Завершення відео (зацикливання)
    this.video.addEventListener('ended', () => {
      this.video.currentTime = 0;
      this.tryPlayVideo();
    });

    // Обробка зависання
    this.video.addEventListener('stalled', () => {
      this.log('Video stalled, trying to resume', 'warn');
      setTimeout(() => this.tryPlayVideo(), 1000);
    });

    // Відео не може завантажитися
    this.video.addEventListener('suspend', () => {
      this.log('Video suspended, showing fallback', 'warn');
      setTimeout(() => {
        if (this.video.readyState < 2) {
          this.showFallbackImage();
        }
      }, 3000);
    });

    // Ховер (якщо включено)
    if (this.config.pauseOnHover) {
      this.video.addEventListener('mouseenter', () => this.pause());
      this.video.addEventListener('mouseleave', () => this.resume());
    }

    // Видимість сторінки
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else if (!isPaused) {
        setTimeout(() => this.resume(), 500);
      }
    });

    // Взаємодія користувача (важливо для iOS)
    ['touchstart', 'click', 'keydown'].forEach(event => {
      document.addEventListener(event, () => {
        if (!hasUserInteracted) {
          hasUserInteracted = true;
          this.tryPlayVideo();
        }
      }, { once: true });
    });

    // Ресайз вікна
    window.addEventListener('resize', () => {
      if (isIOS) {
        setTimeout(() => this.tryPlayVideo(), 300);
      }
    });
  }

  start() {
    if (videoInterval) {
      this.log('Carousel already started');
      return;
    }

    videoInterval = setInterval(() => {
      if (!isPaused && !isTransitioning) {
        this.changeVideo();
      }
    }, this.config.videoDuration);

    this.log('Carousel started');
  }

  stop() {
    if (videoInterval) {
      clearInterval(videoInterval);
      videoInterval = null;
      this.log('Carousel stopped');
    }

    if (videoObserver) {
      videoObserver.disconnect();
      videoObserver = null;
    }
  }

  pause() {
    isPaused = true;
    this.pauseVideo();
    this.log('Carousel paused');
  }

  resume() {
    isPaused = false;
    this.tryPlayVideo();
    this.log('Carousel resumed');
  }

  async changeVideo() {
    if (isTransitioning) return;

    isTransitioning = true;
    const nextIndex = (currentVideoIndex + 1) % videoSources.length;

    this.log(`Change video: ${videoSources[currentVideoIndex]} → ${videoSources[nextIndex]}`);

    // Плавний перехід
    this.video.style.transition = `opacity ${this.config.transitionDuration}ms ease-in-out`;
    this.video.style.opacity = '0';

    setTimeout(async () => {
      currentVideoIndex = nextIndex;
      this.videoSource.src = videoSources[currentVideoIndex];

      // Для iOS додатково встановлюємо атрибути
      if (isIOS) {
        this.video.load();
        this.video.muted = true;
        this.video.defaultMuted = true;
      } else {
        this.video.load();
      }

      // Повертаємо прозорість
      this.video.style.opacity = '1';

      // Спробуємо відтворити нове відео
      setTimeout(() => {
        this.tryPlayVideo();
        isTransitioning = false;
      }, 100);

    }, this.config.transitionDuration);
  }

  skipToNext() {
    if (!isTransitioning) {
      this.changeVideo();
    }
  }

  goToVideo(index) {
    if (index >= 0 && index < videoSources.length && index !== currentVideoIndex) {
      currentVideoIndex = index - 1;
      this.changeVideo();
    }
  }

  getStatus() {
    return {
      currentIndex: currentVideoIndex,
      currentVideo: videoSources[currentVideoIndex],
      totalVideos: videoSources.length,
      isRunning: !!videoInterval,
      isPaused: isPaused,
      isTransitioning: isTransitioning,
      isIOS: isIOS,
      canAutoplay: this.canAutoplay,
      hasUserInteracted: hasUserInteracted
    };
  }

  log(message, type = 'info') {
    if (this.config.enableLogging) {
      console[type](`[VideoCarousel] ${message}`);
    }
  }

  showFallbackImage() {
    if (this.fallbackElement) {
      this.fallbackElement.classList.add('active');
      this.log('Showing fallback image due to video loading issues', 'warn');
    }
  }

  hideFallbackImage() {
    if (this.fallbackElement) {
      this.fallbackElement.classList.remove('active');
    }
  }
}

let videoCarousel = null;

function initVideoCarousel(customConfig = {}) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      videoCarousel = new VideoCarousel(customConfig);
    });
  } else {
    videoCarousel = new VideoCarousel(customConfig);
  }
}

// Глобальні контроли
window.videoCarouselControl = {
  start: () => videoCarousel?.start(),
  stop: () => videoCarousel?.stop(),
  pause: () => videoCarousel?.pause(),
  resume: () => videoCarousel?.resume(),
  next: () => videoCarousel?.skipToNext(),
  goTo: (index) => videoCarousel?.goToVideo(index),
  status: () => videoCarousel?.getStatus() || null
};

// Очищення ресурсів
window.clearVideoCarousel = () => {
  if (videoCarousel) {
    videoCarousel.stop();
  }
  if (videoObserver) {
    videoObserver.disconnect();
    videoObserver = null;
  }
};

// Ініціалізація
initVideoCarousel(); 