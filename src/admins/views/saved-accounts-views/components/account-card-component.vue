<template>
  <div class="product-card">
    <div class="card-header">
      <img v-if="account.productImageUrl !== null" :src="product.productImageUrl" alt="Product Image" class="product-image" />
      <p class="product-name">{{ account.productName }}</p>
      <p class="product-info">{{ account.category }}</p>
    </div>
    <div class="card-body">
      <p class="product-price">S/. {{ account.productPrice }}</p>
      <div class="card-buttons">
        <button @click="$emit('edit-product', account)">Edit</button>
        <button @click="$emit('delete-product', account.id)">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>

</style>