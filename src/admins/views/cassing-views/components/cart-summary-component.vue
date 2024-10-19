<template>
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
</template>

<script>
export default {
  props: {
    cart: Array,
    subtotal: Number,
    igv: Number,
    total: Number
  },
  methods: {
    addCustomer() {
      this.$emit('add-customer');
    },
    saveSale() {
      this.$emit('save-sale');
    },
    charge() {
      this.$emit('charge');
    }
  }
}
</script>

<style scoped>
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
