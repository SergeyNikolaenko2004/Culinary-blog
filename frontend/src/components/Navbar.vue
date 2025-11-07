<template>
  <q-header elevated class="bg-dark text-white">
    <q-toolbar>
      <q-img 
          src="/public/чуркапчел.png" 
          style="width: 50px; cursor: pointer"
          class="q-mr-sm"
          @click="back2home"
        />

      <q-scroll-area horizontal style="height: 50px; width: 100%">
        <div class="row no-wrap">
          <q-btn
            v-for="culture in culture_plasts"
            :key="culture.id"
            :label="culture.culture"
            :to="`/culture_plast/${culture.id}/food_names`"
            flat
            class="text-white q-px-md nav-btn"
            active-class="text-yellow"
          />
        </div>
      </q-scroll-area>

      <q-space />
      
      <q-input 
        v-model="searchQuery"
        placeholder="Введите..."
        class="q-mr-sm search-input"
        @keyup.enter="searchFood"
      >
        <template v-slot:append>
          <q-icon name="search" class="cursor-pointer" @click="searchFood" />
        </template>
      </q-input>
      
      <q-btn 
        flat 
        round 
        dense 
        :icon="userIcon" 
        @click="openProfile" 
        class="account-btn"
      >
        <q-avatar v-if="currentUser" class="account-avatar">
          {{ userInitial }}
        </q-avatar>
      </q-btn>
    </q-toolbar>
    
    <q-footer 
      elevated 
      class="bg-dark text-white footer" 
      :class="{ 'footer-visible': isFooterVisible }"
    >
      <q-toolbar >
        <q-toolbar-title class="text-center">
          <div class="row q-col-gutter-md justify-center">
            <div class="col-auto">
              <q-icon name="phone" size="sm" class="q-mr-xs" />
              <span>+7 (924) 533-44-572</span>
            </div>
            
            <div class="col-auto">
              <q-icon name="email" size="sm" class="q-mr-xs" />
              <span>nikolaenkoserzh@gmail.com</span>
            </div>
            
          </div>
          
          <div class="text-caption q-mt-md" >
            &copy; 2025 套餐
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>


    <q-dialog v-model="accountDialog">
      <q-card style="min-width: 350px">
        <q-card-section class="q-pt-none">
          <q-tabs v-model="accountTab" class="text-dark">
            <q-tab name="login" label="Вход" />
            <q-tab name="register" label="Регистрация" />
          </q-tabs>

          <q-tab-panels v-model="accountTab" animated>
            <q-tab-panel name="login">
              <q-input v-model="loginName" color="dark" label="Username" class="q-mb-sm" />
              <q-input v-model="loginPassword" color="dark" label="Password" type="password" />
            </q-tab-panel>

            <q-tab-panel name="register">
              <q-input 
                v-model="registerName" 
                color="dark" 
                label="Username *" 
                class="q-mb-sm" 
                :rules="[val => !!val || 'Поле обязательно']"
                lazy-rules
              />
              <q-input 
                v-model="registerLastname" 
                color="dark" 
                label="Lastname" 
                class="q-mb-sm" 
              />
              <q-input 
                v-model="registerPassword" 
                color="dark" 
                label="Password *" 
                type="password"
                :rules="[val => !!val || 'Поле обязательно']"
                lazy-rules
              />
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" class="text-dark" v-close-popup />
          <q-btn 
            v-if="accountTab === 'login'" 
            label="Войти" 
            color="positive" 
            @click="handleLogin" 
          />
          <q-btn 
            v-else 
            label="Зарегистрироваться" 
            color="positive" 
            @click="handleRegister" 
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-header>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import http from "/src/http-common";


export default defineComponent({
  name: "Navbar",
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const culture_plasts = ref([]);
    const leftDrawerOpen = ref(false);
    const searchQuery = ref('');
    const accountDialog = ref(false);
    const accountTab = ref('login');
    const loginName = ref('');
    const loginPassword = ref('');
    const registerName = ref('');
    const registerLastname = ref('');
    const registerPassword = ref('');
    const currentUser = ref(null);
    
    const isFooterVisible = ref(false);

    const checkScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      const threshold = 100; 

      isFooterVisible.value = scrollPosition >= pageHeight - threshold;
    };

    const back2home = () => {
      if (currentUser.value) {
        router.push('/');
      } else {
        accountDialog.value = true;
      }
    };

    const openProfile = () => {
      if (currentUser.value) {
        router.push('/profile');
      } else {
        accountDialog.value = true;
      }
    };
    const userInitial = computed(() => currentUser.value?.username?.charAt(0).toUpperCase() || '');
    const userIcon = computed(() => currentUser.value ? '' : 'account_circle');

    const getCulturePlasts = () => {
      http.get("/culture_plasts")
        .then(response => culture_plasts.value = response.data)
        .catch(console.error);
    };



    const searchFood = () => {
      if (searchQuery.value.trim()) {
        router.push({ path: '/search-results', query: { q: searchQuery.value } });
        searchQuery.value = '';
      }
    };

    const handleLogin = () => {
      http.get("/user")
        .then(response => {
          const user = response.data.find(u => 
            u.username === loginName.value && 
            u.password === loginPassword.value
          );

          if (user) {
            currentUser.value = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            $q.notify({ 
              message: 'Вход выполнен', 
              color: 'positive',
              onDismiss: () => {
                window.location.reload(); 
              }
            });
            accountDialog.value = false;
          } else {
            $q.notify({ message: 'Неверное имя пользователя или пароль', color: 'negative' });
          }
        }).catch(error => {
          $q.notify({ message: 'Ошибка при входе', color: 'negative' });
          console.error(error);
        });
    };

    const handleRegister = () => {
      if (!registerName.value || !registerPassword.value) {
        $q.notify({
          message: 'Поля Username и Password обязательны для заполнения',
          color: 'negative'
        });
        return;
      }
      http.post("/adduser", {
        username: registerName.value,
        lastname: registerLastname.value,
        password: registerPassword.value,
        role: 'пользователь'
      }).then(response => {
        currentUser.value = response.data;
        localStorage.setItem('currentUser', JSON.stringify(response.data));
        $q.notify({
          message: 'Регистрация успешна', 
          color: 'positive',
          onDismiss:()=>{
            window.location.reload();
          }
       }); 
        accountDialog.value = false;
        registerName.value = '';
        registerLastname.value = '';
        registerPassword.value = '';
      }).catch(error => {
        $q.notify({
          message: 'Ошибка регистрации: ' + (error.response?.data?.message || error.message),
          color: 'negative'
        });
      });
    };

    const checkAuth = () => {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) currentUser.value = JSON.parse(savedUser);
    };

    onMounted(() => {
      getCulturePlasts();
      checkAuth();
      window.addEventListener('scroll', checkScroll);
      checkScroll();
    });
    
    onUnmounted(() => {
      window.removeEventListener('scroll', checkScroll);
    });
    
    return {
      isFooterVisible,
      culture_plasts,
      leftDrawerOpen,
      searchQuery,
      accountDialog,
      accountTab,
      loginName,
      loginPassword,
      registerName,
      registerLastname,
      registerPassword,
      currentUser,
      userInitial,
      userIcon,
      getCulturePlasts,
      searchFood,
      handleLogin,
      handleRegister,
      openProfile,
      back2home
    };
  }
});
</script>

<style>
.col-auto{
  font-size: 15px;
}

.page-container {
  display: flex;
  flex-direction: column;
  min-height: 220vh;
}

.footer {
  position: fixed;
  bottom: -200px;
  transition: bottom 1s ease;
  padding: 10px;
  border-top: 1px solid rgb(36, 35, 35);
}


.footer-visible {
  bottom: 0 !important;
}

.q-toolbar-title {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.account-btn {
  width: 30px;
  height: 30px;
  padding: 0;
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.account-avatar {
  background-color: #f5a209;
  color: white;
  font-weight: bold;
  font-size: 16px;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 27px;
}

.nav-btn {
  display: flex;
  align-items: center;
  height: 100%;
  min-height: 50px;
}

.nav-btn:hover,
.q-btn--active.text-yellow {
  color: #ffeb3b !important;
  text-decoration: underline;
  text-underline-offset: 5px;
}

.nav-btn:hover {
  transition: all 0.3s ease;
}

.search-input {
  width: 250px;
}

.search-input .q-field__control:after {
  background: #ffeb3b !important;
  height: 2px !important;
  transform: scaleX(0);
  transition: transform .36s cubic-bezier(.4,0,.2,1);
}

.search-input .q-field--focused .q-field__control:after {
  transform: scaleX(1);
}

.search-input .q-field__control:hover {
  border-bottom: 1px solid #ffeb3b !important;
}

.search-input .q-field__native {
  color: white;
}

.search-input .q-icon {
  color: white;
  font-size: 1.2rem;
}

.search-input ::placeholder {
  color: rgba(255, 255, 255, 0.5);
}
</style>