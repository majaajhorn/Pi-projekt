<template>
    <div class="statistics-container">
      <h1>Statistics</h1>
      <!-- Sort by dropdown -->
<div class="sort-dropdown">
  <label for="sort">Sort by:</label>
  <select id="sort" v-model="sortOrder" @change="sortUsers">
    <option value="asc">Alphabetically Ascending</option>
    <option value="desc">Alphabetically Descending</option>
  </select>
  <i class="fas fa-chevron-down" @click="toggleSortDropdown"></i>
  <ul v-if="sortDropdownOpen" class="sort-dropdown-list">
    <li @click="sortOrder = 'asc'">Alphabetically Ascending</li>
    <li @click="sortOrder = 'desc'">Alphabetically Descending</li>
  </ul>
</div>

<!-- Spacing -->
<div class="spacing"></div>

<!-- Search input -->
<div class="search-input">
  <label for="search">Search by Email:</label>
  <input type="text" id="search" v-model="searchTerm" @input="filterUsers" placeholder="Enter email to search">
  <i class="fas fa-search" @click="filterUsers"></i>
</div>
      <!-- Loading indicator -->
      <div v-if="loading" class="loading">Loading...</div>
      <!-- User list -->
      <ul v-else class="user-list">
        <li v-for="user in filteredUsers" :key="user.id" class="user-item" @click="showUserDetails(user)">
          {{ user.email }} - Times Logged In: {{ user.timesLoggedIn }}
        </li>
      </ul>
      <Navbar />
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { getFirestore, collection, getDocs } from 'firebase/firestore';
  import Navbar from '../components/Navbar.vue';
  
  export default {
    name: 'Statistics',
    components: {
      Navbar,
    },
    data() {
      return {
        users: [],
        loading: true,
        sortOrder: 'asc', // Default sort order
        searchTerm: '', // Search term for filtering users
        selectedUser: null,
        sortDropdownOpen: false,
      };
    },
    methods: {
      async fetchUsers() {
        try {
          const db = getFirestore();
          const usersCollection = collection(db, 'users');
          const usersSnapshot = await getDocs(usersCollection);
  
          const allUsers = [];
  
          usersSnapshot.forEach(doc => {
            const userData = doc.data();
            if (userData.registrationDate) {
              allUsers.push({
                id: doc.id,
                email: userData.email,
                timesLoggedIn: userData.timesLoggedIn || 0,
                registrationDate: userData.registrationDate.toDate().toISOString().split('T')[0]
              });
            } else {
              allUsers.push({
                id: doc.id,
                email: userData.email,
                timesLoggedIn: userData.timesLoggedIn || 0,
                registrationDate: 'Unknown'
              });
            }
          });
  
          this.users = allUsers;
          this.loading = false;
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      },
      sortUsers() {
        this.users.sort((a, b) => {
          const aValue = a.email.toLowerCase();
          const bValue = b.email.toLowerCase();
          if (this.sortOrder === 'asc') {
            return aValue.localeCompare(bValue);
          } else {
            return bValue.localeCompare(aValue);
          }
        });
      },
      filterUsers() {
        const searchTerm = this.searchTerm.toLowerCase();
        this.filteredUsers = this.users.filter(user => user.email.toLowerCase().includes(searchTerm));
      },
      showUserDetails(user) {
        this.selectedUser = user;
      },
      toggleSortDropdown() {
      this.sortDropdownOpen = !this.sortDropdownOpen;
    },
    },
    computed: {
      filteredUsers() {
        return this.searchTerm ? this.users.filter(user => user.email.toLowerCase().includes(this.searchTerm.toLowerCase())) : this.users;
      },
      registrationDistribution() {
        const distribution = {};
        this.users.forEach(user => {
          distribution[user.registrationDate] = (distribution[user.registrationDate] || 0) + 1;
        });
        return distribution;
      }
    },
    created() {
      this.fetchUsers();
    }
  };
  </script>
  
  <style scoped>
  .statistics-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
  }
  
  .loading {
    font-size: 1.2rem;
    color: #777;
    text-align: center;
  }
  
  .user-list {
    list-style: none;
    padding: 0;
  }
  
  .user-item {
    background-color: #f9f9f9;
    padding: 10px 20px;
    margin-bottom: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease;
    cursor: pointer; /* Add cursor pointer for indicating clickable items */
  }
  
  .user-item:hover {
    background-color: #e0e0e0;
  }
  
  .label {
    font-size: 14px;
    text-align: center;
  }

  .sort-dropdown {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.sort-dropdown label {
  font-size: 14px;
  margin-right: 10px;
}

.sort-dropdown select {
  font-size: 14px;
  padding: 5px;
  border: none;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.sort-dropdown i {
  font-size: 14px;
  margin-left: 10px;
  cursor: pointer;
}

.sort-dropdown-list {
  position: absolute;
  top: 40px;
  left: 0;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  display: none;
}

.sort-dropdown-list li {
  padding: 10px;
  cursor: pointer;
}

.sort-dropdown-list li:hover {
  background-color: #e0e0e0;
}

.search-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.search-input label {
  font-size: 14px;
  margin-right: 10px;
}

.search-input input {
  font-size: 14px;
  padding: 5px;
  border: none;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.search-input i {
  font-size: 14px;
  margin-left: 10px;
  cursor: pointer;
}

.spacing {
  height: 20px; /* Adjust the height as needed */
}
  </style>
  