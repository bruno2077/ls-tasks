<template>    
    <div class="navBar" :class="defineClass()">
        <div class="imgContainer">
            <img v-if="logo" src="../assets/img/Logo.png" alt="navbar icon" class="navLogo">
        </div>
        <div class="listContainer" :class="direction === 'column' ? 'column' : 'row'">
            <!-- show vertical -->
            <ul v-if="links && links.length && direction === 'column'" class="navList" :class="defineClass()">                
                <li v-for="(link, index) in links" :key="index" >
                    <router-link :to="link.url" class="navLink" :class="url === link.url ? 'selected' : ''">
                        <i :class="link.icon"></i>
                        <span>{{link.label}}</span>
                    </router-link>
                </li>
            </ul>
            
            <!-- show horizontal -->
            <div v-else-if="links && links.length" class="navDropdown" :class="openDropdown ? 'open' : ''" @click="openDropdown = !openDropdown">
                <i class="fas fa-bars navMenu"></i>
                
                <div class="dropdown-content">
                    <ul>
                        <li v-for="(link, index) in links" :key="index" class="navLinkMobile" :class="url === link.url ? 'selected' : ''">
                        <router-link  :to="link.url" >
                            <i :class="link.icon"></i>
                            <span>{{link.label}}</span>
                        </router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div>
            <span v-if="avatar" class="avatarContainer">
                <img :src="`https://api.dicebear.com/5.x/adventurer/svg?seed=${store.user.avatar}`" alt="user avatar" class="avatarImg">
                <!-- <img :src="avatarUrl" alt="user avatar" class="avatarImg"> -->
                <div v-if="direction !== 'column'" class="userInfo">
                    <div class="username" :class="defineClass()">{{store.user.username}}</div>
                    <div class="userAbout" :class="defineClass()">{{store.user.whois}}</div>
                </div>            
            </span>
        </div>        
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, PropType } from 'vue'
    import { useAppStore } from '../stores/appStore'
    import { useRoute } from 'vue-router'    
    
    export interface Navlink {
        icon: string,
        label: string,
        url: string,
    }

    const store = useAppStore()
    const route = useRoute()

    const props = defineProps({
        direction: String, // row || column
        color: String, // css color
        bgColor: String, // css color
        logo: String, // logo img name
        links: {type: Array as PropType<Navlink[]>}, // [ { icon, label, url },... ]
        avatar: Boolean, // show avatar or not
        bgSelected: String, // css color
        theme: {type: String, required: true} // color theme. current: 'blue', 'light'
    })

    const themes = ['blue', 'white']
    
    // const avatarUrl = ref( require(`../assets/img/avatar/${store.user.avatar}`) )
    const openDropdown = ref(false)

    const url = computed( () => {
        return route.path
    })

    function getImageUrl(name: string) {
        return new URL(`../assets/images/${name}`, import.meta.url).href
    }

    function defineStyle(): string {
        let style = ''

        style += props.color ? `color: ${props.color}; ` : 'color: #222; '
        style += props.bgColor ? `background-color: ${props.bgColor}; ` : 'background-color: #fff; '
        
        return style
    }

    function defineClass(){
        let classToReturn = props.direction === 'column' ? 'column ' : 'row ' 
        classToReturn += themes.includes(props.theme) ? props.theme : 'white'

        return classToReturn
    }
</script>

<style lang="stylus" scoped>
    .navBar
        position: relative
        display: flex
        align-items: center
        justify-content: space-between
        // Direction
        &.column
            flex-direction: column; height: 100%
        &.row
            width: 100%
        // Themes
        &.blue
            background-color: #2693FF
            color: #fff
        &.white
            background-color: #fff
            color: #222
        > div
            display: flex
            align-items: center
            justify-content: center
        &.row 
            padding-right: 32px
            .navLogo
                margin-left: 14px
            > div
                height: 100%            
        &.column 
            padding-bottom: 32px 
            .navLogo
                margin-top: 14px            
    
    .navLogo
        width: 55px

    .listContainer.row
        height: 100%
    .listContainer.column
        width: 100%

    .navList
        padding: 0px
        margin: 0px        
        // Direction
        &.row
            display: none 
            // .navLink
            //     width: 106px
            //     height: 100%
        &.column
            width: 100%
            .navLink
                width: 100%
                height: 83px
        // Themes
        &.blue
            .navLink:hover, .navLink.selected
                background-color: #1182F2
        &.white 
            .navLink:hover, .navLink.selected
                background-color: #DDD
        
    .navLink
        display: flex
        justify-content: center
        align-items: center
        margin: 0px        
        border: 1px solid #46A3FF
        cursor: pointer
        flex-direction: column
        text-decoration: none
        color: #fff
        &:visited, &:link, &:hover, &:active
            color: #fff
        > i
            font-size: 36px
            display: block            
        > span
            font-weight: 700
            font-size: 12px
            line-height: 13px
        
    
    .navMenu
        font-size: 40px
        padding: 10px 12px
        border-radius: 50%
        &.blue
            color: #fff
            &:hover
                background-color: #1182F2
        &.white
            color: #222
            &:hover
                background-color: #DDD

    .avatarContainer
        display: flex
        align-items: center
        .avatarImg
            height: 60px
            width: auto
            // border-radius: 50%
        .username
            font-weight: 600
            font-size: 15px
            line-height: 16px
            margin-left: 10px
            &.blue, &.white
                color: #283848         
        .userAbout
            margin-left: 10px
            font-weight: 600
            font-size: 12px
            line-height: 13px
            &.blue 
                color: #fff
            &.white
                color: #2693FF

    // DROPDOWN BTN
    .navDropdown
        i
            cursor: pointer
        &.open .dropdown-content 
            display: block            
        .dropdown-content 
            display: none
            position: absolute
            z-index: 2
            border-radius: 0px            
            background-color: #fff
            color: #222
            width: 100%
            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2)
            padding-top: 11px 
            left: 0px
            top: 60px
            
            ul 
                list-style: none
                padding: 0px
                .navLinkMobile
                    
                    display: flex
                    align-items: center
                    a
                        padding: 10px 0px 10px 40px
                        text-decoration: none
                        display: inline-block
                        width: 100%
                        &:visited, &:link, &:hover, &:active
                            color: inherit                        
                    i
                        font-size: 25px
                        margin-right: 10px
                    span
                        font-size: 15px
                    &:hover
                        background-color: #2693FF
                        color: #fff   
                    
    @media only screen and (max-width:568px)
        .userInfo    
            display: none
    
</style>