<template>
  <div class="home-page">
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧内容区域（房间导航 + 空调控制） -->
      <div class="left-section">
        <!-- 房间导航栏 -->
        <div class="room-navigation">
          <button 
            v-for="room in rooms" 
            :key="room.id"
            :class="['room-btn', { active: room.id === activeRoom }]"
            @click="setActiveRoom(room.id)"
          >
            {{ room.name }}
          </button>
          <button class="add-room-btn">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            Add Room
          </button>
        </div>

        <div class="room-content">
          <!-- 空调控制卡片 -->
        <div class="air-cooler-card">
          <div class="card-header">
            <div class="air-card-info">
              <h3>Air Cooler</h3>
              <p>GTA AC00L4</p>
            </div>
                         <div class="power-switch">
               <span class="switch-label">{{ acPower ? 'On' : 'Off' }}</span>
               <div 
                 :class="['switch-button', { active: acPower }]"
                 @click="toggleAC"
               ></div>
             </div>
          </div>
          
          <div class="temperature-section">
            <div class="ac-temp">
              <div class="temp-header">
                <h4>AC</h4>
                <h4>Temperature</h4>
              </div>
              <div class="temp-display" :style="{ '--temp-end-color': tempEndColor }">{{ acTemp }}°</div>
            </div>
            <div class="room-temp">
              <h4>Room Temperature</h4>
              <div class="room-image" :style="{ '--room-tint': roomTint }">
                <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop" alt="Living Room">
                <div class="temp-overlay">20°</div>
              </div>
            </div>
          </div>
          
          <div class="mode-controls">
          <div v-for="mode in acModes" class="mode-div">
            <button :key="mode.id"
              :class="['mode-btn', { active: mode.id === activeMode, disabled: !acPower }]"
              :disabled="!acPower"
              @click="setActiveMode(mode.id)">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path v-if="mode.id === 'heat'" d="M12 4a8 8 0 1 0 0 16a8 8 0 1 0 0-16z M12 1v2 M12 21v2 M1 12h2 M21 12h2 M4.2 4.2l1.4 1.4 M18.4 18.4l1.4 1.4 M4.2 19.8l1.4-1.4 M18.4 5.6l1.4-1.4" stroke="currentColor" stroke-width="1.5" fill="none"/>
                 <path v-else-if="mode.id === 'dry'" d="M12 4 C5 12, 3 20, 12 23 C21 20, 19 12, 12 4 Z" stroke="currentColor" stroke-width="2" fill="none"/>
                 <path v-else-if="mode.id === 'cool'" d="M12 2 L12 22 M2 12 L22 12 M5 5 L19 19 M19 5 L5 19 M8 4 L12 8 L16 4 M8 20 L12 16 L16 20 M4 8 L8 12 L4 16 M20 8 L16 12 L20 16" stroke="currentColor" stroke-width="2" fill="none"/>
                 <path v-else-if="mode.id === 'auto'" d="M7 16 L12 5 L17 16 M9 12 L15 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>

               </svg>
            </button>
            <span>{{ mode.name }}</span>
          </div>
          </div>
        </div>

        <!-- 智能设备列表 -->
      <div class="devices-list">
        <div 
          v-for="device in devices" 
          :key="device.id"
          class="device-card"
        >
          <div class="device-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path v-if="device.type === 'light'" d="M12 2a7 7 0 0 0-7 7c0 3 2 5 4 6v3h6v-3c2-1 4-3 4-6a7 7 0 0 0-7-7z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>

              <path v-else-if="device.type === 'tv'" d="M3 7h18v10H3zM7 17v2M17 17v2" stroke="currentColor" stroke-width="2" fill="none"/>
              <path v-else-if="device.type === 'vacuum'" d="M12 2a10 10 0 0 0-10 10c0 5.5 4.5 10 10 10s10-4.5 10-10c0-5.5-4.5-10-10-10z" stroke="currentColor" stroke-width="2" fill="none"/>
              <path v-else-if="device.type === 'thermostat'" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <div class="device-info">
            <h4>{{ device.name }}</h4>
            <p>{{ device.model }}</p>
          </div>
          <div class="device-switch">
            <span class="switch-label">{{ device.power ? 'On' : 'Off' }}</span>
            <div 
              :class="['switch-button', { active: device.power }]"
              @click="toggleDevice(device.id)"
            ></div>
          </div>
        </div>
      </div>
      
        <!-- 摄像头模块（移动到下方） -->
        <div class="camera-card">
          <div class="camera-header">
            <h3>Camera</h3>
            <div class="camera-controls">
              <button 
                class="mic-button"
                :class="{ listening: isListening }"
                @mousedown.prevent="startVoice"
                @mouseup.prevent="stopVoice"
                @mouseleave.prevent="stopVoice"
                @touchstart.prevent="startVoice"
                @touchend.prevent="stopVoice"
                :title="isListening ? 'Release to stop' : 'Hold to talk'"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M12 14a3 3 0 003-3V7a3 3 0 10-6 0v4a3 3 0 003 3z" stroke="currentColor" stroke-width="1.8"/>
                  <path d="M19 11a7 7 0 01-14 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                  <path d="M12 18v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
              </button>
              <div class="room-selector-wrapper">
                <button class="room-selector" @click="cameraMenuOpen = !cameraMenuOpen">
                  <span>{{ roomLabel }}</span>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <div v-if="cameraMenuOpen" class="room-selector-menu">
                  <button 
                    v-for="room in rooms.filter(r => r.id !== 'all')"
                    :key="room.id"
                    :class="['room-selector-item', { selected: room.id === selectedCameraRoom }]"
                    @click.stop="selectCameraRoom(room.id)"
                  >
                    {{ room.name }}
                  </button>
                </div>
              </div>
              <div class="camera-switch">
                <span class="switch-label">{{ cameraPower ? 'On' : 'Off' }}</span>
                <div 
                  :class="['switch-button', { active: cameraPower }]"
                  @click="toggleCamera"
                ></div>
              </div>
            </div>
          </div>
          <div class="camera-view">
            <video v-if="cameraPower" class="camera-video" :src="cameraVideoSrc" autoplay muted loop playsinline></video>
            <div v-else class="camera-placeholder">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" fill="none"/>
                <circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
              <p>Camera Off</p>
            </div>
            <button 
              v-if="cameraPower"
              class="fullscreen-button"
              @click="toggleFullscreen"
              :title="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path v-if="!isFullscreen" d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path v-else d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <div class="voice-output">
            <span v-if="!speechSupported">Your browser does not support SpeechRecognition.</span>
            <span v-else>{{ transcript || (isListening ? 'Listening…' : 'Hold mic to speak') }}</span>
          </div>
        </div>

        <!-- 扫地机器人控制面板 -->
        <div class="vacuum-card">
          <div class="card-header">
            <div class="vacuum-card-info">
              <h3>Smart Vacuum</h3>
              <p>KLAZ Vacuum Pro</p>
            </div>
            
            <!-- 记录按钮 -->
            <div class="record-button">
              <button 
                class="record-btn"
                @click="showVacuumRecordDialog"
                title="查看扫地记录">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
                扫地记录
              </button>
            </div>
            
            <div class="power-switch">
              <span class="switch-label">{{ vacuumPower ? 'On' : 'Off' }}</span>
              <div 
                :class="['switch-button', { active: vacuumPower }]"
                @click="toggleVacuum"
              ></div>
            </div>
          </div>
          
          <div class="vacuum-status-section">
            <div class="vacuum-info">
              <div class="status-display">
                <div class="status-icon" :class="vacuumStatus">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2a10 10 0 0 0-10 10c0 5.5 4.5 10 10 10s10-4.5 10-10c0-5.5-4.5-10-10-10z" stroke="currentColor" stroke-width="2" fill="none"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
                  </svg>
                </div>
                <div class="status-text">
                  <h4>{{ vacuumStatusText }}</h4>
                  <p>{{ vacuumBattery }}% Battery</p>
                </div>
              </div>
              <div class="cleaning-progress">
                <div class="progress-label">Cleaning Progress</div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: vacuumProgress + '%' }"></div>
                </div>
                <div class="progress-text">{{ vacuumProgress.toFixed(1) }}%</div>
              </div>
            </div>
          </div>
          
          <div class="vacuum-controls">
            <div v-for="mode in vacuumModes" class="mode-div">
              <button :key="mode.id"
                :class="['mode-btn', { active: mode.id === activeVacuumMode && vacuumPower, disabled: !vacuumPower }]"
                :disabled="!vacuumPower"
                @click="setVacuumMode(mode.id)">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path v-if="mode.id === 'auto'" d="M12 2a10 10 0 0 0-10 10c0 5.5 4.5 10 10 10s10-4.5 10-10c0-5.5-4.5-10-10-10z M12 6v6l4 2" stroke="currentColor" stroke-width="2" fill="none"/>
                  <path v-else-if="mode.id === 'spot'" d="M12 2a10 10 0 0 0-10 10c0 5.5 4.5 10 10 10s10-4.5 10-10c0-5.5-4.5-10-10-10z M12 8v8 M8 12h8" stroke="currentColor" stroke-width="2" fill="none"/>
                  <path v-else-if="mode.id === 'edge'" d="M12 2a10 10 0 0 0-10 10c0 5.5 4.5 10 10 10s10-4.5 10-10c0-5.5-4.5-10-10-10z M8 8h8v8H8z" stroke="currentColor" stroke-width="2" fill="none"/>
                  <path v-else-if="mode.id === 'mop'" d="M12 2a10 10 0 0 0-10 10c0 5.5 4.5 10 10 10s10-4.5 10-10c0-5.5-4.5-10-10-10z M12 6v12 M6 12h12" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
              </button>
              <span>{{ mode.name }}</span>
            </div>
          </div>
        </div>

        <!-- 洗衣机控制面板 -->
        <div class="washing-machine-card">
          <div class="card-header">
            <div class="washing-machine-card-info">
              <h3>Washing Machine</h3>
              <p>Samsung Smart Washer</p>
            </div>
            
            <!-- 记录按钮 -->
            <div class="record-button">
              <button 
                class="record-btn"
                @click="showWashingMachineRecordDialog"
                title="查看洗衣记录">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
                洗衣记录
              </button>
            </div>
            
            <!-- 开始按钮 -->
            <div class="washing-machine-start">
              <button 
                :class="['start-btn', { disabled: !washingMachinePower || (!activeWashingMachineMode && washingMachineStatus === 'idle') || (washingMachineStatus !== 'idle' && washingMachineStatus !== 'done') }]"
                :disabled="!washingMachinePower || (!activeWashingMachineMode && washingMachineStatus === 'idle') || (washingMachineStatus !== 'idle' && washingMachineStatus !== 'done')"
                @click="startWashingMachine">
                <svg v-if="washingMachineStatus === 'idle'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <svg v-else-if="washingMachineStatus === 'done'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                {{ startButtonText }}
              </button>
            </div>
            
            <div class="power-switch">
              <span class="switch-label">{{ washingMachinePower ? 'On' : 'Off' }}</span>
              <div 
                :class="['switch-button', { active: washingMachinePower }]"
                @click="toggleWashingMachine"
              ></div>
            </div>
          </div>
          
          <div class="washing-machine-status-section">
            <div class="washing-machine-info">
              <div class="status-display">
                <div class="status-icon" :class="washingMachineStatus">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6h18v2H3V6zM3 10h18v8H3v-8z" stroke="currentColor" stroke-width="2" fill="none"/>
                    <circle cx="8" cy="14" r="1" fill="currentColor"/>
                    <circle cx="12" cy="14" r="1" fill="currentColor"/>
                    <circle cx="16" cy="14" r="1" fill="currentColor"/>
                  </svg>
                </div>
                <div class="status-text">
                  <h4>{{ washingMachineStatusText }}</h4>
                  <p>{{ washingMachineTime.toFixed(1) }} min remaining</p>
                </div>
              </div>
              <div class="washing-progress">
                <div class="progress-label">Washing Progress</div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: washingMachineProgress + '%' }"></div>
                </div>
                <div class="progress-text">{{ washingMachineProgress.toFixed(1) }}%</div>
              </div>
            </div>
          </div>
          
          <div class="washing-machine-controls">
            <div v-for="mode in washingMachineModes" class="mode-div">
              <button :key="mode.id"
                :class="['mode-btn', { active: mode.id === activeWashingMachineMode && washingMachinePower, disabled: !washingMachinePower || (washingMachineStatus !== 'idle' && washingMachineStatus !== 'done') }]"
                :disabled="!washingMachinePower || (washingMachineStatus !== 'idle' && washingMachineStatus !== 'done')"
                @click="setWashingMachineMode(mode.id)">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path v-if="mode.id === 'normal'" d="M3 6h18v2H3V6zM3 10h18v8H3v-8z M8 14h8" stroke="currentColor" stroke-width="2" fill="none"/>
                  <path v-else-if="mode.id === 'quick'" d="M3 6h18v2H3V6zM3 10h18v8H3v-8z M8 12h8 M8 16h8" stroke="currentColor" stroke-width="2" fill="none"/>
                  <path v-else-if="mode.id === 'delicate'" d="M3 6h18v2H3V6zM3 10h18v8H3v-8z M8 13h8" stroke="currentColor" stroke-width="2" fill="none"/>
                  <path v-else-if="mode.id === 'heavy'" d="M3 6h18v2H3V6zM3 10h18v8H3v-8z M8 12h8 M8 14h8 M8 16h8" stroke="currentColor" stroke-width="2" fill="none"/>
                  <path v-else-if="mode.id === 'wool'" d="M3 6h18v2H3V6zM3 10h18v8H3v-8z M8 12h8" stroke="currentColor" stroke-width="2" fill="none"/>
                  <path v-else-if="mode.id === 'eco'" d="M3 6h18v2H3V6zM3 10h18v8H3v-8z M8 13h8" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
              </button>
              <span>{{ mode.name }}</span>
            </div>
          </div>
          
          <!-- 洗衣机详细设置 -->
          <div class="washing-machine-settings">
            <!-- 温度设置 -->
            <div class="setting-group">
              <h5>温度</h5>
              <div class="setting-options">
                <button 
                  v-for="option in temperatureOptions" 
                  :key="option.id"
                  :class="['setting-btn', { active: option.id === washingMachineSettings.temperature && washingMachinePower && activeWashingMachineMode, disabled: !washingMachinePower || !activeWashingMachineMode || (washingMachineStatus !== 'idle' && washingMachineStatus !== 'done') }]"
                  :disabled="!washingMachinePower || !activeWashingMachineMode || (washingMachineStatus !== 'idle' && washingMachineStatus !== 'done')"
                  @click="setWashingMachineSetting('temperature', option.id)">
                  {{ option.name }}
                </button>
              </div>
            </div>
            
            <!-- 洗涤次数设置 -->
            <div class="setting-group">
              <h5>洗涤次数</h5>
              <div class="setting-options">
                <button 
                  v-for="option in rinseCountOptions" 
                  :key="option.id"
                  :class="['setting-btn', { active: option.id === washingMachineSettings.rinseCount && washingMachinePower && activeWashingMachineMode, disabled: !washingMachinePower || !activeWashingMachineMode || (washingMachineStatus !== 'idle' && washingMachineStatus !== 'done') }]"
                  :disabled="!washingMachinePower || !activeWashingMachineMode || (washingMachineStatus !== 'idle' && washingMachineStatus !== 'done')"
                  @click="setWashingMachineSetting('rinseCount', option.id)">
                  {{ option.name }}
                </button>
              </div>
            </div>
            
            <!-- 脱水转速设置 -->
            <div class="setting-group">
              <h5>脱水转速</h5>
              <div class="setting-options">
                <button 
                  v-for="option in spinSpeedOptions" 
                  :key="option.id"
                  :class="['setting-btn', { active: option.id === washingMachineSettings.spinSpeed && washingMachinePower && activeWashingMachineMode, disabled: !washingMachinePower || !activeWashingMachineMode || (washingMachineStatus !== 'idle' && washingMachineStatus !== 'done') }]"
                  :disabled="!washingMachinePower || !activeWashingMachineMode || (washingMachineStatus !== 'idle' && washingMachineStatus !== 'done')"
                  @click="setWashingMachineSetting('spinSpeed', option.id)">
                  {{ option.name }}
                </button>
              </div>
            </div>
            
            <!-- 烘干时长设置 -->
            <div class="setting-group">
              <h5>烘干时长</h5>
              <div class="setting-options">
                <button 
                  v-for="option in dryTimeOptions" 
                  :key="option.id"
                  :class="['setting-btn', { active: option.id === washingMachineSettings.dryTime && washingMachinePower && activeWashingMachineMode, disabled: !washingMachinePower || !activeWashingMachineMode || (washingMachineStatus !== 'idle' && washingMachineStatus !== 'done') }]"
                  :disabled="!washingMachinePower || !activeWashingMachineMode || (washingMachineStatus !== 'idle' && washingMachineStatus !== 'done')"
                  @click="setWashingMachineSetting('dryTime', option.id)">
                  {{ option.name }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 冰箱控制面板 -->
        <div class="refrigerator-card">
          <div class="card-header">
            <div class="refrigerator-card-info">
              <h3>Refrigerator</h3>
              <p>Haier Smart Fridge</p>
            </div>
            
            <!-- 冰箱模式选择 -->
            <div class="refrigerator-modes-header">
              <div class="mode-buttons">
                <button 
                  v-for="mode in [{ id: 'normal', name: '标准' }, { id: 'eco', name: '节能' }, { id: 'vacation', name: '度假' }]"
                  :key="mode.id"
                  :class="['mode-btn', { active: mode.id === refrigeratorMode && refrigeratorPower, disabled: !refrigeratorPower }]"
                  :disabled="!refrigeratorPower"
                  @click="setRefrigeratorMode(mode.id)">
                  {{ mode.name }}
                </button>
              </div>
            </div>
            
            <div class="power-switch">
              <span class="switch-label">{{ refrigeratorPower ? 'On' : 'Off' }}</span>
              <div 
                :class="['switch-button', { active: refrigeratorPower }]"
                @click="toggleRefrigerator"
              ></div>
            </div>
          </div>
          
          <div class="refrigerator-status-section">
            <div class="refrigerator-info">
              <div class="status-display">
                <div class="status-icon" :class="refrigeratorStatus">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4h16v16H4V4zM6 6v12h12V6H6zM8 8h8v2H8V8zM8 12h8v2H8v-2z" stroke="currentColor" stroke-width="2" fill="none"/>
                  </svg>
                </div>
                <div class="status-text">
                  <h4>{{ refrigeratorStatusText }}</h4>
                  <p>Smart Refrigeration System</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 冷藏室控制 -->
          <div class="refrigerator-controls">
            <div class="compartment-control cooling-compartment">
              <div class="compartment-header">
                <h4>冷藏室</h4>
                <div class="temperature-display">
                  {{ refrigeratorSettings.coolingTemperature }}°C
                </div>
              </div>
              
              <div class="temperature-control">
                <label>温度设置</label>
                <div class="temp-slider-container">
                  <input 
                    type="range" 
                    min="-2" 
                    max="20" 
                    step="1"
                    :value="refrigeratorSettings.coolingTemperature"
                    :disabled="!refrigeratorPower"
                    @input="setCoolingTemperature(parseInt($event.target.value))"
                    class="temp-slider">
                  <div class="temp-labels">
                    <span>-2°C</span>
                    <span>4°C</span>
                    <span>10°C</span>
                    <span>16°C</span>
                    <span>20°C</span>
                  </div>
                </div>
              </div>
              
              <div class="sterilization-control">
                <label>杀菌功能</label>
                <div 
                  :class="['sterilization-switch', { active: refrigeratorSettings.coolingSterilization && refrigeratorPower, disabled: !refrigeratorPower }]"
                  @click="toggleCoolingSterilization">
                  <div class="switch-indicator"></div>
                </div>
              </div>
            </div>
            
            <!-- 冷冻室控制 -->
            <div class="compartment-control freezer-compartment">
              <div class="compartment-header">
                <h4>冷冻室</h4>
                <div class="temperature-display">
                  {{ freezerSettings.freezerTemperature }}°C
                </div>
              </div>
              
              <div class="temperature-control">
                <label>温度设置</label>
                <div class="temp-slider-container">
                  <input 
                    type="range" 
                    min="-12" 
                    max="0" 
                    step="1"
                    :value="freezerSettings.freezerTemperature"
                    :disabled="!refrigeratorPower"
                    @input="setFreezerTemperature(parseInt($event.target.value))"
                    class="temp-slider">
                  <div class="temp-labels">
                    <span>-12°C</span>
                    <span>-9°C</span>
                    <span>-6°C</span>
                    <span>-3°C</span>
                    <span>0°C</span>
                  </div>
                </div>
              </div>
              
              <div class="sterilization-control">
                <label>杀菌功能</label>
                <div 
                  :class="['sterilization-switch', { active: freezerSettings.freezerSterilization && refrigeratorPower, disabled: !refrigeratorPower }]"
                  @click="toggleFreezerSterilization">
                  <div class="switch-indicator"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

    </div>
  </div>

  <!-- 洗衣机关闭确认对话框 -->
  <div v-if="showWashConfirmDialog" class="confirm-dialog-overlay" @click="cancelTurnOffWashingMachine">
    <div class="confirm-dialog" @click.stop>
      <div class="confirm-dialog-header">
        <h3>确认关闭洗衣机</h3>
      </div>
      <div class="confirm-dialog-content">
        <p>洗衣机正在运行中，确定要关闭吗？</p>
        <p class="warning-text">关闭后洗衣进度将丢失，需要重新开始。</p>
      </div>
      <div class="confirm-dialog-actions">
        <button class="cancel-btn" @click="cancelTurnOffWashingMachine">取消</button>
        <button class="confirm-btn" @click="confirmTurnOffWashingMachine">确认关闭</button>
      </div>
    </div>
  </div>

  <!-- 扫地机器人记录对话框 -->
  <div v-if="showVacuumRecords" class="record-dialog-overlay" @click="closeRecordDialog">
    <div class="record-dialog" @click.stop>
      <div class="record-dialog-header">
        <h3>清洁记录</h3>
        <button class="close-btn" @click="closeRecordDialog">×</button>
      </div>
      <div class="record-dialog-content">
        <div class="record-list">
          <div v-for="record in vacuumRecords" :key="record.id" class="record-item">
            <div class="record-date">
              <span class="date">{{ record.date }}</span>
              <span class="time">{{ record.time }}</span>
            </div>
            <div class="record-details">
              <span class="mode">{{ record.mode }}</span>
              <span class="duration">{{ record.duration }}</span>
              <span class="status completed">{{ record.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 洗衣机记录对话框 -->
  <div v-if="showWashingMachineRecords" class="record-dialog-overlay" @click="closeRecordDialog">
    <div class="record-dialog" @click.stop>
      <div class="record-dialog-header">
        <h3>洗衣记录</h3>
        <button class="close-btn" @click="closeRecordDialog">×</button>
      </div>
      <div class="record-dialog-content">
        <div class="record-list">
          <div v-for="record in washingMachineRecords" :key="record.id" class="record-item">
            <div class="record-date">
              <span class="date">{{ record.date }}</span>
              <span class="time">{{ record.time }}</span>
            </div>
            <div class="record-details">
              <span class="mode">{{ record.mode }}</span>
              <span class="duration">{{ record.duration }}</span>
              <span class="status completed">{{ record.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
// =========================
// Imports
// =========================
import { ref, computed, watch } from 'vue'

// =========================
// Room navigation data/state
// - rooms: includes an 'all' option for the navigation only
// - activeRoom: current nav selection (defaults to 'all')
// =========================
const rooms = ref([
  { id: 'all', name: 'All' },
  { id: 'living', name: 'Living Room' },
  { id: 'dining', name: 'Dining Room' },
  { id: 'bedroom', name: 'Bed Room' },
  { id: 'bathroom', name: 'Bath Room' },
  { id: 'backyard', name: 'Backyard' }
])

// 当前选中的房间
const activeRoom = ref('all')

// =========================
// AC modes and state
// =========================
const acModes = ref([
  { id: 'heat', name: 'Heat' },
  { id: 'dry', name: 'Dry' },
  { id: 'cool', name: 'Cool' },
  { id: 'auto', name: 'Auto' }
])

// 当前选中的空调模式
const activeMode = ref('cool')
// 记住上一次的模式，用于断电后恢复
const lastActiveMode = ref(activeMode.value)

// 空调电源状态
const acPower = ref(true)

// 当前空调温度（示例）
const acTemp = ref(16)

// 根据温度选择渐变终点色（6个区间）
const tempEndColor = computed(() => {
  const t = acTemp.value
  if (t <= 10) return 'var(--temp-color-1)'
  if (t <= 16) return 'var(--temp-color-2)'
  if (t <= 22) return 'var(--temp-color-3)'
  if (t <= 26) return 'var(--temp-color-4)'
  if (t <= 30) return 'var(--temp-color-5)'
  return 'var(--temp-color-6)'
})

// 根据模式计算房间覆盖色（房间图片上色）
const roomTint = computed(() => {
  if (!acPower.value) return 'transparent'
  switch (activeMode.value) {
    case 'heat':
      return 'var(--mode-heat-overlay)'
    case 'dry':
      return 'var(--mode-dry-overlay)'
    case 'cool':
      return 'var(--mode-cool-overlay)'
    case 'auto':
      return 'transparent'
    default:
      return 'transparent'
  }
})

// 设备数据
const devices = ref([
  { id: 1, name: 'Smart Light', model: 'Bardi Smart Light', type: 'light', power: false },
  { id: 2, name: 'Smart TV', model: 'Samsung QBOC', type: 'tv', power: true },
  { id: 3, name: 'Smart Vacuum', model: 'KLAZ Vacuum', type: 'vacuum', power: false },
  { id: 4, name: 'Thermostat', model: 'Tuya Zigbe', type: 'thermostat', power: false }
])

// =========================
// Navigation / Mode handlers
// =========================
const setActiveRoom = (roomId) => {
  activeRoom.value = roomId
}

// =========================
// Camera module: independent room selector
// - roomLabel: label for the selector
// - selectedCameraRoom: local selection (independent from nav)
// - cameraMenuOpen: dropdown visibility
// =========================
const roomLabel = computed(() => {
  const map = {
    'living': 'Living Room',
    'dining': 'Dining Room',
    'bedroom': 'Bed Room',
    'bathroom': 'Bath Room',
    'backyard': 'Backyard'
  }
  // 当 activeRoom 为 all 时，默认显示 Living Room
  return map[selectedCameraRoom.value] || 'Living Room'
})

// Camera 独立选择的房间（不影响 room-navigation）
// 初始化选择器为第一个非 all 的房间
const selectedCameraRoom = ref('living')
const cameraMenuOpen = ref(false)

// room-navigation 改变时，自动同步 room-selector 的显示值
watch(activeRoom, (val) => {
  if (val === 'all') return
  selectedCameraRoom.value = val
})

// room-selector 改变时，只影响自身，不修改 activeRoom
const selectCameraRoom = (roomId) => {
  selectedCameraRoom.value = roomId
  cameraMenuOpen.value = false
}

// 示例：按房间提供不同演示视频地址（可接入真实流）
const cameraSources = {
  living: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  dining: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm',
  bedroom: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
  bathroom: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
  backyard: 'https://media.w3.org/2010/05/video/movie_300.mp4'
}

const cameraVideoSrc = computed(() => {
  return cameraSources[selectedCameraRoom.value] || cameraSources.living
})

// =========================
// Voice input (local speech recognition to text)
// =========================
const SpeechRecognition = (window.SpeechRecognition || window.webkitSpeechRecognition)
const speechSupported = !!SpeechRecognition
const isListening = ref(false)
const transcript = ref('')
let recognition = null

if (speechSupported) {
  recognition = new SpeechRecognition()
  recognition.lang = 'zh-CN'
  recognition.continuous = true
  recognition.interimResults = true
  recognition.onresult = (event) => {
    let text = ''
    for (let i = event.resultIndex; i < event.results.length; i++) {
      text += event.results[i][0].transcript
    }
    transcript.value = text
  }
  recognition.onend = () => {
    isListening.value = false
  }
}

const startVoice = () => {
  if (!speechSupported || !recognition) return
  transcript.value = ''
  isListening.value = true
  try { recognition.start() } catch (e) { /* ignore double start */ }
}

const stopVoice = () => {
  if (!speechSupported || !recognition) return
  try { recognition.stop() } catch (e) { /* ignore */ }
}

// 设置空调模式
const setActiveMode = (modeId) => {
  if (!acPower.value) return
  activeMode.value = modeId
  lastActiveMode.value = modeId
}

// 切换设备开关
const toggleDevice = (deviceId) => {
  const device = devices.value.find(d => d.id === deviceId)
  if (device) {
    device.power = !device.power
  }
}

// 切换空调电源
const toggleAC = () => {
  acPower.value = !acPower.value
  if (!acPower.value) {
    // 关闭电源时，清除当前模式的选中状态
    lastActiveMode.value = activeMode.value
    activeMode.value = null
  } else {
    // 打开电源时，恢复上一次模式
    activeMode.value = lastActiveMode.value || 'cool'
  }
}

// =========================
// Vacuum robot state and modes
// =========================
const vacuumModes = ref([
  { id: 'auto', name: 'Auto' },
  { id: 'spot', name: 'Spot' },
  { id: 'edge', name: 'Edge' },
  { id: 'mop', name: 'Mop' }
])

const vacuumPower = ref(false)
const activeVacuumMode = ref('auto')
// 记住上一次的模式，用于断电后恢复
const lastActiveVacuumMode = ref(activeVacuumMode.value)
const vacuumStatus = ref('idle') // idle, cleaning, charging, done, error
const vacuumBattery = ref(85)
const vacuumProgress = ref(0)

// 计算状态文本
const vacuumStatusText = computed(() => {
  if (!vacuumPower.value) return 'Offline'
  switch (vacuumStatus.value) {
    case 'idle': return 'Idle'
    case 'cleaning': return 'Cleaning'
    case 'charging': return 'Charging'
    case 'done': return 'Done'
    case 'error': return 'Error'
    default: return 'Unknown'
  }
})

// =========================
// Washing machine state and modes
// =========================
const washingMachineModes = ref([
  { id: 'normal', name: 'Normal' },
  { id: 'quick', name: 'Quick' },
  { id: 'delicate', name: 'Delicate' },
  { id: 'heavy', name: 'Heavy' },
  { id: 'wool', name: 'Wool' },
  { id: 'eco', name: 'Eco' }
])

// 温度选项
const temperatureOptions = ref([
  { id: 'cold', name: '常温', value: '常温' },
  { id: 'warm', name: '40°C', value: '40°C' }
])

// 洗涤次数选项
const rinseCountOptions = ref([
  { id: 1, name: '1次' },
  { id: 2, name: '2次' },
  { id: 3, name: '3次' }
])

// 脱水转速选项
const spinSpeedOptions = ref([
  { id: 0, name: '无' },
  { id: 400, name: '400' },
  { id: 600, name: '600' },
  { id: 800, name: '800' },
  { id: 1000, name: '1000' },
  { id: 1200, name: '1200' }
])

// 烘干时长选项
const dryTimeOptions = ref([
  { id: 'none', name: '不烘干' },
  { id: 'smart', name: '智能烘干' },
  { id: '30', name: '30分钟' },
  { id: '60', name: '60分钟' },
  { id: '90', name: '90分钟' },
  { id: '120', name: '120分钟' },
  { id: '180', name: '180分钟' }
])

const washingMachinePower = ref(false)
const activeWashingMachineMode = ref('normal')
// 记住上一次的模式，用于断电后恢复
const lastActiveWashingMachineMode = ref(activeWashingMachineMode.value)
const washingMachineStatus = ref('idle') // idle, washing, rinsing, spinning, done
const washingMachineTime = ref(0)
const washingMachineProgress = ref(0)

// 确认对话框状态
const showWashConfirmDialog = ref(false)

// 设备记录数据
const vacuumRecords = ref([
  { id: 1, date: '2024-01-15', time: '14:30', duration: '45分钟', mode: 'Auto', status: '完成' },
  { id: 2, date: '2024-01-14', time: '09:15', duration: '32分钟', mode: 'Spot', status: '完成' },
  { id: 3, date: '2024-01-13', time: '20:45', duration: '38分钟', mode: 'Edge', status: '完成' }
])

const washingMachineRecords = ref([
  { id: 1, date: '2024-01-15', time: '16:20', duration: '45分钟', mode: 'Normal', status: '完成' },
  { id: 2, date: '2024-01-14', time: '10:30', duration: '30分钟', mode: 'Quick', status: '完成' },
  { id: 3, date: '2024-01-13', time: '19:15', duration: '60分钟', mode: 'Heavy', status: '完成' }
])

// 记录对话框状态
const showVacuumRecords = ref(false)
const showWashingMachineRecords = ref(false)

// =========================
// Refrigerator state and modes
// =========================
const refrigeratorPower = ref(false)
const refrigeratorStatus = ref('idle') // idle, cooling, defrosting, error
const refrigeratorMode = ref('normal') // normal, eco, vacation

// 冷藏室设置
const refrigeratorSettings = ref({
  coolingTemperature: 4, // 冷藏温度
  coolingSterilization: false, // 冷藏杀菌
  coolingStatus: 'idle' // 冷藏状态
})

// 冷冻室设置
const freezerSettings = ref({
  freezerTemperature: -6, // 冷冻温度
  freezerSterilization: false, // 冷冻杀菌
  freezerStatus: 'idle' // 冷冻状态
})


// 洗衣机设置选项
const washingMachineSettings = ref({
  temperature: 'cold', // 默认常温
  rinseCount: 2, // 默认2次
  spinSpeed: 800, // 默认800转
  dryTime: 'none' // 默认不烘干
})

// 计算状态文本
const washingMachineStatusText = computed(() => {
  if (!washingMachinePower.value) return 'Offline'
  switch (washingMachineStatus.value) {
    case 'idle': return 'Idle'
    case 'washing': return 'Washing'
    case 'rinsing': return 'Rinsing'
    case 'spinning': return 'Spinning'
    case 'done': return 'Done'
    default: return 'Unknown'
  }
})

// 开始按钮文字
const startButtonText = computed(() => {
  if (!washingMachinePower.value) return '设备关闭'
  if (!activeWashingMachineMode.value) return '选择模式'
  
  switch (washingMachineStatus.value) {
    case 'idle': return '开始洗衣'
    case 'washing': return '洗衣中...'
    case 'rinsing': return '漂洗中...'
    case 'spinning': return '脱水中...'
    case 'done': return '已完成'
    default: return '开始洗衣'
  }
})

// =========================
// Camera power state
// =========================
const cameraPower = ref(true)

// 切换扫地机器人开关
const toggleVacuum = () => {
  vacuumPower.value = !vacuumPower.value
  if (!vacuumPower.value) {
    // 关闭电源时，清除当前模式的选中状态
    lastActiveVacuumMode.value = activeVacuumMode.value
    activeVacuumMode.value = null
    vacuumStatus.value = 'idle'
    vacuumProgress.value = 0
  } else {
    // 打开电源时，不默认选中任何模式
    activeVacuumMode.value = null
    vacuumStatus.value = 'idle'
    vacuumProgress.value = 0
  }
}

// 设置扫地机器人模式
const setVacuumMode = (modeId) => {
  if (!vacuumPower.value) return
  activeVacuumMode.value = modeId
  lastActiveVacuumMode.value = modeId
  
  // 模拟开始清洁
  if (modeId !== 'auto' || vacuumStatus.value === 'idle') {
    vacuumStatus.value = 'cleaning'
    startCleaningSimulation()
  }
}

// 模拟清洁进度
const startCleaningSimulation = () => {
  vacuumProgress.value = 0
  const interval = setInterval(() => {
    if (vacuumProgress.value < 100 && vacuumStatus.value === 'cleaning') {
      vacuumProgress.value += Math.random() * 5
      if (vacuumProgress.value >= 100) {
        vacuumProgress.value = 100
        vacuumStatus.value = 'done'
        clearInterval(interval)
        
        // 3秒后重置按钮和进度条
        setTimeout(() => {
          activeVacuumMode.value = null
          vacuumStatus.value = 'idle'
          vacuumProgress.value = 0
        }, 3000)
      }
    } else {
      clearInterval(interval)
    }
  }, 1000)
}

// 切换洗衣机开关
const toggleWashingMachine = () => {
  // 如果正在洗衣过程中，显示确认对话框
  if (washingMachinePower.value && (washingMachineStatus.value === 'washing' || washingMachineStatus.value === 'rinsing' || washingMachineStatus.value === 'spinning')) {
    showWashConfirmDialog.value = true
    return
  }
  
  washingMachinePower.value = !washingMachinePower.value
  if (!washingMachinePower.value) {
    // 关闭电源时，清除当前模式的选中状态
    lastActiveWashingMachineMode.value = activeWashingMachineMode.value
    activeWashingMachineMode.value = null
    washingMachineStatus.value = 'idle'
    washingMachineProgress.value = 0
    washingMachineTime.value = 0
  } else {
    // 打开电源时，不默认选中任何模式
    activeWashingMachineMode.value = null
    washingMachineStatus.value = 'idle'
    washingMachineProgress.value = 0
    washingMachineTime.value = 0
  }
}

// 确认关闭洗衣机
const confirmTurnOffWashingMachine = () => {
  washingMachinePower.value = false
  lastActiveWashingMachineMode.value = activeWashingMachineMode.value
  activeWashingMachineMode.value = null
  washingMachineStatus.value = 'idle'
  washingMachineProgress.value = 0
  washingMachineTime.value = 0
  showWashConfirmDialog.value = false
}

// 取消关闭洗衣机
const cancelTurnOffWashingMachine = () => {
  showWashConfirmDialog.value = false
}

// 显示扫地机器人记录
const showVacuumRecordDialog = () => {
  showVacuumRecords.value = true
}

// 显示洗衣机记录
const showWashingMachineRecordDialog = () => {
  showWashingMachineRecords.value = true
}

// 关闭记录对话框
const closeRecordDialog = () => {
  showVacuumRecords.value = false
  showWashingMachineRecords.value = false
}

// 冰箱状态文本
const refrigeratorStatusText = computed(() => {
  if (!refrigeratorPower.value) return 'Offline'
  switch (refrigeratorStatus.value) {
    case 'idle': return 'Idle'
    case 'cooling': return 'Cooling'
    case 'defrosting': return 'Defrosting'
    case 'error': return 'Error'
    default: return 'Unknown'
  }
})

// 切换冰箱开关
const toggleRefrigerator = () => {
  refrigeratorPower.value = !refrigeratorPower.value
  if (!refrigeratorPower.value) {
    // 关闭电源时，重置所有状态
    refrigeratorStatus.value = 'idle'
    refrigeratorSettings.value.coolingStatus = 'idle'
    freezerSettings.value.freezerStatus = 'idle'
  } else {
    // 打开电源时，开始制冷
    refrigeratorStatus.value = 'cooling'
    refrigeratorSettings.value.coolingStatus = 'cooling'
    freezerSettings.value.freezerStatus = 'cooling'
  }
}

// 设置冰箱模式
const setRefrigeratorMode = (mode) => {
  if (!refrigeratorPower.value) return
  refrigeratorMode.value = mode
}

// 设置冷藏温度
const setCoolingTemperature = (temp) => {
  if (!refrigeratorPower.value) return
  refrigeratorSettings.value.coolingTemperature = temp
}

// 设置冷冻温度
const setFreezerTemperature = (temp) => {
  if (!refrigeratorPower.value) return
  freezerSettings.value.freezerTemperature = temp
}

// 切换冷藏杀菌
const toggleCoolingSterilization = () => {
  if (!refrigeratorPower.value) return
  refrigeratorSettings.value.coolingSterilization = !refrigeratorSettings.value.coolingSterilization
}

// 切换冷冻杀菌
const toggleFreezerSterilization = () => {
  if (!refrigeratorPower.value) return
  freezerSettings.value.freezerSterilization = !freezerSettings.value.freezerSterilization
}


// 设置洗衣机模式
const setWashingMachineMode = (modeId) => {
  if (!washingMachinePower.value) return
  // 洗衣过程中不能切换模式
  if (washingMachineStatus.value !== 'idle' && washingMachineStatus.value !== 'done') return
  activeWashingMachineMode.value = modeId
  lastActiveWashingMachineMode.value = modeId
}

// 开始洗衣机工作
const startWashingMachine = () => {
  if (!washingMachinePower.value) {
    return
  }
  
  // 如果已完成，重置状态
  if (washingMachineStatus.value === 'done') {
    washingMachineStatus.value = 'idle'
    washingMachineTime.value = 0
    washingMachineProgress.value = 0
    activeWashingMachineMode.value = null
    return
  }
  
  // 如果没有选择模式，不能开始
  if (!activeWashingMachineMode.value || washingMachineStatus.value !== 'idle') {
    return
  }
  
  // 开始洗衣
  washingMachineStatus.value = 'washing'
  washingMachineTime.value = 45
  startWashingSimulation()
}

// 设置洗衣机选项
const setWashingMachineSetting = (settingType, value) => {
  if (!washingMachinePower.value) return
  // 洗衣过程中不能修改设置
  if (washingMachineStatus.value !== 'idle' && washingMachineStatus.value !== 'done') return
  washingMachineSettings.value[settingType] = value
}

// 模拟洗衣进度
const startWashingSimulation = () => {
  washingMachineProgress.value = 0
  washingMachineTime.value = 45 // 默认45分钟
  
  const interval = setInterval(() => {
    if (washingMachineProgress.value < 100 && washingMachineStatus.value !== 'idle') {
      washingMachineProgress.value += Math.random() * 8
      washingMachineTime.value = Math.max(0, washingMachineTime.value - 1.2)
      
      // 模拟洗衣阶段
      if (washingMachineProgress.value >= 100) {
        washingMachineProgress.value = 100
        washingMachineStatus.value = 'done'
        washingMachineTime.value = 0
        clearInterval(interval)
        
        // 3秒后重置按钮和进度条
        setTimeout(() => {
          activeWashingMachineMode.value = null
          washingMachineStatus.value = 'idle'
          washingMachineProgress.value = 0
        }, 3000)
      } else if (washingMachineProgress.value >= 60 && washingMachineStatus.value === 'washing') {
        washingMachineStatus.value = 'spinning'
      } else if (washingMachineProgress.value >= 30 && washingMachineStatus.value === 'washing') {
        washingMachineStatus.value = 'rinsing'
      }
    } else {
      clearInterval(interval)
    }
  }, 1000)
}

// 切换摄像头开关
const toggleCamera = () => {
  cameraPower.value = !cameraPower.value
}

// =========================
// Fullscreen functionality
// =========================
const isFullscreen = ref(false)

const toggleFullscreen = () => {
  const cameraView = document.querySelector('.camera-view')
  if (!cameraView) return

  if (!isFullscreen.value) {
    // Enter fullscreen
    if (cameraView.requestFullscreen) {
      cameraView.requestFullscreen()
    } else if (cameraView.webkitRequestFullscreen) {
      cameraView.webkitRequestFullscreen()
    } else if (cameraView.msRequestFullscreen) {
      cameraView.msRequestFullscreen()
    }
  } else {
    // Exit fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
  }
}

// Listen for fullscreen changes
const handleFullscreenChange = () => {
  isFullscreen.value = !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  )
}

// Add event listeners for fullscreen changes
document.addEventListener('fullscreenchange', handleFullscreenChange)
document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
document.addEventListener('msfullscreenchange', handleFullscreenChange)
</script>

<style scoped>
@import '../styles/colors.css';

/* =========================
   Page layout
   ========================= */
.home-page {
  width: 100%;
  padding: 8px 24px;
  overflow: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.home-page::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

/* =========================
   Room navigation bar
   ========================= */
.room-navigation {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.room-btn {
  flex-direction: column;
  align-items: center;
  padding:10px 12px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--color-text-secondary);
  text-align: center;
  background-color: var(--color-nav-idle);
  border: 1px solid var(--color-border);
  font-size: 12px;
  font-weight: 500;
}

.room-btn:hover {
  background-color: var(--color-hover);
  color: var(--color-primary);
}

.room-btn.active {
  background-color: var(--color-active);
  color: var(--color-primary);
}

.add-room-btn {
  margin-left: auto;
  padding: 0px 18px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-room-btn:hover {
  background: var(--color-bg-card);
}

.add-room-btn svg {
  width: 16px;
  height: 16px;
}

/* =========================
   Main content grid
   ========================= */
.main-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
}

/* =========================
   Left section container
   ========================= */
.left-section {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.left-section::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.room-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 两列 */
  gap: 16px;
}

/* =========================
   Air cooler card
   ========================= */
.air-cooler-card {
  display: flex;
  flex-direction: column;
  flex: 1;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 24px 18px;
}

/* =========================
   Vacuum robot card
   ========================= */
.vacuum-card {
  display: flex;
  flex-direction: column;
  flex: 1;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 24px 18px;
}

.vacuum-card-info h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.vacuum-card-info p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.vacuum-status-section {
  margin-bottom: 24px;
}

.vacuum-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.status-display {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-button-dark);
  transition: all 0.3s ease;
}

.status-icon svg {
  width: 24px;
  height: 24px;
  color: var(--color-text-secondary);
}

.status-icon.idle {
  background: var(--color-button-dark);
}

.status-icon.cleaning {
  background: var(--color-primary);
  animation: pulse 2s infinite;
}

.status-icon.charging {
  background: var(--color-blue-500);
}

.status-icon.error {
  background: var(--color-red-500);
}

.status-icon.done {
  background: var(--color-green-500);
  animation: pulse 1s infinite;
}

/* 扫地机器人done状态样式 */
.vacuum-card .status-icon.done {
  background: #10b981;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.status-text h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.status-text p {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.cleaning-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-label {
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--color-button-dark);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-blue-500) 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: var(--color-text-secondary);
  text-align: right;
}

.vacuum-controls {
  display: flex;
  gap: 16px;
  margin-top: 24px;
}

/* =========================
   Washing machine card
   ========================= */
.washing-machine-card {
  display: flex;
  flex-direction: column;
  flex: 1;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 24px 18px;
}

.washing-machine-card-info h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.washing-machine-card-info p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.washing-machine-status-section {
  margin-bottom: 24px;
}

.washing-machine-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.washing-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.washing-machine-controls {
  display: flex;
  gap: 16px;
  margin-top: 24px;
  flex-wrap: wrap;
}

/* 洗衣机详细设置样式 */
.washing-machine-settings {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-group h5 {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.setting-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.setting-btn {
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 50px;
  text-align: center;
}

.setting-btn:hover:not(:disabled) {
  background: var(--color-hover);
  color: var(--color-text-primary);
}

.setting-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.setting-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 洗衣机状态图标样式 */
.washing-machine-card .status-icon.idle {
  background: var(--color-button-dark);
}

.washing-machine-card .status-icon.washing {
  background: var(--color-blue-500);
  animation: pulse 2s infinite;
}

.washing-machine-card .status-icon.rinsing {
  background: #60a5fa;
  animation: pulse 2s infinite;
}

.washing-machine-card .status-icon.spinning {
  background: var(--color-blue-600);
  animation: pulse 1.5s infinite;
}

.washing-machine-card .status-icon.done {
  background: #10b981;
  animation: pulse 1s infinite;
}

/* =========================
   Camera module
   ========================= */
.camera-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 16px;
}

.camera-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.camera-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.camera-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.room-selector {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-primary);
}

.room-selector svg {
  width: 14px;
  height: 14px;
}

.room-selector-wrapper {
  position: relative;
  display: inline-block;
}

.mic-button {
  margin-left: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-primary);
}

.mic-button svg {
  width: 18px;
  height: 18px;
}

.mic-button.listening {
  border-color: var(--color-primary);
  color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(191, 254, 1, 0.12);
}

.camera-view {
  position: relative;
  min-height: 340px;
  border-radius: 12px;
  background: var(--color-bg-card);
  border: 1px dashed var(--color-border);
  overflow: hidden;
}

.camera-view:hover .fullscreen-button {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
}

.room-selector-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 5;
  min-width: 160px;
  box-shadow: 0 8px 24px var(--shadow-soft);
}

.room-selector-item {
  padding: 6px 10px;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid transparent;
  text-align: left;
}

.room-selector-item.selected {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.camera-switch {
  display: flex;
  align-items: center;
  gap: 8px;
}

.camera-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  gap: 12px;
}

.camera-placeholder svg {
  width: 48px;
  height: 48px;
}

.camera-placeholder p {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}

.camera-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fullscreen-button {
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  opacity: 0;
  visibility: hidden;
  transform: scale(0.8);
}

.camera-view:hover .fullscreen-button:hover {
  background: rgba(0, 0, 0, 0.8);
  border-color: var(--color-primary);
  transform: scale(1.05);
}

.fullscreen-button svg {
  width: 18px;
  height: 18px;
}

.voice-output {
  margin-top: 8px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
}

.air-card-info h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.air-card-info p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.power-switch {
  display: flex;
  align-items: center;
  gap: 8px;
}

.switch-label {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.switch-button {
  width: 32px;
  height: 20px;
  background: var(--color-switch-indicator);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.switch-button.active {
  background: var(--color-primary);
}

.switch-button::after {
  content: '';
  position: absolute;
  top: 2px;
  width: 14px;
  height: 14px;
  background: var(--color-switch-indicator-active);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.switch-button.active::after {
  left: 16px;
}

/* =========================
   Temperature section
   ========================= */
.temperature-section {
  display: flex;
  gap: 24px;
}

.ac-temp{
  text-align: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
}

.room-temp {
  text-align: center;
  flex-direction: column;
  flex: 3;
  align-items: center;
}

.temp-header h4 {
  margin: 0 0 6px 0;
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.room-temp h4 {
  margin: 0 0 18px 0;
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.temp-display {
  margin-top: 20px;
  font-size: 28px;
  font-weight: 400;
  color: white;
  background: linear-gradient(180deg, var(--color-temp-gradient-start) 0%, var(--temp-end-color, var(--color-blue-500)) 100%);
  border-radius: 32px;
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px var(--shadow-soft);
}

.room-image {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.room-image img {
  width: 100%;
  object-fit: contain;
}

.room-image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--room-tint, transparent);
  pointer-events: none;
}

.temp-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 28px;
  font-weight: 400;
  color: white;
  text-shadow: 0 2px 4px var(--color-border-light);
  padding: 24px 20px;
  border-radius: 50%;
  backdrop-filter: blur(6px);
}

/* =========================
   Mode control buttons
   ========================= */
.mode-controls {
  display: flex;
  gap: 16px;
  margin-top: 24px;
}

.mode-div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.mode-btn {
  border: none;
  border-radius: 10px;
  background: var(--color-button-dark);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 10px 24px;
}

.mode-btn:hover {
  background: var(--color-button-dark-hover);
  transform: translateY(-2px);
}

.mode-btn.active {
  border: 1px solid var(--color-primary);
  color: white;
}

.mode-btn svg {
  width: 28px;
  height: 28px;
  color: white;
  stroke: white;
}

.mode-btn.active svg {
  width: 28px;
  height: 28px;
  color: var(--color-primary);
}

.mode-btn span {
  font-size: 12px;
  font-weight: 500;
  color: white;
  text-align: center;
}

/* =========================
   Devices list
   ========================= */
.devices-list {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
}

.device-card {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 16px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 12px;
  transition: all 0.3s ease;
}

.device-card:hover {
  border: 1px solid var(--color-primary);
}

.device-icon {
  padding: 10px 10px;
  background: var(--color-button-dark);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.device-icon svg {
  width: 24px;
  height: 24px;
  color: var(--color-text-secondary);
}

.device-info h4 {
  margin: 0 0 6px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.device-info p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 13px;
}


.device-switch {
  display: flex;
  margin-left: auto;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

/* =========================
   Washing machine start button
   ========================= */
.washing-machine-start {
  display: flex;
  justify-content: center;
  align-items: center;
}

.start-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.start-btn:hover:not(:disabled) {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

.start-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.start-btn:disabled,
.start-btn.disabled {
  background: var(--color-border);
  color: var(--color-text-secondary);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.start-btn svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

/* =========================
   Confirm dialog styles
   ========================= */
.confirm-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.confirm-dialog {
  background: var(--color-bg);
  border-radius: 16px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-border);
}

.confirm-dialog-header {
  margin-bottom: 16px;
}

.confirm-dialog-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.confirm-dialog-content {
  margin-bottom: 24px;
}

.confirm-dialog-content p {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.warning-text {
  color: #f59e0b !important;
  font-weight: 500;
}

.confirm-dialog-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.cancel-btn, .confirm-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.cancel-btn {
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.cancel-btn:hover {
  background: var(--color-hover);
  color: var(--color-text-primary);
}

.confirm-btn {
  background: #ef4444;
  color: white;
}

.confirm-btn:hover {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* =========================
   Record button styles
   ========================= */
.record-button {
  display: flex;
  align-items: center;
}

.record-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.record-btn:hover {
  background: var(--color-hover);
  color: var(--color-text-primary);
  border-color: var(--color-primary);
}

.record-btn svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

/* =========================
   Record dialog styles
   ========================= */
.record-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.record-dialog {
  background: var(--color-bg);
  border-radius: 16px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-border);
  overflow: hidden;
  opacity: 1;
  backdrop-filter: none;
}

.record-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
}

.record-dialog-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--color-hover);
  color: var(--color-text-primary);
}

.record-dialog-content {
  padding: 0;
  max-height: 60vh;
  overflow-y: auto;
  background: var(--color-bg-secondary);
}

.record-list {
  padding: 0;
  background: var(--color-bg-secondary);
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border);
  transition: background 0.2s ease;
  background: var(--color-bg);
  opacity: 1;
}

.record-item:last-child {
  border-bottom: none;
}

.record-item:hover {
  background: var(--color-hover);
}

.record-date {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.record-date .date {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.record-date .time {
  font-size: 12px;
  color: var(--color-text-secondary);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.record-details {
  display: flex;
  align-items: center;
  gap: 12px;
}

.record-details .mode {
  padding: 4px 8px;
  background: var(--color-primary-light, rgba(191, 254, 1, 0.2));
  color: var(--color-primary);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-primary);
}

/* 白天主题下的模式标签优化 */
[data-theme="light"] .record-details .mode {
  background: rgba(191, 254, 1, 0.3);
  color: #1a1a1a;
  border: 1px solid #8b8b8b;
  font-weight: 700;
  text-shadow: none;
}

.record-details .duration {
  font-size: 12px;
  color: var(--color-text-primary);
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.record-details .status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.record-details .status.completed {
  background: #dcfce7;
  color: #16a34a;
  border: 1px solid #16a34a;
  font-weight: 700;
}

/* 白天主题下的状态标签优化 */
[data-theme="light"] .record-details .status.completed {
  background: #dcfce7;
  color: #15803d;
  border: 1px solid #15803d;
  font-weight: 700;
  text-shadow: none;
}

/* =========================
   Refrigerator card styles
   ========================= */
.refrigerator-card {
  background: var(--color-bg-card);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid var(--color-border);
  margin-bottom: 24px;
}

.refrigerator-card-info h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.refrigerator-card-info p {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.refrigerator-status-section {
  margin-bottom: 24px;
}

.refrigerator-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-display {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-button-dark);
  color: var(--color-text-secondary);
  transition: all 0.3s ease;
}

.status-icon.cooling {
  background: var(--color-blue-500);
  color: white;
  animation: pulse 2s infinite;
}

.status-icon.defrosting {
  background: #f59e0b;
  color: white;
  animation: pulse 2s infinite;
}

.status-icon.error {
  background: #ef4444;
  color: white;
  animation: pulse 2s infinite;
}

.status-text h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.status-text p {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.refrigerator-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.compartment-control {
  background: var(--color-bg-secondary);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid var(--color-border);
}

.compartment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.compartment-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.temperature-display {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
}

.temperature-control,
.sterilization-control {
  margin-bottom: 16px;
}

.temperature-control:last-child,
.sterilization-control:last-child {
  margin-bottom: 0;
}

.temperature-control label,
.sterilization-control label {
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.temp-slider-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.temp-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--color-border);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.temp-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.temp-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.temp-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.temp-slider::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.temp-slider:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.temp-slider:disabled::-webkit-slider-thumb {
  cursor: not-allowed;
}

.temp-slider:disabled::-moz-range-thumb {
  cursor: not-allowed;
}

.temp-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.sterilization-control {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sterilization-switch {
  width: 40px;
  height: 20px;
  background: var(--color-border);
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sterilization-switch.active {
  background: var(--color-primary);
}

.sterilization-switch.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.switch-indicator {
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: all 0.3s ease;
}

.sterilization-switch.active .switch-indicator {
  transform: translateX(20px);
}

.refrigerator-modes-header {
  display: flex;
  align-items: center;
}

.refrigerator-modes-header .mode-buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.refrigerator-modes-header .mode-btn {
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 50px;
  text-align: center;
}

.refrigerator-modes-header .mode-btn:hover:not(:disabled) {
  background: var(--color-hover);
  color: var(--color-text-primary);
}

.refrigerator-modes-header .mode-btn.active {
  background: var(--color-primary);
  color: #1a1a1a;
  border-color: var(--color-primary);
  font-weight: 600;
}

.refrigerator-modes-header .mode-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .refrigerator-controls {
    gap: 16px;
  }
}

</style>
