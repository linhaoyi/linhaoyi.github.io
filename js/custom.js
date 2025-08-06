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

// 修复移动端背景滚动问题
function fixMobileBackground() {
  if (window.innerWidth > 768) return;
  
  const bg = document.body.style.backgroundImage;
  const bgElement = document.createElement('div');
  bgElement.id = 'mobile-bg-fix';
  bgElement.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${bg} center/cover no-repeat;
    z-index: -1;
    pointer-events: none;
    transform: translateZ(0);
  `;
  document.body.appendChild(bgElement);
  
// 初始化加载
document.addEventListener('DOMContentLoaded', loadBackground);

// 快捷键绑定
document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyR') loadBackground(); // 按 R 刷新
});

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

 // 监听滚动保持背景位置
  let lastScrollY = 0;
  window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    // 只有滚动超过阈值时才更新（性能优化）
    if (Math.abs(scrollY - lastScrollY) > 50) {
      bgElement.style.transform = `translateY(${scrollY}px)`;
      lastScrollY = scrollY;
    }
  });
}

// 设备自适应背景加载
document.addEventListener('DOMContentLoaded', function() {

function getDeviceType() {
  const width = window.innerWidth;
  // 更精确的设备判断
  if (width <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return 'mobile';
  }
  if (width <= 1024) {
    return 'tablet';
  }
  return 'desktop';
}

  // 添加移动端修复
      if (device === 'mobile') {
        fixMobileBackground();
      }
  
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
  let lastWidth = window.innerWidth;
  
  window.addEventListener('resize', function() {
    if (Math.abs(window.innerWidth - lastWidth) > 100) {
      lastWidth = window.innerWidth;
      setBackground();
    }
  });
});

// 导航栏滚动控制
document.addEventListener('DOMContentLoaded', function() {
  let lastScrollY = window.scrollY;
  const navbar = document.querySelector('.navbar');
  const headerHeight = document.querySelector('.banner')?.offsetHeight || 0;
  
  // 移动端滚动处理
  if (window.innerWidth <= 768) {
    window.addEventListener('scroll', function() {
      const currentScrollY = window.scrollY;
      
      // 向下滚动时隐藏导航栏
      if (currentScrollY > lastScrollY && currentScrollY > headerHeight) {
        navbar.classList.add('hide-on-scroll');
      } 
      // 向上滚动或回到顶部时显示
      else {
        navbar.classList.remove('hide-on-scroll');
      }
      
      lastScrollY = currentScrollY;
    });
  }
  