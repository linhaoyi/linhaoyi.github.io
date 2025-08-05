// 背景管理功能
let isLoading = false;
const loader = document.createElement('div');
loader.className = 'loading-indicator';
document.body.appendChild(loader);

let currentType = localStorage.getItem('bgType') || 'random';
let currentImageUrl = '';

async function loadBackground() {
    if (isLoading) return;
    isLoading = true;
    loader.classList.add('active');

    try {
        const url = `https://uapis.cn/api/imgapi/furry/img4k.php?t=${Date.now()}`;
        const img = new Image();
        img.src = url;
        currentImageUrl = url;

        await new Promise((resolve, reject) => {
            img.onload = () => {
                document.body.style.backgroundImage = `url("${img.src}")`;
                resolve();
            };
            img.onerror = () => reject(new Error('图片加载失败'));
            setTimeout(() => reject(new Error('加载超时')), 10000);
        });
    } catch (err) {
        console.error('背景加载失败:', err);
        document.body.style.backgroundImage = 'linear-gradient(135deg, #1a1a1a, #2d2d2d)';
    } finally {
        loader.classList.remove('active');
        isLoading = false;
    }
}

// 初始化加载
document.addEventListener('DOMContentLoaded', loadBackground);

// 快捷键绑定
document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyR') loadBackground(); // 按 R 刷新
});

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

document.addEventListener('DOMContentLoaded', function() {
  // 设备检测函数
  function getDeviceType() {
    const width = window.innerWidth;
    if (width <= 768) return 'mobile';  // 手机
    if (width <= 1024) return 'tablet'; // 平板
    return 'desktop';                   // PC
  }

  // 设备专用API配置
  const bgAPIs = {
    mobile: 'https://uapis.cn/api/imgapi/furry/imgs4k.php',
    tablet: 'https://uapis.cn/api/imgapi/furry/szs8k.php',
    desktop: 'https://source.unsplash.com/random/3840x2160/?nature' // PC备用
  };

  // 设置背景图（带加载状态检测）
  function setBackground() {
    const device = getDeviceType();
    const loadingOverlay = document.createElement('div');
    loadingOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--board-color);
      z-index: -2;
      transition: opacity 1s;
    `;
    document.body.appendChild(loadingOverlay);

    const img = new Image();
    img.src = bgAPIs[device] + (device === 'mobile' ? '?t=' + Date.now() : ''); // 手机端禁用缓存
    img.onload = function() {
      document.body.style.backgroundImage = `url(${img.src})`;
      setTimeout(() => loadingOverlay.style.opacity = '0', 100);
      setTimeout(() => loadingOverlay.remove(), 1100);
    };
    img.onerror = function() {
      console.error('背景图加载失败，使用备用API');
      img.src = bgAPIs.desktop;
    };
  }

  // 初始化 + 窗口变化监听
  setBackground();
  window.addEventListener('resize', () => {
    if (window.innerWidth !== lastWidth) {
      lastWidth = window.innerWidth;
      setBackground();
    }
  });
});

