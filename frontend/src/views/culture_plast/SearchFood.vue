<template>
  <q-page class="q-pa-md">
    <div v-if="error" class="text-negative q-mt-lg">
      Ошибка: {{ error }}
    </div>
    <div v-if="foodItems.length > 0" class="row q-col-gutter-md">
        <div 
          v-for="item in foodItems" 
          :key="item.id" 
          class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
        >
      <q-card 
        bordered 
        class="my-card"
        @click="goToFoodDetails(item.id)"
      >
    <div>
      <img 
        v-if="item.url_image" 
        :src="item.url_image" 
        :alt="item.food"
        class="card-image"
        @error="item.url_image = null"
      >
      <div v-else class="no-image-placeholder flex flex-center">
        <span>Нет изображения</span>
      </div>

      <q-card-section class="text-black">
        <div class="row items-center justify-between">
          <div class="text-h6">{{ item.food }}</div>
          <div>
            <q-btn 
              v-if="isAdmin"
              flat 
              round 
              color="primary" 
              icon="edit" 
              @click.stop="startEditing(item.id)"
            />
          </div>
        </div>
        
        <div v-if="item.country" class="q-mt-sm">
          <q-chip dense color="warning" text-color="dark" icon="public">
            {{ item.country }}
          </q-chip>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-px-md">
        <q-btn 
          flat 
          round 
          color="grey" 
          :icon="expandedDescriptions[item.id] ? 'expand_less' : 'expand_more'" 
          @click.stop="toggleDescription(item.id)"
        />
      </q-card-actions>
    </div>

    <q-slide-transition>
      <div v-show="expandedDescriptions[item.id]">
        <q-card-section class="text-subtitle2 description-section">
          <div v-if="!editingDescriptions[item.id]" v-html="item.description || 'Описание отсутствует'"></div>
          
          <q-editor
            v-else
            v-model="editingText"
            min-height="150px"
            content-class="text-left"
            :toolbar="[
              ['left', 'center', 'right', 'justify'],
              ['bold', 'italic', 'underline'],
              ['unordered', 'ordered',],
              ['undo', 'redo'],
              ]"
          />
          
          <div v-if="editingDescriptions[item.id]" class="q-mt-sm">
            <q-btn 
              color="positive" 
              label="Сохранить" 
              @click.stop="saveDescription(item.id)"
              size="sm"
            />
            <q-btn 
              color="negative" 
              label="Отмена" 
              @click.stop="cancelEditing(item.id)"
              size="sm"
              class="q-ml-sm"
            />
          </div>
        </q-card-section>
      </div>
    </q-slide-transition>
  </q-card>
      </div>
    </div>
    
    <div v-else class="full-width row flex-center text-grey q-gutter-sm">
      <span v-if="searchTerm">Ничего не найдено по запросу "{{ searchTerm }}"</span>
      <span v-else>Введите поисковый запрос</span>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import http from "/src/http-common";
import { useQuasar } from 'quasar';

export default defineComponent({
  name: "SearchFood",
  props: {
    searchTerm: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const $q = useQuasar();
    const route = useRoute();
    const router = useRouter();
    const foodItems = ref([]);
    const error = ref(null);
    const currentSearchTerm = ref('');
    const userNameMap = ref({});
    const expandedDescriptions = ref({});
    const editingDescriptions = ref({});
    const editingText = ref('');
    const currentEditingId = ref(null);
    const currentUser = computed(() => {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      return user || null;
    });
    const toggleDescription = (id) => {
      expandedDescriptions.value[id] = !expandedDescriptions.value[id];
    };

    const goToFoodDetails = (id) => {
      router.push({ name: 'FoodDetailsPage', params: { id } });
    };

    const startEditing = (id) => {
      currentEditingId.value = id;
      editingDescriptions.value[id] = true;
      const item = foodItems.value.find(item => item.id === id);
      editingText.value = item?.description || '';
    };

    const cancelEditing = (id) => {
      editingDescriptions.value[id] = false;
      currentEditingId.value = null;
      editingText.value = '';
    };

    const saveDescription = async (id) => {
      try {
        const item = foodItems.value.find(item => item.id === id);
        if (!item) {
          console.error("not found");
          return;
        }

        if (item.description === editingText.value) {
          cancelEditing(id);
          return;
        }

        await http.post(`/updatefood_name/${id}`, {
          description: editingText.value
        });
        
        const index = foodItems.value.findIndex(item => item.id === id);
        if (index !== -1) {
          foodItems.value[index].description = editingText.value;
        }
        
        $q.notify({
          message: 'Описание успешно обновлено',
          color: 'positive',
          icon: 'check'
        });
        
        cancelEditing(id);
        await searchFood(currentSearchTerm.value);
        
      } catch (e) {
        console.error("Ошибка при обновлении описания", e);
        $q.notify({
          message: 'Ошибка при обновлении описания',
          color: 'negative',
          icon: 'error'
        });
      }
    };

    const isAdmin = computed(() => {
      return currentUser.value?.role === 'администратор';
    });

    const isCurrentUserOwner = (userId) => {
      return isAdmin.value || (currentUser.value?.id === userId);
    };

    const loadUserNames = async (items) => {
      const userIds = [...new Set(items.map(item => item.user_id).filter(id => id))];
      
      await Promise.all(userIds.map(async userId => {
        if (!userNameMap.value[userId]) {
          try {
            const response = await http.get(`/user/${userId}`);
            if (response.data && response.data.length > 0) {
              userNameMap.value[userId] = response.data[0].username;
            }
          } catch (e) {
            console.error("Error fetching user:", e);
          }
        }
      }));
    };

    const addToFavorites = (foodId) => {
      $q.notify({
        message: 'Добавлено в избранное',
        color: 'positive',
        icon: 'favorite',
        position: 'top'
      });
    };

    const searchFood = async (foodName) => {
      if (!foodName || foodName.trim() === '') {
        foodItems.value = [];
        currentSearchTerm.value = '';
        return;
      }
      
      if (currentSearchTerm.value === foodName) return;
      
      currentSearchTerm.value = foodName;
      error.value = null;
      
      try {
        const response = await http.get(`/food_name/food/${encodeURIComponent(foodName)}`);
        const items = Array.isArray(response.data) ? response.data : [];
        foodItems.value = items;
        items.forEach(item => {
          if (expandedDescriptions.value[item.id] === undefined) {
            expandedDescriptions.value[item.id] = false;
          }
        });
        await loadUserNames(items);
      } catch (err) {
        console.error('Ошибка поиска:', err);
        error.value = err.response?.data?.message || err.message || 'Ошибка при поиске';
        foodItems.value = [];
      }
    };

    const handleSearch = () => {
      const searchTerm = props.searchTerm || route.query.q || '';
      searchFood(searchTerm);
    };

    watch(() => props.searchTerm, handleSearch);
    watch(() => route.query.q, handleSearch);

    onMounted(() => {
      handleSearch();
    });

    return {
      foodItems,
      error,
      searchTerm: currentSearchTerm,
      userNameMap,
      expandedDescriptions,
      editingDescriptions,
      editingText,
      addToFavorites,
      toggleDescription,
      startEditing,
      cancelEditing,
      saveDescription,
      isCurrentUserOwner,
      isAdmin,
      currentUser,
      goToFoodDetails
    };
  }
});
</script>

<style lang="scss" scoped>
.my-card {
  border-radius: 9px;
  height: 100%;
  width: 300px;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 7px rgb(207, 138, 9);
  }
  
  .card-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
  }
  
  .no-image-placeholder {
    height: 200px;
    background: #f5f5f5;
    color: #999;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .description-section {
  padding-top: 0;
  padding-bottom: 16px;
  white-space: pre-line;
  color: $dark;
  text-align: left;

}
  
  .text-h6 {
    font-weight: 600;
  }

  .q-card__actions {
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .expand-btn {
    transition: transform 0.3s;
    &.expanded {
      transform: rotate(180deg);
    }
  }

  .action-buttons {
    justify-content: flex-end;
    padding-top: 0;
    padding-bottom: 16px;
    .q-btn {
      margin-left: 8px;
    }
  }
}

.q-px-md{
  margin-top: -40px;
}
.q-mt-sm{
  margin: 0;
}

</style>