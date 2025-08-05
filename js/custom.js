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