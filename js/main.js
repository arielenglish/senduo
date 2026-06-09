// ========== 配置 ==========
const CONFIG = {
    wechatId: 'HeyAriel0123',
    phone: '18291883352'
};

// ========== 路由管理 ==========
const pages = ['home', 'courses', 'booking', 'about', 'success'];
let currentPage = 'home';

function navigateTo(pageId) {
    if (!pages.includes(pageId)) return;

    // 隐藏当前页面
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // 显示目标页面
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageId;
    }

    // 更新底部导航
    updateNav(pageId);

    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateNav(pageId) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === pageId);
    });
}

// 从首页跳转到课程详情
function showServiceDetail(type) {
    navigateTo('courses');

    // 高亮对应的课程区域
    setTimeout(() => {
        const element = document.getElementById(`course-${type}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            element.style.animation = 'fadeIn 0.5s ease';
        }
    }, 100);
}

// ========== 底部导航点击 ==========
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.dataset.page;
        navigateTo(page);
    });
});

// ========== 表单处理 ==========
document.getElementById('bookingForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    // 收集表单数据
    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // 简单验证
    if (!data.parentName || !data.phone || !data.childAge || !data.intention) {
        showToast('请填写必填项');
        return;
    }

    // 手机号验证
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(data.phone)) {
        showToast('请输入正确的手机号');
        return;
    }

    // 模拟提交
    console.log('预约数据:', data);

    // 清空表单
    this.reset();

    // 跳转到成功页
    navigateTo('success');

    // 模拟发送通知（实际项目中这里会调用后端API）
    setTimeout(() => {
        console.log('✅ 预约已提交:', JSON.stringify(data, null, 2));
    }, 100);
});

// ========== 课程选择 ==========
function selectCourse(courseName) {
    showToast(`已选择：${courseName}`);

    // 跳转到预约页并预填课程
    setTimeout(() => {
        navigateTo('booking');

        // 尝试预选课程
        const intentionMap = {
            '体验包-外教课': '线上外教课',
            '季度包-外教课': '线上外教课',
            '年度包-外教课': '线上外教课',
            '月卡-阅读小组': '阅读小组',
            '季卡-阅读小组': '阅读小组',
            '年卡-阅读小组': '阅读小组',
            '单次咨询-方案': '一对一方案咨询',
            '季度陪跑-方案': '一对一方案咨询',
            '年度陪跑-方案': '一对一方案咨询'
        };

        const intention = intentionMap[courseName];
        if (intention) {
            const radio = document.querySelector(`input[name="intention"][value="${intention}"]`);
            if (radio) {
                radio.checked = true;
            }
        }
    }, 600);
}

// ========== 联系弹窗 ==========
function showContactModal() {
    document.getElementById('contactModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeContactModal() {
    document.getElementById('contactModal').classList.remove('active');
    document.body.style.overflow = '';
}

// ========== 复制/拨打联系 ==========
function copyContact(type) {
    if (type === '微信') {
        // 尝试复制
        if (navigator.clipboard) {
            navigator.clipboard.writeText(CONFIG.wechatId).then(() => {
                showToast('微信号已复制，请添加好友');
            }).catch(() => {
                showToast(`微信号：${CONFIG.wechatId}`);
            });
        } else {
            // 降级方案
            const input = document.createElement('input');
            input.value = CONFIG.wechatId;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            showToast('微信号已复制，请添加好友');
        }
    } else if (type === '电话') {
        window.location.href = `tel:${CONFIG.phone}`;
    }

    closeContactModal();
}

// ========== Toast提示 ==========
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// ========== 触摸反馈优化 ==========
document.querySelectorAll('.service-card, .price-card, .contact-item, .contact-way').forEach(el => {
    el.addEventListener('touchstart', function() {
        this.style.opacity = '0.8';
    });
    el.addEventListener('touchend', function() {
        this.style.opacity = '1';
    });
    el.addEventListener('touchcancel', function() {
        this.style.opacity = '1';
    });
});

// ========== 页面初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
    // 检查URL hash
    const hash = window.location.hash.replace('#', '');
    if (hash && pages.includes(hash)) {
        navigateTo(hash);
    } else {
        navigateTo('home');
    }

    // 监听hash变化
    window.addEventListener('hashchange', () => {
        const newHash = window.location.hash.replace('#', '');
        if (newHash && pages.includes(newHash)) {
            navigateTo(newHash);
        }
    });

    // 设置联系信息
    const wechatEl = document.getElementById('wechatId');
    const phoneEl = document.getElementById('phoneNum');
    if (wechatEl) wechatEl.textContent = CONFIG.wechatId;
    if (phoneEl) phoneEl.textContent = CONFIG.phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
});

// ========== 防止iOS橡皮筋效果 ==========
document.addEventListener('touchmove', function(e) {
    if (e.target.closest('.page-container')) return;
}, { passive: true });
