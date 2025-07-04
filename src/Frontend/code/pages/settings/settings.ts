export const SettingsPage = {
  template() {
    return `<div class="settings-wrapper flex bg-gradient-to-b from-blue-500 to-neutral-900">
  <!-- SIDEBAR -->
  <div class="sidebar w-50 flex flex-col items-center text-white border-white/20 relative pt-4">
    <!-- INFO USER -->
    <div class="user flex flex-col items-center">
      <img class="user-avatar mb-2 w-16 h-16 rounded-full border-2 border-sky-300" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLk156iHiE6mviqLSwV6NV_s-vV1v3Un34LCcbDCIJXcAuWNQc-hwBF-v_w-3Q1RvtuwIGtpsFbolBnxiqdEmIRfZbyf4-3a_dbyYKog" alt="User avatar">
      <div class="user-data text-center text-base">
        <p class="user-name">Bob Esponja</p>
        <p class="user-username text-gray-400">mrBob201</p>
      </div>
    </div>

    <!-- NAVBAR -->
    <div class="navbar w-full text-center mt-4">
      <button class="account w-full border-t border-white/20 py-2 brightness-85 hover:brightness-100 hover:bg-blue-400 transition-all duration-300 ease-in rounded-sm">Account</button>
      <button class="Security w-full border-t border-white/20 py-2 brightness-85 hover:brightness-100 hover:bg-blue-400 transition-all duration-300 ease-in rounded-sm">Security</button>
      <button class="Social w-full border-y border-white/20 py-2 brightness-85 hover:brightness-100 hover:bg-blue-400 transition-all duration-300 ease-in rounded-sm">Social</button>
    </div>

    <!-- LOGOUT -->
    <div class="mt-auto w-full">
      <button class="logout w-full border-t border-white/20 py-2 brightness-85 hover:brightness-100 hover:bg-blue-400 transition-all duration-300 ease-in rounded-sm">Log Out</button>
    </div>
  </div>

  <!-- Settings body -->
  <div class="settings-content flex-1 p-8 text-white flex flex-col relative">
    <!-- Content shadow -->
    <div class="absolute left-0 top-0 h-full w-2 bg-gradient-to-r from-black/10 to-transparent pointer-events-none"></div>
    
    <h1 class="mb-6 text-4xl font-bold">Settings</h1>
    <h2 class="pt-4 mb-4 text-2xl border-t border-white/20 font-semibold">Account</h2>

    <div class="info space-y-6 flex-1">
      <!-- Username -->
      <div class="username flex items-center space-x-3">
        <label for="username" class="font-semibold w-20">Username:</label>
        <input 
          id="username" 
          type="text" 
          value="esponjinha123" 
          disabled
          readonly
          class="rounded-md bg-gray-300 px-3 py-2 text-gray-500 cursor-not-allowed opacity-60"
        />
        <span class="text-gray-400 text-sm">🔒</span>
      </div>
      
      <!-- Name -->
      <div class="name flex items-center space-x-3">
        <label for="name" class="font-semibold w-20">Name:</label>
        <input 
          id="name" 
          type="text" 
          value="Bob Esponja" 
          class="rounded-md bg-white px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
        />
        <button class="edit hover:text-blue-300 transition-colors duration-200" title="Edit">✎</button>
      </div>
      
      <!-- Email -->
      <div class="email flex items-center space-x-3">
        <label for="email" class="font-semibold w-20">Email:</label>
        <input 
          id="email" 
          type="email" 
          value="bobesponja@gmail.com" 
          class="rounded-md bg-white px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
        />
        <button class="edit hover:text-blue-300 transition-colors duration-200" title="Edit">✎</button>
      </div>
    </div>

    <!-- Save Button positioned at bottom right -->
    <div class="save flex justify-end mt-auto pt-6">
      <button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transform active:scale-85 transition-all duration-100">
        Save
      </button>
    </div>
  </div>
</div> `;
  },

  init() {
    console.log("Settings page loaded!");
  },
} as const;
