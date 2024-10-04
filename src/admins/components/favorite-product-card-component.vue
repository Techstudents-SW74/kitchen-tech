<template>
  <div class="product-card">
    <div class="product-name">{{ product.name }}</div>
    <div class="product-price">{{ formatPrice(product.price) }}</div>
  </div>
</template>

<script>
export default {
  props: {
    product: Object
  },
  methods: {
    selectProduct() {
      this.$emit('product-selected', this.product);
    },
    formatPrice(price) {
      return `S/${price.toFixed(2)}`;
    }
  }
}
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 10px;
  background-color: #f5f5f5;
  padding: 10px;
  cursor: pointer;
}
</style>