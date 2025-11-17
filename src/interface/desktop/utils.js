console.log(`%c %s`, "font-family:monospace", `

   Greetings traveller,
   
   I am ✨ProbeAI✨, your open-source, personal AI copilot.
   
   
   `);

   function toggleNavMenu() {
       let menu = document.getElementById("probeAI-nav-menu");
       menu.classList.toggle("show");
   }
   
   // Close the dropdown menu if the user clicks outside of it
   document.addEventListener('click', function(event) {
       let menu = document.getElementById("probeAI-nav-menu");
       let menuContainer = document.getElementById("probeAI-nav-menu-container");
       let isClickOnMenu = menuContainer?.contains(event.target) || menuContainer === event.target;
       if (menu && isClickOnMenu === false && menu.classList.contains("show")) {
           menu.classList.remove("show");
       }
   });
   
   async function populateHeaderPane() {
       let userInfo = null;
       try {
           userInfo = await window.userInfoAPI.getUserInfo();
       } catch (error) {
           console.log("User not logged in");
       }
   
       let username = userInfo?.username ?? "?";
       let user_photo = userInfo?.photo;
       let is_active = userInfo?.is_active;
       let has_documents = userInfo?.has_documents;
   
       // Populate the header element with the navigation pane
       return `
           <a class="probeAI-logo" href="./splash.html">
               <img class="probeAI-logo" src="./assets/icons/probeAI-logo-sideways-500.png" alt="probeAI"></img>
           </a>
           <nav class="probeAI-nav">
           ${
               userInfo && userInfo.email
                 ? `<div class="probeAI-status-box">
                 <span class="probeAI-status-connected"></span>
                  <span class="probeAI-status-text">Connected to server</span>
                  </div>`
                 : `<div class="probeAI-status-box">
                 <span class="probeAI-status-not-connected"></span>
                  <span class="probeAI-status-text">Not connected to server</span>
                  </div>`
             }
               <a id="chat-nav" class="probeAI-nav" href="./chat.html">
                 <img class="nav-icon" src="./assets/icons/chat.svg" alt="Chat">
                 <span class="probeAI-nav-item-text">Chat</span>
               </a>
               
               ${username ? `
                   <div id="probeAI-nav-menu-container" class="probeAI-nav dropdown">
                       ${user_photo && user_photo != "None" ? `
                           <img id="profile-picture" class="${is_active ? 'circle subscribed' : 'circle'}" src="${user_photo}" alt="${username[0].toUpperCase()}" referrerpolicy="no-referrer">
                       ` : `
                           <div id="profile-picture" class="${is_active ? 'circle user-initial subscribed' : 'circle user-initial'}" alt="${username[0].toUpperCase()}">${username[0].toUpperCase()}</div>
                       `}
                       <div id="probeAI-nav-menu" class="probeAI-nav-dropdown-content">
                           <div class="probeAI-nav-username"> ${username} </div>
                           <a id="settings-nav" class="probeAI-nav" href="./config.html">⚙️ Settings</a>
                       </div>
                   </div>
               ` : ''}
           </nav>
       `;
   }
   