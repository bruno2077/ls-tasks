<template>
	<div class="mainContainer">
		<router-view v-if="!validatingUser"></router-view>
	</div>
</template>

<script setup lang="ts">
import { useAppStore } from './stores/appStore'
import { ref, onMounted } from 'vue'
import { User } from './types'
import { useRoute, useRouter } from 'vue-router'

const myStore = useAppStore()
const router = useRouter()
const route = useRoute()
const validatingUser = ref(true)

onMounted(() => {
	// checa se o LS tem user. Se tiver verfica se tá logado a menos de 1hora. Se tiver prossegue senão vai pra tela de login.
	let lsUser: string | null = localStorage.getItem('user')
	if(lsUser){
		let user: User = JSON.parse(lsUser)
		if(user.logged && (new Date().getTime() - user.lastLogin <= 3600000 )) // Se user logado a menos de 1 hora, prossegue.
			myStore.loadUser(user)
		
		else if(route.path !== '/'){
			router.replace('/')
			window.location.reload()
		}
		validatingUser.value = false
	}	
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