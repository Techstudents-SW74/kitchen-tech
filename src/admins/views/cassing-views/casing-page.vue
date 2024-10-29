<template>
  <div class="layout">
    <sidebar-component :restaurant-name="restaurantName" :role="userRole" class="sidebar" />
    <div class="main-content">
      <header-component :restaurant-name="restaurantName" :role="userRole" class="header" />
      <div class="page-container">
        <div class="left-section">
          <favorite-product-header-component
              v-if="restaurantName"
              :is-edit-mode="isEditMode"
              :restaurant-name="restaurantName"
              :selected-slot="selectedSlot"
              :cart="cart"
              @toggle-edit-mode="toggleEditMode"
              @add-to-slot="addToSlot"
              @add-to-cart="addProductToCart"
          />
          <product-grid-component
              :favorite-products="favoriteProducts"
              :is-edit-mode="isEditMode"
              @open-product-list="openProductList"
              @remove-product-from-favorites="removeProductFromFavorites"
          />
        </div>
        <div class="right-section">
          <cart-summary-component
              :cart="cart"
              :subtotal="subtotal"
              :igv="igv"
              :total="total"
              @add-customer="addCustomer"
              @save-sale="saveSale"
              @charge="charge"
              @update-cart="handleUpdateCart"
              @update-summary="handleUpdateSummary"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderComponent from "@/admins/components/header-component.vue";
import SidebarComponent from "@/admins/components/sidebar-component.vue";
import ProductGridComponent from "@/admins/views/cassing-views/components/product-grid-component.vue";
import CartSummaryComponent from "@/admins/views/cassing-views/components/cart-summary-component.vue";
import FavoriteProductHeaderComponent from "@/admins/views/cassing-views/components/favorite-product-header.vue";
import {ordersService} from "@/public/services/ordersService";
import userService from "@/public/services/userService";

export default {
  components: {
    FavoriteProductHeaderComponent,
    HeaderComponent,
    SidebarComponent,
    ProductGridComponent,
    CartSummaryComponent
  },
  data() {
    return {
      restaurantName: '',
      userRole: '',
      cart: [],
      subtotal: 0,
      igv: 0,
      total: 0,
      isEditMode: false,
      selectedSlot: null,
      favoriteProducts: Array(30).fill(null),
    };
  },
  mounted() {
    this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const restaurantId = userData?.restaurantId;

        if (restaurantId) {
          const restaurantData = await userService.getRestaurantById(restaurantId);
          this.restaurantName = restaurantData.name;
          this.userRole = userData.role;
        }
      } catch (error) {
        console.error("Error fetching restaurant data: ", error);
      }
    },

    toggleEditMode(){
      this.isEditMode = !this.isEditMode;
    },
    openProductList(index) {
      this.selectedSlot = index;
    },
    addToSlot({product, slot}){
      this.favoriteProducts[slot] = product;
    },
    removeProductFromFavorites(index) {
      this.favoriteProducts[index] = null;
    },

    addCustomer() {
      // Lógica para agregar un cliente
    },

    addProductToCart(product) {
      const existingItem = this.cart.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.cart.push({ ...product, quantity: 1 });
      }
      this.updateCartSummary();
    },
    updateCartSummary() {
      this.subtotal = this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      this.igv = this.subtotal * 0.18; // Calcular IGV (18%)
      this.total = this.subtotal;
    },
    handleUpdateCart(updatedCart) {
      this.cart = updatedCart;
    },
    handleUpdateSummary({ subtotal, igv, total }) {
      this.subtotal = subtotal;
      this.igv = igv;
      this.total = total;
    },
    async saveSale(orderData) {
      const newOrder = {
        id: null,
        "order-title": orderData,
        "order-took": `${new Date().toLocaleString()}`,
        products: this.cart.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      try {
        const result = await ordersService.addOrder(this.restaurantName, newOrder);
        if(result.success){
          this.$router.push(`/${this.restaurantName}/${this.userRole}/saved-accounts`);
          alert("Orden guardada exitosamente");
        } else {
          alert(`Error guardando la orden: ${result.message}`);
        }
      } catch (error){
        console.error("Error al guardar la orden:", error);
      }
    },
    charge() {
      // Lógica para procesar el cobro
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

favorite-product-header-component {
  display: flex;
  justify-content: space-between; /* Alinea la barra de búsqueda y el botón de edición */
  margin-bottom: 20px; /* Separación entre el header y la cuadrícula de productos */
}

.left-section {
  flex: 3; /* Hacer que la cuadrícula ocupe más espacio */

}
.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Para evitar la compresión vertical */
  min-width: 350px;
  min-height: 690px;
}
</style>