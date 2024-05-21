<template>
    <div class="center-container">
      <div class="profile-container">
        <h1>My Profile</h1>
        <form @submit.prevent="updateProfile">
          <div class="form-group">
            <label for="profilePicture">Profile Picture:</label>
            <input type="file" id="profilePicture" @change="onFileChange" accept="image/*">
            <button v-show="profilePictureToSave && !pictureSaved" @click="saveProfilePicture" type="button">Save Picture</button>
            <div v-show="profilePictureToShow || profilePictureUrl" class="profile-picture">
              <img :src="profilePictureToShow || profilePictureUrl" alt="Profile Picture">
            </div>
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="email" disabled>
          </div>
          <div class="form-group password-group">
            <label for="password">New Password:</label>
            <input :type="passwordFieldType" id="password" v-model="newPassword">
            <i @click="togglePasswordVisibility" class="fas" :class="passwordFieldIcon"></i>
          </div>
          <button type="submit">Update Profile</button>
          <button type="button" @click="confirmDeleteAccount" class="delete-button">Delete Account</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { auth, db, storage } from '@/Firebase/firebase';
  import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
  import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
  import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
  
  export default {
    name: 'MyProfile',
    setup() {
      const email = ref('');
      const newPassword = ref('');
      const profilePictureUrl = ref('');
      const profilePictureToSave = ref(null);
      const pictureSaved = ref(false);
      const passwordFieldIcon = ref('fa-eye');
      const passwordFieldType = ref('password');
      const profilePictureToShow = ref('');
  
      const fetchUserProfile = async () => {
        const user = auth.currentUser;
        if (user) {
          email.value = user.email;
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.profilePicture) {
              profilePictureUrl.value = await getDownloadURL(storageRef(storage, userData.profilePicture));
            }
            // Optionally load other user data
          }
        }
      };
  
      const onFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          profilePictureToSave.value = file;
          profilePictureToShow.value = URL.createObjectURL(file);
        }
      };
  
      const saveProfilePicture = async () => {
        const user = auth.currentUser;
        if (user && profilePictureToSave.value) {
          const storageReference = storageRef(storage, `profilePictures/${user.uid}`);
          await uploadBytes(storageReference, profilePictureToSave.value);
          profilePictureUrl.value = await getDownloadURL(storageReference);
          await updateDoc(doc(db, 'users', user.uid), { profilePicture: `profilePictures/${user.uid}` });
          profilePictureToSave.value = null;
          pictureSaved.value = true;
        }
      };
  
      const togglePasswordVisibility = () => {
        passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password';
        passwordFieldIcon.value = passwordFieldIcon.value === 'fa-eye' ? 'fa-eye-slash' : 'fa-eye';
      };
  
      const confirmDeleteAccount = () => {
        if (confirm('Are you sure you want to delete your account?')) {
          deleteAccount();
        }
      };
  
      const deleteAccount = async () => {
        const user = auth.currentUser;
        if (user) {
          await deleteDoc(doc(db, 'users', user.uid));
          await user.delete();
          alert('Your account has been deleted.');
          // Redirect to login page or home page
        }
      };
  
      const reauthenticateUser = async () => {
        const user = auth.currentUser;
        if (user) {
          const credential = EmailAuthProvider.credential(user.email, prompt('Please enter your current password:'));
          try {
            await reauthenticateWithCredential(user, credential);
          } catch (error) {
            console.error('Reauthentication failed:', error);
          }
        }
      };
  
      const updateProfile = async () => {
        const user = auth.currentUser;
        if (user && newPassword.value) {
          try {
            await reauthenticateUser();
            await updatePassword(user, newPassword.value);
            await updateDoc(doc(db, 'users', user.uid), { password: newPassword.value }); // Update Firestore document
            alert('Password updated successfully.');
          } catch (error) {
            console.error('Error updating password:', error);
          }
        }
      };
  
      onMounted(fetchUserProfile);
  
      return {
        email,
        newPassword,
        profilePictureUrl,
        profilePictureToSave,
        pictureSaved,
        passwordFieldIcon,
        passwordFieldType,
        onFileChange,
        saveProfilePicture,
        togglePasswordVisibility,
        confirmDeleteAccount,
        profilePictureToShow,
        updateProfile,
      };
    }
  };
  </script>
  
  <style scoped>
  .center-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .profile-container {
    max-width: 400px;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
  }
  
  .form-group input[type="file"] {
    display: block;
  }
  
  .profile-picture {
    margin-top: 10px;
    text-align: center;
  }
  
  .profile-picture img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .password-group {
    position: relative;
  }
  
  .password-group i {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
  }
  
  .delete-button {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #ff4d4d;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  </style>
  