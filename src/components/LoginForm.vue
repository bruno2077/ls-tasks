<template>
    <div>
        <p class="title">Entre com seus dados de acesso.</p>
        <BrInput label="Nome de usuário ou e-mail:" class="inputs" v-model="username"/>
        <BrInput label="Senha:" type="password" class="inputs" v-model="password"/>
        <button class="btn green loginBtn" @click="enter()">Entrar</button>
        <p class="forgotPass">
            <a href="#" @click="alertPasswd()">Esqueci minha senha</a>
        </p>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import BrInput from './BrInput.vue'
    import { useAppStore } from '../stores/appStore'
    import { useRouter } from 'vue-router'
    import { User } from '../types'

    const store = useAppStore()
    const router = useRouter()

    const username = ref('')
    const whois = ref('')
    const avatar = ref('')
    const password = ref('')
    // const confirmPassword = ref('')
    const logged = ref(false)

    const defaultUser: User = {
        id: 1,
        avatar: 'Sam&earrings[]&eyebrows[]&eyes[]&features[]&glasses=variant01&glassesProbability=100&hair=short16&hairColor=592454&mouth[]',
        username: 'Salaryman',
        whois: 'Front-End Developer',
        password: '12345',
        lastLogin: 1672488862248,
        logged: false
    }

    // Faz login e redireciona pra outra tela. Se não tem usuário no localstorage pega o usuário padrão.
    function enter(): void {
        let user: User
        if(store.user.id)
            user = store.user
        else user = defaultUser
        user.logged = true
        user.lastLogin = new Date().getTime()
        store.loadUser(user) // Carrega o usuário logado na Store e no LocalStorage
        router.push('/app/dashboard')
    }

    function alertPasswd(){
        alert("É só pressionar o botão 'Entrar'")
    }

    onMounted( () => {
        // Se usuário já logado preenche o form com seus dados.
        if(store.user.id){
            username.value = store.user.username
            whois.value = store.user.whois
            avatar.value = store.user.avatar
            password.value = store.user.password            
            logged.value = true
        }
    })
</script>

<style lang="stylus" scoped>
    .title
        font-weight: 700
        color: #283848
        font-size: 18px
        margin-bottom: 20px
        line-height: 19px
    .inputs
        margin-top: 10px
        margin-bottom: 10px    
        width: 100%    
    .loginBtn
        margin-top: 10px
        margin-bottom: 10px
        width: 100%
    .forgotPass
        font-weight: 600
        font-size: 13px
        line-height: 14px
        margin-top: 20px
        a
            color: #2693FF
            &:visited, &:link, &:hover, &:active
                color: #2693FF
</style>