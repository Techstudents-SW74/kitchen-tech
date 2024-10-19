<template>
  <div class="products-header">
    <input
        class="search-bar"
        type="text"
        v-model="searchQuery"
        placeholder="Search products..."
        @input="filterProducts"
    />
    <ul v-if="filteredProducts.length" class="dropdown">
      <li v-for="product in filteredProducts" :key="product.id">
        <span>{{product.name}} - S/.{{product.price}}</span>
        <button @click="addProductToCart(product)">Add</button>
      </li>
    </ul>
    <button class="edit-button" @click="toggleEditMode">Edit</button>
  </div>
</template>

<script>
export default {
  props: {
    isEditMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchQuery: '',
      filteredProducts: [],
    };
  },
  methods: {
    filterProducts() {
      const query = this.searchQuery.toLowerCase();
      this.filteredProducts = this.products.filter((product) => product.name.toLowerCase().includes(query));
    },

    addProductToCart(product){
      const existingItem = this.cart.find(item => item.id === product.id);
      if(existingItem){
        existingItem.quantity += 1;
      } else {
        this.cart.push({...product, quantity: 1});
      }
    },
    toggleEditMode() {
      //implementar logica
    },
  }
};
</script>

<style scoped>
.dropdown li {
  padding: 10px;
  display: flex;
  justify-content: space-between;
}
.dropdown button {
  background-color: #31304A;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.products-header {
   display: flex;
   max-width: 1000px;
   justify-content: space-between;
   align-items: center;
   margin: 0 auto;
   padding-bottom: 10px;
   gap: 10px;
 }
.search-bar {
  width: 100%;
  padding: 15px;
  border-radius: 5px;
  border: none;
  color: #31304A;
  background-color: #D3D2E5;
}
.edit-button {
  padding: 13px 20px;
  background: #D3D2E5;
  color: #31304A;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 800;
  flex-shrink: 0;
}
</style>