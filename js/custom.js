// 背景API列表 - 多个来源
const backgroundAPIs = [
  // 稳定可靠的API
  'https://play.pmoze.top:1145/api/image',
  'https://play.pmoze.top:1145/api/image?type=c',
  'https://play.pmoze.top:1145/api/image?type=f',
  'https://play.pmoze.top:1145/api/image?type=s',
  'https://uapis.cn/api/v1/random/image?category=furry&type=4k',
  'https://uapis.cn/api/v1/random/image?category=furry&type=z4k',
  'https://uapis.cn/api/v1/random/image?category=furry&type=s4k',
  'https://uapis.cn/api/v1/random/image?category=furry&type=szs8k'
];

// 当前背景
let currentBackground = '';

// 从API列表中随机选择一个
function getRandomAPI() {
  return backgroundAPIs[Math.floor(Math.random() * backgroundAPIs.length)];
}

// 设置背景图片
function setBackgroundImage(url) {
  // 添加时间戳避免缓存
  const timestamp = Date.now();
  const imageUrl = url.includes('?') 
    ? `${url}&t=${timestamp}` 
    : `${url}?t=${timestamp}`;
  
  console.log('设置背景图片:', imageUrl);
  
  const img = new Image();
  img.onload = function() {
    console.log('背景图片加载成功');
    document.body.style.backgroundImage = `url("${imageUrl}")`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
    currentBackground = imageUrl;
  };
  
  img.onerror = function() {
    console.log('图片加载失败，尝试下一个API');
    tryNextAPI();
  };
  
  img.src = imageUrl;
}

// 尝试下一个API
function tryNextAPI() {
  const nextAPI = getRandomAPI();
  if (nextAPI === currentBackground) {
    // 避免重复，重新选择一个
    return tryNextAPI();
  }
  setBackgroundImage(nextAPI);
}

// 初始化
function init() {
  console.log('初始化随机背景功能');
  
  // 设置初始背景
  const initialAPI = getRandomAPI();
  setBackgroundImage(initialAPI);
  
  // 每天自动更换背景
  const today = new Date().toDateString();
  const lastChange = localStorage.getItem('bgLastChange');
  
  if (lastChange !== today) {
    localStorage.setItem('bgLastChange', today);
  }
  
  // 快捷键：按R键刷新背景
  document.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      tryNextAPI();
      console.log('手动刷新背景');
    }
  });
  
  // 修复移动端背景问题
  fixMobileBackground();
}

// 修复移动端背景问题
function fixMobileBackground() {
  if (window.innerWidth > 768) return;
  
  // 移动端使用更小的图片以节省流量
  document.body.style.backgroundImage = '';
  setTimeout(() => {
    const mobileAPI = 'https://picsum.photos/800/1600';
    setBackgroundImage(mobileAPI);
  }, 100);
  
  // 监听屏幕旋转
  window.addEventListener('resize', function() {
    if (window.innerWidth <= 768) {
      const bg = document.body.style.backgroundImage;
      if (bg && bg !== 'none') {
        const bgElement = document.getElementById('mobile-bg-fix');
        if (bgElement) bgElement.remove();
        
        const newBgElement = document.createElement('div');
        newBgElement.id = 'mobile-bg-fix';
        newBgElement.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: ${bg} center/cover no-repeat;
          z-index: -1;
          pointer-events: none;
        `;
        document.body.appendChild(newBgElement);
      }
    }
  });
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// 页面完全加载后标记
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  console.log('页面加载完成');
});

