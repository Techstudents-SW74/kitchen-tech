<template>
  <div class="products-header">
    <input
        class="search-bar"
        type="text"
        v-model="searchQuery"
        placeholder="Search products..."
        @input="filterProducts"
    />
    <ul v-if="filteredProducts.length && searchQuery" class="dropdown">
      <li v-for="product in filteredProducts" :key="product.id" class="product-card">
        <div class="card-content">
          <span class="product-name">{{ product.name }}</span>
          <span class="product-price">S/.{{ product.price }}</span>
        </div>
        <button @click="addProductToCart(product)" class="add-button">+</button>
      </li>
    </ul>
    <button class="edit-button" @click="toggleEditMode">Edit</button>
  </div>
</template>

<script>
import { productsService } from "@/public/services/productsService";

export default {
  props: {
    isEditMode: {
      type: Boolean,
      default: false,
    },
    restaurantName: {
      type: String,
      required: true,
    },
    cart: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      searchQuery: '',
      products: [], // Almacenar todos los productos del restaurante
      filteredProducts: [], // Productos filtrados por la búsqueda
    };
  },
  mounted() {
    if(this.restaurantName) {
      this.loadProducts();
    } else {
      console.error('Restaurant name is required');
    }

  },
  methods: {
    async loadProducts() {
      console.log('Restaurant Name: ', this.restaurantName);
      try {
        const products = await productsService.getProductsByRestaurant(this.restaurantName);
        this.products = products;
        this.filteredProducts = this.products;
      } catch (error) {
        console.log("Failed to load products", error);
      }
    },
    filterProducts() {
      const query = this.searchQuery.toLowerCase();
      this.filteredProducts = this.products.filter((product) =>
          product.name.toLowerCase().includes(query)
      );
    },
    addProductToCart(product) {
      this.$emit('add-to-cart', product);
    },
    toggleEditMode() {
      this.$emit('toggle-edit-mode');
    },
  },
};
</script>

<style scoped>
.products-header {
  display: flex;
  width: 100%;
  position: relative;
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

.dropdown{
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #D3D2E5;
  border: 1px solid #31304A;
  border-radius: 5px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 0;
  margin: 0;
  max-width: 920px;
}
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

.product-card{
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #F6F5FA;
}
.product-card:last-child{
  border-bottom: none;
}
.card-content{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  font-family: 'Red-hat-display', sans-serif;
}
.product-name {
  font-size: 14px;
  font-weight: 700;
}
.product-price {
  font-size: 12px;
  color: #31304A;
  margin-top: 4px;
}

.add-button {
  background-color: #31304A;
  color: #F6F5FA;
  padding: 6px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
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