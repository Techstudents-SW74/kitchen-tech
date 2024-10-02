import {createRouter, createWebHistory} from 'vue-router'
import LoginPage from "@/public/views/login-page.vue";
import SignupPage from "@/public/views/signup-page.vue";
import CasingPage from "@/admins/views/casing-page.vue";
import SavedAccountsPage from "@/admins/views/saved-accounts-page.vue";
import SalesHistoryPage from "@/admins/views/sales-history-page.vue";
import CasingMovementsPage from "@/admins/views/casing-movements-page.vue";
import ProductsComponent from "@/admins/views/products-component.vue";
import SalesReportComponent from "@/admins/views/sales-report-component.vue";
import InventoryComponent from "@/admins/views/inventory-component.vue";
import CreateNewWaiterComponent from "@/admins/views/create-new-waiter-component.vue";
import ProfileComponent from "@/admins/views/profile-component.vue";

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: LoginPage,
    },
    {
        path: '/',
        name: 'DefaultLogin',
        component: LoginPage,
    },
    {
        path: '/signup',
        name: 'Signup',
        component: SignupPage,
    },

    //rutas dinamicas segun restaurante y rol del usuario
    {
        path: '/:restaurantName/:role/casing',
        name: 'Casing',
        component: CasingPage,
        props: true
    },
    {
        path: '/:restaurantName/:role/saved-accounts',
        name: 'SavedAccounts',
        component: SavedAccountsPage,
        props: true
    },
    {
        path: '/:restaurantName/:role/sales-history',
        name: 'SalesHistory',
        component: SalesHistoryPage,
        props: true
    },
    {
        path: '/:restaurantName/:role/casing-movements',
        name: 'CasingMovements',
        component: CasingMovementsPage,
        props: true
    },
    {
        path: '/:restaurantName/:role/products',
        name: 'Products',
        component: ProductsComponent,
        props: true
    },
    {
        path: '/:restaurantName/:role/sales-report',
        name: 'SalesReport',
        component: SalesReportComponent,
        props: true
    },
    {
        path: '/:restaurantName/:role/inventory',
        name: 'Inventory',
        component: InventoryComponent,
        props: true
    },
    {
        path: '/:restaurantName/:role/profile',
        name: 'Profile',
        component: ProfileComponent,
        props: true
    },
    {
        path: '/:restaurantName/:role/create-new-waiter',
        name: 'NewWaiter',
        component: CreateNewWaiterComponent,
        props: true
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router