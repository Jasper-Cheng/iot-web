# IoT 设备管理平台

基于 Vue 3 的物联网设备展示与管控前端。

## 新功能特性

### 🎮 交互功能
- **点击设备**: 点击任意设备查看详细信息
- **视角控制**: 支持拖拽旋转、缩放视角
- **设备控制**: 在界面中直接控制设备状态

### 📱 响应式设计
- 适配桌面和移动设备
- 现代化的毛玻璃效果界面
- 流畅的动画过渡效果

## 技术栈

- **Vue 3** - 前端框架
- **Element Plus** - UI 组件库
- **Vite** - 构建工具

## 快速开始

### 开发环境

```bash
npm install
npm run dev
```

浏览器访问开发地址（默认 `http://localhost:5173`）。

### Docker 部署

```bash
# 首次运行或 GitHub 更新后
docker-compose up -d --build
```

- 访问地址：`http://localhost:8080`
- 查看日志：`docker-compose logs -f web`
- 停止：`docker-compose down`

**从 GitHub 更新后**：先执行 `git pull`，再执行 `docker-compose up -d --build` 重新构建并运行。

## 使用方法

1. 启动开发服务器: `npm run dev`（或通过 Docker 访问 8080 端口）
2. 在浏览器中访问应用
3. 点击场景中的设备
4. 在详情面板中控制设备状态

## 设备数据格式

```javascript
{
  id: 1,
  device_id: 'fan_001',
  name: '客厅风扇',
  device_type: 'electric_fan',
  status: 'online',           // online/offline
  fan_speed: 3,              // 0-3 档位
  oscillation: true,         // 是否摇头
  temperature: 25,           // 温度
  location: '客厅'
}
```

## 扩展功能

- 支持多种设备类型
- 支持设备分组和场景管理
- 可集成实时数据流
