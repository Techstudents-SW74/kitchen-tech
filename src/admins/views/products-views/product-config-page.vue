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
        restaurantId: null, // Agrega el restaurantId aquí
      },
      isEdit: false,
    };
  },
  mounted() {
    this.fetchUserData();

    const userData = JSON.parse(localStorage.getItem('userData')); // Obtener los datos del usuario
    const restaurantId = localStorage.getItem('restaurantId'); // Obtener el restaurantId
    if (userData) {
      this.restaurantName = userData['business-name']; // O lo que sea necesario
      this.userRole = userData.role;
    }
    if (restaurantId) {
      this.product.restaurantId = restaurantId; // Asigna el restaurantId al producto
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
        const productId = this.$route.params.productId; // Obtén el ID del producto desde los parámetros de la ruta
        const product = await productsService.getProductById(productId); // Llama al endpoint para obtener el producto

        if (product) {
          this.product = {
            id: product.id,
            productName: product.productName,
            productPrice: product.productPrice,
            productImageUrl: product.productImageUrl,
            category: product.category,
            restaurantId: product.restaurantId, // Incluye esto si es necesario
          };
        }
      } catch (error) {
        console.error("Failed to load product", error);
      }
    },
    async submitProduct() {
      this.product.productPrice = parseFloat(this.product.productPrice);
      this.product.restaurantId = Number(this.product.restaurantId);

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
    }
  }
}
</script>


<style scoped>
/* Estilos que adaptan la vista a la region especifica de la pantalla */>
.layout {
  display: flex;
  height: 100vh;
  background-color: #F6F5FA;
}
.main-content {
  margin-left: 280px; /* Desplaza el contenido a la derecha del sidebar */
  width: calc(100% - 280px); /* Ajusta el ancho para ocupar el resto de la pantalla */
  display: flex;
  flex-direction: column;
  font-family: 'Red Hat Display', sans-serif;
  margin-top: 140px;
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
</style>