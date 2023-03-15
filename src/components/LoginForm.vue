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
    import { User, Note } from '../types'

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
    const defaultNotes: Note[] = [
        {
            "id": 1,
            "userId": 1,
            "done": true,
            "category": "Urgente",
            "title": "Ver o sol nascer",
            "description": "",
            "updatedAt": 1678898055666
        },
        {
            "id": 2,
            "userId": 1,
            "done": false,
            "category": "Importante",
            "title": "Trabalhar menos",
            "description": "Arriscar mais, errar mais.",
            "updatedAt": 1678898079033
        },
        {
            "id": 3,
            "userId": 1,
            "done": false,
            "category": "",
            "title": "Preocupar menos com problemas pequenos",
            "description": "A cada um cabe alegrias e a tristeza que vier.",
            "updatedAt": 1678898221968
        },
        {
            "id": 4,
            "userId": 1,
            "done": false,
            "category": "",
            "title": "Ver o sol se pôr",
            "description": "Tempo perdido.mp3",
            "updatedAt": 1678898229392
        }
    ]


    // Faz login e redireciona pra outra tela. Se não tem usuário no localstorage pega o usuário padrão.
    function enter(): void {
        let user: User
        if(store.user.id)
            user = store.user
        else {
            user = defaultUser
            if(!localStorage.getItem('notes')) // cai aqui na 1ª vez. preenche com tarefas padrão
                store.loadNotes(defaultNotes)
        }
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