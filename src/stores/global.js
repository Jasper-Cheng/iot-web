import { defineStore } from 'pinia'
import { getDevices as fetchDeviceStatuses } from '../api/devices'
import { getFamilyMembers, getUserProfile } from '../api/users'
import { getRooms } from '../api/rooms'

export const useGlobalStore = defineStore('global', {
	state: () => ({
		devices: [], // from devices API: detailed runtime status
		members: [],
		profile: null,
		rooms: [], // derived from device location for now
		loading: {
			devices: false,
			members: false,
			profile: false,
			rooms: false
		},
		errors: {
			devices: null,
			members: null,
			profile: null,
			rooms: null
		}
	}),
	actions: {
		async loadDevices() {
			this.loading.devices = true
			this.errors.devices = null
			try {
				const res = await fetchDeviceStatuses()
				this.devices = res?.data || []
			} catch (err) {
				this.errors.devices = err
			} finally {
				this.loading.devices = false
			}
		},
		async loadRooms() {
			this.loading.rooms = true
			this.errors.rooms = null
			try {
				const res = await getRooms()
				this.rooms = res?.data || []
			} catch (err) {
				this.errors.rooms = err
			} finally {
				this.loading.rooms = false
			}
		},
		async loadMembers() {
			this.loading.members = true
			this.errors.members = null
			try {
				const res = await getFamilyMembers()
				this.members = res?.data || []
			} catch (err) {
				this.errors.members = err
			} finally {
				this.loading.members = false
			}
		},
		async loadProfile(userId = 1) {
			this.loading.profile = true
			this.errors.profile = null
			try {
				const res = await getUserProfile(userId)
				this.profile = res?.data || null
			} catch (err) {
				this.errors.profile = err
			} finally {
				this.loading.profile = false
			}
		},
		async loadAll(userId = 1) {
			await Promise.all([
				this.loadDevices(),
				this.loadRooms(),
				this.loadMembers(),
				this.loadProfile(userId)
			])
		}
	}
})


