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
            <ul v-if="filteredProducts.length" class="dropdown">
              <li v-for="product in filteredProducts" :key="product.id">
                <span>{{product.name}} - S/.{{product.price}}</span>
                <button @click="addProductToCart(product)">Add</button>
              </li>
            </ul>
            <button class="edit-button" @click="toggleEditMode">Edit</button>
          </div>
          <div class="products-grid">
            <div
              v-for="(slot, index) in 24"
              :key="index"
              class="product-slot"
              @click="isEditMode ? selectFavoriteSlot(index) : null"
            >
              <FavoriteProductCardComponent
                  v-if="favoriteProducts[index]"
                  :product="favoriteProducts[index]"
                  @product-selected="removeProductFromFavorites(index)"
              />
              <div v-else class="empty-slot">
                <button v-if="isEditMode" @click="openProductList(index)">
                  <i class=" fa fa-plus"></i>
                </button>
              </div>
            </div>
          </div>

          <button class="sell-button" @click="sellCustomProduct">Sell Free Product</button>
        </main>
        <div class="cart-summary">
          <button class="add-customer" @click="addCustomer">Add Customer</button>

          <div class="cart-item" v-for="item in cart" :key="item.id">
            <span>{{ item.name }}</span>
            <span>S/{{ item.price.toFixed(2) }}</span>
          </div>

          <div class="footer">
            <button class="save-sale" @click="saveSale">Save Sale</button>
            <div class="summary">
              <span>Subtotal:</span>
              <span>S/{{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="summary">
              <span>I.G.V:</span>
              <span>S/{{ igv.toFixed(2) }}</span>
            </div>
          </div>
          <button class="charge-button" @click="charge">
            <span>Charge</span>
            <span>S/{{ total.toFixed(2) }}</span>
          </button>
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
      favoriteProducts: Array(24).fill(null),
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
    addProductToCart(product){
      const existingItem = this.cart.find(item => item.id === product.id);
      if(existingItem){
        existingItem.quantity += 1;
      } else {
        this.cart.push({...product, quantity: 1});
      }
    },
    openProductList() {
      this.filteredProducts = this.products;
    },
    removeProductFromFavorites(index) {
      if (confirm("Are you sure you want to remove this product from favorites?")) {
        this.favoriteProducts.splice(index, 1, null);
      }
    },
    selectFavoriteSlot(index) {
      if (!this.favoriteProducts[index]) {
        this.openProductList(index);
      }
    },
    toggleEditMode() {
      this.isEditMode = !this.isEditMode;
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
  display: flex;
  gap: 20px;
}

.dropdown {
  list-style: none;
  background-color: white;
  border: 1px solid #ddd;
  position: absolute;
  width: 100%;
  z-index: 10;
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

.products-page {
  flex: 3;
}
.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
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
  margin-left: 10px;
  font-weight: 800;
}
.products-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* 6 columnas */
  gap: 10px;
}
.product-slot {
  border: 1px dashed #31304A;
  border-radius: 5px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.empty-slot button {
  background: transparent;
  border: none;
  color: #31304A;
  font-size: 1.2rem;
}
.empty-slot i {
  font-size: 1.2rem;
  color: #31304A;
}
.sell-button {
  margin-top: 20px;
  padding: 10px 20px;
  background: #31304A;
  color: #F6F5FA;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cart-summary {
  flex: 1;
  padding: 20px 0;
  border-radius: 5px;
  display: flex;
  background-color: #D3D2E5;
  flex-direction: column;
  position: relative;
  font-family: "Red-hat-display", sans-serif;
}
.cart-summary button {
  padding: 10px;
  background: #31304A;
  color: #F6F5FA;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  justify-content: center;
}
button.add-customer {
  background-color: transparent;
  border: 1px solid #31304A;
  color: #31304A;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 100;
  margin: 0 20px 20px 20px;
}
.cart-item{
  background-color: #F6F5FA;
  padding: 10px;
  margin: 10px 20px 10px 20px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
}
.cart-summary .summary {
  display: flex;
  justify-content: space-between;
  margin: 10px 20px;
  font-weight: 100;
  font-size: 16px;
  color: #31304A;
}
button.save-sale {
  width: 100%;
  background-color: #31304A;
  color: white;
  padding: 15px 0;
  font-weight: bold;
  margin: 10px 0;
  font-size: 16px;
  border-radius: 0;
}
button.charge-button{
  width: 90%;
  display: flex;
  justify-content: space-between;
  background-color: #31304A;
  color: white;
  font-weight: 100;
  font-size: 0.8rem;
  margin-top: 20px;
  margin-left: 5%;
  align-items: center;
}

.cart-summary .footer{
  margin-top: auto;
}
</style>
