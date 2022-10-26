<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
import { TButton, VLayer } from 'layer'
import { ref } from 'vue'
const visible = ref(false)
const visible2 = ref(false)
const visible3 = ref<boolean>(false)
const innerVisible = ref(false)
const message = ref(false)
const messageIcon = ref(false)
const tooltip = ref<boolean>(false)
const tooltipAutoClose = ref(false)
const loading = ref(false)
const loadingType = ref<0 | 1 | 2>(0)
function openLoading(type: 0 | 1 | 2) {
  loadingType.value =  type
  loading.value = true
}
const drawer1 = ref(false)
const drawer2 = ref(false)
const drawer3 = ref(false)
const drawer4 = ref(false)
</script>

<template>
  <TButton @click="visible = !visible">visible</TButton>
  <TButton @click="visible3 = !visible3">visible3</TButton>
  <TButton @click="visible2 = !visible2">Modal & InnerModal & Visible2</TButton>
  <TButton @click="message = !message">Message</TButton>
  <TButton @click="messageIcon = !messageIcon">Message with Icon</TButton>
  <br />
  <br />
  <br />
  <VLayer
    v-model:visible="visible3"
    title="呆萌呆萌的"
    maxmin
    type="page"
    :area="[300, 300]"
    :anim="2"
    :minStack="false"
  >
    <div>
      <p>叮叮叮叮</p>
      <p>叮叮叮叮</p>
      <p>叮叮叮叮</p>
      <p>叮叮叮叮</p>
      <p>叮叮叮叮</p>
      <p>叮叮叮叮</p>
      <p>叮叮叮叮</p>
      <p>叮叮叮叮</p>
    </div>
  </VLayer>
  <VLayer v-model:visible="visible" :anim="1" title="这是标题" :minStack="false" :icon="6"> 这是内容 </VLayer>
  <VLayer
    v-model:visible="visible2"
    maxmin
    type="page"
    title="v2"
    :area="[500, 600]"
    :offset="[10, 20]"
    :shade="false"
    :minStack="false"
  >
    <TButton @click.stop="innerVisible = !innerVisible"></TButton>
    <VLayer v-model:visible="innerVisible" :shade="false">
      <div>
        <p>123</p>
        <p>4aa</p>
      </div>
    </VLayer>
  </VLayer>
  <VLayer v-model:visible="messageIcon" type="message" :icon="4"></VLayer>
  <VLayer v-model:visible="message" type="message"></VLayer>
  <div style="display: flex; flex-direction: row; justify-content: space-between">
    <VLayer v-model:visible="tooltipAutoClose" type="tips" content="RRRR" :time="3000">
      <TButton>Default(R)</TButton>
    </VLayer>
    <VLayer v-model:visible="tooltip" tips="t" type="tips" content="TTTTT">
      <TButton>Default(T)</TButton>
    </VLayer>
    <VLayer v-model:visible="tooltip" tips="l" type="tips" content="LLLL">
      <TButton>Default(L)</TButton>
    </VLayer>
    <VLayer v-model:visible="tooltip" tips="b" type="tips" content="BBBB">
      <TButton>Default(B)</TButton>
    </VLayer>
  </div>
  <br />
  <TButton @click="openLoading(0)">Loading Type 0</TButton>
  <TButton @click="openLoading(1)">Loading Type 1</TButton>
  <TButton @click="openLoading(2)">Loading Type 2</TButton>
  <VLayer v-model:visible="loading" type="loading" :loadingType="loadingType" :time="1000"></VLayer>
  <br />
  <TButton @click="drawer1 = !drawer1">Drawer Left</TButton>
  <TButton @click="drawer2 = !drawer2">Drawer Right</TButton>
  <TButton @click="drawer3 = !drawer3">Drawer Top</TButton>
  <TButton @click="drawer4 = !drawer4">Drawer Bottom</TButton>
  <VLayer v-model:visible="drawer1" type="drawer" offset="lt" :area="[400]" :anim="7">
    <div>Left</div>
  </VLayer>
  <VLayer v-model:visible="drawer2" type="drawer" offset="rt" :area="[400]" :anim="8">
    <div>Right</div>
  </VLayer>
  <VLayer v-model:visible="drawer3" type="drawer" offset="t" :area="['', 320]" :anim="9">
    <div>Top</div>
  </VLayer>
  <VLayer v-model:visible="drawer4" type="drawer" offset="b" :area="['', 230]" :anim="2">
    <div>Bottom</div>
  </VLayer>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
