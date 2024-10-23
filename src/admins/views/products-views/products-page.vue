<template>
  <div class="layout">
    <sidebar-component :restaurant-name="restaurantName" :role="userRole" class="sidebar" />
    <div class="main-content">
      <header-component :restaurant-name="restaurantName" :role="userRole" class="header" />
      <div class="page-container">
        <main class="products-page">
          <!-- Aquí está el contenedor común para los elementos que deben estar alineados -->
          <div class="content-wrapper">
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
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderComponent from "@/admins/components/header-component.vue";
import SidebarComponent from "@/admins/components/sidebar-component.vue";
import ProductCardComponent from "@/admins/views/products-views/components/product-card-component.vue";
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
    if (userData) {
      this.restaurantName = userData['business-name'];
      this.userRole = userData.role;
      this.restaurantId = localStorage.getItem('restaurantId'); // Obtener el ID del restaurante de localStorage
    }
    this.loadProducts();
  },

  methods: {
    async loadProducts() {
      const restaurantId = localStorage.getItem('restaurantId'); // Obtén el ID del restaurante

      try {
        const products = await productsService.getProductsByRestaurant(restaurantId);
        this.products = products;
        this.filteredProducts = this.products;
      } catch (error) {
        console.error("Failed to load products", error);
      }
    },
    filterProducts() {
      const query = this.searchQuery.toLowerCase(); // Convierte la consulta a minúsculas
      this.filteredProducts = this.products.filter((product) =>
          product.productName.toLowerCase().includes(query) // Asegúrate de usar el nombre correcto
      );
    },
    addProduct() {
      this.$router.push(`/${this.restaurantName}/${this.userRole}/new-product`);
    },
    editProduct(product) {
      this.$router.push(`/${this.restaurantName}/${this.userRole}/product/${product.id}`);
    },
    async deleteProduct(productId) {
      if (confirm("Are you sure you want to remove this product?")) {
        try {
          const response = await productsService.deleteProduct(productId);
          alert(response.message || "Product deleted successfully");
          // Vuelve a cargar los productos después de la eliminación
          await this.loadProducts();
        } catch (error) {
          console.error('Error during product deletion process:', error);
          alert('An error occurred: ' + error.message);
        }
      } else {
        alert("Deletion canceled.");
      }
    },


    async fetchProducts(){
      try {
        const response = await productsService.getProductsByRestaurant(this.restaurantName);
        this.products = response.data;
      } catch (error) {
        console.error('Error fetching products: ', error)
      }
    }
  }
}
</script>

<style scoped>
/* Estilos que adaptan la vista a la region especifica de la pantalla */
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

/* Estilos de la vista actual */
.page-container {
  margin-top: 100px; /* Desplaza el contenido principal por debajo del header */
  padding: 20px;
  background-color: #F6F5FA; /* Fondo blanco para la zona de contenido */
  height: calc(100vh - 100px); /* Ajusta el alto para evitar desbordamientos */
  overflow-y: auto; /* Permite el scroll si el contenido es muy largo */
  font-family: 'Red Hat Display', sans-serif;
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
  max-width: 1000px;
}
.add-button {
  padding: 13px 20px;
  background: #D3D2E5;
  color: #31304A;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 800;
  flex-shrink: 0;
}
.product-cards{
  width: 100%;
  max-width: 1000px;
  margin: 20px auto;
}
</style>