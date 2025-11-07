<template>
  <q-page padding>
    <q-card bordered class="profile-card">
      <q-card-section class="bg-dark text-white">
        <div class="row items-center">
          <q-avatar 
            size="60px" 
            font-size="32px" 
            color="#f5a209" 
            text-color="white"
            class="q-mr-md"
          >
            {{ userInitial }}
          </q-avatar>
          <div class="text-h6">Профиль пользователя</div>
        </div>
      </q-card-section>
      
      <q-card-section>
        <div class="row q-mb-md items-center">
          <div class="col-4 text-bold text-dark">Имя:</div>
          <div class="col-8 text-dark">{{ user.username || 'Не указано' }}</div>
        </div>
        
        <div class="row q-mb-md items-center" v-if="user.lastname">
          <div class="col-4 text-bold text-dark">Фамилия:</div>
          <div class="col-8 text-dark">{{ user.lastname }}</div>
        </div>
        
        <div class="row q-mb-md items-center">
          <div class="col-4 text-bold text-dark">Роль:</div>
          <div class="col-8 text-dark">{{ user.role || 'Пользователь' }}</div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn 
          label="Добавить блюдо" 
          color="positive" 
          @click="showAddDishDialog = true"
        />
        <q-btn 
          label="Выйти" 
          color="negative" 
          @click="logout"
        />
      </q-card-actions>
    </q-card>

    <q-dialog v-model="showAddDishDialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Заявка на добавление блюда</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="submitDishRequest" class="q-gutter-md">
            <q-input
              v-model="dishForm.name"
              label="Название блюда *"
              color="dark"
              filled
              :rules="[val => !!val || 'Обязательное поле']"
            />

            <q-input
              v-model="dishForm.country"
              label="Страна *"
              color="dark"
              filled
              :rules="[val => !!val || 'Обязательное поле']"
            />

            <div class="text-bold text-dark q-mb-xs">Ингредиенты *</div>
            <q-editor
              class="text-dark"
              v-model="dishForm.ingredients"
              min-height="5rem"
              toolbar-toggle-color="primary"
              toolbar-bg="white"
              :toolbar="[
                  ['left', 'center', 'right', 'justify'],
                  ['bold', 'italic', 'underline'],
                  ['unordered', 'ordered',],
                  ['undo', 'redo'],
              ]"
              :rules="[val => !!val || 'Обязательное поле']"
            />

            <div class="text-bold text-dark q-mb-xs">Рецепт приготовления *</div>
            <q-editor
              class="text-dark"
              v-model="dishForm.recipe"
              min-height="10rem"
              toolbar-toggle-color="primary"
              toolbar-bg="white"
              :toolbar="[
                  ['left', 'center', 'right', 'justify'],
                  ['bold', 'italic', 'underline'],
                  ['unordered', 'ordered',],
                  ['undo', 'redo'],
              ]"
              :rules="[val => !!val || 'Обязательное поле']"
            />

            <q-input
              class="text-dark"
              v-model="dishForm.email"
              label="Ваш email *"
              color="dark"
              filled
              type="email"
              :rules="[
                val => !!val || 'Обязательное поле',
                val => /.+@.+\..+/.test(val) || 'Введите корректный email'
              ]"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отменить" color="negative" v-close-popup />
          <q-btn 
            label="Отправить заявку" 
            color="positive" 
            @click="submitDishRequest"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'ProfilePage',
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const user = ref(JSON.parse(localStorage.getItem('currentUser')) || {});
    const showAddDishDialog = ref(false);

    const dishForm = ref({
      name: '',
      ingredients: '',
      country: '',
      recipe: '',
      email: user.value.email || ''
    });

    const userInitial = computed(() => {
      return user.value.username?.charAt(0)?.toUpperCase() || '?';
    });

    const logout = () => {
      localStorage.removeItem('currentUser');
      $q.notify({
        message: 'Вы успешно вышли из системы',
        color: 'positive',
        onDismiss: () => {
           window.location.reload();
        }
      });
      router.push('/');
    };

    const submitDishRequest = () => {
      $q.notify({
        message: 'Заявка отправлена!',
        color: 'positive'
      });
      
      dishForm.value = {
        name: '',
        ingredients: '',
        country: '',
        recipe: '',
        email: user.value.email || ''
      };
      
      showAddDishDialog.value = false;
    };

    return {
      user,
      userInitial,
      logout,
      showAddDishDialog,
      dishForm,
      submitDishRequest
    };
  }
});
</script>

<style scoped>
.profile-card {
  max-width: 500px;
  margin: 100px;
  
}
.q-avatar {
  background-color: #f5a209;
  color: white;

}
</style>