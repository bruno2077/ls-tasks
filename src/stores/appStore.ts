import { defineStore } from 'pinia'
import { ref } from 'vue'
import { User, Note } from '../types'

export const useAppStore = defineStore('appStore', () => {

    const user = ref({} as User)
    const notes = ref([] as Note[])
    
    
    function loadUser(payload: User) {        
        user.value = payload
        localStorage.setItem('user', JSON.stringify(payload) )
        console.log('user updated: ', user.value)
    }

    function loadNotes(payload: Note[]) {
        notes.value = JSON.parse(JSON.stringify(payload))
    }

    function createNote(payload: Note){
        payload.id = getNewNoteId()
        notes.value.push(payload)
        localStorage.setItem('notes', JSON.stringify(notes.value) )
    }

    function updateNote(payload: Note){
        for(let i = 0; notes.value.length; i++){
            if(notes.value[i].id === payload.id){
                notes.value[i] = payload
                break
            }
        }
        localStorage.setItem('notes', JSON.stringify(notes.value) ) 
    }

    function deleteNote(payload: number){
        for(let i = 0; i < notes.value.length; i++){
            if(notes.value[i].id === payload) {
                notes.value.splice(i, 1)
                break
            }
        }            
        localStorage.setItem('notes', JSON.stringify(notes.value) )
    }

    function clearMemory(){
        user.value = {} as User
        notes.value = [] as Note[]
        localStorage.clear()
    }

    function getNewNoteId(){
        const ids: number[] = [0]
        notes.value.forEach( (note: Note) => {
            ids.push(note.id)
        });
        return Math.max(...ids) + 1 
    }

    return {user, notes, loadUser, loadNotes, createNote, updateNote, deleteNote, clearMemory}
})