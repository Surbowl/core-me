﻿<template>
    <div class="field">
        <div class="buttons is-centered">
            <a class="button is-zhihu" href="https://www.zhihu.com/people/wan-wan-20-16-43">
                <span class="icon"><span class="icon-zhihu"></span></span>
                <span>知乎</span>
            </a>
            <a class="button is-instagram" href="https://www.instagram.com/jiewen_98">
                <span class="icon"><span class="icon-instagram"></span></span>
                <span>Instagram</span>
            </a>
            <a class="button is-linkedin" href="https://www.linkedin.com/in/%E6%9D%B0%E6%96%87-%E8%94%A1-a6116b110/">
                <span class="icon"><span class="icon-linkedin"></span></span>
                <span>Linkedin</span>
            </a>
            <a class="button is-black" href="https://github.com/Surbowl">
                <span class="icon"><span class="icon-github"></span></span>
                <span>GitHub</span>
            </a>
        </div>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator'

    @Component({
        name: 'SocialButtons'
    })
    export default class SocialButtons extends Vue { }
</script>

<style scoped lang="scss">
    /* cover global button style */
    @mixin social-button($color) {
        color: #FFF !important;
        background-color: $color;
        border-color: $color;

        &:hover {
            border-color: $color;
        }
    }

    .is-zhihu {
        @include social-button(#0085FF);
    }

    .is-instagram {
        @include social-button(#DB2A84);
    }

    .is-linkedin {
        @include social-button(#0077B5);
    }
</style>