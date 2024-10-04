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
            <button class="edit-button" @click="toggleEditMode">Edit</button>
          </div>
          <div class="products-grid">
            <FavoriteProductCardComponent
                v-for="(product) in filteredProducts"
                :key="product.id"
                :product="product"
                @product-selected="addProductToCart"
            />
          </div>

          <button @click="sellCustomProduct">Sell Free Product</button>
        </main>
        <div class="cart-summary">
          <button @click="addCustomer">Add Customer</button>
          <div v-for="item in cart" :key="item.id">{{ item.name }} - S/{{ item.price.toFixed(2) }}</div>
          <div>Subtotal: S/{{ subtotal.toFixed(2) }}</div>
          <div>I.G.V: S/{{ igv.toFixed(2) }}</div>
          <button @click="saveSale">Guardar Venta</button>
          <button @click="charge">Cobrar S/{{ total.toFixed(2) }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderComponent from "@/admins/components/header-component.vue";
import SidebarComponent from "@/admins/components/sidebar-component.vue";
import FavoriteProductCardComponent from "@/admins/components/favorite-product-card-component.vue";

export default {
  components: {
    HeaderComponent,
    SidebarComponent,
    FavoriteProductCardComponent
  },
  data() {
    return {
      products: [],
      filteredProducts: [],
      cart: [],
      isEditMode: false,
      restaurantName: '',
      userRole: '',
      searchQuery: '',
    };
  },
  mounted() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      this.restaurantName = userData['business-name'];
      this.userRole = userData.role;
    }
  },
  computed: {
    subtotal() {
      return this.cart.reduce((sum, product) => sum + product.price, 0);
    },
    igv() {
      return this.subtotal * 0.18; // 18% de IGV
    },
    total() {
      return this.subtotal + this.igv;
    }
  },
  methods: {
    filterProducts() {
      const query = this.searchQuery.toLowerCase();
      this.filteredProducts = this.products.filter((product) => product.name.toLowerCase().includes(query));
    },
    toggleEditMode() {
      this.isEditMode = !this.isEditMode;
    },
    addProductToCart(product) {
      this.cart.push(product);
    },
    addCustomer() {
      // Lógica para agregar cliente
    },
    saveSale() {
      // Lógica para guardar la venta
    },
    charge() {
      // Lógica para cobrar
    }
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

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.cart-summary {
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
}
</style>
