<template>
  <div class="layout">
    <sidebar-component :restaurant-name="restaurantName" :role="userRole" class="sidebar" />
    <div class="main-content">
      <header-component :restaurant-name="restaurantName" :role="userRole" class="header" />
      <div class="page-container">
        <div class="page-header">
          <p class="title">{{ isEdit ? 'Edit Product' : 'Add New Product' }}</p>
        </div>
        <div class="card">
          <form @submit.prevent="submitProduct">
            <div class="form-field">
              <label for="name">Product Name</label>
              <input type="text" v-model="product.productName" required />
            </div>

            <div class="form-row">
              <div class="form-field">
                <label for="category">Product Category</label>
                <input type="text" v-model="product.category" required />
              </div>

              <div class="form-field">
                <label for="price">Product Price</label>
                <input type="number" v-model="product.productPrice" required />
              </div>
            </div>

            <div class="form-field">
              <label for="imageUrl">Product Image URL</label>
              <input type="text" v-model="product.productImageUrl" />
            </div>

            <button type="submit">{{ isEdit ? 'Save Changes' : 'Add Product' }}</button>
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
import userService from "@/public/services/userService";

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
        productName: '',
        category: '',
        productPrice: null,
        restaurantId: null,
      },
      isEdit: false,
    };
  },
  beforeMount() {
    this.fetchUserData();

    const userData = JSON.parse(localStorage.getItem('userData'));
    const restaurantId = userData.restaurantId;
    console.log("id del restaurante:", restaurantId)
    if (userData) {
      this.restaurantName = userData['business-name'];
      this.userRole = userData.role;
    }
    if (restaurantId) {
      this.product.restaurantId = restaurantId;
    }

    if (this.$route.params.productId) {
      this.isEdit = true;
      this.loadProduct();
    }
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

    async loadProduct() {
      try {
        const productId = this.$route.params.productId;
        const product = await productsService.getProductById(productId);

        if (product) {
          this.product = {
            id: product.id,
            productName: product.productName,
            productPrice: product.productPrice,
            productImageUrl: product.productImageUrl,
            category: product.category,
            restaurantId: product.restaurantId,
          };
        }
      } catch (error) {
        console.error("Failed to load product", error);
      }
    },

    async checkProductNameExists(productName, restaurantId) {
      try {
        // Llama a getProductsByRestaurant para obtener los productos del restaurante
        const products = await productsService.getProductsByRestaurant(restaurantId);

        // Verifica si algún producto tiene el mismo nombre (ignora mayúsculas)
        return products.some(product => product.productName.toLowerCase() === productName.toLowerCase());
      } catch (error) {
        console.error('Error checking product name:', error);
        return false;
      }
    },

    async submitProduct() {
      this.product.productPrice = parseFloat(this.product.productPrice);
      this.product.restaurantId = Number(this.product.restaurantId);

      // Verificar si el producto ya existe en el mismo restaurante
      const productNameExists = await this.checkProductNameExists(this.product.productName, this.product.restaurantId);
      if (productNameExists && !this.isEdit) {
        alert('A product with this name already exists in this restaurant. Please choose a different name.');
        return;
      }

      try {
        const response = this.isEdit
            ? await productsService.updateProduct(this.product)
            : await productsService.addProduct(this.product);

        if (response) {
          alert(`Product ${this.isEdit ? 'updated' : 'created'} successfully.`);
        } else {
          console.error(`${this.isEdit ? 'Update' : 'Creation'} response error:`, response);
        }

        this.$router.push(`/${this.restaurantName}/${this.userRole}/products`);

      } catch (error) {
        console.error('Error during product creation/update process:', error);
        alert('An error occurred: ' + (error.response ? error.response.data.message : error.message));
      }
    },
  }
}
</script>

<style scoped>
/* Estilos que adaptan la vista a la region especifica de la pantalla */
.layout {
  display: flex;
  height: 100vh;
  background-color: #F6F5FA
}
.main-content {
  margin-left: 255px; /* Desplaza el contenido a la derecha del sidebar */
  width: calc(100% - 280px); /* Ajusta el ancho para ocupar el resto de la pantalla */
  display: flex;
  flex-direction: column;
}
.page-container {
  margin-top: 70px; /* Desplaza el contenido principal por debajo del header */
  padding: 20px;
  background-color: #F6F5FA; /* Fondo blanco para la zona de contenido */
  height: calc(100vh - 100px); /* Ajusta el alto para evitar desbordamientos */
  font-family: 'Red Hat Display', sans-serif;
}

.title {
  font-weight: 800;
  font-size: 1.5rem;
  max-width: 1000px;
  margin: 20px auto;
  padding-bottom: 10px;
  color: #31304A;
}
.card {
  background: #D3D2E5;
  padding: 30px 50px;
  border-radius: 5px;
  max-width: 1000px;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  gap: 10px;
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
button:active{
  background-color: #201E35;
}
</style>