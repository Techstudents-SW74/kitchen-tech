<template>
  <div class="layout">
    <sidebar-component :restaurant-name="restaurantName" :role="userRole" class="sidebar" />
    <div class="main-content">
      <header-component :restaurant-name="restaurantName" :role="userRole" class="header" />
      <div class="page-container">
        <main class="products-page">
          <div class="products-header">
            <input
                class="search-bar"
                type="text"
                v-model="searchQuery"
                placeholder="Search products..."
                @input="filterProducts"
            />
            <button class="add-button" @click="addProduct">Add Product</button>
          </div>
          <div class="product-cards">
            <ProductCardComponent
                v-for="product in filteredProducts"
                :key="product.id"
                :product="product"
                @edit-product="editProduct"
                @delete-product="deleteProduct"
            />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderComponent from "@/admins/components/header-component.vue";
import SidebarComponent from "@/admins/components/sidebar-component.vue";
import ProductCardComponent from "@/admins/components/product-card-component.vue";
import { productsService } from "@/public/services/productsService";

export default {
  components: {
    HeaderComponent,
    SidebarComponent,
    ProductCardComponent,
  },
  data() {
    return {
      restaurantName: '',
      userRole: '',
      products: [],
      searchQuery: '',
      filteredProducts: [],
    };
  },
  mounted() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if(userData) {
      this.restaurantName = userData['business-name'];
      this.userRole = userData.role;
    }
    this.loadProducts();
  },
  methods: {
    async loadProducts() {
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
      this.filteredProducts = this.products.filter((product) => product.name.toLowerCase().includes(query));
    },
    addProduct() {

    },
    editProduct() {

    },
    deleteProduct() {

    },
  }
}
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 280px;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: #31304A;
}

.main-content {
  margin-left: 280px; /* Desplaza el contenido a la derecha del sidebar */
  width: calc(100% - 280px); /* Ajusta el ancho para ocupar el resto de la pantalla */
  display: flex;
  flex-direction: column;
}

.header {
  position: fixed;
  top: 0;
  background-color: #5E5E99;
  z-index: 1;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.page-container {
  margin-top: 100px; /* Desplaza el contenido principal por debajo del header */
  padding: 20px;
  background-color: #F6F5FA; /* Fondo blanco para la zona de contenido */
  height: calc(100vh - 100px); /* Ajusta el alto para evitar desbordamientos */
  overflow-y: auto; /* Permite el scroll si el contenido es muy largo */
}
</style>