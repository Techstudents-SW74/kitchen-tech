<template>
  <div class="layout">
    <sidebar-component :restaurant-name="restaurantName" :role="userRole" class="sidebar" />
    <div class="main-content">
      <header-component :restaurant-name="restaurantName" :role="userRole" class="header" />
      <div class="page-container">
        <div class="page-header">
          <p class="title">{{ isEdit? 'Edit Product' : 'Add New Product' }}</p>
        </div>
        <div class="card">
          <form @submit.prevent="submitProduct">
            <div class="form-field">
              <label for="name">Product Name</label>
              <input type="text" v-model="product.name" required/>

              <div class="form-row">
                <div class="form-field">
                  <label for="category">Product Category</label>
                  <input type="text" v-model="product.category" required/>
                </div>

                <div class="form-field">
                  <label for="price">Product Price</label>
                  <input type="text" v-model="product.price" required/>
                </div>
              </div>
            </div>
            <button type="submit">{{ isEdit? 'Save Changes' : 'Add Product'}}</button>
          </form>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderComponent from "@/admins/components/header-component.vue";
import SidebarComponent from "@/admins/components/sidebar-component.vue";
import { productsService } from "@/public/services/productsService";

export default {
  components: {
    HeaderComponent,
    SidebarComponent,
  },
  data() {
    return {
      restaurantName: '',
      userRole: '',
      product: {
        id: null,
        name: '',
        category: '',
        price: null,
      },
      isEdit: false,
    };
  },
  async mounted() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      this.restaurantName = userData['business-name'];
      this.userRole = userData.role;
    }

    if(this.$route.params.productId){
      this.isEdit = true;
      await this.loadProduct();
    }
  },
  methods: {
    async loadProduct() {
      try {
        const products = await productsService.getProductsByRestaurant(this.restaurantName);
        const product = products.find((p) => p.id === parseInt(this.$route.params.productId));

        if (product) {
          this.product = product;
        }

      } catch (error) {
        console.error("Failed to load product", error);
      }
    },
    async submitProduct() {
      this.product.price = parseFloat(this.product.price);

      if (this.isEdit) {
        try {
          const response = await productsService.updateProduct(this.restaurantName, this.product);

          if (response && response.success) {
            this.$router.push(`/${this.restaurantName}/${this.userRole}/products`);
            alert('Product updated successfully.');
          } else {
            alert(response.message || 'Update failed');
          }
        } catch (error) {
          console.error('Error during product updating process:', error);
          alert('An error occurred: ' + error.message);
        }
      } else {
        try {
          const response = await productsService.addProduct(this.restaurantName, this.product);

          if (response && response.success) {
            this.$router.push(`/${this.restaurantName}/${this.userRole}/products`);
            alert('Product updated successfully.');
          } else {
            alert(response.message || 'Creation failed');
          }
        } catch (error) {
          console.error('Error during product creation process:', error);
          alert('An error occurred: ' + error.message);
        }
      }
    }
  }
}
</script>

<style scoped>
/* Estilos que adaptan la vista a la region especifica de la pantalla */>
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
  font-family: 'Red Hat Display', sans-serif;
}

.title {
  font-weight: 800;
  font-size: 1.5rem;
}
.card {
  background: #D3D2E5;
  padding: 30px 50px;
  border-radius: 5px;
}

.form-row {
  display: flex;
  gap: 20px;
  flex: 1;
  margin: 20px 0;
}
.form-field {
  flex: 1;
}
.form-field label {
  font-weight: 700;
  color: #31304A;
}
.form-field input {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  color: #31304A;
  margin: 10px 0;
  font-weight: 500;
  box-sizing: border-box;
  background: #F6F5FA;
}

button{
  width: 100%;
  margin: 0 0 16px 0;
  color: #F6F5FA;
  padding: 24px;
  background: #31304A;
  font-weight: 500;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  border: none;
}
</style>