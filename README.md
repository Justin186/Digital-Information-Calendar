# 电子万年历
一个仿照现实中存在的电子万年历做的网页，并支持自定义修改。
## 预览
![预览](/img/preview.png)
## 功能
- 显示年月日与星期
- 显示时间
- 显示温度
- 显示倒数日与天数
## 设置面板
- 选择七段显示器显示样式
- 自定义倒数日（名称应不超过4个字符）
- 选择温度数据来源:
>1. 实时获取 请通过输入心知天气的API Key获取实时天气数据，但是目前获取的天气数据仅为南宁市的实时天气数据，要想改变地区只能在源代码中修改，以后或许会加入自定义地区功能。  
>2. 设为定值  
>3. 程序模拟 以余弦函数为模型计算出一年中每天每小时的温度，目前地区仅支持南宁
- 时间修改 输入倍率以更改时间流速（支持正负）
- 清空本地数据 点击后会清空localStorage中的数据，并刷新页面，恢复默认设置。
