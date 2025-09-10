<template>
  <div class="widgets-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Widget Gallery</h1>
        <p class="page-description">Explore and manage all available widgets for your smart home</p>
      </div>
      <div class="header-actions">
        <button class="add-widget-btn">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
          Add Widget
        </button>
      </div>
    </div>

    <!-- 分类筛选 -->
    <div class="filter-section">
      <div class="filter-tabs">
        <button 
          v-for="category in categories" 
          :key="category.id"
          :class="['filter-tab', { active: activeCategory === category.id }]"
          @click="setActiveCategory(category.id)"
        >
          <div class="tab-icon">
            <component :is="category.icon" />
          </div>
          <span>{{ category.name }}</span>
        </button>
      </div>
    </div>

    <!-- Widget网格 -->
    <div class="widgets-grid">
      <div 
        v-for="widget in filteredWidgets" 
        :key="widget.id"
        class="widget-card"
        @click="selectWidget(widget)"
      >
        <div class="widget-preview">
          <component :is="widget.component" />
        </div>
        <div class="widget-info">
          <h3 class="widget-name">{{ widget.name }}</h3>
          <p class="widget-description">{{ widget.description }}</p>
          <div class="widget-tags">
            <span 
              v-for="tag in widget.tags" 
              :key="tag"
              class="widget-tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
        <div class="widget-actions">
          <button class="action-btn preview-btn" @click.stop="previewWidgetAction(widget)">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" fill="none"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            Preview
          </button>
          <button class="action-btn add-btn" @click.stop="addWidget(widget)">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            Add
          </button>
        </div>
      </div>
    </div>

    <!-- 预览模态框 -->
    <div v-if="previewWidget" class="preview-modal" @click="closePreview">
      <div class="preview-content" @click.stop>
        <div class="preview-header">
          <h3>{{ previewWidget.name }}</h3>
          <button class="close-btn" @click="closePreview">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </button>
        </div>
        <div class="preview-body">
          <component :is="previewWidget.component" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SmartControlPanel from '../widgets/SmartControlPanel.vue'
import DeviceStatsCard from '../widgets/DeviceStatsCard.vue'
import EnergyCard from '../widgets/EnergyCard.vue'
import ColorControlCard from '../widgets/ColorControlCard.vue'
import WiFiCard from '../widgets/WiFiCard.vue'
import TvCard from '../widgets/TvCard.vue'
import MusicCard from '../widgets/MusicCard.vue'
import SocketsCard from '../widgets/SocketsCard.vue'
import AirCoolerCard from '../widgets/AirCoolerCard.vue'
import CameraCard from '../widgets/CameraCard.vue'
import VacuumCard from '../widgets/VacuumCard.vue'
import WashingMachineCard from '../widgets/WashingMachineCard.vue'
import RefrigeratorCard from '../widgets/RefrigeratorCard.vue'
import SpeakerCard from '../widgets/SpeakerCard.vue'
import AirPurifierCard from '../widgets/AirPurifierCard.vue'
import SmartLightCard from '../widgets/SmartLightCard.vue'
import SmartTvCard from '../widgets/SmartTvCard.vue'
import FallDetectionCard from '../widgets/FallDetectionCard.vue'
import SmartSocketCard from '../widgets/SmartSocketCard.vue'

// 分类数据
const categories = ref([
  { id: 'all', name: 'All', icon: 'GridIcon' },
  { id: 'control', name: 'Control', icon: 'ControlIcon' },
  { id: 'monitoring', name: 'Monitoring', icon: 'MonitorIcon' },
  { id: 'entertainment', name: 'Entertainment', icon: 'EntertainmentIcon' },
  { id: 'appliance', name: 'Appliances', icon: 'ApplianceIcon' }
])

// 当前选中的分类
const activeCategory = ref('all')

// Widget数据
const widgets = ref([
  {
    id: 'smart-control',
    name: 'Smart Control Panel',
    description: 'Quick actions for home automation',
    component: SmartControlPanel,
    category: 'control',
    tags: ['Control', 'Quick Actions', 'Automation']
  },
  {
    id: 'device-stats',
    name: 'Device Statistics',
    description: 'Visualize device distribution and status',
    component: DeviceStatsCard,
    category: 'monitoring',
    tags: ['Analytics', 'Charts', 'Statistics']
  },
  {
    id: 'energy-consumption',
    name: 'Energy Consumption',
    description: 'Track and analyze energy usage',
    component: EnergyCard,
    category: 'monitoring',
    tags: ['Energy', 'Charts', 'Analytics']
  },
  {
    id: 'color-control',
    name: 'Color Control',
    description: 'Control smart lighting colors',
    component: ColorControlCard,
    category: 'control',
    tags: ['Lighting', 'Color', 'Control']
  },
  {
    id: 'wifi-status',
    name: 'WiFi Status',
    description: 'Monitor network connectivity',
    component: WiFiCard,
    category: 'monitoring',
    tags: ['Network', 'Status', 'Connectivity']
  },
  {
    id: 'tv-control',
    name: 'TV Control',
    description: 'Control smart television',
    component: TvCard,
    category: 'entertainment',
    tags: ['TV', 'Entertainment', 'Control']
  },
  {
    id: 'music-player',
    name: 'Music Player',
    description: 'Control audio playback',
    component: MusicCard,
    category: 'entertainment',
    tags: ['Music', 'Audio', 'Player']
  },
  {
    id: 'sockets',
    name: 'Smart Sockets',
    description: 'Control power outlets',
    component: SocketsCard,
    category: 'control',
    tags: ['Power', 'Sockets', 'Control']
  },
  {
    id: 'air-cooler',
    name: 'Air Cooler',
    description: 'Climate control system',
    component: AirCoolerCard,
    category: 'appliance',
    tags: ['Climate', 'Cooling', 'Temperature']
  },
  {
    id: 'camera',
    name: 'Security Camera',
    description: 'Monitor security cameras',
    component: CameraCard,
    category: 'monitoring',
    tags: ['Security', 'Camera', 'Monitoring']
  },
  {
    id: 'vacuum',
    name: 'Vacuum Cleaner',
    description: 'Control robotic vacuum',
    component: VacuumCard,
    category: 'appliance',
    tags: ['Cleaning', 'Robot', 'Automation']
  },
  {
    id: 'washing-machine',
    name: 'Washing Machine',
    description: 'Control laundry appliance',
    component: WashingMachineCard,
    category: 'appliance',
    tags: ['Laundry', 'Cleaning', 'Appliance']
  },
  {
    id: 'refrigerator',
    name: 'Refrigerator',
    description: 'Smart refrigerator control',
    component: RefrigeratorCard,
    category: 'appliance',
    tags: ['Kitchen', 'Cooling', 'Storage']
  },
  {
    id: 'speaker',
    name: 'Smart Speaker',
    description: 'Audio system control',
    component: SpeakerCard,
    category: 'entertainment',
    tags: ['Audio', 'Speaker', 'Voice']
  },
  {
    id: 'air-purifier',
    name: 'Air Purifier',
    description: 'Air quality management',
    component: AirPurifierCard,
    category: 'appliance',
    tags: ['Air Quality', 'Health', 'Purification']
  },
  {
    id: 'smart-light',
    name: 'Smart Light',
    description: 'Intelligent lighting control',
    component: SmartLightCard,
    category: 'control',
    tags: ['Lighting', 'Smart', 'Control']
  },
  {
    id: 'smart-tv',
    name: 'Smart TV',
    description: 'Advanced TV control',
    component: SmartTvCard,
    category: 'entertainment',
    tags: ['TV', 'Smart', 'Entertainment']
  },
  {
    id: 'fall-detection',
    name: 'Fall Detection',
    description: 'Safety monitoring system',
    component: FallDetectionCard,
    category: 'monitoring',
    tags: ['Safety', 'Monitoring', 'Health']
  },
  {
    id: 'smart-socket',
    name: 'Smart Socket',
    description: 'Individual outlet control',
    component: SmartSocketCard,
    category: 'control',
    tags: ['Power', 'Individual', 'Control']
  }
])

// 预览的widget
const previewWidget = ref(null)

// 计算过滤后的widgets
const filteredWidgets = computed(() => {
  if (activeCategory.value === 'all') {
    return widgets.value
  }
  return widgets.value.filter(widget => widget.category === activeCategory.value)
})

// 设置活动分类
const setActiveCategory = (categoryId) => {
  activeCategory.value = categoryId
}

// 选择widget
const selectWidget = (widget) => {
  console.log('Selected widget:', widget.name)
}

// 预览widget
const previewWidgetAction = (widget) => {
  previewWidget.value = widget
}

// 关闭预览
const closePreview = () => {
  previewWidget.value = null
}

// 添加widget
const addWidget = (widget) => {
  console.log('Adding widget:', widget.name)
  // 这里可以添加实际的添加逻辑
}
</script>

<style scoped>
.widgets-page {
  width: 100%;
  padding: 8px 24px;
  overflow: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.widgets-page::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.header-content h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 8px 0;
}

.header-content p {
  font-size: 16px;
  color: var(--color-text-secondary);
  margin: 0;
}

.add-widget-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-widget-btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

.add-widget-btn svg {
  width: 16px;
  height: 16px;
}

.filter-section {
  margin-bottom: 32px;
}

.filter-tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-tab:hover {
  background: var(--color-hover);
  border-color: var(--color-primary);
}

.filter-tab.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.tab-icon {
  width: 16px;
  height: 16px;
}

.widgets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.widget-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.widget-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: var(--color-primary);
}

.widget-preview {
  height: 200px;
  background: var(--color-bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  overflow: hidden;
}

.widget-info {
  padding: 20px;
}

.widget-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 8px 0;
}

.widget-description {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.widget-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.widget-tag {
  padding: 4px 8px;
  background: var(--color-button-dark);
  color: var(--color-text-primary);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
}

.widget-actions {
  display: flex;
  gap: 8px;
  padding: 0 20px 20px 20px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-primary);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  justify-content: center;
}

.action-btn:hover {
  background: var(--color-hover);
  border-color: var(--color-primary);
}

.add-btn {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.add-btn:hover {
  background: var(--color-primary-dark);
}

.action-btn svg {
  width: 14px;
  height: 14px;
}

.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.preview-content {
  background: var(--color-bg-card);
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--color-border);
}

.preview-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: var(--color-hover);
  color: var(--color-text-primary);
}

.close-btn svg {
  width: 16px;
  height: 16px;
}

.preview-body {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .widgets-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .filter-tabs {
    justify-content: flex-start;
  }
}
</style>
