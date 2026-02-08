const WORD_LIST = [
  "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", "absurd", "abuse",
  "access", "accident", "account", "accuse", "achieve", "acid", "acoustic", "acquire", "across", "action",
  "actor", "actress", "actual", "adapt", "addict", "address", "adjust", "admit", "adult", "advance",
  "advice", "aerobic", "affair", "afford", "afraid", "again", "agent", "agree", "ahead", "airline",
  "airport", "alarm", "album", "alcohol", "alert", "alien", "allow", "almost", "alone", "alpha",
  "already", "also", "alter", "always", "amateur", "amazing", "among", "amount", "amused", "analyst",
  "anchor", "ancient", "anger", "angle", "angry", "animal", "ankle", "announce", "annual", "another",
  "answer", "antenna", "antique", "anxiety", "apart", "apology", "appear", "apple", "approve", "april",
  "arch", "arctic", "arena", "argue", "armor", "army", "around", "arrange", "arrest", "arrive",
  "arrow", "artist", "artwork", "aspect", "assault", "asset", "assist", "assume", "asthma", "athlete",
  "atom", "attack", "attend", "attitude", "attract", "auction", "audit", "august", "aunt", "author",
  "auto", "autumn", "average", "avocado", "avoid", "awake", "aware", "away", "awesome", "awful",
  "awkward", "axis", "baby", "bachelor", "bacon", "badge", "balance", "balcony", "ball", "bamboo",
  "banana", "banner", "barrel", "base", "basic", "basket", "battle", "beach", "bean", "beauty",
  "become", "beef", "before", "begin", "behave", "behind", "believe", "below", "belt", "bench",
  "benefit", "best", "betray", "better", "between", "beyond", "bicycle", "bind", "biology", "bird",
  "birth", "bitter", "black", "blade", "blame", "blanket", "blast", "bleak", "bless", "blind",
  "blood", "blossom", "blouse", "blue", "blur", "blush", "board", "boat", "body", "boil",
  "bomb", "bone", "bonus", "book", "boost", "border", "boring", "borrow", "boss", "bottom",
  "bounce", "bowl", "boxer", "bracket", "brain", "brand", "brass", "brave", "bread", "breeze",
  "brick", "bridge", "brief", "bright", "bring", "brisk", "broccoli", "broken", "bronze", "broom",
  "brother", "brown", "brush", "bubble", "buddy", "budget", "buffalo", "build", "bulb", "bulk",
  "bullet", "bundle", "bunker", "burden", "burger", "burst", "business", "busy", "butter", "buyer",
  "buzz", "cabbage", "cabin", "cable", "cactus", "cage", "cake", "call", "calm", "camera",
  "camp", "canal", "cancel", "candy", "cannon", "canoe", "canvas", "canyon", "capable", "capital",
  "captain", "carbon", "card", "cargo", "carpet", "carry", "cart", "case", "cash", "casino",
  "castle", "casual", "catalog", "catch", "category", "cattle", "caught", "cause", "caution", "cave",
  "ceiling", "celery", "cement", "census", "century", "cereal", "certain", "chair", "chalk", "champion",
  "change", "chaos", "chapter", "charge", "chase", "chat", "cheap", "check", "cheese", "chef",
  "cherry", "chest", "chicken", "chief", "child", "chimney", "choice", "choose", "chronic", "chuckle",
  "chunk", "churn", "cigar", "cinnamon", "circle", "citizen", "city", "civil", "claim", "clap",
  "clarify", "claw", "clay", "clean", "clerk", "clever", "click", "client", "cliff", "climb",
  "clinic", "clip", "clock", "clog", "close", "cloth", "cloud", "clown", "club", "clump",
  "cluster", "clutch", "coach", "coast", "coconut", "code", "coffee", "coil", "coin", "collect",
  "color", "column", "combine", "come", "comfort", "comic", "common", "company", "concert", "conduct",
  "confirm", "congress", "connect", "consider", "control", "convince", "cook", "cool", "copper", "copy",
  "coral", "core", "corn", "correct", "cost", "cotton", "couch", "country", "couple", "course",
  "cousin", "cover", "coyote", "crack", "cradle", "craft", "crane", "crash", "crater", "crawl",
  "crazy", "cream", "credit", "creek", "crew", "cricket", "crime", "crisp", "critic", "crop",
  "cross", "crouch", "crowd", "crucial", "cruel", "cruise", "crumble", "crunch", "crush", "crystal",
  "cube", "culture", "cupboard", "curious", "current", "curtain", "curve", "cushion", "custom", "cute",
  "cycle", "damage", "damp", "dance", "danger", "daring", "dash", "daughter", "dawn", "debate",
  "debris", "decade", "december", "decide", "decline", "decorate", "decrease", "deer", "defense", "define",
  "defy", "degree", "delay", "deliver", "demand", "demise", "denial", "dentist", "deny", "depart",
  "depend", "deposit", "depth", "deputy", "derive", "describe", "desert", "design", "desk", "despair",
  "destroy", "detail", "detect", "develop", "device", "devote", "diagram", "dial", "diamond", "diary",
  "dice", "diesel", "diet", "differ", "digital", "dignity", "dilemma", "dinner", "dinosaur", "direct",
  "dirt", "disagree", "discover", "disease", "dish", "dismiss", "disorder", "display", "distance", "divert",
  "divide", "divorce", "dizzy", "doctor", "document", "dodge", "dollar", "dolphin", "domain", "donate",
  "donkey", "donor", "door", "dose", "double", "dove", "draft", "dragon", "drama", "drastic",
  "draw", "dream", "dress", "drift", "drill", "drink", "drip", "drive", "drop", "drum",
  "drunk", "dumb", "dune", "during", "dust", "dutch", "duty", "dwarf", "dynamic", "eager",
  "eagle", "early", "earn", "earth", "easily", "east", "easy", "echo", "ecology", "economy",
  "edge", "edit", "educate", "effort", "eight", "either", "elbow", "elder", "electric", "elegant",
  "element", "elephant", "elevator", "elite", "else", "embark", "embody", "embrace", "emerge", "emotion",
  "employ", "empower", "empty", "enable", "enact", "endorse", "enemy", "energy", "enforce", "engage",
  "engine", "enhance", "enjoy", "enlist", "enough", "enrich", "enroll", "ensure", "enter", "entire",
  "entry", "envelope", "episode", "equal", "equip", "erase", "erode", "erosion", "error", "erupt",
  "escape", "essay", "essence", "estate", "eternal", "ethics", "evidence", "evil", "evoke", "evolve",
  "exact", "example", "excess", "exchange", "excite", "exclude", "excuse", "execute", "exercise", "exhaust",
  "exhibit", "exile", "exist", "exit", "exotic", "expand", "expect", "expire", "explain", "expose",
  "express", "extend", "extra", "eyebrow", "fabric", "face", "faculty", "fade", "faint", "faith",
  "fall", "false", "fame", "family", "famous", "fancy", "fantasy", "farm", "fashion", "fatal",
  "father", "fatigue", "fault", "favorite", "feature", "february", "federal", "feel", "female", "fence",
  "festival", "fetch", "fever", "fiber", "fiction", "field", "figure", "file", "film", "filter",
  "final", "find", "fine", "finger", "finish", "fire", "firm", "first", "fiscal", "fish",
  "fitness", "flag", "flame", "flash", "flat", "flavor", "flee", "flight", "flip", "float",
  "flock", "floor", "flower", "fluid", "flush", "focus", "foam", "fold", "follow", "food",
  "foot", "force", "forest", "forget", "fork", "fortune", "forum", "forward", "fossil", "foster",
  "found", "fountain", "fourth", "frame", "frequent", "fresh", "friend", "fringe", "frog", "front",
  "frost", "frown", "frozen", "fruit", "fuel", "function", "funny", "furnace", "fury", "future",
  "gadget", "gain", "galaxy", "gallery", "game", "gamma", "garage", "garbage", "garden", "garlic",
  "garment", "gather", "gauge", "gaze", "general", "genius", "genre", "gentle", "genuine", "gesture",
  "ghost", "giant", "gift", "giggle", "ginger", "giraffe", "girl", "give", "glad", "glance",
  "glare", "glass", "glide", "glimpse", "globe", "gloom", "glory", "glove", "glow", "glue",
  "goat", "goddess", "gold", "good", "goose", "gorilla", "gospel", "gossip", "govern", "gown",
  "grab", "grace", "grain", "grant", "grape", "grass", "gravity", "great", "green", "grid",
  "grief", "grit", "grocery", "group", "grow", "grunt", "guard", "guess", "guide", "guilt",
  "guitar", "gust", "habit", "hair", "half", "hammer", "hamster", "hand", "happy", "harbor",
  "hard", "harsh", "harvest", "hate", "have", "hawk", "hazard", "head", "health", "heart",
  "heavy", "hedgehog", "height", "hello", "helmet", "help", "hero", "hidden", "high", "hill",
  "hint", "hire", "history", "hobby", "hockey", "hold", "hole", "holiday", "hollow", "home",
  "honey", "hood", "hope", "horn", "horror", "horse", "hospital", "host", "hotel", "hour",
  "hover", "huge", "human", "humble", "humor", "hundred", "hungry", "hunt", "hurdle", "hurry",
  "husband", "hybrid", "icon", "idea", "identify", "idle", "ignore", "illegal", "illness", "image",
  "imitate", "immense", "immune", "impact", "impose", "improve", "impulse", "inch", "include", "income",
  "increase", "index", "indicate", "indoor", "industry", "infant", "inflict", "inform", "inhale", "inherit",
  "initial", "inject", "injury", "inmate", "inner", "innocent", "input", "inquiry", "insane", "insect",
  "inside", "inspire", "install", "intact", "interest", "into", "invest", "invite", "involve", "iron",
  "island", "isolate", "issue", "item", "ivory", "jacket", "jaguar", "january", "japan", "jealous",
  "jeans", "jelly", "jewel", "join", "joke", "journey", "judge", "juice", "july", "jump",
  "june", "jungle", "junior", "junk", "just", "kangaroo", "keen", "keep", "ketchup", "kick",
  "kidney", "kind", "kingdom", "kiss", "kitchen", "kite", "kitten", "kiwi", "knee", "knife",
  "knock", "know", "label", "labor", "ladder", "lady", "lake", "lamp", "language", "laptop",
  "large", "later", "latin", "laugh", "laundry", "lava", "lawn", "lawsuit", "layer", "lazy",
  "leader", "leaf", "learn", "leave", "lecture", "left", "legal", "legend", "leisure", "lemon",
  "lend", "length", "lens", "leopard", "lesson", "letter", "level", "liar", "liberty", "library",
  "license", "life", "lift", "light", "limit", "link", "lion", "liquid", "list", "little",
  "live", "lizard", "load", "loan", "lobster", "local", "lock", "logic", "lonely", "long",
  "loop", "lottery", "loud", "lounge", "love", "loyal", "lucky", "luggage", "lumber", "lunar",
  "lunch", "luxury", "lyrics", "machine", "mad", "magic", "magnet", "maid", "mail", "main",
  "major", "make", "mammal", "manage", "mandate", "mango", "mansion", "manual", "maple", "marble",
  "march", "margin", "marine", "market", "marriage", "mask", "mass", "master", "match", "material",
  "math", "matrix", "matter", "maximum", "maze", "meadow", "mean", "measure", "meat", "mechanic",
  "medal", "media", "melody", "melt", "member", "memory", "mention", "menu", "mercy", "merge",
  "merit", "merry", "mesh", "message", "metal", "method", "middle", "midnight", "milk", "million",
  "mimic", "mind", "minimum", "minor", "minute", "miracle", "mirror", "misery", "miss", "mistake",
  "mix", "mixed", "mixture", "mobile", "model", "modify", "moment", "monitor", "monkey", "monster",
  "month", "moon", "moral", "more", "morning", "mosquito", "mother", "motion", "motor", "mountain",
  "mouse", "move", "movie", "much", "muffin", "mule", "multiply", "muscle", "museum", "mushroom",
  "music", "must", "mutual", "myself", "mystery", "myth", "naive", "name", "napkin", "narrow",
  "nasty", "nation", "nature", "near", "neck", "need", "negative", "neglect", "neither", "nephew",
  "nerve", "nest", "network", "neutral", "never", "news", "next", "nice", "night", "noble",
  "noise", "nominee", "noodle", "normal", "north", "nose", "notable", "note", "nothing", "notice",
  "novel", "november", "nuclear", "number", "nurse", "object", "oblige", "obscure", "observe", "obtain",
  "obvious", "occur", "ocean", "october", "odor", "offer", "office", "often", "olive", "olympic",
  "omit", "once", "onion", "online", "only", "open", "opera", "opinion", "oppose", "option",
  "orange", "orbit", "orchard", "order", "ordinary", "organ", "orient", "original", "orphan", "ostrich",
  "other", "outdoor", "outer", "output", "outside", "oval", "oven", "over", "owner", "oxygen",
  "oyster", "ozone", "pact", "paddle", "page", "pair", "palace", "palm", "panda", "panel",
  "panic", "panther", "paper", "parade", "parent", "park", "parrot", "party", "pass", "patch",
  "path", "patient", "patrol", "pattern", "pause", "pave", "payment", "peace", "peanut", "pear",
  "peasant", "pelican", "penalty", "pencil", "people", "pepper", "perfect", "permit", "person", "pet",
  "phone", "photo", "phrase", "physical", "piano", "picnic", "picture", "piece", "pilot", "pink",
  "pioneer", "pipe", "pistol", "pitch", "pizza", "place", "planet", "plastic", "plate", "play",
  "please", "pledge", "pluck", "plug", "plunge", "poem", "poet", "point", "polar", "pole",
  "police", "pond", "pony", "pool", "popular", "portion", "position", "possible", "post", "potato",
  "pottery", "poverty", "powder", "power", "practice", "praise", "predict", "prefer", "prepare", "present",
  "pretty", "prevent", "price", "pride", "primary", "print", "priority", "prison", "private", "prize",
  "problem", "process", "produce", "profit", "program", "project", "promote", "proof", "property", "prosper",
  "protect", "proud", "provide", "public", "pudding", "pull", "pulp", "pulse", "pumpkin", "punch",
  "pupil", "puppy", "purchase", "purity", "purpose", "purse", "push", "puzzle", "pyramid", "quality",
  "quantum", "quarter", "question", "quick", "quit", "quiz", "quote", "rabbit", "raccoon", "race",
  "rack", "radar", "radio", "rail", "rain", "raise", "rally", "ramp", "ranch", "random",
  "range", "rapid", "rare", "rate", "rather", "raven", "razor", "ready", "real", "reason",
  "rebel", "rebuild", "recall", "receive", "recipe", "record", "recycle", "reduce", "reflect", "reform",
  "refuse", "region", "regret", "regular", "reject", "relax", "release", "relief", "rely", "remain",
  "remember", "remind", "remove", "render", "renew", "rent", "reopen", "repair", "repeat", "replace",
  "report", "require", "rescue", "resemble", "resist", "resource", "response", "result", "retire", "retreat",
  "return", "reunion", "reveal", "review", "reward", "rhythm", "ribbon", "rice", "rich", "ride",
  "ridge", "rifle", "right", "rigid", "ring", "riot", "ripple", "risk", "ritual", "rival",
  "river", "road", "roast", "robot", "robust", "rocket", "romance", "roof", "rookie", "room",
  "rose", "rotate", "rough", "round", "route", "royal", "rubber", "rude", "rugby", "ruin",
  "rule", "run", "runway", "rural", "saddle", "sadness", "safe", "sail", "salad", "salmon",
  "salon", "salt", "salute", "same", "sample", "sand", "satisfy", "satoshi", "sauce", "sausage",
  "save", "scale", "scan", "scatter", "scene", "scheme", "school", "science", "scissors", "scorpion",
  "scout", "scrap", "screen", "script", "scrub", "search", "season", "seat", "second", "secret",
  "section", "security", "seed", "seek", "segment", "select", "sell", "seminar", "senior", "sense",
  "sentence", "series", "service", "session", "settle", "setup", "seven", "shadow", "shaft", "shallow",
  "share", "shed", "shell", "sheriff", "shield", "shift", "shine", "ship", "shiver", "shock",
  "shoe", "shoot", "shop", "short", "shoulder", "shove", "shrimp", "shrug", "shuffle", "sibling",
  "sick", "side", "siege", "sight", "sign", "silent", "silk", "silly", "silver", "similar",
  "simple", "since", "sing", "siren", "sister", "situate", "size", "skate", "sketch", "skill",
  "skin", "skirt", "skull", "slab", "slam", "sleep", "slender", "slice", "slide", "slight",
  "slim", "slogan", "slot", "slow", "slush", "small", "smart", "smile", "smoke", "smooth",
  "snack", "snake", "snap", "sniff", "snow", "soap", "soccer", "social", "sock", "soda",
  "soft", "solar", "soldier", "solid", "solution", "solve", "someone", "song", "soon", "sorry",
  "sort", "soul", "sound", "soup", "source", "south", "space", "spare", "spatial", "spawn",
  "speak", "special", "speed", "spell", "spend", "sphere", "spice", "spider", "spike", "spin",
  "spirit", "split", "spoil", "sponsor", "spoon", "sport", "spot", "spray", "spread", "spring",
  "square", "squeeze", "squirrel", "stable", "stadium", "staff", "stage", "stairs", "stamp", "stand",
  "start", "state", "stay", "steak", "steel", "stem", "step", "stereo", "stick", "still",
  "sting", "stock", "stomach", "stone", "stool", "story", "stove", "strategy", "street", "strike",
  "strong", "struggle", "student", "stuff", "stumble", "style", "subject", "submit", "subway", "success",
  "such", "sudden", "suffer", "sugar", "suggest", "suit", "summer", "sun", "sunny", "sunset",
  "super", "supply", "supreme", "sure", "surface", "surge", "surprise", "surround", "survey", "suspect",
  "sustain", "swallow", "swamp", "swap", "swarm", "swear", "sweet", "swift", "swim", "swing",
  "switch", "sword", "symbol", "symptom", "syrup", "system", "table", "tackle", "tag", "tail",
  "talent", "talk", "tank", "tape", "target", "task", "taste", "tattoo", "taxi", "teach",
  "team", "tell", "tenant", "tennis", "tent", "term", "test", "text", "thank", "that",
  "theme", "then", "theory", "there", "they", "thing", "this", "thought", "three", "thrive",
  "throw", "thumb", "thunder", "ticket", "tide", "tiger", "tilt", "timber", "time", "tiny",
  "tired", "tissue", "title", "toast", "tobacco", "today", "toddler", "together", "toilet", "token",
  "tomato", "tomorrow", "tone", "tongue", "tonight", "tool", "tooth", "topic", "topple", "torch",
  "tornado", "tortoise", "toss", "total", "tourist", "toward", "tower", "town", "toxic", "track",
  "trade", "traffic", "tragic", "train", "transfer", "trap", "trash", "travel", "tray", "treat",
  "tree", "trend", "trial", "tribe", "trick", "trigger", "trim", "trip", "trophy", "trouble",
  "truck", "true", "truly", "trumpet", "trust", "truth", "tube", "tuition", "tumble", "tuna",
  "tunnel", "turkey", "turn", "turtle", "twelve", "twenty", "twice", "twin", "twist", "type",
  "typical", "ugly", "umbrella", "unable", "unaware", "uncle", "uncover", "under", "undo", "unfair",
  "unfold", "unhappy", "uniform", "unique", "unit", "universe", "unknown", "unlock", "until", "unusual",
  "unveil", "update", "upgrade", "uphold", "upon", "upper", "upset", "urban", "urge", "usage",
  "useful", "useless", "usual", "utility", "vacant", "vacuum", "vague", "valid", "valley", "valve",
  "vampire", "vanilla", "various", "vast", "vault", "vector", "vehicle", "velvet", "vendor", "venture",
  "venue", "verb", "verify", "version", "very", "vessel", "veteran", "viable", "vibrant", "vicious",
  "victory", "video", "view", "village", "vintage", "violin", "virtual", "virus", "visa", "visit",
  "visual", "vital", "vivid", "vocal", "voice", "void", "volcano", "volume", "vote", "voyage",
  "wage", "wagon", "wait", "walk", "wall", "walnut", "want", "warfare", "warm", "warrior",
  "wash", "wasp", "waste", "water", "wave", "way", "wealth", "weapon", "wear", "weasel",
  "weather", "wedding", "weekend", "weird", "welcome", "west", "wet", "whale", "what", "wheat",
  "wheel", "when", "where", "whip", "whisper", "wide", "width", "wife", "wild", "will",
  "window", "wine", "wing", "wink", "winner", "winter", "wire", "wisdom", "wise", "wish",
  "witness", "wolf", "woman", "wonder", "wood", "wool", "word", "work", "world", "worry",
  "worth", "wrap", "wreck", "wrestle", "wrist", "write", "wrong", "yard", "year", "yellow",
  "young", "youth", "zebra", "zero", "zone", "zoo"
];

function getSecureRandomInt(max: number): number {
  if (max <= 0) return 0;
  if (max === 1) return 0;
  
  const array = new Uint32Array(1);
  const maxRange = 0x100000000;
  const remainder = maxRange % max;
  const limit = maxRange - remainder;
  
  while (true) {
    crypto.getRandomValues(array);
    if (array[0] < limit) {
      return array[0] % max;
    }
  }
}

function getSecureRandomBytes(length: number): Uint8Array {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return array;
}

function generatePassphrase(wordCount: number, separator: string): string {
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(WORD_LIST[getSecureRandomInt(WORD_LIST.length)]);
  }
  return words.join(separator);
}

function generatePassword(length: number, options: {
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}): string {
  let charset = "";
  if (options.lowercase) charset += "abcdefghijklmnopqrstuvwxyz";
  if (options.uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (options.numbers) charset += "0123456789";
  if (options.symbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
  
  if (charset.length === 0) charset = "abcdefghijklmnopqrstuvwxyz";
  
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset[getSecureRandomInt(charset.length)];
  }
  return password;
}

function generateAlphanumeric(length: number): string {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += charset[getSecureRandomInt(charset.length)];
  }
  return result;
}

function generateHexKey(bits: number): string {
  const bytes = getSecureRandomBytes(bits / 8);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateUUID(): string {
  const bytes = getSecureRandomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

function generateBase64Key(bytes: number): string {
  const randomBytes = getSecureRandomBytes(bytes);
  const binary = String.fromCharCode(...Array.from(randomBytes));
  return btoa(binary);
}

function generateApiKey(prefix: string): string {
  return `${prefix}_${generateAlphanumeric(32)}`;
}

export interface GenerateRequest {
  type: 'password' | 'passphrase' | 'keys';
  requestId: string;
  options?: {
    length?: number;
    uppercase?: boolean;
    lowercase?: boolean;
    numbers?: boolean;
    symbols?: boolean;
    wordCount?: number;
    separator?: string;
  };
}

export interface GenerateResponse {
  type: 'password' | 'passphrase' | 'keys';
  result: string | Array<{ value: string; type: string; bits: number }>;
  wordListLength?: number;
  requestId: string;
}

self.onmessage = (event: MessageEvent<GenerateRequest>) => {
  const { type, requestId, options = {} } = event.data;
  
  let response: GenerateResponse;
  
  switch (type) {
    case 'password':
      response = {
        type: 'password',
        requestId,
        result: generatePassword(options.length || 16, {
          uppercase: options.uppercase ?? true,
          lowercase: options.lowercase ?? true,
          numbers: options.numbers ?? true,
          symbols: options.symbols ?? true,
        }),
      };
      break;
      
    case 'passphrase':
      response = {
        type: 'passphrase',
        requestId,
        result: generatePassphrase(options.wordCount || 4, options.separator || '-'),
        wordListLength: WORD_LIST.length,
      };
      break;
      
    case 'keys':
      response = {
        type: 'keys',
        requestId,
        result: [
          { value: generateUUID(), type: "UUID v4", bits: 122 },
          { value: generateHexKey(128), type: "128-bit Hex", bits: 128 },
          { value: generateHexKey(256), type: "256-bit Hex", bits: 256 },
          { value: generateBase64Key(32), type: "JWT Secret", bits: 256 },
          { value: generateApiKey("sk_live"), type: "API Key", bits: 190 },
          { value: generateAlphanumeric(24), type: "Alphanumeric", bits: 142 },
        ],
      };
      break;
      
    default:
      response = { type: 'password', requestId, result: '' };
  }
  
  self.postMessage(response);
};
