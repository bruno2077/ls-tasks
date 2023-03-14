<template>
    <div class="container">
        <label v-if="label" :for="id">{{label}}</label>
        <textarea v-if="tag === 'textarea'" :id="id" :placeholder="placeholder" 
            :value="modelValue " @input="updateValue"
        ></textarea>
        <input v-else :type="type ? type : 'text'" :id="id" :placeholder="placeholder || ''" 
            :value="modelValue " @input="updateValue"
        >
        <i v-if="icon" class="inputIcon" :class="icon"></i>
    </div>    
</template>

<script setup lang="ts">
    import { ref, defineEmits, defineProps } from 'vue'

    const props = defineProps({
        modelValue: String,
        tag: String, // ['input', 'textarea']
        type: String, // input type ['password', 'text']
        label: String,
        icon: String,
        placeholder: String,
    })

    const id = `${Math.trunc(Math.random() * 1000000)}`
    const emit = defineEmits(['update:modelValue'])

    function updateValue(event: Event){
        const newValue = (event.target as HTMLInputElement).value
        emit('update:modelValue', newValue)
    }
</script>

<style lang="stylus" scoped>
    .container
        position: relative
        display: flex
        flex-direction: column
        font-family: 'Gilroy'
        color: #4E657B        
        label
            font-weight: 600        
            font-size: 14px
            line-height: 15px    
            margin-bottom: 5px
        textarea, input
            background-color: inherit
            font-weight: 600
            font-size: 15px            
            color: #304458
            outline: none
            width: 100%            
            border-radius: 5px
            border: 2px solid #BFDAEB
            &:focus
                border: 2px solid #2693FF
            padding-left: 15px
            padding-right: 15px  
        input
            height: 55px
            line-height: 16px
        textarea
            resize: none
            padding-top: 15px
            line-height: 20px
            height: 100%
        .inputIcon
            color: #AECBDE
            position: absolute
            font-size: 25px
            right: 13px
            bottom: 15px
</style>