function startFight() {
    // Get selected character and weapon IDs
    const character1Id = $('#character1Select').val();
    const character2Id = $('#character2Select').val();
    const weapon1Id = $('#weapon1Select').val();
    const weapon2Id = $('#weapon2Select').val();
  
    // Fetch character and weapon data based on IDs (from characters and weapons arrays)
    const character1 = characters.find(character => character.id == character1Id);
    const character2 = characters.find(character => character.id == character2Id);
    const weapon1 = weapons.find(weapon => weapon.id == weapon1Id);
    const weapon2 = weapons.find(weapon => weapon.id == weapon2Id);
  
    // Calculate damage based on weapon and armor
    let damage1 = Math.max(1, weapon1.damage - character2.armor);
    let damage2 = Math.max(1, weapon2.damage - character1.armor);
  
    // Update health of characters based on damage
    character1.health -= damage2;
    character2.health -= damage1;
  
    // Display fight results
    $('#fightResults').show();
    $('#winningText').text(`Character 1 health: ${character1.health}, Character 2 health: ${character2.health}`);
  }