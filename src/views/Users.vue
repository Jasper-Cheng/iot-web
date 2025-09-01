<template>
  <div>
    <el-card>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3>用户管理</h3>
        <el-button type="primary" @click="openDialog()">新增用户</el-button>
      </div>

      <!-- 用户表格 -->
      <el-table :data="users" style="width: 100%; margin-top: 20px;">
        <el-table-column prop="id" label="用户ID" width="120" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="role" label="角色" />
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button size="small" type="primary" @click="openDialog(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteUser(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增/编辑用户弹窗 -->
      <el-dialog :title="isEdit ? '编辑用户' : '新增用户'" :visible.sync="dialogVisible">
        <el-form :model="form">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input type="password" v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item label="角色" :label-width="formLabelWidth">
            <el-select v-model="form.role" placeholder="选择角色">
              <el-option label="管理员" value="admin" />
              <el-option label="普通用户" value="user" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确认</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '../utils/request'

const users = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const form = ref({ id: null, username: '', password: '', role: 'user' })
const formLabelWidth = '80px'

// 获取用户列表
async function getUsers() {
  try {
    users.value = await request.get('/users')
  } catch (e) {
    console.error('获取用户失败', e)
  }
}

onMounted(() => getUsers())

// 打开弹窗
function openDialog(user = null) {
  if (user) {
    isEdit.value = true
    form.value = { ...user, password: '' } // 编辑时密码留空
  } else {
    isEdit.value = false
    form.value = { id: null, username: '', password: '', role: 'user' }
  }
  dialogVisible.value = true
}

// 提交表单
async function submitForm() {
  try {
    if (isEdit.value) {
      await request.put(`/users/${form.value.id}`, form.value)
    } else {
      await request.post('/users', form.value)
    }
    dialogVisible.value = false
    getUsers()
  } catch (e) {
    console.error('保存用户失败', e)
  }
}

// 删除用户
async function deleteUser(id) {
  try {
    await request.delete(`/users/${id}`)
    getUsers()
  } catch (e) {
    console.error('删除用户失败', e)
  }
}
</script>
