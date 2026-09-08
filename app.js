/**
 * AuraPlayer - Modern Offline Video Player
 * Pure vanilla ES6+ client-side media player engine
 */

(() => {
  'use strict';

  // --- DOM Elements ---
  const playerWrapper = document.getElementById('playerWrapper');
  const video = document.getElementById('videoElement');
  const subtitleTrack = document.getElementById('subtitleTrack');
  const dropZone = document.getElementById('dropZone');
  const playerOverlay = document.getElementById('playerOverlay');
  const feedbackHud = document.getElementById('feedbackHud');
  const hudIcon = document.getElementById('hudIcon');
  const hudText = document.getElementById('hudText');

  // Top Bar Elements
  const videoTitle = document.getElementById('videoTitle');
  const videoMetaBadge = document.getElementById('videoMetaBadge');
  const returnToDropBtn = document.getElementById('returnToDropBtn');
  const playlistToggleBtn = document.getElementById('playlistToggleBtn');
  const playlistCountBadge = document.getElementById('playlistCountBadge');
  const ambientToggleBtn = document.getElementById('ambientToggleBtn');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const filterToggleBtn = document.getElementById('filterToggleBtn');
  const shortcutsBtn = document.getElementById('shortcutsBtn');

  // Controls Elements
  const playPauseBtn = document.getElementById('playPauseBtn');
  const prevTrackBtn = document.getElementById('prevTrackBtn');
  const nextTrackBtn = document.getElementById('nextTrackBtn');
  const rewindBtn = document.getElementById('rewindBtn');
  const forwardBtn = document.getElementById('forwardBtn');
  const muteBtn = document.getElementById('muteBtn');
  const volumeContainer = document.getElementById('volumeContainer');
  const volumeSlider = document.getElementById('volumeSlider');
  const volumePercent = document.getElementById('volumePercent');
  const timeDisplay = document.getElementById('timeDisplay');
  const currentTimeEl = document.getElementById('currentTime');
  const totalDurationEl = document.getElementById('totalDuration');

  // Timeline / Scrubber
  const timelineContainer = document.getElementById('timelineContainer');
  const timelineBuffer = document.getElementById('timelineBuffer');
  const timelineProgress = document.getElementById('timelineProgress');
  const timelineThumb = document.getElementById('timelineThumb');
  const timelineTooltip = document.getElementById('timelineTooltip');

  // Right Controls
  const subtitleBtn = document.getElementById('subtitleBtn');
  const speedBtn = document.getElementById('speedBtn');
  const speedValue = document.getElementById('speedValue');
  const speedMenu = document.getElementById('speedMenu');
  const resetSpeedBtn = document.getElementById('resetSpeedBtn');
  const speedSlider = document.getElementById('speedSlider');
  const speedSliderValue = document.getElementById('speedSliderValue');
  const aspectRatioBtn = document.getElementById('aspectRatioBtn');
  const snapshotBtn = document.getElementById('snapshotBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const downloadTopBtn = document.getElementById('downloadTopBtn');
  const pipBtn = document.getElementById('pipBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');

  // Playlist Drawer
  const playlistDrawer = document.getElementById('playlistDrawer');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const playlistList = document.getElementById('playlistList');
  const queueTotalBadge = document.getElementById('queueTotalBadge');
  const addMoreVideosBtn = document.getElementById('addMoreVideosBtn');
  const clearPlaylistBtn = document.getElementById('clearPlaylistBtn');

  // Visual Enhancements Popover
  const filterPopover = document.getElementById('filterPopover');
  const brightnessSlider = document.getElementById('brightnessSlider');
  const contrastSlider = document.getElementById('contrastSlider');
  const saturationSlider = document.getElementById('saturationSlider');
  const brightnessVal = document.getElementById('brightnessVal');
  const contrastVal = document.getElementById('contrastVal');
  const saturationVal = document.getElementById('saturationVal');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');

  // Theme Selector Popover
  const themePopover = document.getElementById('themePopover');
  const closeThemePopoverBtn = document.getElementById('closeThemePopoverBtn');

  // Subtitle Popover
  const subtitlePopover = document.getElementById('subtitlePopover');
  const closeSubtitlePopoverBtn = document.getElementById('closeSubtitlePopoverBtn');
  const subtitleToggleCheckbox = document.getElementById('subtitleToggleCheckbox');
  const subtitleFileInfo = document.getElementById('subtitleFileInfo');
  const loadSubtitleFileBtn = document.getElementById('loadSubtitleFileBtn');
  const offsetMinusBtn = document.getElementById('offsetMinusBtn');
  const offsetPlusBtn = document.getElementById('offsetPlusBtn');
  const offsetResetBtn = document.getElementById('offsetResetBtn');
  const subtitleOffsetVal = document.getElementById('subtitleOffsetVal');

  // Shortcuts Dialog
  const shortcutsDialog = document.getElementById('shortcutsDialog');
  const closeShortcutsModal = document.getElementById('closeShortcutsModal');

  // URL & Stream Dialog
  const urlDialog = document.getElementById('urlDialog');
  const closeUrlModal = document.getElementById('closeUrlModal');
  const videoUrlInput = document.getElementById('videoUrlInput');
  const pasteClipboardBtn = document.getElementById('pasteClipboardBtn');
  const addUrlToQueueBtn = document.getElementById('addUrlToQueueBtn');
  const playUrlNowBtn = document.getElementById('playUrlNowBtn');
  const openUrlBtn = document.getElementById('openUrlBtn');
  const openUrlTopBtn = document.getElementById('openUrlTopBtn');
  const addUrlToDrawerBtn = document.getElementById('addUrlToDrawerBtn');

  // Download Dialog Elements
  const downloadDialog = document.getElementById('downloadDialog');
  const closeDownloadModal = document.getElementById('closeDownloadModal');
  const downloadPlatformBadge = document.getElementById('downloadPlatformBadge');
  const downloadVideoTitle = document.getElementById('downloadVideoTitle');
  const downloadVideoUrl = document.getElementById('downloadVideoUrl');
  const btnDownloadConverter = document.getElementById('btnDownloadConverter');
  const btnDownloadCopyLink = document.getElementById('btnDownloadCopyLink');
  const btnDownloadOpenSource = document.getElementById('btnDownloadOpenSource');
  let currentDownloadItem = null;

  // Dropzone Quick Buttons
  const btnPasteDrop = document.getElementById('btnPasteDrop');

  // File Inputs, Canvas & Embed Frame
  const embedFrame = document.getElementById('embedFrame');
  const videoFileInput = document.getElementById('videoFileInput');
  const subtitleFileInput = document.getElementById('subtitleFileInput');
  const openFilesBtn = document.getElementById('openFilesBtn');
  const snapshotCanvas = document.getElementById('snapshotCanvas');
  const ambientCanvas = document.getElementById('ambientCanvas');

  // --- State Variables ---
  let playlist = []; // Array of { file, url, name, size, type, isEmbed, embedUrl }
  let currentIndex = -1;
  let hlsInstance = null;
  let isDraggingTimeline = false;
  let hasResumedCurrentTrack = false;
  let pendingSeekTarget = null;
  let seekDebounceTimer = null;
  let wasPlayingBeforeSeek = false;
  let controlsTimeout = null;
  let hudTimeout = null;
  let isRemainingTime = false;
  let currentSubtitleRaw = null;
  let currentSubtitleUrl = null;
  let subtitleOffset = 0; // seconds

  const aspectModes = ['contain', 'cover', 'fill'];
  let aspectModeIndex = 0;

  const filters = {
    brightness: 100,
    contrast: 100,
    saturation: 100
  };

  // --- Local Storage Keys ---
  const STORAGE_VOLUME = 'auraplayer_volume';
  const STORAGE_MUTED = 'auraplayer_muted';
  const STORAGE_SPEED = 'auraplayer_speed';
  const STORAGE_RESUME_POS = 'auraplayer_resume_positions';
  const STORAGE_THEME = 'auraplayer_theme';
  const STORAGE_AMBIENT = 'auraplayer_ambient';

  // --- Themes System ---
  const THEMES = [
    { id: 'aura-midnight', name: 'Aura Midnight' },
    { id: 'cyberpunk-neon', name: 'Cyberpunk Neon' },
    { id: 'emerald-matrix', name: 'Emerald Matrix' },
    { id: 'sunset-vapor', name: 'Sunset Vapor' },
    { id: 'nordic-frost', name: 'Nordic Frost' },
    { id: 'amethyst-abyss', name: 'Amethyst Abyss' },
    { id: 'crimson-dusk', name: 'Crimson Dusk' },
    { id: 'oled-pure', name: 'OLED Pure Black' }
  ];
  let currentThemeId = 'aura-midnight';

  const themeColors = {
    'aura-midnight': '#07090e',
    'cyberpunk-neon': '#0d0614',
    'emerald-matrix': '#040907',
    'sunset-vapor': '#0f0810',
    'nordic-frost': '#070c12',
    'amethyst-abyss': '#0a0512',
    'crimson-dusk': '#0f0506',
    'oled-pure': '#000000'
  };

  // --- SVG Icons for Feedback HUD ---
  const ICONS = {
    play: `<svg viewBox="0 0 24 24"><path d="M7 4.5v15c0 .85.94 1.36 1.65.9l12-7.5c.67-.42.67-1.39 0-1.81l-12-7.5c-.71-.45-1.65.06-1.65.91z"/></svg>`,
    pause: `<svg viewBox="0 0 24 24"><rect x="5.5" y="4" width="4.5" height="16" rx="2.25"/><rect x="14" y="4" width="4.5" height="16" rx="2.25"/></svg>`,
    forward: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>`,
    rewind: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/></svg>`,
    volumeUp: `<svg viewBox="0 0 24 24"><path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zm-2.5-1.23L6 6H2v12h4l5.5 4V2zm4.5 10c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>`,
    volumeMute: `<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`,
    speed: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    snapshot: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
    download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>`,
    theme: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.93 19.07l1.41-1.41"/><path d="M17.66 6.34l1.41-1.41"/></svg>`,
    ambient: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20Z"/></svg>`
  };

  // --- Dynamic Ambient Aura Glow ---
  let ambientAnimationId = null;
  let ambientEnabled = true;
  const ambientCtx = ambientCanvas ? ambientCanvas.getContext('2d', { alpha: false, willReadFrequently: false }) : null;

  function initAmbientLighting() {
    const savedAmbient = localStorage.getItem(STORAGE_AMBIENT);
    if (savedAmbient !== null) {
      ambientEnabled = savedAmbient === 'true';
    }
    updateAmbientUI();
  }

  function toggleAmbientLighting() {
    ambientEnabled = !ambientEnabled;
    localStorage.setItem(STORAGE_AMBIENT, ambientEnabled);
    updateAmbientUI();
    showHud(ICONS.ambient, ambientEnabled ? 'Ambient Aura ON' : 'Ambient Aura OFF');
    if (ambientEnabled) {
      startAmbientRenderLoop();
      renderAmbientFrame();
    } else {
      stopAmbientRenderLoop();
    }
  }

  function updateAmbientUI() {
    if (!ambientCanvas) return;
    if (ambientEnabled) {
      ambientCanvas.classList.remove('disabled');
      if (ambientToggleBtn) ambientToggleBtn.classList.add('active');
    } else {
      ambientCanvas.classList.add('disabled');
      if (ambientToggleBtn) ambientToggleBtn.classList.remove('active');
    }
  }

  function renderAmbientFrame() {
    if (!ambientEnabled || !ambientCanvas || !ambientCtx) return;
    if (!video.paused && !video.ended && video.readyState >= 2) {
      try {
        if (ambientCanvas.width !== 64) ambientCanvas.width = 64;
        if (ambientCanvas.height !== 36) ambientCanvas.height = 36;
        ambientCtx.drawImage(video, 0, 0, 64, 36);
      } catch {
        // Fallback gracefully if cross-origin
      }
    }
    if (ambientEnabled && !video.paused && !video.ended) {
      ambientAnimationId = requestAnimationFrame(renderAmbientFrame);
    }
  }

  function startAmbientRenderLoop() {
    if (!ambientEnabled || !ambientCanvas || !ambientCtx) return;
    cancelAnimationFrame(ambientAnimationId);
    ambientAnimationId = requestAnimationFrame(renderAmbientFrame);
  }

  function stopAmbientRenderLoop() {
    if (ambientAnimationId) {
      cancelAnimationFrame(ambientAnimationId);
      ambientAnimationId = null;
    }
  }

  // --- Themes Management ---
  function initTheme() {
    const saved = localStorage.getItem(STORAGE_THEME) || 'aura-midnight';
    setTheme(saved, false);
  }

  function setTheme(themeId, showFeedback = true) {
    const themeObj = THEMES.find(t => t.id === themeId) || THEMES[0];
    currentThemeId = themeObj.id;
    document.documentElement.setAttribute('data-theme', currentThemeId);
    localStorage.setItem(STORAGE_THEME, currentThemeId);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta && themeColors[currentThemeId]) {
      meta.setAttribute('content', themeColors[currentThemeId]);
    }

    if (themePopover) {
      themePopover.querySelectorAll('.theme-card').forEach(card => {
        const isActive = card.dataset.theme === currentThemeId;
        card.classList.toggle('active', isActive);
        card.setAttribute('aria-checked', isActive ? 'true' : 'false');
      });
    }

    if (showFeedback) {
      showHud(ICONS.theme, themeObj.name);
    }
  }

  function cycleTheme() {
    const currentIdx = THEMES.findIndex(t => t.id === currentThemeId);
    const nextIdx = (currentIdx + 1) % THEMES.length;
    setTheme(THEMES[nextIdx].id, true);
  }

  // --- Demo Video Feature ---
  const DEMO_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  const DEMO_VIDEO_NAME = 'Big Buck Bunny (Aura Showcase Demo)';

  function playDemoVideo() {
    let demoIdx = playlist.findIndex(item => item.url === DEMO_VIDEO_URL);
    if (demoIdx === -1) {
      playlist.push({
        type: 'url',
        isEmbed: false,
        url: DEMO_VIDEO_URL,
        name: DEMO_VIDEO_NAME,
        size: 0
      });
      renderPlaylist();
      updatePlaylistBadge();
      demoIdx = playlist.length - 1;
    }
    loadVideo(demoIdx);
    dropZone.classList.add('hidden');
    showHud(ICONS.play, 'Showcase Demo Loaded');
  }

  // --- Initialize Saved Preferences ---
  function initPreferences() {
    initTheme();
    initAmbientLighting();

    const savedVolume = localStorage.getItem(STORAGE_VOLUME);
    if (savedVolume !== null) {
      video.volume = parseFloat(savedVolume);
      volumeSlider.value = savedVolume;
    } else {
      video.volume = 1;
      volumeSlider.value = 1;
    }

    const savedMuted = localStorage.getItem(STORAGE_MUTED);
    if (savedMuted === 'true') {
      video.muted = true;
    }
    updateVolumeUI();

    const savedSpeed = localStorage.getItem(STORAGE_SPEED);
    if (savedSpeed) {
      setPlaybackSpeed(parseFloat(savedSpeed), false);
    } else {
      setPlaybackSpeed(1.0, false);
    }
  }

  // --- Format Utilities ---
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  // --- HUD Feedback Flash ---
  function showHud(iconSvg, text = '') {
    hudIcon.innerHTML = iconSvg;
    if (text) {
      hudText.textContent = text;
      feedbackHud.classList.remove('icon-only');
    } else {
      hudText.textContent = '';
      feedbackHud.classList.add('icon-only');
    }

    // Force animation restart
    feedbackHud.classList.remove('active');
    void feedbackHud.offsetWidth;
    feedbackHud.classList.add('active');

    clearTimeout(hudTimeout);
    const duration = text ? 600 : 450;
    hudTimeout = setTimeout(() => {
      feedbackHud.classList.remove('active');
    }, duration);
  }

  // --- Auto-Hide Controls on Inactivity ---
  let isHoveringControls = false;

  function resetControlsTimeout() {
    playerOverlay.classList.remove('inactive');
    playerWrapper.classList.remove('hide-cursor');

    clearTimeout(controlsTimeout);
    if (!video.paused && !isHoveringControls && !isAnyPopoverOpen()) {
      controlsTimeout = setTimeout(() => {
        if (!video.paused && !isHoveringControls && !isAnyPopoverOpen()) {
          playerOverlay.classList.add('inactive');
          playerWrapper.classList.add('hide-cursor');
        }
      }, 3000);
    }
  }

  function isAnyPopoverOpen() {
    return (
      speedMenu.classList.contains('open') ||
      filterPopover.classList.contains('open') ||
      subtitlePopover.classList.contains('open') ||
      (themePopover && themePopover.classList.contains('open')) ||
      playlistDrawer.classList.contains('open') ||
      shortcutsDialog.open ||
      (urlDialog && urlDialog.open) ||
      (downloadDialog && downloadDialog.open)
    );
  }

  // --- URL & Web Stream Parser ---
  function parseVideoUrl(rawUrl) {
    const url = (rawUrl || '').trim();
    if (!url) return null;

    // YouTube: standard watch?v=, youtu.be/, shorts/, embed/
    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (ytMatch) {
      const videoId = ytMatch[1];
      return {
        type: 'youtube',
        isEmbed: true,
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`,
        name: `YouTube: ${videoId}`,
        url
      };
    }

    // Vimeo: vimeo.com/123456
    const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/i);
    if (vimeoMatch) {
      const videoId = vimeoMatch[1];
      return {
        type: 'vimeo',
        isEmbed: true,
        embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1`,
        name: `Vimeo: ${videoId}`,
        url
      };
    }

    // Twitch: twitch.tv/videos/123456 or twitch.tv/channel
    const twitchVideoMatch = url.match(/twitch\.tv\/videos\/(\d+)/i);
    if (twitchVideoMatch) {
      const videoId = twitchVideoMatch[1];
      const host = window.location.hostname || 'localhost';
      return {
        type: 'twitch',
        isEmbed: true,
        embedUrl: `https://player.twitch.tv/?video=${videoId}&parent=${host}&autoplay=true`,
        name: `Twitch Video: ${videoId}`,
        url
      };
    }
    const twitchChannelMatch = url.match(/twitch\.tv\/([a-zA-Z0-9_]{3,25})/i);
    if (twitchChannelMatch && !['directory', 'p', 'downloads'].includes(twitchChannelMatch[1].toLowerCase())) {
      const channel = twitchChannelMatch[1];
      const host = window.location.hostname || 'localhost';
      return {
        type: 'twitch',
        isEmbed: true,
        embedUrl: `https://player.twitch.tv/?channel=${channel}&parent=${host}&autoplay=true`,
        name: `Twitch Stream: ${channel}`,
        url
      };
    }

    // Dailymotion: dailymotion.com/video/x123 or dai.ly/x123
    const dmMatch = url.match(/(?:dailymotion\.com\/video\/|dai\.ly\/)([a-zA-Z0-9]+)/i);
    if (dmMatch) {
      const videoId = dmMatch[1];
      return {
        type: 'dailymotion',
        isEmbed: true,
        embedUrl: `https://www.dailymotion.com/embed/video/${videoId}?autoplay=1`,
        name: `Dailymotion: ${videoId}`,
        url
      };
    }

    // Streamable: streamable.com/abcde
    const streamableMatch = url.match(/streamable\.com\/([a-zA-Z0-9]+)/i);
    if (streamableMatch) {
      const videoId = streamableMatch[1];
      return {
        type: 'streamable',
        isEmbed: true,
        embedUrl: `https://streamable.com/e/${videoId}?autoplay=1`,
        name: `Streamable: ${videoId}`,
        url
      };
    }

    // Google Drive: drive.google.com/file/d/ID/view
    const gdriveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
    if (gdriveMatch) {
      const fileId = gdriveMatch[1];
      return {
        type: 'gdrive',
        isEmbed: true,
        embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        name: `Google Drive Video (${fileId.slice(0, 8)}...)`,
        url
      };
    }

    // Loom: loom.com/share/ID or loom.com/embed/ID
    const loomMatch = url.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/i);
    if (loomMatch) {
      const videoId = loomMatch[1];
      return {
        type: 'loom',
        isEmbed: true,
        embedUrl: `https://www.loom.com/embed/${videoId}?autoplay=1`,
        name: `Loom Video: ${videoId}`,
        url
      };
    }

    // HLS Stream (.m3u8)
    if (url.toLowerCase().includes('.m3u8')) {
      return {
        type: 'hls',
        isEmbed: false,
        name: extractNameFromUrl(url) || 'Live HLS Stream',
        url
      };
    }

    // Direct Video Link (.mp4, .webm, .ogg, etc.) or generic URL
    return {
      type: 'direct',
      isEmbed: false,
      name: extractNameFromUrl(url) || 'Online Video Stream',
      url
    };
  }

  function extractNameFromUrl(url) {
    try {
      const u = new URL(url);
      const segment = u.pathname.split('/').filter(Boolean).pop();
      return segment ? decodeURIComponent(segment) : null;
    } catch {
      return null;
    }
  }

  function addUrlToPlaylist(urlStr, playImmediately = false) {
    const parsed = parseVideoUrl(urlStr);
    if (!parsed) {
      alert('Please enter a valid video link.');
      return;
    }

    playlist.push({
      type: parsed.type,
      isEmbed: parsed.isEmbed,
      embedUrl: parsed.embedUrl,
      url: parsed.url,
      name: parsed.name,
      size: 0
    });

    renderPlaylist();
    updatePlaylistBadge();

    if (playImmediately || currentIndex === -1) {
      loadVideo(playlist.length - 1);
    } else {
      showHud(ICONS.play, 'Added to Queue');
    }
  }

  // --- Playlist & Video Loading ---
  function addFilesToPlaylist(files) {
    const videoExtensions = ['.mp4', '.mkv', '.webm', '.mov', '.avi', '.m4v', '.ogg'];
    const validFiles = Array.from(files).filter(f => {
      const name = f.name.toLowerCase();
      return f.type.startsWith('video/') || videoExtensions.some(ext => name.endsWith(ext));
    });

    if (validFiles.length === 0) return;

    validFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      playlist.push({
        type: 'local',
        isEmbed: false,
        file,
        url,
        name: file.name,
        size: file.size
      });
    });

    renderPlaylist();
    updatePlaylistBadge();

    // If currently empty or stopped, auto-play first added file
    if (currentIndex === -1 && playlist.length > 0) {
      loadVideo(0);
    }
  }

  function loadVideo(index) {
    if (index < 0 || index >= playlist.length) return;

    // Save previous video position if it was a native video
    if (currentIndex >= 0 && playlist[currentIndex] && !playlist[currentIndex].isEmbed) {
      savePlaybackPosition(playlist[currentIndex].name, video.currentTime);
    }

    currentIndex = index;
    hasResumedCurrentTrack = false;
    const item = playlist[currentIndex];

    // Clean up any existing HLS stream
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }

    dropZone.classList.add('hidden');
    renderPlaylist();

    if (item.isEmbed) {
      // --- Embedded Player Mode (YouTube / Vimeo) ---
      video.pause();
      video.removeAttribute('src');
      video.load();
      embedFrame.src = item.embedUrl;
      embedFrame.style.display = 'block';
      playerWrapper.classList.add('is-embed');
      playerWrapper.classList.add('playing');

      videoTitle.textContent = item.name;
      videoTitle.title = item.name;
      videoMetaBadge.textContent = `${item.type.toUpperCase()} EMBED`;
      showHud(ICONS.play, `${item.type.toUpperCase()} Stream`);
    } else {
      // --- Native HTML5 Video Mode ---
      embedFrame.src = '';
      embedFrame.style.display = 'none';
      playerWrapper.classList.remove('is-embed');

      videoTitle.textContent = item.name;
      videoTitle.title = item.name;
      videoMetaBadge.textContent = item.size ? `${formatBytes(item.size)}` : 'ONLINE STREAM';

      if (item.type === 'hls') {
        if (window.Hls && Hls.isSupported()) {
          hlsInstance = new Hls();
          hlsInstance.loadSource(item.url);
          hlsInstance.attachMedia(video);
          hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {});
          });
          hlsInstance.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              showHud(ICONS.pause, 'Stream Error');
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = item.url;
        } else {
          alert('HLS stream playback is not supported in this browser.');
          return;
        }
      } else {
        video.src = item.url;
      }

      video.load();
      if (video.readyState >= 1) {
        handleMetadataLoaded();
      }
      video.play().catch(err => {
        console.log('Autoplay prevented or waiting for interaction:', err);
      });
    }
  }

  function handleMetadataLoaded() {
    if (!video.duration || isNaN(video.duration)) return;
    const item = playlist[currentIndex];
    if (!item || item.isEmbed) return;

    if (!hasResumedCurrentTrack) {
      hasResumedCurrentTrack = true;
      const resumePos = getSavedPlaybackPosition(item.name);
      if (resumePos && resumePos > 5 && resumePos < video.duration - 10) {
        video.currentTime = resumePos;
        showHud(ICONS.play, `Resumed at ${formatTime(resumePos)}`);
      }
    }

    const sizeStr = item.size ? formatBytes(item.size) : 'STREAM';
    videoMetaBadge.textContent = `${formatTime(video.duration)} • ${video.videoWidth || '0'}x${video.videoHeight || '0'} • ${sizeStr}`;
    updateTimelineProgress();
  }

  function renderPlaylist() {
    playlistList.innerHTML = '';
    playlist.forEach((item, idx) => {
      const li = document.createElement('li');
      li.className = `playlist-item ${idx === currentIndex ? 'active' : ''}`;
      li.innerHTML = `
        <div class="track-meta">
          <span class="track-index">${idx + 1}</span>
          <span class="track-name" title="${item.name}">${item.name}</span>
        </div>
        <div class="track-actions">
          <button class="track-action-btn track-download-btn" title="Download video" data-index="${idx}" type="button">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </button>
          <button class="track-action-btn track-remove-btn" title="Remove track" data-index="${idx}" type="button">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      `;

      li.addEventListener('click', (e) => {
        if (!e.target.closest('.track-action-btn')) {
          loadVideo(idx);
        }
      });

      const downloadBtnEl = li.querySelector('.track-download-btn');
      if (downloadBtnEl) {
        downloadBtnEl.addEventListener('click', (e) => {
          e.stopPropagation();
          downloadVideoItem(item);
        });
      }

      const removeBtn = li.querySelector('.track-remove-btn');
      if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          removePlaylistItem(idx);
        });
      }

      playlistList.appendChild(li);
    });

    updatePlaylistBadge();
  }

  function removePlaylistItem(idx) {
    if (idx < 0 || idx >= playlist.length) return;
    if (playlist[idx].url && playlist[idx].url.startsWith('blob:')) {
      URL.revokeObjectURL(playlist[idx].url);
    }
    playlist.splice(idx, 1);

    if (playlist.length === 0) {
      clearAllPlaylist();
    } else if (idx === currentIndex) {
      const nextIdx = idx >= playlist.length ? 0 : idx;
      loadVideo(nextIdx);
    } else if (idx < currentIndex) {
      currentIndex--;
      renderPlaylist();
    } else {
      renderPlaylist();
    }
  }

  function clearAllPlaylist() {
    playlist.forEach(item => {
      if (item.url && item.url.startsWith('blob:')) {
        URL.revokeObjectURL(item.url);
      }
    });
    playlist = [];
    currentIndex = -1;
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
    video.pause();
    video.removeAttribute('src');
    video.load();
    embedFrame.src = '';
    embedFrame.style.display = 'none';
    playerWrapper.classList.remove('is-embed');

    dropZone.classList.remove('hidden');
    videoTitle.textContent = 'No video selected';
    videoMetaBadge.textContent = '00:00 • 0p';
    renderPlaylist();
  }

  function updatePlaylistBadge() {
    const count = playlist.length;
    playlistCountBadge.textContent = count;
    queueTotalBadge.textContent = `${count} video${count === 1 ? '' : 's'}`;
  }

  function playNextTrack() {
    if (playlist.length <= 1) return;
    const nextIdx = (currentIndex + 1) % playlist.length;
    loadVideo(nextIdx);
  }

  function playPrevTrack() {
    if (playlist.length <= 1) return;
    if (video.currentTime > 3) {
      video.currentTime = 0;
      return;
    }
    const prevIdx = (currentIndex - 1 + playlist.length) % playlist.length;
    loadVideo(prevIdx);
  }

  // --- Resume Playback Store ---
  function savePlaybackPosition(fileName, time) {
    try {
      const store = JSON.parse(localStorage.getItem(STORAGE_RESUME_POS) || '{}');
      store[fileName] = Math.floor(time);
      localStorage.setItem(STORAGE_RESUME_POS, JSON.stringify(store));
    } catch {
      // Ignore quota errors
    }
  }

  function getSavedPlaybackPosition(fileName) {
    try {
      const store = JSON.parse(localStorage.getItem(STORAGE_RESUME_POS) || '{}');
      return store[fileName] || null;
    } catch {
      return null;
    }
  }

  // --- Play / Pause Controls ---
  async function togglePlay() {
    if (playlist.length === 0 || currentIndex === -1) return;
    const item = playlist[currentIndex];
    if (!item) return;

    if (item.isEmbed) {
      showHud(ICONS.play, 'Control in video frame');
      return;
    }

    try {
      if (video.paused || video.ended) {
        await video.play();
        playerWrapper.classList.add('playing');
        showHud(ICONS.play, '');
      } else {
        video.pause();
        playerWrapper.classList.remove('playing');
        showHud(ICONS.pause, '');
      }
    } catch (err) {
      console.warn('Playback error / Autoplay blocked:', err);
    }
  }

  // --- Seeking / Time Scrubbing ---
  function seekRelative(seconds) {
    if (!video.src || !video.duration) return;

    if (pendingSeekTarget === null) {
      wasPlayingBeforeSeek = !video.paused && !video.ended;
    }

    const baseTime = pendingSeekTarget !== null ? pendingSeekTarget : video.currentTime;
    const targetTime = Math.max(0, Math.min(video.duration, baseTime + seconds));
    pendingSeekTarget = targetTime;

    const diff = Math.round(targetTime - video.currentTime);
    if (diff > 0) {
      showHud(ICONS.forward, `+${diff}s`);
    } else if (diff < 0) {
      showHud(ICONS.rewind, `${diff}s`);
    }

    // Snappy visual timeline feedback
    const pct = (targetTime / video.duration) * 100;
    timelineProgress.style.width = `${pct}%`;
    timelineThumb.style.left = `${pct}%`;
    currentTimeEl.textContent = formatTime(targetTime);

    clearTimeout(seekDebounceTimer);
    seekDebounceTimer = setTimeout(() => {
      const target = pendingSeekTarget;
      pendingSeekTarget = null;
      if (target !== null && !isNaN(target)) {
        if (typeof video.fastSeek === 'function') {
          try {
            video.fastSeek(target);
          } catch {
            video.currentTime = target;
          }
        } else {
          video.currentTime = target;
        }

        if (wasPlayingBeforeSeek && video.paused && !video.ended) {
          video.play().catch(() => {});
        }
      }
    }, 45);
  }

  function handleTimelineSeek(e) {
    if (!video.duration) return;
    const rect = timelineContainer.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetTime = pos * video.duration;

    timelineProgress.style.width = `${pos * 100}%`;
    timelineThumb.style.left = `${pos * 100}%`;
    currentTimeEl.textContent = formatTime(targetTime);

    const wasPlaying = !video.paused && !video.ended;
    if (typeof video.fastSeek === 'function') {
      try {
        video.fastSeek(targetTime);
      } catch {
        video.currentTime = targetTime;
      }
    } else {
      video.currentTime = targetTime;
    }

    if (wasPlaying && video.paused && !video.ended) {
      video.play().catch(() => {});
    }
    updateTimelineProgress();
  }

  function handleTimelineHover(e) {
    if (!video.duration) return;
    const rect = timelineContainer.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetTime = pos * video.duration;

    timelineTooltip.textContent = formatTime(targetTime);
    timelineTooltip.style.left = `${pos * 100}%`;
  }

  function updateTimelineProgress() {
    if (!video.duration) return;
    const current = video.currentTime;
    const duration = video.duration;
    const pct = (current / duration) * 100;

    timelineProgress.style.width = `${pct}%`;
    timelineThumb.style.left = `${pct}%`;

    // Time display
    currentTimeEl.textContent = formatTime(current);
    if (isRemainingTime) {
      const remaining = Math.max(0, duration - current);
      totalDurationEl.textContent = `-${formatTime(remaining)}`;
    } else {
      totalDurationEl.textContent = formatTime(duration);
    }

    // Buffer progress
    if (video.buffered.length > 0) {
      for (let i = 0; i < video.buffered.length; i++) {
        if (video.buffered.start(i) <= current && current <= video.buffered.end(i)) {
          const bufferPct = (video.buffered.end(i) / duration) * 100;
          timelineBuffer.style.width = `${bufferPct}%`;
          break;
        }
      }
    }
  }

  // --- Volume & Mute ---
  function setVolume(val) {
    const clamped = Math.max(0, Math.min(1, val));
    video.volume = clamped;
    volumeSlider.value = clamped;
    if (clamped > 0 && video.muted) {
      video.muted = false;
    }
    localStorage.setItem(STORAGE_VOLUME, clamped);
    updateVolumeUI();
    showHud(ICONS.volumeUp, `${Math.round(clamped * 100)}%`);
  }

  function toggleMute() {
    video.muted = !video.muted;
    localStorage.setItem(STORAGE_MUTED, video.muted);
    updateVolumeUI();
    showHud(video.muted ? ICONS.volumeMute : ICONS.volumeUp, video.muted ? 'Muted' : `${Math.round(video.volume * 100)}%`);
  }

  function updateVolumeUI() {
    const isMuted = video.muted || video.volume === 0;
    const volHigh = muteBtn.querySelector('.icon-vol-high');
    const volLow = muteBtn.querySelector('.icon-vol-low');
    const volMute = muteBtn.querySelector('.icon-vol-mute');

    volHigh.style.display = 'none';
    volLow.style.display = 'none';
    volMute.style.display = 'none';

    if (isMuted) {
      volMute.style.display = 'block';
    } else if (video.volume < 0.5) {
      volLow.style.display = 'block';
    } else {
      volHigh.style.display = 'block';
    }

    if (volumePercent) {
      volumePercent.textContent = `${Math.round(isMuted ? 0 : video.volume * 100)}%`;
    }
  }

  // --- Playback Speed ---
  function setPlaybackSpeed(rawSpeed, flashHud = true) {
    let speed = Math.round(rawSpeed * 100) / 100;
    speed = Math.max(0.25, Math.min(2.0, speed));

    video.playbackRate = speed;
    video.defaultPlaybackRate = speed;
    if ('preservesPitch' in video) video.preservesPitch = true;
    if ('webkitPreservesPitch' in video) video.webkitPreservesPitch = true;
    if ('mozPreservesPitch' in video) video.mozPreservesPitch = true;

    const formatted = speed % 1 === 0 ? `${speed.toFixed(1)}x` : `${speed}x`;
    speedValue.textContent = formatted;

    if (speedSlider) {
      speedSlider.value = speed;
    }
    if (speedSliderValue) {
      speedSliderValue.textContent = `${speed.toFixed(2)}x`;
    }

    localStorage.setItem(STORAGE_SPEED, speed);

    // Update active state across preset chips
    if (speedMenu) {
      speedMenu.querySelectorAll('.preset-chip').forEach(chip => {
        const chipSpeed = parseFloat(chip.dataset.speed);
        if (Math.abs(chipSpeed - speed) < 0.01) {
          chip.classList.add('active');
        } else {
          chip.classList.remove('active');
        }
      });
    }

    if (flashHud) {
      showHud(ICONS.speed, `${formatted} Speed`);
    }
  }

  function changeSpeedStep(delta) {
    const current = video.playbackRate || 1.0;
    const next = Math.round((current + delta) * 100) / 100;
    setPlaybackSpeed(next, true);
  }

  // --- Aspect Ratio Toggle ---
  function cycleAspectRatio() {
    aspectModeIndex = (aspectModeIndex + 1) % aspectModes.length;
    const mode = aspectModes[aspectModeIndex];
    video.style.objectFit = mode;
    showHud(ICONS.play, `Aspect: ${mode.toUpperCase()}`);
  }

  // --- Video Visual Adjustments (Brightness, Contrast, Saturation) ---
  function applyVisualFilters() {
    video.style.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%)`;
    brightnessVal.textContent = `${filters.brightness}%`;
    contrastVal.textContent = `${filters.contrast}%`;
    saturationVal.textContent = `${filters.saturation}%`;
  }

  function resetVisualFilters() {
    filters.brightness = 100;
    filters.contrast = 100;
    filters.saturation = 100;
    brightnessSlider.value = 100;
    contrastSlider.value = 100;
    saturationSlider.value = 100;
    applyVisualFilters();
    showHud(ICONS.play, 'Filters Reset');
  }

  // --- Frame Snapshot Capture ---
  function takeSnapshot() {
    if (!video.src || !video.videoWidth) return;

    snapshotCanvas.width = video.videoWidth;
    snapshotCanvas.height = video.videoHeight;
    const ctx = snapshotCanvas.getContext('2d');
    
    // Apply video filters onto canvas snapshot as well
    ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%)`;
    ctx.drawImage(video, 0, 0, snapshotCanvas.width, snapshotCanvas.height);

    const fileName = playlist[currentIndex] ? playlist[currentIndex].name.replace(/\.[^/.]+$/, "") : 'snapshot';
    const timeFormatted = formatTime(video.currentTime).replace(/:/g, '-');
    const downloadName = `${fileName}_frame_${timeFormatted}.png`;

    snapshotCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showHud(ICONS.snapshot, 'Snapshot Saved');
    }, 'image/png');
  }

  // --- Video Download Feature ---
  async function downloadCurrentVideo() {
    if (currentIndex < 0 || !playlist[currentIndex]) {
      showHud(ICONS.pause, 'No Video Loaded');
      return;
    }
    await downloadVideoItem(playlist[currentIndex]);
  }

  function getConverterUrl(item) {
    const rawUrl = (item && item.url) ? item.url : '';
    // YouTube: direct to ssyoutube converter
    const ytMatch = rawUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (ytMatch) {
      return `https://www.ssyoutube.com/watch?v=${ytMatch[1]}`;
    }
    // Universal SaveFrom fallback (Vimeo, Twitch, etc.)
    return `https://en.savefrom.net/248/#url=${encodeURIComponent(rawUrl)}`;
  }

  function openDownloadModal(item) {
    if (!item) return;
    currentDownloadItem = item;

    if (downloadPlatformBadge) {
      downloadPlatformBadge.textContent = (item.type || 'WEB').toUpperCase();
    }
    if (downloadVideoTitle) {
      downloadVideoTitle.textContent = item.name || 'Video';
    }
    if (downloadVideoUrl) {
      downloadVideoUrl.textContent = item.url || '';
    }

    if (downloadDialog) {
      downloadDialog.showModal();
    }
  }

  async function downloadVideoItem(item) {
    if (!item) return;

    if (item.isEmbed) {
      // For YouTube/Vimeo/etc. embeds, open the interactive Download Dialog
      openDownloadModal(item);
      return;
    }

    const safeName = (item.name || 'video').trim();
    const filename = safeName.includes('.') ? safeName : `${safeName}.mp4`;
    showHud(ICONS.download, 'Starting Download...');

    try {
      if (item.file) {
        const blobUrl = URL.createObjectURL(item.file);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
        showHud(ICONS.download, 'Download Saved');
        return;
      }

      if (item.url && item.url.startsWith('blob:')) {
        const a = document.createElement('a');
        a.href = item.url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showHud(ICONS.download, 'Download Saved');
        return;
      }

      if (item.url) {
        // Try direct blob fetch if CORS allows
        try {
          const res = await fetch(item.url);
          if (res.ok) {
            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
            showHud(ICONS.download, 'Download Completed');
            return;
          }
        } catch (fetchErr) {
          console.warn('CORS blob fetch failed, falling back to direct anchor download', fetchErr);
        }

        // Anchor download fallback
        const a = document.createElement('a');
        a.href = item.url;
        a.download = filename;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showHud(ICONS.download, 'Download Triggered');
      }
    } catch (err) {
      console.error('Download error:', err);
      showHud(ICONS.pause, 'Download Failed');
    }
  }

  // --- Picture in Picture ---
  async function togglePiP() {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled && video.src) {
        await video.requestPictureInPicture();
      }
    } catch (err) {
      console.warn('PiP not supported or failed:', err);
    }
  }

  // --- Fullscreen ---
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      playerWrapper.requestFullscreen().then(() => {
        playerWrapper.classList.add('is-fullscreen');
      }).catch(err => console.error(err));
    } else {
      document.exitFullscreen().then(() => {
        playerWrapper.classList.remove('is-fullscreen');
      }).catch(err => console.error(err));
    }
  }

  // --- Subtitles Engine (SRT to WebVTT Converter & Track Loader) ---
  function parseSRTtoVTT(srtText, offsetSeconds = 0) {
    let vtt = 'WEBVTT\n\n';
    // Normalize newlines
    const normalized = srtText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const blocks = normalized.trim().split(/\n\s*\n/);

    for (const block of blocks) {
      const lines = block.split('\n');
      if (lines.length < 2) continue;

      let timeIndex = 0;
      // Skip numeric index if present
      if (/^\d+$/.test(lines[0].trim())) {
        timeIndex = 1;
      }

      const timeLine = lines[timeIndex];
      if (!timeLine || !timeLine.includes('-->')) continue;

      const [startRaw, endRaw] = timeLine.split('-->').map(s => s.trim());
      const startTime = shiftTimestamp(startRaw, offsetSeconds);
      const endTime = shiftTimestamp(endRaw, offsetSeconds);

      const textLines = lines.slice(timeIndex + 1).join('\n');
      vtt += `${startTime} --> ${endTime}\n${textLines}\n\n`;
    }

    return vtt;
  }

  function shiftTimestamp(timeStr, offsetSeconds) {
    // 00:00:20,000 or 00:00:20.000
    const parts = timeStr.replace(',', '.').split(':');
    if (parts.length < 3) return timeStr;

    const h = parseFloat(parts[0]);
    const m = parseFloat(parts[1]);
    const s = parseFloat(parts[2]);

    let totalSeconds = h * 3600 + m * 60 + s + offsetSeconds;
    totalSeconds = Math.max(0, totalSeconds);

    const newH = Math.floor(totalSeconds / 3600);
    const newM = Math.floor((totalSeconds % 3600) / 60);
    const newS = (totalSeconds % 60).toFixed(3);

    return `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}:${newS.toString().padStart(6, '0')}`;
  }

  function loadSubtitleFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      currentSubtitleRaw = content;
      applySubtitleContent();
      subtitleFileInfo.textContent = `${file.name}`;
      showHud(ICONS.play, 'Subtitles Loaded');
    };
    reader.readAsText(file);
  }

  function applySubtitleContent() {
    if (!currentSubtitleRaw) return;
    if (currentSubtitleUrl) {
      URL.revokeObjectURL(currentSubtitleUrl);
    }

    const vttContent = currentSubtitleRaw.startsWith('WEBVTT')
      ? currentSubtitleRaw
      : parseSRTtoVTT(currentSubtitleRaw, subtitleOffset);

    const blob = new Blob([vttContent], { type: 'text/vtt' });
    currentSubtitleUrl = URL.createObjectURL(blob);
    subtitleTrack.src = currentSubtitleUrl;
    subtitleTrack.mode = subtitleToggleCheckbox.checked ? 'showing' : 'hidden';
  }

  // --- Keyboard Shortcuts Manager ---
  function handleKeyDown(e) {
    // Don't intercept if typing in a modal or input
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

    resetControlsTimeout();

    switch (e.key.toLowerCase()) {
      case ' ':
      case 'k':
        e.preventDefault();
        togglePlay();
        break;

      case 'f':
        e.preventDefault();
        toggleFullscreen();
        break;

      case 'm':
        e.preventDefault();
        toggleMute();
        break;

      case 'arrowleft':
        e.preventDefault();
        seekRelative(-5);
        break;

      case 'arrowright':
        e.preventDefault();
        seekRelative(5);
        break;

      case 'j':
        e.preventDefault();
        seekRelative(-10);
        break;

      case 'l':
        e.preventDefault();
        seekRelative(10);
        break;

      case 'arrowup':
        e.preventDefault();
        setVolume(video.volume + 0.05);
        break;

      case 'arrowdown':
        e.preventDefault();
        setVolume(video.volume - 0.05);
        break;

      case '[':
        e.preventDefault();
        changeSpeedStep(-0.25);
        break;

      case ']':
        e.preventDefault();
        changeSpeedStep(0.25);
        break;

      case 's':
        e.preventDefault();
        takeSnapshot();
        break;

      case 'd':
      case 'D':
        e.preventDefault();
        downloadCurrentVideo();
        break;

      case 'p':
        e.preventDefault();
        togglePiP();
        break;

      case 'c':
        e.preventDefault();
        subtitleToggleCheckbox.checked = !subtitleToggleCheckbox.checked;
        subtitleTrack.mode = subtitleToggleCheckbox.checked ? 'showing' : 'hidden';
        showHud(ICONS.play, subtitleToggleCheckbox.checked ? 'Subtitles ON' : 'Subtitles OFF');
        break;

      case 'n':
        e.preventDefault();
        if (e.shiftKey) {
          playPrevTrack();
        } else {
          playNextTrack();
        }
        break;

      case 'o':
        e.preventDefault();
        videoFileInput.click();
        break;

      case 'u':
        e.preventDefault();
        openUrlModal();
        break;

      case 't':
        e.preventDefault();
        cycleTheme();
        break;

      case 'a':
        e.preventDefault();
        toggleAmbientLighting();
        break;

      case '?':
        e.preventDefault();
        shortcutsDialog.showModal();
        break;

      case 'escape':
        closeAllPopovers();
        break;
    }
  }

  function closeAllPopovers() {
    speedMenu.classList.remove('open');
    filterPopover.classList.remove('open');
    subtitlePopover.classList.remove('open');
    if (themePopover) themePopover.classList.remove('open');
    if (shortcutsDialog.open) shortcutsDialog.close();
    if (urlDialog && urlDialog.open) urlDialog.close();
    if (downloadDialog && downloadDialog.open) downloadDialog.close();
  }

  // --- Attach Event Listeners ---
  function setupEventListeners() {
    // Playback state updates
    video.addEventListener('play', () => {
      playerWrapper.classList.add('playing');
      resetControlsTimeout();
      startAmbientRenderLoop();
    });

    video.addEventListener('pause', () => {
      playerWrapper.classList.remove('playing');
      resetControlsTimeout();
      stopAmbientRenderLoop();
    });

    video.addEventListener('timeupdate', () => {
      if (!isDraggingTimeline) {
        updateTimelineProgress();
      }
      // Save playback position periodically
      if (playlist[currentIndex] && video.currentTime > 2) {
        savePlaybackPosition(playlist[currentIndex].name, video.currentTime);
      }
    });

    video.addEventListener('ended', () => {
      stopAmbientRenderLoop();
      if (playlist.length > 1) {
        playNextTrack();
      } else {
        playerWrapper.classList.remove('playing');
      }
    });

    // Persistent Video Event Listeners
    video.addEventListener('loadedmetadata', handleMetadataLoaded);
    video.addEventListener('loadeddata', renderAmbientFrame);
    video.addEventListener('durationchange', handleMetadataLoaded);

    video.addEventListener('seeking', () => {
      playerWrapper.classList.add('buffering');
    });

    video.addEventListener('seeked', () => {
      playerWrapper.classList.remove('buffering');
      updateTimelineProgress();
      renderAmbientFrame();
      if (wasPlayingBeforeSeek && video.paused && !video.ended) {
        video.play().catch(() => {});
      }
    });

    video.addEventListener('waiting', () => {
      playerWrapper.classList.add('buffering');
    });

    video.addEventListener('playing', () => {
      playerWrapper.classList.remove('buffering');
      playerWrapper.classList.add('playing');
    });

    video.addEventListener('canplay', () => {
      playerWrapper.classList.remove('buffering');
      if (wasPlayingBeforeSeek && video.paused && !video.ended) {
        video.play().catch(() => {});
      }
    });

    video.addEventListener('error', () => {
      const err = video.error;
      let msg = 'Failed to load video';
      if (err) {
        if (err.code === 4) msg = 'Format not supported or network error';
        else if (err.code === 3) msg = 'Playback aborted';
        else if (err.code === 2) msg = 'Network error loading video';
      }
      showHud(ICONS.pause, msg);
      videoMetaBadge.textContent = msg;
      playerWrapper.classList.remove('playing');
    });

    // Click anywhere on player to toggle play/pause
    playerWrapper.addEventListener('click', (e) => {
      if (e.target.closest('.top-bar') ||
          e.target.closest('.bottom-bar') ||
          e.target.closest('.playlist-drawer') ||
          e.target.closest('.popover-card') ||
          e.target.closest('.popover-menu') ||
          e.target.closest('.modal-dialog') ||
          e.target.closest('.drop-zone') ||
          playerWrapper.classList.contains('is-embed')) {
        return;
      }
      togglePlay();
    });

    // Double click player for fullscreen
    playerWrapper.addEventListener('dblclick', (e) => {
      if (e.target.closest('.top-bar') ||
          e.target.closest('.bottom-bar') ||
          e.target.closest('.playlist-drawer') ||
          e.target.closest('.popover-card') ||
          e.target.closest('.popover-menu') ||
          e.target.closest('.modal-dialog') ||
          e.target.closest('.drop-zone') ||
          playerWrapper.classList.contains('is-embed')) {
        return;
      }
      toggleFullscreen();
    });

    // Mouse Activity on Player Wrapper
    playerWrapper.addEventListener('mousemove', resetControlsTimeout);
    playerWrapper.addEventListener('pointerdown', resetControlsTimeout);

    // Keep controls visible while hovering over top or bottom bars
    const bottomBarEl = document.getElementById('bottomBar');
    const topBarEl = document.getElementById('topBar');
    if (bottomBarEl) {
      bottomBarEl.addEventListener('mouseenter', () => { isHoveringControls = true; resetControlsTimeout(); });
      bottomBarEl.addEventListener('mouseleave', () => { isHoveringControls = false; resetControlsTimeout(); });
    }
    if (topBarEl) {
      topBarEl.addEventListener('mouseenter', () => { isHoveringControls = true; resetControlsTimeout(); });
      topBarEl.addEventListener('mouseleave', () => { isHoveringControls = false; resetControlsTimeout(); });
    }

    // Wheel over player adjusts volume
    playerWrapper.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.05 : -0.05;
      setVolume(video.volume + delta);
    }, { passive: false });

    // Buttons
    playPauseBtn.addEventListener('click', togglePlay);
    rewindBtn.addEventListener('click', () => seekRelative(-10));

    // Forward Button (Tap = +10s, Hold = 2x Fast Forward)
    let forwardHoldTimer = null;
    let isHoldingFastForward = false;
    let preHoldSpeed = 1.0;

    const startFastForwardHold = () => {
      if (!video.src || !video.duration) return;
      forwardHoldTimer = setTimeout(() => {
        isHoldingFastForward = true;
        preHoldSpeed = video.playbackRate || 1.0;
        setPlaybackSpeed(2.0, false);
        showHud(ICONS.forward, '2.0x Fast Forward »');
        if (video.paused && !video.ended) {
          video.play().catch(() => {});
        }
      }, 260);
    };

    const stopFastForwardHold = () => {
      if (forwardHoldTimer) {
        clearTimeout(forwardHoldTimer);
        forwardHoldTimer = null;
      }
      if (isHoldingFastForward) {
        isHoldingFastForward = false;
        setPlaybackSpeed(preHoldSpeed, false);
        showHud(ICONS.play, `${preHoldSpeed}x Speed`);
      }
    };

    forwardBtn.addEventListener('mousedown', startFastForwardHold);
    forwardBtn.addEventListener('mouseup', () => {
      if (!isHoldingFastForward) {
        seekRelative(10);
      }
      stopFastForwardHold();
    });
    forwardBtn.addEventListener('mouseleave', stopFastForwardHold);
    forwardBtn.addEventListener('touchstart', startFastForwardHold, { passive: true });
    forwardBtn.addEventListener('touchend', () => {
      if (!isHoldingFastForward) {
        seekRelative(10);
      }
      stopFastForwardHold();
    });

    prevTrackBtn.addEventListener('click', playPrevTrack);
    nextTrackBtn.addEventListener('click', playNextTrack);
    muteBtn.addEventListener('click', toggleMute);
    aspectRatioBtn.addEventListener('click', cycleAspectRatio);
    snapshotBtn.addEventListener('click', takeSnapshot);
    if (downloadBtn) {
      downloadBtn.addEventListener('click', downloadCurrentVideo);
    }
    if (downloadTopBtn) {
      downloadTopBtn.addEventListener('click', downloadCurrentVideo);
    }
    pipBtn.addEventListener('click', togglePiP);
    fullscreenBtn.addEventListener('click', toggleFullscreen);

    // Time toggle
    timeDisplay.addEventListener('click', () => {
      isRemainingTime = !isRemainingTime;
      updateTimelineProgress();
    });

    // Volume Slider
    volumeSlider.addEventListener('input', (e) => {
      setVolume(parseFloat(e.target.value));
    });

    // Timeline Scrubber Click & Drag
    timelineContainer.addEventListener('click', (e) => {
      if (!isDraggingTimeline) {
        handleTimelineSeek(e);
      }
    });
    timelineContainer.addEventListener('mousemove', handleTimelineHover);

    let wasPlayingBeforeDrag = false;
    let scrubTargetTime = null;
    let scrubRafId = null;

    timelineContainer.addEventListener('mousedown', (e) => {
      if (!video.duration) return;
      isDraggingTimeline = true;
      timelineContainer.classList.add('dragging');
      wasPlayingBeforeDrag = !video.paused && !video.ended;
      if (wasPlayingBeforeDrag) {
        video.pause();
      }

      const computeScrubTime = (ev) => {
        const rect = timelineContainer.getBoundingClientRect();
        const pos = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
        return pos * video.duration;
      };

      scrubTargetTime = computeScrubTime(e);
      const initialPos = (scrubTargetTime / video.duration) * 100;
      timelineProgress.style.width = `${initialPos}%`;
      timelineThumb.style.left = `${initialPos}%`;
      currentTimeEl.textContent = formatTime(scrubTargetTime);

      const onMouseMove = (ev) => {
        if (!isDraggingTimeline || !video.duration) return;
        scrubTargetTime = computeScrubTime(ev);
        const p = (scrubTargetTime / video.duration) * 100;

        timelineProgress.style.width = `${p}%`;
        timelineThumb.style.left = `${p}%`;
        currentTimeEl.textContent = formatTime(scrubTargetTime);
        timelineTooltip.textContent = formatTime(scrubTargetTime);
        timelineTooltip.style.left = `${p}%`;

        // Smooth frame preview via requestAnimationFrame without overloading decoder
        if (!scrubRafId) {
          scrubRafId = requestAnimationFrame(() => {
            if (typeof video.fastSeek === 'function') {
              try { video.fastSeek(scrubTargetTime); } catch { video.currentTime = scrubTargetTime; }
            } else {
              video.currentTime = scrubTargetTime;
            }
            scrubRafId = null;
          });
        }
      };

      const onMouseUp = () => {
        isDraggingTimeline = false;
        timelineContainer.classList.remove('dragging');
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        if (scrubRafId) {
          cancelAnimationFrame(scrubRafId);
          scrubRafId = null;
        }

        if (video.duration && scrubTargetTime !== null && !isNaN(scrubTargetTime)) {
          video.currentTime = scrubTargetTime;
          scrubTargetTime = null;
        }

        if (wasPlayingBeforeDrag && video.paused && !video.ended) {
          video.play().catch(() => {});
        }
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    // Speed Popover & Controls
    if (speedBtn) {
      speedBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        speedMenu.classList.toggle('open');
        if (filterPopover) filterPopover.classList.remove('open');
        if (subtitlePopover) subtitlePopover.classList.remove('open');
        if (themePopover) themePopover.classList.remove('open');
      });
    }

    if (resetSpeedBtn) {
      resetSpeedBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setPlaybackSpeed(1.0, true);
      });
    }

    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => {
        setPlaybackSpeed(parseFloat(e.target.value), false);
      });
      speedSlider.addEventListener('change', (e) => {
        const val = parseFloat(e.target.value);
        showHud(ICONS.speed, `${val.toFixed(2)}x Speed`);
      });
    }



    if (speedMenu) {
      speedMenu.querySelectorAll('.preset-chip').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          setPlaybackSpeed(parseFloat(btn.dataset.speed), true);
        });
      });
    }

    // Filters Popover
    filterToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      filterPopover.classList.toggle('open');
      speedMenu.classList.remove('open');
      subtitlePopover.classList.remove('open');
      if (themePopover) themePopover.classList.remove('open');
    });

    brightnessSlider.addEventListener('input', (e) => {
      filters.brightness = parseInt(e.target.value);
      applyVisualFilters();
    });

    contrastSlider.addEventListener('input', (e) => {
      filters.contrast = parseInt(e.target.value);
      applyVisualFilters();
    });

    saturationSlider.addEventListener('input', (e) => {
      filters.saturation = parseInt(e.target.value);
      applyVisualFilters();
    });

    resetFiltersBtn.addEventListener('click', resetVisualFilters);

    // Subtitle Popover & Actions
    subtitleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      subtitlePopover.classList.toggle('open');
      speedMenu.classList.remove('open');
      filterPopover.classList.remove('open');
      if (themePopover) themePopover.classList.remove('open');
    });

    closeSubtitlePopoverBtn.addEventListener('click', () => {
      subtitlePopover.classList.remove('open');
    });

    // Theme Popover & Actions
    if (themeToggleBtn && themePopover) {
      themeToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        themePopover.classList.toggle('open');
        speedMenu.classList.remove('open');
        filterPopover.classList.remove('open');
        subtitlePopover.classList.remove('open');
      });
    }

    if (closeThemePopoverBtn && themePopover) {
      closeThemePopoverBtn.addEventListener('click', () => {
        themePopover.classList.remove('open');
      });
    }

    if (themePopover) {
      themePopover.querySelectorAll('.theme-card').forEach(card => {
        card.addEventListener('click', (e) => {
          e.stopPropagation();
          const selectedTheme = card.dataset.theme;
          if (selectedTheme) {
            setTheme(selectedTheme, true);
          }
        });
      });
    }

    // Ambient Lighting Toggle
    if (ambientToggleBtn) {
      ambientToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleAmbientLighting();
      });
    }

    // Quick Paste from Dropzone
    if (btnPasteDrop) {
      btnPasteDrop.addEventListener('click', async (e) => {
        e.stopPropagation();
        try {
          const text = await navigator.clipboard.readText();
          if (text && (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('blob:'))) {
            addUrlToPlaylist(text.trim(), true);
            return;
          }
        } catch (err) {
          console.warn('Clipboard read error:', err);
        }
        openUrlModal();
      });
    }

    // Download Dialog Event Listeners
    if (closeDownloadModal) {
      closeDownloadModal.addEventListener('click', () => {
        if (downloadDialog && downloadDialog.open) downloadDialog.close();
      });
    }
    if (downloadDialog) {
      downloadDialog.addEventListener('click', (e) => {
        if (e.target === downloadDialog) downloadDialog.close();
      });
    }
    if (btnDownloadConverter) {
      btnDownloadConverter.addEventListener('click', () => {
        if (!currentDownloadItem) return;
        const targetUrl = getConverterUrl(currentDownloadItem);
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
        showHud(ICONS.download, 'Opening Downloader...');
        if (downloadDialog && downloadDialog.open) downloadDialog.close();
      });
    }
    if (btnDownloadCopyLink) {
      btnDownloadCopyLink.addEventListener('click', async () => {
        if (!currentDownloadItem || !currentDownloadItem.url) return;
        try {
          await navigator.clipboard.writeText(currentDownloadItem.url);
          showHud(ICONS.download, 'Link Copied to Clipboard!');
        } catch {
          showHud(ICONS.pause, 'Could not copy link');
        }
        if (downloadDialog && downloadDialog.open) downloadDialog.close();
      });
    }
    if (btnDownloadOpenSource) {
      btnDownloadOpenSource.addEventListener('click', () => {
        if (!currentDownloadItem || !currentDownloadItem.url) return;
        window.open(currentDownloadItem.url, '_blank', 'noopener,noreferrer');
        if (downloadDialog && downloadDialog.open) downloadDialog.close();
      });
    }

    subtitleToggleCheckbox.addEventListener('change', (e) => {
      subtitleTrack.mode = e.target.checked ? 'showing' : 'hidden';
    });

    loadSubtitleFileBtn.addEventListener('click', () => {
      subtitleFileInput.click();
    });

    subtitleFileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        loadSubtitleFile(e.target.files[0]);
      }
    });

    offsetPlusBtn.addEventListener('click', () => {
      subtitleOffset += 0.5;
      subtitleOffsetVal.textContent = `${subtitleOffset > 0 ? '+' : ''}${subtitleOffset.toFixed(1)}s`;
      applySubtitleContent();
    });

    offsetMinusBtn.addEventListener('click', () => {
      subtitleOffset -= 0.5;
      subtitleOffsetVal.textContent = `${subtitleOffset > 0 ? '+' : ''}${subtitleOffset.toFixed(1)}s`;
      applySubtitleContent();
    });

    offsetResetBtn.addEventListener('click', () => {
      subtitleOffset = 0;
      subtitleOffsetVal.textContent = `0.0s`;
      applySubtitleContent();
    });

    // Playlist Drawer
    playlistToggleBtn.addEventListener('click', () => {
      playlistDrawer.classList.toggle('open');
    });

    closeDrawerBtn.addEventListener('click', () => {
      playlistDrawer.classList.remove('open');
    });

    addMoreVideosBtn.addEventListener('click', () => {
      videoFileInput.click();
    });

    clearPlaylistBtn.addEventListener('click', clearAllPlaylist);

    // Shortcuts Modal
    shortcutsBtn.addEventListener('click', () => {
      shortcutsDialog.showModal();
    });

    closeShortcutsModal.addEventListener('click', () => {
      shortcutsDialog.close();
    });

    shortcutsDialog.addEventListener('click', (e) => {
      if (e.target === shortcutsDialog) shortcutsDialog.close();
    });

    // URL & Web Stream Modal
    function openUrlModal() {
      urlDialog.showModal();
      videoUrlInput.value = '';
      setTimeout(() => videoUrlInput.focus(), 50);
    }

    if (openUrlBtn) openUrlBtn.addEventListener('click', openUrlModal);
    if (openUrlTopBtn) openUrlTopBtn.addEventListener('click', openUrlModal);
    if (addUrlToDrawerBtn) addUrlToDrawerBtn.addEventListener('click', openUrlModal);

    if (closeUrlModal) {
      closeUrlModal.addEventListener('click', () => urlDialog.close());
    }

    if (urlDialog) {
      urlDialog.addEventListener('click', (e) => {
        if (e.target === urlDialog) urlDialog.close();
      });
    }

    if (pasteClipboardBtn) {
      pasteClipboardBtn.addEventListener('click', async () => {
        try {
          const text = await navigator.clipboard.readText();
          if (text) {
            videoUrlInput.value = text.trim();
            videoUrlInput.focus();
          }
        } catch {
          videoUrlInput.focus();
        }
      });
    }

    document.querySelectorAll('.sample-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        videoUrlInput.value = chip.dataset.url;
      });
    });

    if (playUrlNowBtn) {
      playUrlNowBtn.addEventListener('click', () => {
        const url = videoUrlInput.value.trim();
        if (url) {
          addUrlToPlaylist(url, true);
          urlDialog.close();
        } else {
          videoUrlInput.focus();
        }
      });
    }

    if (addUrlToQueueBtn) {
      addUrlToQueueBtn.addEventListener('click', () => {
        const url = videoUrlInput.value.trim();
        if (url) {
          addUrlToPlaylist(url, false);
          urlDialog.close();
        } else {
          videoUrlInput.focus();
        }
      });
    }

    if (videoUrlInput) {
      videoUrlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          playUrlNowBtn.click();
        }
      });
    }

    // Dropzone / File Picker triggers
    openFilesBtn.addEventListener('click', () => videoFileInput.click());
    returnToDropBtn.addEventListener('click', () => {
      dropZone.classList.remove('hidden');
    });

    videoFileInput.addEventListener('change', (e) => {
      addFilesToPlaylist(e.target.files);
      videoFileInput.value = '';
    });

    // Drag and Drop
    ['dragenter', 'dragover'].forEach(name => {
      window.addEventListener(name, (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      window.addEventListener(name, (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
      });
    });

    window.addEventListener('drop', (e) => {
      e.preventDefault();
      if (e.dataTransfer && e.dataTransfer.files.length > 0) {
        addFilesToPlaylist(e.dataTransfer.files);
      }
    });

    // Close popovers on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown-wrapper') && !e.target.closest('#speedMenu')) {
        speedMenu.classList.remove('open');
      }
      if (!e.target.closest('#filterToggleBtn') && !e.target.closest('#filterPopover')) {
        filterPopover.classList.remove('open');
      }
      if (!e.target.closest('#subtitleBtn') && !e.target.closest('#subtitlePopover')) {
        subtitlePopover.classList.remove('open');
      }
      if (!e.target.closest('#themeToggleBtn') && !e.target.closest('#themePopover')) {
        if (themePopover) themePopover.classList.remove('open');
      }
    });

    // Global Keyboard Shortcuts
    document.addEventListener('keydown', handleKeyDown);

    // Fullscreen change detection
    document.addEventListener('fullscreenchange', () => {
      if (document.fullscreenElement) {
        playerWrapper.classList.add('is-fullscreen');
      } else {
        playerWrapper.classList.remove('is-fullscreen');
      }
    });
  }

  // --- Initialize App ---
  initPreferences();
  setupEventListeners();

  // Register Service Worker for PWA / offline support if available
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {
        // Safe ignore if loaded via file:// protocol
      });
    });
  }

})();
