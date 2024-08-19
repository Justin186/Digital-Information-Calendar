// 时间格式化函数
function formatTime(num) {
    return num.toString().padStart(2, '0');
}
// 日期格式化函数
function formatDate(num) {
    return num.toString().padStart(2, ' ');
}
// 时间更新函数
function updateClock() {
    var now = new Date();
    var year = now.getFullYear();
    var month = formatDate(now.getMonth() + 1); // 月份从0开始，所以需要加1
    var day = formatDate(now.getDate());
    var week = now.getDay();
    var hour = formatTime(now.getHours());
    var minute = formatTime(now.getMinutes());
    var second = formatTime(now.getSeconds());

    document.getElementById('year').textContent = year;
    document.getElementById('month').textContent = month;
    document.getElementById('day').textContent = day;
    document.getElementById('weekd').textContent = ['8', '1', '2', '3', '4', '5', '6'][week];
    document.getElementById('hour').textContent = hour;
    document.getElementById('minute').textContent = minute;
    document.getElementById('second').textContent = second;
}
window.onload = function() {
    updateClock(); // 页面加载时更新时间
    setInterval(updateClock, 1000); // 每秒更新一次时间
};