let chatMemory = [];
const MAX_MEMORY_SIZE = 5;


document.addEventListener('DOMContentLoaded', () => {
    // Character creation handling
    const form = document.getElementById('characterCreationForm');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission

            // Collect form data
            const archetype = document.getElementById('archetype').value;
            const backstory = document.getElementById('backstory').value;
            const worldSetting = document.getElementById('worldSetting').value;

            // Package the form data into a context string
            const aiContext = {
                archetype: archetype,
                backstory: backstory,
                worldSetting: worldSetting
            };

            // Store the context in session storage
            sessionStorage.setItem('aiContext', JSON.stringify(aiContext));
            
            // Navigate to the game UI
            window.location.href = 'gameui.html'; // Redirect to the game UI page
        });
    }

    if (window.location.href.includes('gameui.html')) {
        initiateGameNarrative();
    }

    async function initiateGameNarrative() {
        const aiContext = JSON.parse(sessionStorage.getItem('aiContext'));
        const startingMessage = "start adventure"; // This is the cue for the AI to provide the opening narrative
        const aiResponse = await sendChatToAPI(startingMessage, aiContext);
        updateChatbox('AI: ' + aiResponse);
    }

    // Initialize the game UI if we are on the game page
    if (document.getElementById('gameUI')) {
        initializeGameUI();
    }

    const sendAction = document.getElementById('sendAction');
    const actionInput = document.getElementById('actionInput');
    const chatbox = document.getElementById('chatbox');

    if (sendAction) {
        sendAction.addEventListener('click', async function() {
            const actionText = actionInput.value.trim();
            if (actionText === '') return; // Prevent sending empty messages
            actionInput.value = ''; // Clear the input box
            updateChatbox('You: ' + actionText);

            // Retrieve the AI context from session storage
            const aiContext = JSON.parse(sessionStorage.getItem('aiContext'));

            try {
                const aiResponse = await sendChatToAPI(actionText, aiContext);
                updateChatbox('AI: ' + aiResponse);
            } catch (error) {
                console.error('Error while getting response from AI:', error);
                updateChatbox('AI: Sorry, there was an error processing your request.');
            }
        });
    }

    async function sendChatToAPI(userMessage, context) {
        const apiKey = 'API_KEY_HERE'; // Use environment variables or secure methods to store API keys
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: `You are a Game Master guiding a ${context.archetype} in a world set in a ${context.worldSetting} setting. Use only 4-5 sentences and give the player chances to explore and make decisions. This is their Backstory: ${context.backstory}.` },
                    { role: "assistant", content: chatMemory.join('')},
                    { role: "user", content: userMessage }
                ],
            }),
        });

        const data = await response.json();
        chatMemory.push(userMessage);
        chatMemory.push(data.choices[0].message.content);
        
        console.log(chatMemory);

        if (chatMemory.length > 2 * MAX_MEMORY_SIZE) {
            chatMemory.splice(0, chatMemory - 2 * MAX_MEMORY_SIZE);
        }
        console.log(chatMemory);
        return data.choices[0].message.content.trim();
        // Returns the AI response
    }

    function updateChatbox(userMessage) {
        const messageElement = document.createElement('div');
        messageElement.textContent = userMessage;
        messageElement.classList.add('gametext');
        chatbox.appendChild(messageElement);
        chatbox.scrollTop = chatbox.scrollHeight; // Scroll to the bottom of the chatbox for the latest message
    }

    function initializeGameUI() {
        // Fetch the stored context
        const storedContext = JSON.parse(sessionStorage.getItem('aiContext'));
        if (storedContext) {
            updateGameUI(storedContext.archetype);
        }
    }

    function updateGameUI(archetype) {
        // Define your archetype stats here or fetch them if they are complex
        const archetypes = {
            fighter: {
                class: 'Fighter',
                health: 200,
                stamina: 150,
                mana: 100,
                level: 1,
                skill1: 'Unarmed Combat: 60',
                skill2: 'Melee Weapons: 75',
                skill3: 'Ranged Weapons: 55',
                skill4: 'Armor Efficiency: 70',
                skill5: 'Intimidation: 65',
                ability1: 'Rage',
                ability2: 'Cleave',
                ability3: 'Crushing Blow',
                ability4: 'Stun',
                ability5: 'Executing Blow',
                action1: 'Take',
                action2: 'Attack',
                action3: 'Stealth',
                action4: 'Talk',
                action5: 'Retreat',
                action6: 'Rest',
                item1: 'Longsword',
                item2: 'Shield',
                item3: 'Crossbow',
                item4: 'Repair Kit',
                item5: 'First Aid Kit'
            },
            scholar: {
                class: 'Scholar',
                health: 100,
                stamina: 150,
                mana: 200,
                level: 1,
                skill1: 'Unarmed Combat: 25',
                skill2: 'Melee Weapons: 45',
                skill3: 'Spell Combat: 90',
                skill4: 'Armor Efficiency: 30',
                skill5: 'Persuasion: 65',
                ability1: 'Fireball',
                ability2: 'Lightning Strike',
                ability3: 'Ice Javalin',
                ability4: 'Fear',
                ability5: 'Charm',
                action1: 'Take',
                action2: 'Attack',
                action3: 'Stealth',
                action4: 'Talk',
                action5: 'Retreat',
                action6: 'Rest',
                item1: 'Shortsword',
                item2: 'Quarterstaff',
                item3: 'Book of Knowledge',
                item4: 'Brewery Kit',
                item5: 'First Aid Kit'
            },
            rogue: {
                class: 'Rogue',
                health: 150,
                stamina: 200,
                mana: 100,
                level: 1,
                skill1: 'Unarmed Combat: 55',
                skill2: 'Melee Weapons: 70',
                skill3: 'Ranged Combat: 80',
                skill4: 'Armor Efficiency: 50',
                skill5: 'Deception: 65',
                ability1: 'Bleeding Stab',
                ability2: 'Posion Imbuement',
                ability3: 'Sniper Shot',
                ability4: 'Rapid Fire',
                ability5: 'Invisibility',
                action1: 'Take',
                action2: 'Attack',
                action3: 'Stealth',
                action4: 'Talk',
                action5: 'Retreat',
                action6: 'Rest',
                item1: 'Rapier',
                item2: 'Dagger',
                item3: 'Long Bow',
                item4: 'Lockpicking Kit',
                item5: 'First Aid Kit'
            }
        };

        // Update the UI elements with archetype data
        const characterData = archetypes[archetype];
        document.getElementById('health').textContent = `Health: ${characterData.health}`;
        document.getElementById('stamina').textContent = `Stamina: ${characterData.stamina}`;
        document.getElementById('mana').textContent = `Mana: ${characterData.mana}`;
        document.getElementById('class').textContent = `Class: ${characterData.class}`;
        document.getElementById('level').textContent = `Level: ${characterData.level}`;
        
        // Set the experience bar according to initial values
        document.getElementById('experienceBar').value = 0;

        document.getElementById('skill1').textContent = `${characterData.skill1}`;
        document.getElementById('skill2').textContent = `${characterData.skill2}`;
        document.getElementById('skill3').textContent = `${characterData.skill3}`;
        document.getElementById('skill4').textContent = `${characterData.skill4}`;
        document.getElementById('skill5').textContent = `${characterData.skill5}`;
        // Similarly, update skills, abilities, and inventory based on the archetype

        document.getElementById('ability1').textContent = `${characterData.ability1}`;
        document.getElementById('ability2').textContent = `${characterData.ability2}`;
        document.getElementById('ability3').textContent = `${characterData.ability3}`;
        document.getElementById('ability4').textContent = `${characterData.ability4}`;
        document.getElementById('ability5').textContent = `${characterData.ability5}`;
        // This requires elements in the HTML for skills, abilities, and inventory

        document.getElementById('action1').textContent = `${characterData.action1}`;
        document.getElementById('action2').textContent = `${characterData.action2}`;
        document.getElementById('action3').textContent = `${characterData.action3}`;
        document.getElementById('action4').textContent = `${characterData.action4}`;
        document.getElementById('action5').textContent = `${characterData.action5}`;
        document.getElementById('action6').textContent = `${characterData.action6}`;

        document.getElementById('item1').textContent = `${characterData.item1}`;
        document.getElementById('item2').textContent = `${characterData.item2}`;
        document.getElementById('item3').textContent = `${characterData.item3}`;
        document.getElementById('item4').textContent = `${characterData.item4}`;
        document.getElementById('item5').textContent = `${characterData.item5}`;
    }

    const archetypePhrases = {
        fighter: {
            abilities: ["I enter into a trance of Rage!", "I perform a powerful sweeping Cleave!", "I perfrom a devastating Crushing Blow!", "I raise the blunt side of my weapon and perfrom a Stun!", "I raise my weapon and perfrom an Executing Blow!"],
            actions: ["I pick up and take the item.", "I draw my weapon, ready to attack!", "I crouch into stealth.", "I approach and try to talk.", "I dash to retreat from danger!", "I choose to rest to regain my strength, stamina, and clear my mind."],
            items: ["I wield my Longsword valiantly!", "I raise my Shield in defense.", "I equip my Crossbow, ready to attack from afar.", "My gear is damaged, I must stop and use my Repair Kit.", "I'm injuried, I must use my First Aid Kit!"]
        },
        scholar: {
            abilities: ["I cast a devastating Fireball!", "I channel the sky to cast a lightning Strike!", "I conjure and hurl an Ice Javalin!", "I cast Fear, filling their minds with nightmarish horrors!", "I cast Charm, they see me as nothing more than a friend."],
            actions: ["I pick up and take the item.", "I draw my weapon, ready to attack!", "I crouch into stealth.", "I approach and try to talk.", "I dash to retreat from danger!", "I choose to rest to regain my strength, stamina, and clear my mind."],
            items: ["I draw my shortsword, ready to defend myself!", "I hold my qaurterstaff, ready to channel my spells!", "I open and read the Book of Knowledge, it must know something that maybe useful.","I ponder the usage of my Brewery Kit.", "I'm injuried, I must use my First Aid Kit!"]
        },
        rogue: {
            abilities: ["I perform bleeding stab to weaken my enemy.", "I cast Posion Imbuement on my weapons!", "I perform Sniper Shot to attack my enemy from a great distance.", "I perform Rapid Fire to fire multiple arrows in quick succession.", "I cast Invisibility."],
            actions: ["I pick up and take the item.", "I draw my weapon, ready to attack!", "I crouch into stealth.", "I approach and try to talk.", "I dash to retreat from danger!", "I choose to rest to regain my strength, stamina, and clear my mind."],
            items: ["I draw my Rapier, ready to dual!", "I draw my dagger, ready to backstab.", "I wield my longbow, ready to strike from afar.", "Locked? Time to use my Lockpicking Kit.","I'm injuried, I must use my First Aid Kit!"]
        }            
    };

    // Function to update action input and chatbox with the phrase
    function setPhrase(buttonId, phrase) {
        const actionInput = document.getElementById('actionInput');
        actionInput.value = phrase;
        // If you want the phrase to be sent immediately, uncomment the following line:
        // document.getElementById('sendAction').click();
    }

    // Function to initialize buttons based on the current archetype
    function initializeButtons(archetype) {
        const abilities = archetypePhrases[archetype].abilities;
        const actions = archetypePhrases[archetype].actions;
        const items = archetypePhrases[archetype].items;

        abilities.forEach((phrase, index) => {
            const button = document.getElementById(`ability${index+1}`);
            if (button) {
                button.addEventListener('click', () => setPhrase(`ability${index+1}`, phrase));
            }
        });

        actions.forEach((phrase, index) => {
            const button = document.getElementById(`action${index+1}`);
            if (button) {
                button.addEventListener('click', () => setPhrase(`action${index+1}`, phrase));
            }
        });

        items.forEach((phrase, index) => {
            const button = document.getElementById(`item${index+1}`);
            if (button) {
                button.addEventListener('click', () => setPhrase(`item${index+1}`, phrase));
            }
        });
    }

    // Retrieve the stored archetype from session storage
    const storedContext = JSON.parse(sessionStorage.getItem('aiContext'));
    if (storedContext && storedContext.archetype) {
        initializeButtons(storedContext.archetype);
    }
});
