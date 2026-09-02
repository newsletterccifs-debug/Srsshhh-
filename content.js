/**
 * Birthday Celebration Website Configuration
 * Customize all details, questions, memories, and messages here!
 */

const BIRTHDAY_CONFIG = {
  // Birthday Star Personal Details
  celebrant: {
    name: "Shristii 🐘",
    nickname: "Our Shining Star 🐘",
    birthdayDate: "2026-11-01", // YYYY-MM-DD for countdown (November 1)
    age: "Fabulous & Ageless",   // e.g. "25", "Sweet 16", "30 & Thriving"
    title: "The Queen of Grace, Elegance & Joy 🐘",
    shortBio: "Radiating warmth, effortless charm, and brilliance—celebrating another magnificent year of life.",
    heroTagline: "An exclusive celebration curated with endless love and appreciation.",
  },

  // Security & Preview Lock Settings
  security: {
    lockUntilBirthday: true,        // Automatically unlocks on November 1st
    unlockPasscode: "shristii1101", // Passcode for Organizer / VIP early preview
    altPasscodes: ["1101", "shristii", "vip2026", "queen"], // Alternate accepted keys
  },

  // Audio & Soundtrack Settings
  audio: {
    bgmTitle: "Celebration Lo-Fi Jam",
    defaultMuted: false,
  },

  // Memories & Timeline Data (used in memories.html)
  timeline: [
    {
      year: "Chapter 1",
      title: "The Legend Begins",
      description: "Entered this world with boundless energy and a smile that could light up any room.",
      icon: "🌟",
      tag: "Origins"
    },
    {
      year: "Chapter 2",
      title: "Mastering the Art of Shenanigans",
      description: "Countless adventures, late-night laughs, questionable life decisions, and unforgettable memories.",
      icon: "🚀",
      tag: "Adventures"
    },
    {
      year: "Chapter 3",
      title: "Conquering New Horizons",
      description: "Achieving milestones, breaking records, and inspiring everyone around along the way.",
      icon: "🏆",
      tag: "Milestone"
    },
    {
      year: "Today",
      title: "Leveling Up Once Again!",
      description: "Another year wiser, bolder, more awesome, and ready to take on the world.",
      icon: "🎂",
      tag: "Birthday"
    }
  ],

  // Polaroid Memories Gallery
  photos: [
    {
      url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80",
      caption: "Spontaneous Roadtrips & Best Vibes ✨",
      date: "Golden Moments",
      rotation: -3
    },
    {
      url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80",
      caption: "Partying like there is no tomorrow 🎉",
      date: "Epic Night",
      rotation: 2
    },
    {
      url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80",
      caption: "Balloons, laughter, and zero regrets 🎈",
      date: "Unforgettable",
      rotation: -2
    },
    {
      url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop&q=80",
      caption: "Cakes, sweet treats, and pure joy 🍰",
      date: "Sweet Life",
      rotation: 4
    },
    {
      url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
      caption: "Festival lights & midnight dancing 🎶",
      date: "Magic Moments",
      rotation: -4
    },
    {
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80",
      caption: "To many more years of unforgettable laughs! 🥂",
      date: "Forever Friends",
      rotation: 1
    }
  ],

  // Cassette Mixtape Dedications (memories.html)
  mixtape: [
    { title: "Celebration Anthems (Side A)", duration: "3:45", dedication: "For dancing like nobody is watching" },
    { title: "Midnight Car Singalongs (Side A)", duration: "4:12", dedication: "Shouting chorus at top of our lungs" },
    { title: "Chill Sunday Memories (Side B)", duration: "3:20", dedication: "Lazy mornings, coffee & endless chats" },
    { title: "The 'Remember When?' Track (Side B)", duration: "5:00", dedication: "The inside jokes nobody else gets" }
  ],

  // Trivia Quiz Questions (used in arcade.html)
  quizQuestions: [
    {
      question: "What is the Birthday Star's ultimate superpower?",
      options: [
        "Finding the best snacks at 2 AM",
        "Lighting up any room with infectious laughter",
        "Making everyone around feel special & appreciated",
        "All of the above (obviously!)"
      ],
      correct: 3,
      explanation: "Too easy! Shristii is a multi-talented superhero in every sense of the word!"
    },
    {
      question: "If the Birthday Star were stranded on a desert island, what is the ONE thing they'd need?",
      options: [
        "An endless supply of coffee & boba",
        "A Bluetooth speaker playing throwback bops",
        "Wi-Fi to send memes to the group chat",
        "A comfy hammock and unlimited snacks"
      ],
      correct: 2,
      explanation: "Memes are essential for survival, and nobody curates them better!"
    },
    {
      question: "What is the official motto for this birthday year?",
      options: [
        "More adventures, less stress!",
        "Eat the extra slice of cake!",
        "Living life at maximum volume!",
        "All of the glorious above!"
      ],
      correct: 3,
      explanation: "Life is short, celebrate every single day like it's your birthday!"
    },
    {
      question: "What should everyone do for the Birthday Star today?",
      options: [
        "Shower them with compliments and high fives",
        "Grant all their wishes with zero arguments",
        "Treat them to their favorite food and drinks",
        "Crown them Birthday Royalty for the day"
      ],
      correct: 3,
      explanation: "All hail the Birthday Star! Today is your kingdom!"
    },
    {
      question: "What is the secret formula for Shristii's eternal charm?",
      options: [
        "100% pure kindness & heart of gold",
        "Unstoppable sense of humor",
        "Flawless main-character energy",
        "An unbeatable blend of all three"
      ],
      correct: 3,
      explanation: "That's why everybody loves having you in their lives!"
    }
  ],

  // Wheel of Birthday Fortune Coupons (arcade.html)
  wheelPrizes: [
    { text: "☕ 1 Free Coffee / Boba", color: "#FF6B6B" },
    { text: "🍕 Free Pizza Delivery", color: "#4ECDC4" },
    { text: "🛋️ Chores Exemption Pass", color: "#FFE66D" },
    { text: "🎬 Movie Night Pick", color: "#1A535C" },
    { text: "👑 Royalty Treatment (1 Day)", color: "#FF9F1C" },
    { text: "🍰 Unlimited Cake License", color: "#F72585" },
    { text: "🤗 100 Unlimited Hugs", color: "#7209B7" },
    { text: "✨ 1 Wildcard Free Wish", color: "#4361EE" }
  ],

  // Fortune Cookie & Wishing Jar Messages (arcade.html)
  fortunes: [
    "🌟 This year, the stars align to bring you unexpected breakthroughs, exciting adventures, and limitless joy!",
    "🎂 Warning: High probability of massive happiness, incredible cake, and great memories incoming.",
    "🚀 Your potential is infinite! Keep daring, keep dreaming, and never stop being your authentic awesome self.",
    "💖 The universe is plotting something wonderfully magical for your next chapter. Stay tuned!",
    "🍀 Luck is already knocking at your door—open it with your brightest smile.",
    "🎈 Life is too short for boring parties. Today, break all the fun records!",
    "🌈 You are loved more than words can say. May all your secret wishes quietly come true."
  ],

  // Starter Wishes for the Guestbook Pinboard (wishes.html)
  starterWishes: [
    {
      author: "Sam & Jordan",
      avatar: "🎉",
      badge: "Besties",
      color: "card-yellow",
      text: "Happy Birthday to the realest one! Thank you for always bringing the hype and being the sweetest friend. Let's make this year unforgettable!",
      date: "Today at 10:00 AM",
      likes: 12
    },
    {
      author: "Maya",
      avatar: "💖",
      badge: "Family",
      color: "card-pink",
      text: "Wishing you a year filled with big dreams coming true, endless smiles, and zero hangovers! So proud of everything you've accomplished!",
      date: "Today at 9:15 AM",
      likes: 8
    },
    {
      author: "The Squad 🚀",
      avatar: "⭐",
      badge: "Crew",
      color: "card-blue",
      text: "Another year hotter, smarter, and cooler! Drinks are on us this weekend. Cheers to leveling up! 🥂",
      date: "Today at 8:30 AM",
      likes: 19
    },
    {
      author: "Grandma & Grandpa",
      avatar: "🎂",
      badge: "Love",
      color: "card-green",
      text: "Happy Birthday our dearest sunshine! We love you to the moon and back. Keep shining bright like you always do!",
      date: "Today at 7:45 AM",
      likes: 15
    }
  ],

  // Surprise Unboxing Content (surprise.html)
  surprise: {
    letterTitle: "A Heartfelt Letter Just For You 💌",
    letterBody: `Dearest Shristii 🐘,

Today isn't just another ordinary day on the calendar—it's the anniversary of the world becoming a substantially brighter, kinder, and more hilarious place!

Through every high and every challenge, your warmth, positivity, and authenticity inspire everyone around you. Thank you for being someone we can always count on, laugh with till our stomachs hurt, and celebrate endlessly.

May this new year around the sun bring you vibrant health, wild success in everything you reach for, true peace of mind, and more reasons to dance than ever before.

Happy Birthday from the bottom of our hearts! ❤️`,
    coupons: [
      { code: "BDAY-ROYALTY", title: "VIP Royal Treatment", desc: "Redeemable for 1 full day of being treated like absolute royalty with zero complaints." },
      { code: "BDAY-FEAST", title: "Favorite Feast on the House", desc: "Valid for dinner anywhere your heart desires, dessert included." },
      { code: "BDAY-ADVENTURE", title: "Spontaneous Day Out", desc: "An all-expenses-paid adventure of your choosing!" },
      { code: "BDAY-HUGS", title: "Lifetime Hugs & Support", desc: "No expiration date. Infinite uses whenever needed." }
    ]
  }
};

// Expose globally
if (typeof window !== 'undefined') {
  window.BIRTHDAY_CONFIG = BIRTHDAY_CONFIG;
}
