import { defineStore } from 'pinia'
import { ref } from 'vue'
interface User {
    id: number,
    avatar: string,
    username: string,
    whois: string,
    password: string,
    lastLogin: number, // miliseconds
    logged: boolean
}
interface Note {
    id: number,
    userId: number,
    done: boolean,
    category: string,
    title: string,
    description: string,
    updatedAt: number // miliseconds
}

export const useAppStore = defineStore('appStore', () => {

    const users = ref([] as User[])
    const notes = ref([] as Note[])
    const user = ref({} as User)


    function loadUsers(payload: User[]) {
        users.value = JSON.parse(JSON.stringify(payload))
    }
    
    function loadUser(payload: User | null) {
        user.value = JSON.parse(JSON.stringify(payload))
    }

    function loadNotes(payload: Note[]) {
        notes.value = JSON.parse(JSON.stringify(payload))
    }

    function createUser(payload: User){
        users.value.push(payload)
        // Sempre atualiza TODO LocalStorage a cada alteração
        localStorage.setItem('appData', JSON.stringify([{users: users.value, notes: notes.value}]) ) 
    }

   function updateUser(payload: User){
        for(let i = 0; i < users.value.length; i++){
            if(users.value[i].id === payload.id) {
                users.value[i] = {...payload}
                break
            }
        }
        localStorage.setItem('appData', JSON.stringify([{users: users.value, notes: notes.value}]) )
    }

    function createNote(payload: Note){
        notes.value.push(payload)
        localStorage.setItem('appData', JSON.stringify([{users: users.value, notes: notes.value}]) ) 

    }

    function updateNote(payload: Note){
        for(let i = 0; notes.value.length; i++){
            if(notes.value[i].id === payload.id){
                notes.value[i] = {...payload}
                break
            }
        }
        localStorage.setItem('appData', JSON.stringify([{users: users.value, notes: notes.value}]) ) 
    }

    function deleteNote(payload: number){
        for(let i = 0; i < notes.value.length; i++){
            if(notes.value[i].id === payload) {
                notes.value.splice(i, 1)
                break
            }
        }            
        localStorage.setItem('appData', JSON.stringify([{users: users.value, notes: notes.value}]) )
    }

    return {users, notes, user, loadUsers, loadUser, loadNotes, createUser, updateUser, createNote, updateNote, deleteNote}
})