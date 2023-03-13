<template>
    <div class="configContainer">

        
           
        <div style="margin: 15px" class="configForm">

            <h3 style="text-align: center;">Configurações</h3>

            <div class="avatarContainer">
                <div class="avatarDiv" @click="openAvatarModal()">
                    <img :src="`https://api.dicebear.com/5.x/adventurer/svg?seed=${avatarSeed}`" alt="Avatar" >
                </div>
                <span>Avatar</span>
            </div>

            <div class="">                
                <BrInput label="Nome de usuário ou e-mail:" class="inputs" v-model="username" />
                <BrInput label="Ocupação:" class="inputs" v-model="whois" />
                <BrInput label="Senha:" class="inputs" v-model="password" type="password"/>
                <BrInput label="Repita a senha:" class="inputs" v-model="confirmPassword" type="password"/>
                <div class="row">
                    <button class="btn green side"  @click="updateUserData()">Salvar</button>
                    
                    <span class="side" style="text-align: center">
                        <span class="resetContainer">
                            <span class="resetCaption" @click="showResetModal = true">Limpar memória</span>
                        </span>
                    </span>
                </div>
            </div>

            <!-- 
            <div class="row">
                <span class="side">
                    <BrInput label="Nome de usuário ou e-mail:" class="inputs" v-model="username" style=""/>
                </span>
                <span class="side">
                    <BrInput label="Ocupação:" class="inputs" v-model="whois" style=""/>
                </span>
            </div>

            <div class="row">
                <span class="side">
                    <BrInput label="Senha:" class="inputs" v-model="password" type="password"/>
                </span>
                <span class="side">
                    <BrInput label="Repita a senha:" class="inputs" v-model="confirmPassword" type="password"/>
                </span>
            </div>

            <div class="row">
                <button class="btn green side" style="" @click="updateUserData()">Salvar</button>
                
                <span class="side" style="text-align: center">
                    <span class="resetCaption" @click="showResetModal = true">Limpar memória</span>
                </span>
            </div>
             -->
        </div>

        <BrModal v-if="showResetModal" width="450px">
            <div slot="body" class="delNoteModal" >
                <div class="bigIcon">
                    <i class="far fa-trash-alt"></i>
                </div>
                <p>Todas as tarefas serão excluídas e os dados do usuário voltarão ao padrão.</p>
                <span>Esta ação não poderá ser desfeita.</span>
                <div>
                    <button class="btn green" @click="showResetModal = false">Cancelar</button>
                    <button class="btn red" @click="clearAllData()">Confirmar</button>
                </div>
            </div>
        </BrModal>

        <BrModal v-if="showAvatarModal" width="500px">
            <div class="avatarModalTitle">
                Escolha um avatar
            </div>
            <div style="display: flex; justify-content: center;">
                <div class="imgList">
                    <div class="avatarRefresh">
                        <span @click="generateNewAvatars()">Mudar <i class="fas fa-sync-alt" style="margin-left: 4px; display: inline-block;"></i></span>
                    </div>
                    <div v-for="(seed, index) in images" :key="index" class="listItem">
                        <div class="imgDiv">
                            <img 
                                :src="`https://api.dicebear.com/5.x/adventurer/svg?seed=${seed}`" 
                                :alt="'avatar'+index"
                                @click="pickAvatar(seed)" 
                            >
                        </div>
                    </div>
                    <div style="width: 100%; display: flex; padding: 20px 5px 10px 5px; justify-content: center">
                        <button class="btn sm red" style="width: 100%" @click="showAvatarModal = false">Cancelar</button>
                    </div>          
                </div>
            </div>  
        </BrModal>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { useAppStore } from '../../stores/appStore'
    import BrInput from '../../components/BrInput.vue'
    import BrModal from '../../components/Modal.vue'
    import router from '../../router'

    const store = useAppStore()
    const username = ref(store.user.username)
    const whois = ref(store.user.whois)
    const password = ref('')
    const confirmPassword = ref('')
    const showResetModal = ref(false)
    const showAvatarModal = ref(false)
    const images = ref([] as string[])
    const avatarSeed = ref(store.user.avatar)    
    const avatarHistory = ref([] as string[][])

    function openAvatarModal(){
        generateNewAvatars()
        showAvatarModal.value = true
    }
    
    function generateNewAvatars(){
        if(images.value.length)
            avatarHistory.value.push(images.value)

        const seeds: string[] = []
        for(let i = 1; i <= 6; i++)
            seeds.push((Math.random() * 4419792000).toFixed(0)) // 4.419.792.000 combinações possíveis
        
        images.value = seeds
    }

    function pickAvatar(seed: string){
        avatarSeed.value = seed
        showAvatarModal.value = false
    }

    function updateUserData(){
        if(password.value && whois.value && username.value){
            if(password.value === confirmPassword.value){
                console.log("LEN:", password.value.length)
                if(password.value.length >= 5) {
                    const userData = store.user
                    userData.username = username.value
                    userData.whois = whois.value
                    userData.password = password.value
                    userData.avatar = avatarSeed.value

                    console.log("OBJ 2 Send: ", userData)
    
                    store.loadUser(userData)
    
                    alert('Usuário atualizado com sucesso!')
                }
                else alert("Senha muito curta. Digite ao menos 5 caracteres :)")
            }
            else alert("Senhas divergentes! verifique e tente novamente")
        }
        else alert('Preencha todos os campos!')
    }

    function clearAllData(){
        store.clearMemory()
        router.replace('/')
    }
</script>

<style lang="stylus" scoped>
    $avatarSize = 100px
    .configContainer 
        display: flex
        align-items: flex-start
        justify-content: center
        background-color: #E9F4FB
        height: 100%
    .configForm
        width: 500px
        padding-top: 50px
        @media screen and (max-width:600px)
            width: 100%
        h3
            font-weight: 700
            font-size: 26px
            line-height: 27px
            color: #283848


    .avatarContainer
        display: flex
        flex-direction: column
        justify-content: center
        align-items: center
        margin-bottom: 10px
        > span 
            color: #4E657B
            font-weight:  600
    .avatarDiv
        width: $avatarSize
        height: $avatarSize
        background-color: #fff
        border-radius: 25%
        display: flex
        align-items: center
        justify-content: center
        cursor: pointer
        &.sm
            width: 100px
            height 100px
            
                
    .imgList
        display: flex
        align-items: center
        justify-content: space-between
        flex-wrap: wrap
        width: 100%
        margin: 0px 25px
        // background-color: pink     
        position: relative
        .avatarRefresh
            text-align: center
            width: 100%
            margin-bottom: 15px
            > span  
                // margin-right: 15px
                cursor: pointer
                &:hover
                    color: #2693FF
        .listItem 
            width: 33%
            display: flex
            align-items: center
            justify-content: center
            @media screen and (max-width: 450px)
                width: 50%
            .imgDiv
                padding: 0px 8px
                cursor: pointer
                border-radius: 8px
                border: 2px solid transparent
                &:hover
                    border: 2px solid #2693FF
                img 
                    width: 100px
                    height: 100px

            

    .row
        display: flex
        justify-content: center
        gap: 10px
        align-items: center
        margin-top: 20px
        @media only screen and (max-width: 600px)
            flex-wrap: wrap
        
        .side
            width: calc(50% - 10px)
            @media only screen and (max-width: 600px)
                width: 100%
            .resetContainer
                display: flex
                align-items: center
                justify-content: center
                height: 50px
                .resetCaption
                    cursor: pointer
                    font-weight: 500
                    &:hover
                        color: red

    .avatarModalTitle
        text-align: center
        margin-bottom: 30px
        color: #283848
        font-weight: 600
        font-size: 24px
        padding-top: 20px

    .inputs
        margin-top: 20px
    
        

    
    
    
</style>