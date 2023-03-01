import { defineStore } from 'pinia'
import { ref } from 'vue'
import { User, Note } from '../types'

export const useAppStore = defineStore('appStore', () => {

    const user = ref({} as User)
    const notes = ref([] as Note[])


    // function loadUsers(payload: User[]) {
    //     users.value = JSON.parse(JSON.stringify(payload))
    // }
    
    function loadUser(payload: User) {
        user.value = payload
        localStorage.setItem('user', JSON.stringify(payload) )
        console.log('user updated: ', user.value)
    }
    

    // function createUser(payload: User){
    //     users.value.push(payload)
    //     localStorage.setItem('appData', JSON.stringify([{users: users.value, notes: notes.value}]) ) 
    // }

    //    function updateUser(payload: User){
    //         for(let i = 0; i < users.value.length; i++){
    //             if(users.value[i].id === payload.id) {
    //                 users.value[i] = {...payload}
    //                 break
    //             }
    //         }
    //         localStorage.setItem('appData', JSON.stringify([{users: users.value, notes: notes.value}]) )
    //     }

    function loadNotes(payload: Note[]) {
        notes.value = JSON.parse(JSON.stringify(payload))
    }

    function createNote(payload: Note){
        notes.value.push(payload)
        localStorage.setItem('notes', JSON.stringify(notes) )

    }

    function updateNote(payload: Note){
        for(let i = 0; notes.value.length; i++){
            if(notes.value[i].id === payload.id){
                notes.value[i] = payload
                break
            }
        }
        localStorage.setItem('notes', JSON.stringify(notes) ) 
    }

    function deleteNote(payload: number){
        for(let i = 0; i < notes.value.length; i++){
            if(notes.value[i].id === payload) {
                notes.value.splice(i, 1)
                break
            }
        }            
        localStorage.setItem('notes', JSON.stringify(notes) )
    }

    return {user, notes, loadUser, loadNotes, createNote, updateNote, deleteNote}
    // return {users, notes, user, loadUsers, loadUser, loadNotes, createUser, updateUser, createNote, updateNote, deleteNote}
})