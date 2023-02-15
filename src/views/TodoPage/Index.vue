<template>
	<div v-if="loggedUser" class="todoContainer">
		<NavBar
			theme="blue"
			:direction="clientWidth > 768 ? 'column' : 'row'" 
			:logo="navLogo" 
			:links="navLinks"
			class="navBarMain"
			:avatar="clientWidth > 768 ? false : true"
		></NavBar>
		<div class="todoRight">
			<NavBar			
				theme="white"
				direction="row"
				class="navBarTop"
				avatar
			></NavBar>
			<div class="todoRouterContainer">
				<router-view></router-view>
			</div>	
		</div>
	</div>
</template>

<script setup lang="ts">	
	import NavBar from '../../components/NavBar.vue'
	import { ref, onMounted, onBeforeUnmount } from 'vue'
	import { useAppStore } from '../../stores/appStore'
	import { useRouter } from 'vue-router'
	
	const store = useAppStore()
	const router = useRouter()    
	
	const loggedUser = ref(false)
	const navLogo = ref('logo.png')
	const clientWidth = ref(Number(window.innerWidth))

	const navLinks = [
		{
			icon: 'far fa-chart-bar',
			label: 'Dashboard',
			url: '/app/dashboard'
		},
		{
			icon: 'far fa-check-circle',
			label: 'Tarefas',
			url: '/app/tarefas'
		},
		{
			icon: 'fas fa-cogs',
			label: 'Configurações',
			url: '/app/config'
		},
	]

	function handleResize() {
		clientWidth.value = Number(window.innerWidth)
	}

	
	onMounted(() => {
		const currentUser = {...store.user}
		if(!currentUser.id) // Se não tem usuário logado redir pra loginPage
			router.push('/')
		else {
			loggedUser.value = true
			window.addEventListener('resize', handleResize)
		}
	})

	onBeforeUnmount( () => {
		window.removeEventListener('resize', handleResize)
	})
</script>

<style lang="stylus" scoped>
	.todoContainer
		display: flex
		height: 100vh
		width: 100vw
	.navBarMain
		width: 106px
	.todoRight
		flex: 1
		position: relative
	.navBarTop
		box-shadow: 0px 1px 6px 0px rgba(40, 56, 72, 0.07)
		width: 100%
		height: 83px
	.todoRouterContainer
		height: calc(100% - 83px) // desconta a navBarTop
	
	@media only screen and (max-width:768px)
		.todoContainer
			flex-direction: column
		.navBarMain
			width: 100%
			height: 83px
		.navBarTop
			display: none
		.todoRouterContainer
			height: 100%
</style>