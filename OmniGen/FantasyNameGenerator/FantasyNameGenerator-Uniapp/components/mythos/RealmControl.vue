<template>
  <view class="realm-control">
    <button
      v-for="realm in realms"
      :key="realm.id"
      class="segment"
      :class="{ active: realm.id === realmId }"
      :data-testid="`realm-${realm.id}`"
      @tap="selectRealm(realm.id)"
    >
      <text class="segment-icon">{{ glyphs[realm.id] }}</text>
      <text>{{ realm.shortLabel === 'Magic' ? 'Spell' : realm.shortLabel }}</text>
    </button>
  </view>
</template>

<script>
export default {
  name: 'RealmControl',
  props: {
    realms: {
      type: Array,
      required: true
    },
    realmId: {
      type: String,
      required: true
    }
  },
  emits: ['select-realm'],
  data() {
    return {
      glyphs: {
        elf: '♧',
        dragon: '♞',
        magic: '✧'
      }
    }
  },
  methods: {
    selectRealm(realmId) {
      this.$emit('select-realm', realmId)
    }
  }
}
</script>

<style>
.realm-control {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8rpx;
  margin-top: 0;
  padding: 8rpx;
  border: 1rpx solid #d8d0c4;
  border-radius: 26rpx;
  background: rgba(255, 255, 255, 0.56);
}

.segment {
  display: flex;
  width: 100%;
  min-height: 70rpx;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  border-radius: 16rpx;
  font-size: 26rpx;
  color: rgba(23, 21, 29, 0.72);
  background: rgba(255, 255, 255, 0.42);
  box-shadow: inset 0 0 0 1rpx rgba(216, 208, 196, 0.68);
  margin: 0;
  padding: 0;
  line-height: 1;
}

.segment.active {
  background: #1c1a27;
  color: #fbf9f5;
  box-shadow: inset 0 0 24rpx rgba(184, 138, 68, 0.14);
}

.segment-icon {
  font-size: 34rpx;
}
</style>
