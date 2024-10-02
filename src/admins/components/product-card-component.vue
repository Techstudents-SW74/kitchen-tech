<template>
  <div class="product-card">
    <p class="product-name">{{ product.name }}</p>
    <p class="product-info">{{ product.category }}</p>
    <p class="product-info">S/. {{ product.price }}</p>
    <button @click="$emit('edit-product', product)">Edit</button>
    <button @click="$emit('delete-product', product.id)">Delete</button>
  </div>
</template>

<script>
  export default {
    props: {
      product: Object,
    },
  };
</script>

<style scoped>
.product-card {
  width: 250px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fff;
}
.product-card button {
  margin-right: 10px;
}
</style>