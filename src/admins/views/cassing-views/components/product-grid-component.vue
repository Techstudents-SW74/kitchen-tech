<template>
  <div class="products-grid">
    <div
        v-for="(slot, index) in 40"
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
          <i class="fa fa-plus"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import FavoriteProductCardComponent from "@/admins/views/cassing-views/components/favorite-product-card-component.vue";

export default {
  props: {
    isEditMode: Boolean,
    favoriteProducts: Array
  },
  components: {
    FavoriteProductCardComponent
  },
  methods: {
    openProductList(index) {
      this.$emit('open-product-list', index);
    },
    removeProductFromFavorites(index) {
      this.$emit('remove-product-from-favorites', index);
    },
    selectFavoriteSlot(index) {
      if (!this.favoriteProducts[index]) {
        this.openProductList(index);
      }
    }
  }
}
</script>

<style scoped>
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 15px;
  max-width: 1000px;
  width: 100%;
  margin: 30px auto;
  align-items: center;
}
.product-slot {
  border: 1px dashed #31304A;
  border-radius: 5px;
  height: 100px;
  max-width: 120px;
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

@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }
}
</style>