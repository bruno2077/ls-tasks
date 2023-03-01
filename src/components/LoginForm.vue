<template>
    <div>
        <p class="title">Entre com seus dados de acesso.</p>
        <BrInput label="Nome de usuário ou e-mail:" class="inputs" v-model="username"/>
        <BrInput label="Senha:" type="password" class="inputs" v-model="password"/>
        <button class="btn green loginBtn" @click="enter()">Entrar</button>
        <p class="forgotPass">
            <a href="#">Esqueci minha senha</a>
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


    // Procura o usuário na Store. retorna o usuário ou false em caso de erro.
    // function findUser(defaultUser: boolean): User | false {
    //     let user: User
    //     if(defaultUser)
    //         user = {...store.users.filter(el => el.id === 1)[0] }
    //     else user = store.users.filter(el => el.username === username.value && el.password === password.value)[0]
        
    //     if(Object.keys(user).length)
    //         return user                
    //     return false // Não encontrado
    // }

    // Cria usuário ou faz login.
    // No caso de login: com o 1º campo vazio loga com o usuário padrão.
    // No caso de criar: nome/email de usuário deve ser único.
    function enter(): void {
        let user: User = store.user
        console.log('pre user: ', JSON.parse(JSON.stringify(user)))
        user.logged = true
        user.lastLogin = new Date().getTime() // atualiza o horário do último login
        store.loadUser(user) // Carrega o usuário logado na Store e no LocalStorage

        router.push('/app/dashboard') // tela dashboard
        

        //-----------------------
        /*
        if(!signUp.value){ // LOGIN
            let user: User | false
            if(!username.value) // Carrega usuário padrão
                user = findUser(true)                        
            else user = findUser(false)
            
            if(user){
                user.logged = true
                user.lastLogin = new Date().getTime() // atualiza o horário do último login
                store.loadUser(user) // Carrega o usuário logado na Store
                store.updateUser(user) // Como modifica o horário do último login, atualiza na Store e no LocalStorage
                
                router.push('/app') // tela dashboard
            }
            else alert("Usuário e/ou senha incorreto(s). DICA: Deixe o nome em branco para logar com usuário padrão!")
        }
        //*/
    }


    onMounted( () => {
        // REVER ISSO
        // Se tem usuário logado já preenche o form com seus dados.
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