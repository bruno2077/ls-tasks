<template>
	<div class="mainContainer">
		<router-view></router-view>
	</div>
</template>

<script setup lang="ts">
import { useAppStore } from './stores/appStore'
import { ref, onMounted } from 'vue'
import defaultData from './assets/db.json'

interface AppDatabase {
	users: User[],
	notes: Note[]	
}

interface User{
	id: number,
	avatar: string,
	username: string,
	whois: string,
	password: string,
	lastLogin: number,
	logged: boolean
}

interface Note{
	id: number,
	userId: number,
	done: boolean,
	category: string,
	title: string,
	description: string,
	updatedAt: number,
}

const myStore = useAppStore()
const loading = ref(true)

function loadData(){
	let appData: any = JSON.parse(localStorage.getItem('appData') || 'null' ) // AppDatabase | null
	if(appData && appData.length)
		appData = appData[0]
	
	if(!appData){
		appData = defaultData[0] // pega do JSON
	}

	myStore.loadUsers(appData.users)
	myStore.loadUser( currentUser(appData.users))
	myStore.loadNotes(appData.users)	
	// this.$store.commit('loadUsers', appData.users)
	// this.$store.commit('loadUser', this.currentUser(appData.users) )	
	// this.$store.commit('loadNotes', appData.notes)

	loading.value = false
}

// Se 1 ou + usuários fizeram login nos últimos 60minutos retorna o usuário logado mais recentemente. Ou {} se nenhum.
function currentUser(users: User[]): User | null {
	const now = new Date().getTime()
	let loggedUsers = users.filter(el => el.logged)
	if(loggedUsers.length > 1){
		loggedUsers.sort(compareByDate)
		if(now - Number(loggedUsers[0].lastLogin) <= 3600000){
			return loggedUsers[0]
		}
	}
	return null
}

function compareByDate(a: User, b: User) {
	if ( Number(a.lastLogin) < Number(b.lastLogin) )
		return 1			
	if ( Number(a.lastLogin) > Number(b.lastLogin) )
		return -1			
	return 0			
}

onMounted(() => {
    loadData()	
})
</script>

<style lang="stylus">
	*
		font-family: 'Gilroy', sans-serif
	.btn
		border: 0px
		cursor: pointer
		border-radius: 5px		
		height: 55px		
		font-size: 16px
		font-weight: 700
		line-height: 16.8px
		color: #fff
		&.green
			background: #1AD18F
			&:hover
				background: hsl(158, 78%, 40%)
		&.red
			background: #FF4874
			&:hover
				background: hsl(346, 100%, 58%)				
		&:disabled
			background: #A6C1D2
			pointer-events: none
		&.round
			border-radius: 50%
</style>