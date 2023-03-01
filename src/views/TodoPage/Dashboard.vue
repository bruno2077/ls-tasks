<template>
    <div class="dashContainer">
        <div class="dashAside">
            <div>
                <span class="category">Categorias</span>
                <ul class="catList">
                    <li v-for="(item, index) in categories" :key="index" class="catItem" @click="selectCategory(item.name)"
                    :class="item.name === selectedCategory ? 'selected' : ''">
                        <i class="fas fa-chevron-right"></i>
                        <span class="catName">{{item.name}}</span>
                        <span v-if="item.chip && item.chip.amount" class="catChip" :class="item.chip.color">
                            <span >{{item.chip.amount}}</span>
                        </span>
                    </li>
                </ul>

                <div class="catListMobile" :class="catMenuOpen ? 'open' : ''" @click="catMenuOpen = !catMenuOpen">
                    <div class="header">
                        <span>{{ selectedCategory }}</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="dropdown-content">
                        <ul>
                            <li v-for="(item, index) in categories" :key="index" class="catItem" @click="selectCategory(item.name)"
                                :class="item.name === selectedCategory ? 'selected' : ''"
                            >
                                <i class="fas fa-chevron-right"></i>
                                <span class="catName">{{item.name}}</span>
                                
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
        <div class="dashMain">
            <div class='dashContent'>
                <h3>Minhas Tarefas</h3>
                <p>Olá <span class="username">{{store.user.username}}</span>, você
                    <span v-if="!notDoneAmount"> não tem <span class="taskAmount">nenhuma tarefa</span> pendente!</span>
                    <span v-else-if="notDoneAmount === 1">tem <span class="taskAmount">{{notDoneAmount}} tarefa</span> pendente.</span>
                    <span v-else>tem <span class="taskAmount">{{notDoneAmount}} tarefas</span> pendentes.</span>
                </p>
                    
                <BrInput class="search" icon="fas fa-search" v-model="searchInput" @input="filterNotes()"/>
                <NoteComponent v-for="note  in currentNotes" :key="note.id+'.'+listKey" :note="note" class="userNote" 
                    @check="toggleNoteStatus" @edit="getNoteToEdit" @delete="getNoteToDelete"
                />
                <div class="divBtnNew">
                    <button class="btn green round btnNew" @click="showEditModal = true">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            
            <BrModal v-if="showEditModal" width="660px">
                <div slot="body" class="editNoteModal">
                    <i @click="closeEditModal()" class='modalCloseBtn fas fa-times'></i>
                    <h3 v-if="selectedNote.id">Editar Tarefa</h3>
                    <h3 v-else>Cadastrar Tarefa</h3>
                    <BrInput class="note" v-model="temptitle" @change="getLog()"></BrInput>
                    <BrInput tag="textarea" label="Descrição:" class="description" v-model="selectedNote.description"></BrInput>
                    <div class="footer">
                        <div>
                            <div class="divRadio" :class="selectedNote.category === 'Urgente' ? 'selected' : ''" 
                                @click="setSelectedNoteCategory('Urgente')"
                            >
                                <span class="outer"></span>
                                <span class="inner"></span>
                                <span class="label">Urgente</span>
                            </div>

                            <div class="divRadio" :class="selectedNote.category === 'Importante' ? 'selected' : ''" 
                                @click="setSelectedNoteCategory('Importante')"
                            >
                                <span class="outer"></span>
                                <span class="inner"></span>
                                <span class="label">Importante</span>
                            </div>
                        </div>
                        <button v-if="selectedNote.id" class="btn green" :disabled="!selectedNote.title" @click="saveNote()">
                            Editar
                        </button>
                        <button v-else class="btn green" :disabled="!selectedNote.title" @click="saveNote()">
                            Adicionar
                        </button>
                    </div>
                </div>
            </BrModal>

            <BrModal v-if="showDelModal" width="477px">
                <div slot="body" class="delNoteModal">
                    <div class="bigIcon">
                        <i class="far fa-trash-alt"></i>
                    </div>
                    <p>Tem certeza que deseja excluir esta tarefa?</p>
                    <span>Esta ação não poderá ser desfeita.</span>
                    <div>
                        <button class="btn green" @click="closeDelModal()">Cancelar</button>
                        <button class="btn red" @click="deleteNote()">Confirmar</button>
                    </div>
                </div>
            </BrModal>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onBeforeMount, computed } from 'vue'
    import { useAppStore } from '../../stores/appStore'
    import BrInput from '../../components/BrInput.vue'
    import NoteComponent from '../../components/Note.vue'
    import BrModal from '../../components/Modal.vue' 
    import { User, Note } from '../../types'   
    
    const store = useAppStore()

    const noteInitialState: Note = {
        id: 0,
        userId: store.user.id,
        done: false,
        category: '',
        title: '',
        description: '',
        updatedAt: 0
    }

    const temptitle = ref('')

    const categories = ref(<Array<any>>[
        {
            name: 'Todas',
        },
        {
            name: 'Urgentes',
            chip: {
                color: 'red',
                amount: 0
            }
        },
        {
            name: 'Importantes',
            chip: {
                color: 'yellow',
                amount: 0
            },
        },
        {
            name: 'Outras',
        },
        {
            name: 'Finalizadas',
        },
    ])    
    const showDelModal = ref(false)
    const showEditModal = ref(false)
    let notes = ref<Array<Note>>([])
    let currentNotes = ref<Array<Note>>([])
    const selectedCategory = ref('Todas')
    const searchInput = ref('')
    const selectedNote = ref<Note>({...noteInitialState})
    const listKey = ref(1) // usado pra forçar update na lista de notas
    const catMenuOpen = ref(false)
    
    onBeforeMount( () => {
        getNotes()
    })

    const urgentAmount = computed( () => {
        return notes.value.filter((el: Note )=> el.category === 'Urgente').length
    })
    const importantAmount = computed( () => {
        return notes.value.filter((el: Note )=> el.category === 'Importante').length
    })
    const notDoneAmount = computed( () => {
        return notes.value.filter((el: Note )=> !el.done).length
    })
    const tasksAmount = computed( () => {
        return notes.value.length
    })

    function getLog(){
        console.log("WAT: ", temptitle.value)
        // console.log(selectedNote.value.title)
    }


    function getNotes(): void{
        notes.value =  store.notes.filter((el: Note) => el.userId === store.user.id) // armazena todas as tarefas
        countCategory() // Conta quantas tarefas são 'Urgente' e 'Importante'
        filterNotes() // armazena e lida com as tarefas que são mostradas                
        ++listKey.value
    }

    function countCategory(): void{
        let urgentes = 0
        let importantes = 0
        notes.value.forEach((el: Note) => {
            if(el.category === 'Urgente')
                ++urgentes
            if(el.category === 'Importante')
                ++importantes
        })
        categories.value[1].chip.amount = urgentes
        categories.value[2].chip.amount = importantes
    }

    // ordena a lista de tarefas pela data e, se categoria 'Todas', pela categoria.
    function sortNoteList(){
        currentNotes.value.sort(compareByDate)
        if(selectedCategory.value === 'Todas')
            currentNotes.value.sort(compareByCategory)
    }

    function compareByCategory(a: Note, b: Note): number {
        if(a.category === b.category)
            return 0

        if (a.category === 'Urgente')
            return -1			
        if (b.category === 'Urgente')
            return 1

        if (a.category === 'Importante')
            return -1			
        if (b.category === 'Importante')
            return 1

        return 0 // Só pro ts não chorar
    }

    function compareByDate(a: Note, b: Note): number {
        if ( a.updatedAt < b.updatedAt )
            return -1			
        if ( a.updatedAt > b.updatedAt )
            return 1			
        return 0			
    }

    function selectCategory(name: string): void{
        selectedCategory.value = name
        filterNotes()
    }
    function updateTasksList(){
        // baseado no input e na selectedCategory filtra na store
    }

    function getNoteToEdit(note: Note){
        selectedNote.value = {...note}
        showEditModal.value = true
    }

    function getNoteToDelete(note: Note){
        selectedNote.value = {...note}
        showDelModal.value = true
    }

    function deleteNote(){
        showDelModal.value = false
        store.deleteNote(selectedNote.value.id)
        selectedNote.value = {...noteInitialState}
        getNotes()
    }
    function editNote(){
        store.updateNote(selectedNote.value)
        // notes = reactive([...store.notes]) // meter um get user notes lá na store. uma action ou algo assim.
        // roda o filtro        
    }
    function closeEditModal(){
        selectedNote.value = {...noteInitialState}
        showEditModal.value = false
    }

    function setSelectedNoteCategory(name: string){
        if(name === selectedNote.value.category)
            selectedNote.value.category = ''
        else selectedNote.value.category = name
    }
    function closeDelModal(){
        selectedNote.value = {...noteInitialState}
        showDelModal.value = false
    }

    // Filtra a lista de notas pela categoria selecionada e pela string digitada no input
    function filterNotes(){
        filterNotesByCategory()
        filterNotesByString()
        sortNoteList()
    }

    function filterNotesByCategory(){
        switch(selectedCategory.value){
            case 'Todas':
                currentNotes.value = [...notes.value]
                break
            case 'Urgentes':
                currentNotes.value = notes.value.filter(el => el.category === 'Urgente')
                break
            case 'Importantes':
                currentNotes.value = notes.value.filter(el => el.category === 'Importante')
                break
            case 'Outras':
                currentNotes.value = notes.value.filter(el => el.category === '')
                break
            case 'Finalizadas':
                currentNotes.value = notes.value.filter(el => el.done)
                break
        }
    }

    function filterNotesByString(){
        if(searchInput.value){
            currentNotes.value = currentNotes.value.filter(el => el.title.includes(searchInput.value) ||  el.description.includes(searchInput.value))
        }
    }

    function toggleNoteStatus(note: Note){
        note.done = !note.done
        store.updateNote(note)
        getNotes()
    }

    function saveNote(){
        showEditModal.value = false
        if(selectedNote.value.id){ // UPDATE
            selectedNote.value.updatedAt = new Date().getTime()
            store.updateNote(selectedNote.value)
        }
        else { // CREATE
            selectedNote.value.id = idGenerator(notes.value)
            selectedNote.value.userId = store.user.id
            selectedNote.value.updatedAt = new Date().getTime()
            store.createNote(selectedNote.value)
        }
        selectedNote.value = {...noteInitialState}
        getNotes()
    }

    function idGenerator(arrayObject: Note[]): number{
        let biggest = 1
        arrayObject.forEach(el => {
            if(el.id >= biggest)
                biggest = el.id+1                    
        })
        return biggest
    }
</script>

<style lang="stylus" scoped>
    .dashContainer
        display: flex 
        height: 100%

    .dashAside
        display: flex
        flex-direction: column
        justify-content: center
        width: 227px
        background-color: #F4FBFF        
        padding-left: 40px  
        padding-bottom: 50px
        box-shadow: 0px 1px 10px 0px rgba(40, 56, 72, 0.06)
        overflow-y: auto
        .category
            display: block
            color: #4E5F70
            font-weight: 700
            font-size: 17px
            line-height: 18px
            margin-bottom: 40px
        .catList
            list-style: none
            margin: 0px
            padding: 0px
            .catItem
                display: flex
                align-items: center
                margin: 12px 0px                
                cursor: pointer
                color: #283848
                font-weight: 700
                &:hover, &.selected
                    color: #2693FF
                > i
                    font-size: 10px
                .catName
                    margin-left: 12px                    
                    font-size: 15px
                    line-height: 25px
                .catChip
                    display: flex
                    align-items: center
                    justify-content: center
                    margin-left: 5px
                    width: 20px
                    height: 20px
                    border-radius: 50%                    
                    font-size: 11px
                    line-height: 12px
                    color: #fff
                    &.red
                        background-color: #FF2E79
                    &.yellow
                        background-color: #FFC42E
        .catInput
            display: none

    .dashMain
        flex: 1
        display: flex
        padding-top: 10vh
        background-color: #E9F4FB
        justify-content: center
        overflow-y: auto
        h3
            font-weight: 700
            font-size: 26px
            line-height: 27px
            color: #283848

    .dashContent
        width: 635px
        max-width: 635px
        > p
            font-weight: 600
            font-size: 17px
            line-height: 18px
            color: #77899E
            .username, .taskAmount
                color: #2693FF
            .taskAmount
                text-decoration: underline
        .search
            margin: 31px 0px
        .userNote
            margin: 7px 0px

    .btnNew
        position: absolute
        right: 28px
        bottom: 23px
        width: 77px
        height: 77px
        font-size: 24px

    .delNoteModal        
        padding: 40px 10px 
        .bigIcon
            display: flex
            align-items: center
            justify-content: center
            height: 136px
            width: 136px
            border-radius: 50%
            background-color: #EDF6FC
            margin: auto
            i
                font-size: 67px
                display: block
                color: #4A6583
        > p
            text-align: center
            margin-top: 12px
            margin-bottom: 4px
            font-weight: 700
            font-size: 20px
            line-height: 21px
            color: #283848
            span
                color: #FF4874
        > span
            display: block
            text-align: center
            font-weight: 600
            font-size: 15px
            line-height: 16px
            color: #475E78
            margin-bottom: 29px
        > div
            text-align: center
            margin-bottom: 6px
            .btn
                height: 41px
                margin: 0px 6px
                padding: 0px 27px            

    .editNoteModal
        position: relative
        padding: 1px 40px 40px 40px
        .modalCloseBtn
            cursor: pointer
            position: absolute
            right: 17px
            top: 19px
            // font-size: 10px
        h3
            margin-bottom: 59px
        .note
            margin-bottom: 15px
        .description
            margin-bottom: 17px
            height: 183px
        .footer
            display: flex
            justify-content: space-between
            align-items: center
            div
                display: flex
                .divRadio
                    position: relative
                    display: flex
                    align-items: center
                    margin-right: 12px
                    cursor: pointer
                    .outer
                        position: absolute
                        border-radius: 50%
                        border: 2px solid #BFDAEB
                        background-color: inherit
                        width: 24px
                        height: 24px
                    .inner
                        display: none
                        position: absolute
                        z-index: 1
                        left: 6.5px
                        border-radius: 50%
                        background-color: #2693FF     
                        width: 10px
                        height: 10px  
                    &.selected .inner
                        display: block
                    .label
                        margin-left: 33px
                        font-weight: 600;
                        font-size: 14px;
                        line-height: 15px;
                        color: #4E657B
            button
                padding-left: 23px
                padding-right: 23px

    // DROPDOWN BTN
    .catListMobile
        display: none
        width: 100%
        height: 100%
        .header
            display: flex
            width: 100%
            padding: 0px 40px
            justify-content: space-between
            align-items: center
            font-weight: 600
            cursor: pointer
        &.open .dropdown-content 
            display: block            
        .dropdown-content 
            display: none
            position: absolute
            z-index: 1
            border-radius: 0px
            box-shadow: 0px 0px 8px 2px rgba(49, 81, 113, 0.1)
            background-color: #fff
            width: 100%
            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2)
            padding-top: 11px 
            top: 60px
            ul 
                list-style: none
                padding: 0px
                .catItem
                    display: block
                    cursor: pointer
                    padding: 8px 0px 8px 40px
                    font-weight: 600
                    &:hover
                        background-color: #2693FF
                        color: #fff   
                    i
                        font-size: 12px
                        margin-right: 8px
                    
            
                

    @media only screen and (max-width: 1180px)
        .btnNew{
            position: unset
        }
        .divBtnNew{
            margin: 20px 0px
            text-align: end
        }        

    @media only screen and (max-width: 1023px)
        .dashContainer
            flex-direction: column
        .dashContent
            width: 90%
            min-width: 360px
            max-width: 90%            
       
        .dashAside            
            height: 60px
            width: 100%
            padding: 0px
            margin: 0px
            > div
                flex: 1
            .category
                display: none                
            .catList
                display: none
            .catListMobile
                display: flex
                justify-content: space-between
        
</style>