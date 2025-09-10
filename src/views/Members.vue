<template>
  <div class="members-page">
    <div class="page-header">
      <h1>Members</h1>
      <p>Manage family members and their access</p>
    </div>
    <div class="coming-soon">
      <h2>Coming Soon</h2>
      <p>This feature is under development</p>
    </div>
  </div>
</template>

<script setup>
// Members page - coming soon
</script>

<style scoped>
.members-page {
  padding: 24px;
  background: var(--color-bg-primary);
  min-height: 100vh;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 8px 0;
}

.page-header p {
  font-size: 16px;
  color: var(--color-text-secondary);
  margin: 0;
}

.coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  text-align: center;
}

.coming-soon h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 16px 0;
}

.coming-soon p {
  font-size: 16px;
  color: var(--color-text-secondary);
  margin: 0;
}
</style>
