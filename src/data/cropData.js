// cropData.js
// Comprehensive crop dictionary for South Indian edible crops
// Includes multilingual keywords and common misspellings for fuzzy matching
// Categories: grains-pulses, vegetables, fruits, spices, leafy-greens

export const CROP_DICTIONARY = [
  {
    id: 'rice',
    name: 'Rice',
    category: 'grains-pulses',
    image: '/images/crops/rice.jpg',
    keywords: ['rice', 'paddy', 'vari', 'vadlu', 'biyyam', 'dhan', 'chawal', 'arisi', 'ric', 'pady', 'rise', 'ryce', 'padie', 'nellu', 'soru', 'akki', 'tandul', 'bhat']
  },
  {
    id: 'wheat',
    name: 'Wheat',
    category: 'grains-pulses',
    image: '/images/crops/wheat.jpg',
    keywords: ['wheat', 'godhumalu', 'godhuma', 'gehun', 'godhumai', 'weat', 'whit', 'godhum', 'gehu']
  },
  {
    id: 'maize',
    name: 'Maize',
    category: 'grains-pulses',
    image: '/images/crops/maize.jpg',
    keywords: ['maize', 'corn', 'mokka jonna', 'mokkajonna', 'makka', 'cholam', 'makai', 'makka jola', 'maise', 'corn', 'makkajonna']
  },
  {
    id: 'jowar',
    name: 'Jowar',
    category: 'grains-pulses',
    image: '/images/crops/jowar.jpg',
    keywords: ['jowar', 'jonna', 'sorghum', 'jola', 'cholam', 'jonnalu', 'joar', 'javar', 'jwar', 'jona', 'jwari']
  },
  {
    id: 'redgram',
    name: 'Red Gram',
    category: 'grains-pulses',
    image: '/images/crops/red gram.jpg',
    keywords: ['redgram', 'red gram', 'pigeon pea', 'kandi', 'kandulu', 'tur', 'arhar', 'thuvarai', 'toor', 'redgam', 'kandi pappu', 'kandipappu', 'togari bele', 'tur dal']
  },
  {
    id: 'greengram',
    name: 'Green Gram',
    category: 'grains-pulses',
    image: '/images/crops/Green Gram.jpg',
    keywords: ['greengram', 'green gram', 'moong', 'pesalu', 'pesara', 'mung', 'payaru', 'greengam', 'pesra', 'mong', 'pesarapappu', 'paasi payaru', 'pasi payaru']
  },
  {
    id: 'blackgram',
    name: 'Black Gram',
    category: 'grains-pulses',
    image: '/images/crops/Black Gram.jpg',
    keywords: ['blackgram', 'black gram', 'urad', 'minapa', 'minumulu', 'minapapappu', 'ulundu', 'uradh', 'blackgam', 'minpa', 'minapappu', 'ulundhu']
  },
  {
    id: 'bengalgram',
    name: 'Bengal Gram',
    category: 'grains-pulses',
    image: '/images/crops/chana.jpg',
    keywords: ['bengalgram', 'bengal gram', 'chana', 'chickpea', 'senaga', 'sanagalu', 'kadalai', 'channa', 'cickpea', 'bengal', 'senagapappu', 'konda kadalai']
  },
  {
    id: 'tomato',
    name: 'Tomato',
    category: 'vegetables',
    image: '/images/vegetables/tomato.jpg',
    keywords: ['tomato', 'tamata', 'tamatar', 'thakkali', 'tometo', 'tamato', 'tomto', 'tamto', 'tomatto', 'tamaatar']
  },
  {
    id: 'onion',
    name: 'Onion',
    category: 'vegetables',
    image: '/images/vegetables/onion.jpg',
    keywords: ['onion', 'nirulli', 'ulli', 'ullipaya', 'pyaz', 'vengayam', 'onyon', 'onien', 'onon', 'ullipayalu', 'pyaaz', 'chinna vengayam', 'erulli', 'kanda']
  },
  {
    id: 'potato',
    name: 'Potato',
    category: 'vegetables',
    image: '/images/vegetables/potato.jpg',
    keywords: ['potato', 'bangaladumpa', 'aloo', 'urulaikizhangu', 'alu', 'batata', 'poteto', 'potatos', 'bangala dumpa', 'bangaladumpa', 'urulai']
  },
  {
    id: 'brinjal',
    name: 'Brinjal',
    category: 'vegetables',
    image: '/images/vegetables/brinjal.jpg',
    keywords: ['brinjal', 'eggplant', 'vankaya', 'vankayalu', 'baingan', 'kathirikai', 'bangan', 'vankay', 'brinjl', 'vankaya', 'begun', 'kathirikkai', 'kathiri', 'badanekayi', 'vangi']
  },
  {
    id: 'okra',
    name: 'Okra',
    category: 'vegetables',
    image: '/images/vegetables/okra.jpg',
    keywords: ['okra', 'ladyfinger', 'benda', 'bendakaya', 'bhindi', 'vendakkai', 'bendy', 'okara', 'ladiesfinger', 'bendakayalu', 'bhendi', 'vendai']
  },
  {
    id: 'chilli',
    name: 'Chilli',
    category: 'spices',
    image: '/images/vegetables/Green Chillies.jpg',
    keywords: ['chilli', 'chili', 'mirchi', 'mirapakaya', 'mirapakayalu', 'milagai', 'mirch', 'chilly', 'mirci', 'mirapakay', 'mirapaka', 'mirapa', 'menasinakayi', 'hirvi mirchi', 'green chilli']
  },
  {
    id: 'bottlegourd',
    name: 'Bottle Gourd',
    category: 'vegetables',
    image: '/images/vegetables/bottle gaurd.jpg',
    keywords: ['bottlegourd', 'bottle gourd', 'lauki', 'sorakaya', 'sorakayalu', 'suraikai', 'ghiya', 'doodhi', 'botlegourd', 'sorakay', 'sorkai']
  },
  {
    id: 'drumstick',
    name: 'Drumstick',
    category: 'vegetables',
    image: '/images/default_crop.jpg',
    keywords: ['drumstick', 'moringa', 'munaga', 'munagaku', 'munagakaya', 'sahjan', 'murungakkai', 'drumstik', 'munaga kaya', 'saijan', 'murungai']
  },
  {
    id: 'mango',
    name: 'Mango',
    category: 'fruits',
    image: '/images/fruits/Mango.jpg',
    keywords: ['mango', 'mamidi', 'mamidikaya', 'aam', 'mangai', 'manga', 'mago', 'mangoe', 'mamidi pandu', 'mamidipandu', 'maangai', 'mambalam', 'mavina hannu', 'amba', 'hapus']
  },
  {
    id: 'banana',
    name: 'Banana',
    category: 'fruits',
    image: '/images/fruits/Banana.jpg',
    keywords: ['banana', 'arati', 'aratipandu', 'kela', 'vazhai', 'bananna', 'banan', 'bananna', 'arati pandu', 'vaazhai', 'vazhai pazham']
  },
  {
    id: 'coconut',
    name: 'Coconut',
    category: 'fruits',
    image: '/images/fruits/coconuts.jpg',
    keywords: ['coconut', 'kobbari', 'kobbarikaya', 'nariyal', 'thengai', 'kokanut', 'coconat', 'kobbari kaya', 'kobari', 'tengai', 'tenkai', 'thenginakayi', 'naral']
  },
  {
    id: 'lemon',
    name: 'Lemon',
    category: 'fruits',
    image: '/images/fruits/Lemon.jpg',
    keywords: ['lemon', 'nimma', 'nimmakaya', 'nimbu', 'elumichai', 'lemon', 'lemmon', 'nimmakay', 'nimbu', 'elumichai']
  },
  {
    id: 'turmeric',
    name: 'Turmeric',
    category: 'spices',
    image: '/images/vegetables/turmeric.jpg',
    keywords: ['turmeric', 'pasupu', 'haldi', 'manjal', 'turmeric', 'termeric', 'tumeric', 'haldhi', 'paspu', 'manjal']
  },
  {
    id: 'garlic',
    name: 'Garlic',
    category: 'spices',
    image: '/images/vegetables/Garlic.jpg',
    keywords: ['garlic', 'vellulli', 'vellulipaya', 'lahsun', 'poondu', 'garlik', 'garlick', 'velluli', 'lasun', 'vellulli paya']
  },
  {
    id: 'ginger',
    name: 'Ginger',
    category: 'spices',
    image: '/images/vegetables/ginger.jpg',
    keywords: ['ginger', 'allam', 'adrak', 'inji', 'gingar', 'ginjr', 'ginjer', 'alam', 'adarak', 'inji']
  },
  {
    id: 'ragi',
    name: 'Ragi',
    category: 'grains-pulses',
    image: '/images/crops/ragi.jpg',
    keywords: ['ragi', 'finger millet', 'ragulu', 'nachni', 'kelvaragu', 'keppai', 'raagi', 'rgi']
  },
  {
    id: 'bajra',
    name: 'Bajra',
    category: 'grains-pulses',
    image: '/images/default_crop.jpg',
    keywords: ['bajra', 'pearl millet', 'sajjalu', 'bajri', 'kambu', 'bajara']
  },
  {
    id: 'snakegourd',
    name: 'Snake Gourd',
    category: 'vegetables',
    image: '/images/vegetables/snake gaurd.jpg',
    keywords: ['snake gourd', 'snakegourd', 'potlakaya', 'chichinda', 'pudalangai', 'pudal', 'potla kaya']
  },
  {
    id: 'tamarind',
    name: 'Tamarind',
    category: 'spices',
    image: '/images/vegetables/Tamarind.jpg',
    keywords: ['tamarind', 'chintapandu', 'imli', 'puli', 'chintha', 'imalee', 'tamrind']
  },
  // Premium Spices - High Value Commercial Crops
  {
    id: 'pepper',
    name: 'Black Pepper',
    category: 'spices',
    image: '/images/default_crop.jpg',
    keywords: ['pepper', 'black pepper', 'miriyalu', 'kurumulaku', 'kali mirch', 'miryalu', 'karu mulaku', 'kalimirch']
  },
  {
    id: 'cardamom',
    name: 'Cardamom',
    category: 'spices',
    image: '/images/spices/ilachi.jpg',
    keywords: ['cardamom', 'elakkai', 'yelakulu', 'elakka', 'ilaichi', 'elachi', 'elaichi', 'yelakki']
  },
  {
    id: 'clove',
    name: 'Clove',
    category: 'spices',
    image: '/images/spices/cloves.jpg',
    keywords: ['clove', 'lavangam', 'grambu', 'laung', 'lavang', 'grampu', 'long']
  },
  {
    id: 'cinnamon',
    name: 'Cinnamon',
    category: 'spices',
    image: '/images/spices/cinnamon.jpg',
    keywords: ['cinnamon', 'dalchina chekka', 'karuvapatta', 'dalchini', 'dalchini chekka', 'karuvappatta', 'dalcheeni']
  },
  // Commercial Tubers & Vegetables - Daily Use
  {
    id: 'tapioca',
    name: 'Tapioca',
    category: 'vegetables',
    image: '/images/default_crop.jpg',
    keywords: ['tapioca', 'cassava', 'kappa', 'maracheeni', 'karra pendalam', 'maravalli kizhangu', 'mara cheeni', 'kapakizhangu']
  },
  {
    id: 'yam',
    name: 'Elephant Foot Yam',
    category: 'vegetables',
    image: '/images/default_crop.jpg',
    keywords: ['elephant foot yam', 'yam', 'suran', 'kanda', 'chena', 'jimikand', 'senai kizhangu', 'chenaikilangu', 'kandagadda']
  },
  {
    id: 'ash_gourd',
    name: 'Ash Gourd',
    category: 'vegetables',
    image: '/images/default_crop.jpg',
    keywords: ['ash gourd', 'winter melon', 'kumbalanga', 'boodida gummidi', 'petha', 'poosanikai', 'gummadikaya', 'petha kaddu']
  },
  // Special Fruits - Commercial Grade
  {
    id: 'nendran_banana',
    name: 'Nendran Banana',
    category: 'fruits',
    image: '/images/fruits/Banana.jpg',
    keywords: ['nendran', 'kerala banana', 'ethapazham', 'chengalikodan', 'nendra pazham', 'plantain', 'arati kaaya', 'kela']
  },
  {
    id: 'jackfruit',
    name: 'Jackfruit',
    category: 'fruits',
    image: '/images/fruits/jack fruit.jpg',
    keywords: ['jackfruit', 'raw jackfruit', 'panasa', 'chakka', 'kathal', 'panasa pandu', 'palaa', 'phanas']
  },
  {
    id: 'pineapple',
    name: 'Pineapple',
    category: 'fruits',
    image: '/images/fruits/Pineapple.jpg',
    keywords: ['pineapple', 'anasa', 'kaitha chakka', 'ananas', 'ananas pandu', 'annachi pazham', 'kayitha', 'ananas']
  },
  // Karnataka Market Crops - High Value
  {
    id: 'grapes',
    name: 'Grapes',
    category: 'fruits',
    image: '/images/fruits/green grape.jpg',
    keywords: ['grapes', 'draksha', 'drakshi', 'angoor', 'grape', 'drakshe', 'draaksh']
  },
  {
    id: 'orange',
    name: 'Orange',
    category: 'fruits',
    image: '/images/default_crop.jpg',
    keywords: ['orange', 'santra', 'nagpur orange', 'kithale', 'orangu', 'narangi', 'santhra']
  },
  {
    id: 'pomegranate',
    name: 'Pomegranate',
    category: 'fruits',
    image: '/images/fruits/Promoganates.jpg',
    keywords: ['pomegranate', 'danimma', 'dalimb', 'dalimbe', 'anar', 'pomgranate', 'daalimb', 'anaar']
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    category: 'fruits',
    image: '/images/fruits/strawberries.jpg',
    keywords: ['strawberry', 'mahabaleshwar strawberry', 'strawbery', 'strawberi']
  },
  {
    id: 'coffee',
    name: 'Coffee',
    category: 'spices',
    image: '/images/default_crop.jpg',
    keywords: ['coffee', 'coffee beans', 'kaapi', 'kapi', 'coffe', 'koffee', 'arabica', 'robusta']
  },
  {
    id: 'methi',
    name: 'Methi',
    category: 'leafy-greens',
    image: '/images/vegetables/fenugreek leaves.jpg',
    keywords: ['methi', 'menthya', 'fenugreek', 'menthe soppu', 'venthayam', 'methi leaves']
  },
  {
    id: 'capsicum',
    name: 'Capsicum',
    category: 'vegetables',
    image: '/images/vegetables/capsicum.jpg',
    keywords: ['capsicum', 'shimla mirch', 'donna menasinakayi', 'bell pepper', 'shimla mirchi', 'capsicam', 'capsikam']
  }
];

// Helper function to find crop by keyword (case-insensitive)
export const findCropByKeyword = (keyword) => {
  const lowerKeyword = keyword.toLowerCase().trim();
  return CROP_DICTIONARY.find(crop => 
    crop.keywords.some(kw => kw.toLowerCase() === lowerKeyword)
  );
};

// Get crop category by crop name
export const getCropCategory = (cropName) => {
  if (!cropName) return null;
  const lower = cropName.toLowerCase().trim();
  const match = CROP_DICTIONARY.find(c =>
    c.name.toLowerCase() === lower ||
    c.keywords.some(k => k.toLowerCase() === lower)
  );
  return match ? match.category : null;
};

// Get all crop names for autocomplete
export const getAllCropNames = () => {
  return CROP_DICTIONARY.map(crop => crop.name);
};

// Get all keywords for search
export const getAllKeywords = () => {
  return CROP_DICTIONARY.flatMap(crop => crop.keywords);
};