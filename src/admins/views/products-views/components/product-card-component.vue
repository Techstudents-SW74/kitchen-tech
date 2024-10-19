<template>
  <div class="product-card">
    <div class="card-header">
      <p class="product-name">{{ product.name }}</p>
      <p class="product-info">{{ product.category }}</p>
    </div>
    <div class="card-body">
      <p class="product-price">S/. {{ product.price }}</p>
      <div class="card-buttons">
        <button @click="$emit('edit-product', product)">Edit</button>
        <button @click="$emit('delete-product', product.id)">Delete</button>
      </div>
    </div>
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
  display: flex;
  max-width: 100%;
  padding: 20px;
  border-radius: 5px;
  background-color: #D3D2E5;
  color: #31304A;
  justify-content: space-between;
  font-family: 'Red-hat-display', sans-serif;
  align-items: center;
  align-content: center;
  margin: 0 auto 20px;
}
.product-name {
  font-weight: 700;
  font-size: 1.2rem;
  margin: 0;
}
.product-info {
  font-weight: 100;
  font-size: 0.8rem;
  margin: 10px 0 0 0;
}
.product-price {
  text-align: right;
  margin: 10px 5px 0 0;
  font-weight: 600;
}
.card-buttons button {
  background: #31304A;
  color: #F6F5FA;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  margin: 10px 0 0 10px;
  cursor: pointer;
}
</style>