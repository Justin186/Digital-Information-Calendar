// 全局变量声明
var now = new Date(); //全局时间
let intervalClock; // 时钟刷新定时器ID
let intervalTemp; // 温度刷新定时器ID
// 时间格式化函数
function formatTime(num) {
    return num.toString().padStart(2, '0');
}
// 日期格式化函数
function formatDate(num) {
    return num.toString().padStart(2, ' ');
}
// 温度格式化函数
function formatTemp(num) {
    if (num.toString().length > 2) {
        return num.toString().slice(-2); // 取右侧2位
    }
    return num.toString().padStart(2, ' '); // 不超过三位则正常处理
}
// 倒计时格式化函数
function formatCountdown(num) {
    return num.toString().padStart(4, ' ');
}
// 倒数日格式化函数
function formatToFourChars(str) {
    if (str.length > 4)
        return str.slice(0, 4);
    else
        return str;
}
// 时间更新函数
function updateClock() {
    const status = document.getElementById('status').checked;
    const rateValue = document.getElementById('rate').value;
    if (status === false) {
        now = new Date();
    }
    else {
        if (rateValue <= 100) {
            now = new Date(now.getTime() + 1000);
        } else {
            now = new Date(now.getTime() + parseInt(rateValue) * 10);
        }
    }
    var year = now.getFullYear();
    var month = formatDate(now.getMonth() + 1); // 月份从0开始，所以需要加1
    var day = formatDate(now.getDate());
    var week = now.getDay();
    var hour = formatTime(now.getHours());
    var minute = formatTime(now.getMinutes());
    var second = formatTime(now.getSeconds());
    var targetDate = Date.parse(document.getElementById('date-select').value) - 28800000;
    var ctdday = Math.ceil((targetDate - now.getTime()) / 86400000);
    if (ctdday < 0) {
        ctdday = 0; // 如果 ctdday 小于 0，则设置为 0
    }
    document.getElementById('year').textContent = year;
    document.getElementById('exp1').textContent = year;
    document.getElementById('exp2').textContent = year;
    document.getElementById('month').textContent = month;
    document.getElementById('day').textContent = day;
    document.getElementById('weekd').textContent = ['8', '1', '2', '3', '4', '5', '6'][week];
    document.getElementById('hour').textContent = hour;
    document.getElementById('minute').textContent = minute;
    document.getElementById('second').textContent = second;
    document.getElementById('ctd').textContent = formatCountdown(ctdday);
}
function updateCountdown() {
    const dateValue = document.getElementById('date-select').value;
    localStorage.setItem('dateValue', dateValue); // 保存到 localStorage
    var now = new Date();
    var targetDate = Date.parse(dateValue);
    var ctdday = Math.ceil((targetDate - now.getTime()) / (1000 * 60 * 60 * 24));
    if (ctdday < 0) {
        ctdday = 0; // 如果 ctdday 小于 0，则设置为 0
    }
    document.getElementById('ctd').textContent = formatCountdown(ctdday);
}
function updateStyle1() {
    var elements = document.querySelectorAll('.clock-display-two');
    elements.forEach(function (element) {
        if (element.id !== 'exp1' && element.id !== 'exp2') {
            element.classList.remove('clock-display-two');
            element.classList.add('clock-display');
        }
    });
    var elements = document.querySelectorAll('.clock-display-beneath-two');
    elements.forEach(function (element) {
        if (element.id !== 'exp1' && element.id !== 'exp2') {
            element.classList.remove('clock-display-beneath-two');
            element.classList.add('clock-display-beneath');
        }
    });
}
function updateStyle2() {
    var elements = document.querySelectorAll('.clock-display');
    elements.forEach(function (element) {
        if (element.id !== 'exp1' && element.id !== 'exp2') {
            element.classList.remove('clock-display');
            element.classList.add('clock-display-two');
        }
    });
    var elements = document.querySelectorAll('.clock-display-beneath');
    elements.forEach(function (element) {
        if (element.id !== 'exp1' && element.id !== 'exp2') {
            element.classList.remove('clock-display-beneath');
            element.classList.add('clock-display-beneath-two');
        }
    });
}
function updateStyle() {
    const selectedValue = document.querySelector('input[name="clock-style"]:checked').id;
    localStorage.setItem('styleModeValue', selectedValue); // 保存当前样式选择到 localStorage
    if (selectedValue === 'cs1') {
        updateStyle1();
    } else if (selectedValue === 'cs2') {
        updateStyle2();
    }
}
function updateCtdname() {
    const ctdNameValue = document.getElementById('ctdname').value;
    localStorage.setItem('ctdNameValue', ctdNameValue); // 保存到 localStorage
    document.getElementById('nameplate').textContent = formatToFourChars(ctdNameValue);
}
// 处理实时获取
function handleJit() {
    const location = 'nanning';
    const apiKey = document.getElementById('api').value;
    localStorage.setItem('apiValue', apiKey); // 保存到 localStorage
    fetch(`https://api.seniverse.com/v3/weather/now.json?key=${apiKey}&location=${location}&language=zh-Hans&unit=c`)
        .then(response => {
            console.log(response); // 输出响应对象
            if (!response.ok) {
                throw new Error('无效API或1分钟内访问次数过多');
            }
            return response.json(); // 解析 JSON
        })
        .then(data => {
            // 提取温度信息
            const temperature = data.results[0].now.temperature; // 获取温度属性
            // 找到 DOM 元素并设置其 textContent
            document.getElementById('warn').style.display = 'none';
            document.getElementById('tempd').textContent = temperature; // 设置文本内容
        })
        .catch(error => {
            console.error(error); // 输出错误信息以便于调试
            document.getElementById('warn').style.display = 'block';
        });
}
// 处理设为定值
function handleFix() {
    const tmpValue = document.getElementById('tmp').value;
    localStorage.setItem('tmpValue', tmpValue); // 保存到 localStorage
    document.getElementById('tempd').textContent = formatTemp(tmpValue);
}
// 处理程序模拟
function handleSim() {
    const preMinTemp = 19; // 最低温度
    const preMaxTemp = 27; // 最高温度
    // 获取当前日期和小时数
    const dayOfYear = getDayOfYear(now);
    const hour = parseInt(document.getElementById('hour').textContent);
    // 计算基于日期的每日温度变化
    const dailyVariation = (-Math.cos((2 * Math.PI / 365) * (dayOfYear - 20)) * 12) - 1; // 每天的变化量
    const minTemp = preMinTemp + dailyVariation;
    const maxTemp = preMaxTemp + dailyVariation;
    const amplitude = (maxTemp - minTemp) / 2;  // 振幅
    const offset = (maxTemp + minTemp) / 2;     // 偏移量
    const omega = (2 * Math.PI) / 24;           // 角速度ω，周期为24小时
    const peakTime = 14;                         // 最高温度出现的时间点（下午两点）

    // 根据时间计算当前温度
    const temp = Math.round(amplitude * Math.cos(omega * (hour - peakTime)) + offset);
    // 更新温度显示
    document.getElementById('tempd').textContent = formatTemp(temp);
}

// 获取当天在一年中的第几天
function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}
// 温度设置部分的输入更新函数
function updateInputs() {
    const apiInput = document.getElementById('api');
    const tmpInput = document.getElementById('tmp');
    const selectBox = document.querySelector('select');
    const selectedValue = document.querySelector('input[name="tpmd"]:checked').id;
    localStorage.setItem('tempModeValue', selectedValue); // 保存当前温度模式到 localStorage
    if (selectedValue === 'jit') {
        apiInput.disabled = false; // 启用API输入
        document.getElementById('apiw').style.color = 'rgba(255, 255, 255, 1)';
        tmpInput.disabled = true;   // 禁用TMP输入
        document.getElementById('tmpw').style.color = 'rgba(255, 255, 255, 0.6)';
        selectBox.disabled = true;  // 禁用选择框
        document.getElementById('selw').style.color = 'rgba(255, 255, 255, 0.6)';
        handleJit();
    } else if (selectedValue === 'fix') {
        apiInput.disabled = true;   // 禁用API输入
        document.getElementById('apiw').style.color = 'rgba(255, 255, 255, 0.6)';
        document.getElementById('warn').style.display = 'none';
        tmpInput.disabled = false;   // 启用TMP输入
        document.getElementById('tmpw').style.color = 'rgba(255, 255, 255, 1)';
        selectBox.disabled = true;  // 禁用选择框
        document.getElementById('selw').style.color = 'rgba(255, 255, 255, 0.6)';
        handleFix();
    } else if (selectedValue === 'sim') {
        apiInput.disabled = true;   // 禁用API输入
        document.getElementById('apiw').style.color = 'rgba(255, 255, 255, 0.6)';
        document.getElementById('warn').style.display = 'none';
        tmpInput.disabled = true;   // 禁用TMP输入
        document.getElementById('tmpw').style.color = 'rgba(255, 255, 255, 0.6)';
        selectBox.disabled = false;  // 启用选择框
        document.getElementById('selw').style.color = 'rgba(255, 255, 255, 1)';
        handleSim();
    }
}
// 温度显示更新
function updateTempDisplay() {
    const selectedValue = document.querySelector('input[name="tpmd"]:checked').id;
    if (selectedValue === 'jit') {
        handleJit();
    } else if (selectedValue === 'fix') {
    } else if (selectedValue === 'sim') {
        handleSim();
    }
}
function updateRate() {
    const rateValue = document.getElementById('rate').value;
    localStorage.setItem('rateValue', rateValue); // 保存到 localStorage
    const status = document.getElementById('status').checked;
    if (intervalClock) {
        clearInterval(intervalClock); // 清除之前的定时器
        clearInterval(intervalTemp);
    }
    if (status === true) {
        if (rateValue != 0) {
            if (rateValue <= 100) {
                intervalClock = setInterval(updateClock, 1000 / rateValue); // 创建新的定时器
                intervalTemp = setInterval(updateTempDisplay, 60000 / rateValue);
            } else {
                intervalClock = setInterval(updateClock, 10);
                intervalTemp = setInterval(updateTempDisplay, 10);
            }
        }
    } else {
        updateClock();
        updateTempDisplay();
        intervalClock = setInterval(updateClock, 1000); // 创建新的定时器
        intervalTemp = setInterval(updateTempDisplay, 60000);
    }
}
function reset() {
    localStorage.clear(); // 清除 localStorage
    alert('已清除所有配置，即将刷新页面');
    location.reload(); // 刷新页面
}
// 设置事件监听器函数
function setupEventListeners() {
    document.getElementById('ctdname').addEventListener('input', updateCtdname);
    document.getElementById('date-select').addEventListener('change', updateCountdown);

    const tempModeRadioButtons = document.querySelectorAll('input[name="tpmd"]');
    tempModeRadioButtons.forEach(radio => {
        radio.addEventListener('change', updateInputs);
    });
    const styleModeRadioButtons = document.querySelectorAll('input[name="clock-style"]');
    styleModeRadioButtons.forEach(radio => {
        radio.addEventListener('change', updateStyle);
    });

    document.getElementById('api').addEventListener('input', handleJit);
    document.getElementById('tmp').addEventListener('input', handleFix);
    document.getElementById('rate').addEventListener('input', updateRate);
    document.getElementById('status').addEventListener('change', updateRate);
    document.getElementById('reset').addEventListener('click', reset);

}
// 导入本地配置
function ImportConfig() {
    // 读取存储在 localStorage 的数据
    const apiValue = localStorage.getItem('apiValue');
    const tmpValue = localStorage.getItem('tmpValue');
    const ctdNameValue = localStorage.getItem('ctdNameValue');
    const dateValue = localStorage.getItem('dateValue');
    const tempModeValue = localStorage.getItem('tempModeValue');
    const styleModeValue = localStorage.getItem('styleModeValue');
    const rateValue = localStorage.getItem('rateValue');

    // 如果存在，则更新相应的输入框和选择
    if (apiValue) {
        document.getElementById('api').value = apiValue;
    }
    if (tmpValue) {
        document.getElementById('tmp').value = tmpValue;
    }
    if (ctdNameValue) {
        document.getElementById('ctdname').value = ctdNameValue;
        updateCtdname(); // 更新显示倒数日名称
    }
    if (tempModeValue) {
        document.getElementById(tempModeValue).checked = true; // 按钮选择
        updateInputs(); // 根据选择更新输入框
    }
    if (styleModeValue) {
        document.getElementById(styleModeValue).checked = true; // 按钮选择
        updateStyle(); // 根据选择更新输入框
    }
    if (dateValue) {
        document.getElementById('date-select').value = dateValue; // 日期选择框
    }
    else {
        document.getElementById('date-select').value = '2024-01-01'; // 默认日期
    }
    if (rateValue) {
        document.getElementById('rate').value = rateValue;
        updateRate();
    }
    else {
        document.getElementById('rate').value = 1.0; // 默认刷新频率为1秒
        updateRate();
    }
}
// 初始化函数
function init() {
    ImportConfig(); // 加载配置
    updateClock(); // 页面加载时更新时间
    setupEventListeners(); // 设置事件监听器
    updateInputs(); // 进行一次输入更新
}
// 在窗口加载完成后初始化
//document.addEventListener('DOMContentLoaded', init);
window.onload = init;
