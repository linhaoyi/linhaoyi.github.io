// ================= 随机背景 API 列表 =================
const backgroundAPIs = [
  'https://play.pmoze.top:1145/api/image',
  'https://play.pmoze.top:1145/api/image?type=c',
  'https://play.pmoze.top:1145/api/image?type=f',
  'https://play.pmoze.top:1145/api/image?type=s',
  'https://uapis.cn/api/v1/random/image?category=furry&type=4k',
  'https://uapis.cn/api/v1/random/image?category=furry&type=z4k',
  'https://uapis.cn/api/v1/random/image?category=furry&type=s4k',
  'https://uapis.cn/api/v1/random/image?category=furry&type=szs8k',
  'https://api.furry.ist/furry-img/'
];

// ================= 全局变量 =================
let currentBackground = '';           // 当前显示的图片 URL
let retryCount = 0;                   // 当前重试次数
const MAX_RETRY = backgroundAPIs.length * 2; // 最大重试次数
let isSetting = false;                // 防止并发设置
let pendingUrl = null;                // 待处理的 URL（用于取消旧请求）

// 背景层元素
let bgLayer = null;

// ================= 工具函数 =================
function getRandomAPI() {
  return backgroundAPIs[Math.floor(Math.random() * backgroundAPIs.length)];
}

// 创建背景层（如果不存在）
function ensureBgLayer() {
  if (bgLayer) return;
  bgLayer = document.createElement('div');
  bgLayer.id = 'dynamic-bg';
  bgLayer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;
  `;
  document.body.appendChild(bgLayer);
}

// ================= 核心设置函数（带预加载和淡入）=================
function setBackgroundImage(url) {
  if (isSetting) {
    console.log('已有设置进行中，跳过:', url);
    return;
  }
  isSetting = true;

  const timestamp = Date.now();
  const imageUrl = url.includes('?') ? `${url}&t=${timestamp}` : `${url}?t=${timestamp}`;

  // 预加载图片
  const img = new Image();
  const thisRequestUrl = imageUrl;
  pendingUrl = thisRequestUrl;

  img.onload = () => {
    if (pendingUrl !== thisRequestUrl) {
      isSetting = false;
      return;
    }
    ensureBgLayer();
    bgLayer.style.backgroundImage = `url("${imageUrl}")`;
    bgLayer.style.opacity = '1';      // 淡入
    currentBackground = imageUrl;
    retryCount = 0;
    isSetting = false;
    pendingUrl = null;
    console.log('背景设置成功:', imageUrl);
  };

  img.onerror = () => {
    if (pendingUrl !== thisRequestUrl) {
      isSetting = false;
      return;
    }
    console.log('图片加载失败:', url);
    retryCount++;
    isSetting = false;
    pendingUrl = null;

    if (retryCount < MAX_RETRY) {
      tryNextAPI();
    } else {
      console.error('所有 API 均失败');
      // 失败时保持背景层透明，显示 body 背景色
    }
  };

  img.src = imageUrl;
}

function tryNextAPI() {
  const nextAPI = getRandomAPI();
  if (nextAPI === currentBackground) {
    return tryNextAPI(); // 避免重复尝试同一个失败的 API
  }
  setBackgroundImage(nextAPI);
}

// ================= 初始化（确保只执行一次）=================
let initialized = false;
function init() {
  if (initialized) return;
  initialized = true;
  console.log('初始化随机背景');
  
  // 创建背景层（透明）
  ensureBgLayer();
  // 设置 body 深色背景，作为底层
  document.body.style.backgroundColor = '#1a1a1a';
  
  setBackgroundImage(getRandomAPI());
}

// 根据页面加载状态执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ================= 页面完全加载后检查背景 =================
window.addEventListener('load', () => {
  setTimeout(() => {
    if (!bgLayer || bgLayer.style.opacity !== '1' || !currentBackground) {
      console.log('背景可能丢失，重新设置');
      tryNextAPI();
    } else {
      console.log('背景正常');
    }
  }, 800);
});

// ================= 快捷键 R 刷新背景 =================
document.addEventListener('keydown', (e) => {
  if (e.key === 'r' || e.key === 'R') {
    e.preventDefault();
    console.log('手动刷新背景');
    // 刷新时先让背景层淡出，再加载新图淡入
    if (bgLayer) bgLayer.style.opacity = '0';
    tryNextAPI();
  }
});

// ================= 移动端屏幕旋转处理 =================
if (window.innerWidth <= 768) {
  window.addEventListener('resize', () => {
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(() => {
      if (currentBackground && bgLayer) {
        // 仅需保持背景，background-size 已为 cover，无需重新加载
      }
    }, 200);
  });
}