document.addEventListener('DOMContentLoaded', () => {
    const characterForm = document.getElementById('characterForm');
    const weaponForm = document.getElementById('weaponForm');
  
    if (characterForm) {
      characterForm.addEventListener('submit', async (event) => {
        event.preventDefault();
  
        const formData = new FormData(characterForm);
  
        try {
          const response = await fetch('/create-character', {
            method: 'POST',
            body: formData
          });
  
          if (response.ok) {
            alert('Character created successfully');
            // Optionally, redirect or update UI
          } else {
            alert('Failed to create character');
          }
        } catch (error) {
          console.error('Error creating character:', error);
          alert('An error occurred while creating character');
        }
      });
    }
  
    if (weaponForm) {
      weaponForm.addEventListener('submit', async (event) => {
        event.preventDefault();
  
        const formData = new FormData(weaponForm);
  
        try {
          const response = await fetch('/create-weapon', {
            method: 'POST',
            body: formData
          });
  
          if (response.ok) {
            alert('Weapon created successfully');
            // Optionally, redirect or update UI
          } else {
            alert('Failed to create weapon');
          }
        } catch (error) {
          console.error('Error creating weapon:', error);
          alert('An error occurred while creating weapon');
        }
      });
    }
  });
  