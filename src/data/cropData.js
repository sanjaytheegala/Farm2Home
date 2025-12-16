// cropData.js
// Comprehensive crop dictionary for South Indian edible crops
// Includes multilingual keywords and common misspellings for fuzzy matching

export const CROP_DICTIONARY = [
  {
    id: 'rice',
    name: 'Rice',
    image: 'https://cdn-icons-png.flaticon.com/512/2674/2674052.png',
    keywords: ['rice', 'paddy', 'vari', 'vadlu', 'biyyam', 'dhan', 'chawal', 'arisi', 'ric', 'pady', 'rise', 'ryce', 'padie', 'nellu', 'soru', 'akki', 'tandul', 'bhat']
  },
  {
    id: 'wheat',
    name: 'Wheat',
    image: 'https://cdn-icons-png.flaticon.com/512/2515/2515268.png',
    keywords: ['wheat', 'godhumalu', 'godhuma', 'gehun', 'godhumai', 'weat', 'whit', 'godhum', 'gehu']
  },
  {
    id: 'maize',
    name: 'Maize',
    image: 'https://cdn-icons-png.flaticon.com/512/2224/2224176.png',
    keywords: ['maize', 'corn', 'mokka jonna', 'mokkajonna', 'makka', 'cholam', 'makai', 'makka jola', 'maise', 'corn', 'makkajonna']
  },
  {
    id: 'jowar',
    name: 'Jowar',
    image: 'https://cdn-icons-png.flaticon.com/512/3050/3050283.png',
    keywords: ['jowar', 'jonna', 'sorghum', 'jola', 'cholam', 'jonnalu', 'joar', 'javar', 'jwar', 'jona', 'jwari']
  },
  {
    id: 'redgram',
    name: 'Red Gram',
    image: 'https://cdn-icons-png.flaticon.com/512/2153/2153788.png',
    keywords: ['redgram', 'red gram', 'pigeon pea', 'kandi', 'kandulu', 'tur', 'arhar', 'thuvarai', 'toor', 'redgam', 'kandi pappu', 'kandipappu', 'togari bele', 'tur dal']
  },
  {
    id: 'greengram',
    name: 'Green Gram',
    image: 'https://cdn-icons-png.flaticon.com/512/3050/3050430.png',
    keywords: ['greengram', 'green gram', 'moong', 'pesalu', 'pesara', 'mung', 'payaru', 'greengam', 'pesra', 'mong', 'pesarapappu', 'paasi payaru', 'pasi payaru']
  },
  {
    id: 'blackgram',
    name: 'Black Gram',
    image: 'https://cdn-icons-png.flaticon.com/512/2153/2153720.png',
    keywords: ['blackgram', 'black gram', 'urad', 'minapa', 'minumulu', 'minapapappu', 'ulundu', 'uradh', 'blackgam', 'minpa', 'minapappu', 'ulundhu']
  },
  {
    id: 'bengalgram',
    name: 'Bengal Gram',
    image: 'https://cdn-icons-png.flaticon.com/512/2153/2153834.png',
    keywords: ['bengalgram', 'bengal gram', 'chana', 'chickpea', 'senaga', 'sanagalu', 'kadalai', 'channa', 'cickpea', 'bengal', 'senagapappu', 'konda kadalai']
  },
  {
    id: 'tomato',
    name: 'Tomato',
    image: 'https://cdn-icons-png.flaticon.com/512/1202/1202125.png',
    keywords: ['tomato', 'tamata', 'tamatar', 'thakkali', 'tometo', 'tamato', 'tomto', 'tamto', 'tomatto', 'tamaatar']
  },
  {
    id: 'onion',
    name: 'Onion',
    image: 'https://cdn-icons-png.flaticon.com/512/2224/2224274.png',
    keywords: ['onion', 'nirulli', 'ulli', 'ullipaya', 'pyaz', 'vengayam', 'onyon', 'onien', 'onon', 'ullipayalu', 'pyaaz', 'chinna vengayam', 'erulli', 'kanda']
  },
  {
    id: 'potato',
    name: 'Potato',
    image: 'https://cdn-icons-png.flaticon.com/512/2224/2224242.png',
    keywords: ['potato', 'bangaladumpa', 'aloo', 'urulaikizhangu', 'alu', 'batata', 'poteto', 'potatos', 'bangala dumpa', 'bangaladumpa', 'urulai']
  },
  {
    id: 'brinjal',
    name: 'Brinjal',
    image: 'https://cdn-icons-png.flaticon.com/512/2153/2153786.png',
    keywords: ['brinjal', 'eggplant', 'vankaya', 'vankayalu', 'baingan', 'kathirikai', 'bangan', 'vankay', 'brinjl', 'vankaya', 'begun', 'kathirikkai', 'kathiri', 'badanekayi', 'vangi']
  },
  {
    id: 'okra',
    name: 'Okra',
    image: 'https://cdn-icons-png.flaticon.com/512/2933/2933245.png',
    keywords: ['okra', 'ladyfinger', 'benda', 'bendakaya', 'bhindi', 'vendakkai', 'bendy', 'okara', 'ladiesfinger', 'bendakayalu', 'bhendi', 'vendai']
  },
  {
    id: 'chilli',
    name: 'Chilli',
    image: 'https://cdn-icons-png.flaticon.com/512/2276/2276931.png',
    keywords: ['chilli', 'chili', 'mirchi', 'mirapakaya', 'mirapakayalu', 'milagai', 'mirch', 'chilly', 'mirci', 'mirapakay', 'mirapaka', 'mirapa', 'menasinakayi', 'hirvi mirchi', 'green chilli']
  },
  {
    id: 'bottlegourd',
    name: 'Bottle Gourd',
    image: 'https://cdn-icons-png.flaticon.com/512/2515/2515356.png',
    keywords: ['bottlegourd', 'bottle gourd', 'lauki', 'sorakaya', 'sorakayalu', 'suraikai', 'ghiya', 'doodhi', 'botlegourd', 'sorakay', 'sorkai']
  },
  {
    id: 'drumstick',
    name: 'Drumstick',
    image: 'https://cdn-icons-png.flaticon.com/512/2515/2515302.png',
    keywords: ['drumstick', 'moringa', 'munaga', 'munagaku', 'munagakaya', 'sahjan', 'murungakkai', 'drumstik', 'munaga kaya', 'saijan', 'murungai']
  },
  {
    id: 'mango',
    name: 'Mango',
    image: 'https://cdn-icons-png.flaticon.com/512/590/590685.png',
    keywords: ['mango', 'mamidi', 'mamidikaya', 'aam', 'mangai', 'manga', 'mago', 'mangoe', 'mamidi pandu', 'mamidipandu', 'maangai', 'mambalam', 'mavina hannu', 'amba', 'hapus']
  },
  {
    id: 'banana',
    name: 'Banana',
    image: 'https://cdn-icons-png.flaticon.com/512/2224/2224287.png',
    keywords: ['banana', 'arati', 'aratipandu', 'kela', 'vazhai', 'bananna', 'banan', 'bananna', 'arati pandu', 'vaazhai', 'vazhai pazham']
  },
  {
    id: 'coconut',
    name: 'Coconut',
    image: 'https://cdn-icons-png.flaticon.com/512/2224/2224290.png',
    keywords: ['coconut', 'kobbari', 'kobbarikaya', 'nariyal', 'thengai', 'kokanut', 'coconat', 'kobbari kaya', 'kobari', 'tengai', 'tenkai', 'thenginakayi', 'naral']
  },
  {
    id: 'lemon',
    name: 'Lemon',
    image: 'https://cdn-icons-png.flaticon.com/512/2224/2224268.png',
    keywords: ['lemon', 'nimma', 'nimmakaya', 'nimbu', 'elumichai', 'lemon', 'lemmon', 'nimmakay', 'nimbu', 'elumichai']
  },
  {
    id: 'turmeric',
    name: 'Turmeric',
    image: 'https://cdn-icons-png.flaticon.com/512/3050/3050274.png',
    keywords: ['turmeric', 'pasupu', 'haldi', 'manjal', 'turmeric', 'termeric', 'tumeric', 'haldhi', 'paspu', 'manjal']
  },
  {
    id: 'garlic',
    name: 'Garlic',
    image: 'https://cdn-icons-png.flaticon.com/512/3143/3143645.png',
    keywords: ['garlic', 'vellulli', 'vellulipaya', 'lahsun', 'poondu', 'garlik', 'garlick', 'velluli', 'lasun', 'vellulli paya']
  },
  {
    id: 'ginger',
    name: 'Ginger',
    image: 'https://cdn-icons-png.flaticon.com/512/2276/2276919.png',
    keywords: ['ginger', 'allam', 'adrak', 'inji', 'gingar', 'ginjr', 'ginjer', 'alam', 'adarak', 'inji']
  },
  {
    id: 'ragi',
    name: 'Ragi',
    image: 'https://cdn-icons-png.flaticon.com/512/3050/3050345.png',
    keywords: ['ragi', 'finger millet', 'ragulu', 'nachni', 'kelvaragu', 'keppai', 'raagi', 'rgi']
  },
  {
    id: 'bajra',
    name: 'Bajra',
    image: 'https://cdn-icons-png.flaticon.com/512/2515/2515301.png',
    keywords: ['bajra', 'pearl millet', 'sajjalu', 'bajri', 'kambu', 'bajara']
  },
  {
    id: 'snakegourd',
    name: 'Snake Gourd',
    image: 'https://cdn-icons-png.flaticon.com/512/2515/2515348.png',
    keywords: ['snake gourd', 'snakegourd', 'potlakaya', 'chichinda', 'pudalangai', 'pudal', 'potla kaya']
  },
  {
    id: 'tamarind',
    name: 'Tamarind',
    image: 'https://cdn-icons-png.flaticon.com/512/2515/2515327.png',
    keywords: ['tamarind', 'chintapandu', 'imli', 'puli', 'chintha', 'imalee', 'tamrind']
  },
  // Premium Spices - High Value Commercial Crops
  {
    id: 'pepper',
    name: 'Black Pepper',
    image: 'https://cdn-icons-png.flaticon.com/512/2553/2553691.png',
    keywords: ['pepper', 'black pepper', 'miriyalu', 'kurumulaku', 'kali mirch', 'miryalu', 'karu mulaku', 'kalimirch']
  },
  {
    id: 'cardamom',
    name: 'Cardamom',
    image: 'https://cdn-icons-png.flaticon.com/512/2276/2276940.png',
    keywords: ['cardamom', 'elakkai', 'yelakulu', 'elakka', 'ilaichi', 'elachi', 'elaichi', 'yelakki']
  },
  {
    id: 'clove',
    name: 'Clove',
    image: 'https://cdn-icons-png.flaticon.com/512/2276/2276906.png',
    keywords: ['clove', 'lavangam', 'grambu', 'laung', 'lavang', 'grampu', 'long']
  },
  {
    id: 'cinnamon',
    name: 'Cinnamon',
    image: 'https://cdn-icons-png.flaticon.com/512/2553/2553664.png',
    keywords: ['cinnamon', 'dalchina chekka', 'karuvapatta', 'dalchini', 'dalchini chekka', 'karuvappatta', 'dalcheeni']
  },
  // Commercial Tubers & Vegetables - Daily Use
  {
    id: 'tapioca',
    name: 'Tapioca',
    image: 'https://cdn-icons-png.flaticon.com/512/2515/2515293.png',
    keywords: ['tapioca', 'cassava', 'kappa', 'maracheeni', 'karra pendalam', 'maravalli kizhangu', 'mara cheeni', 'kapakizhangu']
  },
  {
    id: 'yam',
    name: 'Elephant Foot Yam',
    image: 'https://cdn-icons-png.flaticon.com/512/2224/2224243.png',
    keywords: ['elephant foot yam', 'yam', 'suran', 'kanda', 'chena', 'jimikand', 'senai kizhangu', 'chenaikilangu', 'kandagadda']
  },
  {
    id: 'ash_gourd',
    name: 'Ash Gourd',
    image: 'https://cdn-icons-png.flaticon.com/512/2515/2515354.png',
    keywords: ['ash gourd', 'winter melon', 'kumbalanga', 'boodida gummidi', 'petha', 'poosanikai', 'gummadikaya', 'petha kaddu']
  },
  // Special Fruits - Commercial Grade
  {
    id: 'nendran_banana',
    name: 'Nendran Banana',
    image: 'https://cdn-icons-png.flaticon.com/512/2909/2909761.png',
    keywords: ['nendran', 'kerala banana', 'ethapazham', 'chengalikodan', 'nendra pazham', 'plantain', 'arati kaaya', 'kela']
  },
  {
    id: 'jackfruit',
    name: 'Jackfruit',
    image: 'https://cdn-icons-png.flaticon.com/512/2515/2515367.png',
    keywords: ['jackfruit', 'raw jackfruit', 'panasa', 'chakka', 'kathal', 'panasa pandu', 'palaa', 'phanas']
  },
  {
    id: 'pineapple',
    name: 'Pineapple',
    image: 'https://cdn-icons-png.flaticon.com/512/590/590779.png',
    keywords: ['pineapple', 'anasa', 'kaitha chakka', 'ananas', 'ananas pandu', 'annachi pazham', 'kayitha', 'ananas']
  },
  // Karnataka & Maharashtra Market Crops - High Value
  {
    id: 'grapes',
    name: 'Grapes',
    image: 'https://cdn-icons-png.flaticon.com/512/590/590800.png',
    keywords: ['grapes', 'draksha', 'drakshi', 'angoor', 'grape', 'drakshe', 'draaksh']
  },
  {
    id: 'orange',
    name: 'Orange',
    image: 'https://cdn-icons-png.flaticon.com/512/590/590746.png',
    keywords: ['orange', 'santra', 'nagpur orange', 'kithale', 'orangu', 'narangi', 'santhra']
  },
  {
    id: 'pomegranate',
    name: 'Pomegranate',
    image: 'https://cdn-icons-png.flaticon.com/512/590/590772.png',
    keywords: ['pomegranate', 'danimma', 'dalimb', 'dalimbe', 'anar', 'pomgranate', 'daalimb', 'anaar']
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    image: 'https://cdn-icons-png.flaticon.com/512/590/590763.png',
    keywords: ['strawberry', 'mahabaleshwar strawberry', 'strawbery', 'strawberi']
  },
  {
    id: 'coffee',
    name: 'Coffee',
    image: 'https://cdn-icons-png.flaticon.com/512/2553/2553691.png',
    keywords: ['coffee', 'coffee beans', 'kaapi', 'kapi', 'coffe', 'koffee', 'arabica', 'robusta']
  },
  {
    id: 'methi',
    name: 'Methi',
    image: 'https://cdn-icons-png.flaticon.com/512/3050/3050285.png',
    keywords: ['methi', 'menthya', 'fenugreek', 'menthe soppu', 'venthayam', 'methi leaves']
  },
  {
    id: 'capsicum',
    name: 'Capsicum',
    image: 'https://cdn-icons-png.flaticon.com/512/2276/2276927.png',
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

// Get all crop names for autocomplete
export const getAllCropNames = () => {
  return CROP_DICTIONARY.map(crop => crop.name);
};

// Get all keywords for search
export const getAllKeywords = () => {
  return CROP_DICTIONARY.flatMap(crop => crop.keywords);
};
