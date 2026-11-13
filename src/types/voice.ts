export type AppScreen = 'studio-home' | 'welcome-stage' | 'conversation-stage';

export type OrbState = 'idle' | 'listening' | 'speaking' | 'cheering';

export type CharacterRoleId =
  | 'narrator'
  | 'dragon'
  | 'pirate'
  | 'hero'
  | 'explorer'
  | 'wizard';

export type VoiceName = 'Zephyr' | 'Puck' | 'Kore' | 'Fenrir' | 'Charon';

export type LanguageCode = 'auto' | 'en' | 'nl' | 'es' | 'fr' | 'de' | 'ja';

export interface LanguageProfile {
  code: LanguageCode;
  label: string;
  nativeName: string;
  shortCode: string;
}

export interface CharacterRole {
  id: CharacterRoleId;
  name: string;
  tagline: string;
  accentColor: string;
  bgTint: string;
  borderTint: string;
  actingStyle: string;
  sampleCommand: string;
  starterScript: ScriptCard;
}

export interface VoiceProfile {
  id: VoiceName;
  label: string;
  tone: string;
}

export interface ScriptCard {
  title: string;
  line: string;
  phoneticCue: string;
  stageDirection: string;
  category: string;
}

export interface TranscriptEntry {
  id: string;
  speaker: 'user' | 'sunny' | 'system';
  text: string;
  roleId?: CharacterRoleId;
  timestamp: string;
}

export const LANGUAGE_PROFILES: LanguageProfile[] = [
  { code: 'auto', label: 'Auto-Detect', nativeName: 'Any Language', shortCode: 'AUTO' },
  { code: 'nl', label: 'Dutch', nativeName: 'Nederlands', shortCode: 'NL' },
  { code: 'en', label: 'English', nativeName: 'English', shortCode: 'EN' },
  { code: 'es', label: 'Spanish', nativeName: 'Español', shortCode: 'ES' },
  { code: 'fr', label: 'French', nativeName: 'Français', shortCode: 'FR' },
  { code: 'de', label: 'German', nativeName: 'Deutsch', shortCode: 'DE' },
  { code: 'ja', label: 'Japanese', nativeName: '日本語', shortCode: 'JA' },
];

export const VOICE_PROFILES: VoiceProfile[] = [
  { id: 'Zephyr', label: 'Zephyr', tone: 'Warm & Bright' },
  { id: 'Puck', label: 'Puck', tone: 'Playful & Energetic' },
  { id: 'Kore', label: 'Kore', tone: 'Clear & Expressive' },
  { id: 'Fenrir', label: 'Fenrir', tone: 'Bold & Dramatic' },
  { id: 'Charon', label: 'Charon', tone: 'Deep & Storyteller' },
];

export const CHARACTER_ROLES: CharacterRole[] = [
  {
    id: 'narrator',
    name: 'Storybook Narrator',
    tagline: 'Warm picture-book magic & expressive pauses',
    accentColor: '#ff9800',
    bgTint: '#fff2e2',
    borderTint: '#ffb870',
    actingStyle:
      'You are Sunny Spark, a warm, enchanted storybook narrator. Use cozy wonder, vivid vocal imagery, and lively pacing.',
    sampleCommand: 'Tell me a tiny bedtime adventure!',
    starterScript: {
      title: 'The Whispering Lantern',
      line: 'High above the sleepy treetops, one little golden lantern blinked awake!',
      phoneticCue: 'HIGH a-bove · SLEE-py TREE-tops · BLINKED a-WAKE!',
      stageDirection: 'Start soft and mysterious, then brighten with wonder on "blinked awake!"',
      category: 'Storybook Warmup',
    },
  },
  {
    id: 'dragon',
    name: 'Friendly Dragon',
    tagline: 'Smoky rumbles, cheerful roars & giggles',
    accentColor: '#22c55e',
    bgTint: '#dcfce7',
    borderTint: '#86efac',
    actingStyle:
      'You are Ember, a friendly, slightly clumsy baby dragon who loves toasted marshmallows and dramatic rumbles. Be warm, funny, and playfully booming.',
    sampleCommand: 'Give me your best friendly dragon roar!',
    starterScript: {
      title: 'Marshmallow Volcano',
      line: 'ROAAAR! Oh—excuse me! I sneezed a tiny spark onto your cocoa!',
      phoneticCue: 'ROAAAR! · ex-CUSE me! · SNEEZED a TI-ny SPARK!',
      stageDirection: 'Big chesty roar at first, then drop into an embarrassed giggle.',
      category: 'Creature Voice',
    },
  },
  {
    id: 'pirate',
    name: 'Pirate Captain',
    tagline: 'Swashbuckling sea shanties & bold "Ahoy!"',
    accentColor: '#0284c7',
    bgTint: '#e0f2fe',
    borderTint: '#7dd3fc',
    actingStyle:
      'You are Captain Sunny, a joyful treasure-hunting pirate captain! Use playful nautical flair with booming theatrical energy.',
    sampleCommand: 'Captain, where did we hide the treasure map?',
    starterScript: {
      title: 'Compass of the Clouds',
      line: 'Ahoy, matey! Hoist the starlight sails—adventure waits beyond the reef!',
      phoneticCue: 'a-HOY, MAY-tee! · HOIST the STAR-light SAILS!',
      stageDirection: 'Project loudly across the deck with a grin in your voice.',
      category: 'Adventure Scene',
    },
  },
  {
    id: 'hero',
    name: 'Cartoon Hero',
    tagline: 'Zippy action punchlines & upbeat courage',
    accentColor: '#ff6584',
    bgTint: '#ffe4e9',
    borderTint: '#fda4af',
    actingStyle:
      'You are Captain Spark, an upbeat Saturday-morning cartoon superhero! Speak with crisp energy, heroic confidence, and bouncy comic timing.',
    sampleCommand: 'Quick! Read an action hero rescue line!',
    starterScript: {
      title: 'Turbo Bounce Rescue',
      line: 'Never fear! When gravity wobbles, Turbo Spark leaps into action!',
      phoneticCue: 'NE-ver FEAR! · GRA-vi-ty WOB-bles · LEAPS in-to AC-tion!',
      stageDirection: 'Punchy, fast tempo with a heroic pause before "Turbo Spark!"',
      category: 'Animation Reel',
    },
  },
  {
    id: 'explorer',
    name: 'Cosmic Explorer',
    tagline: 'Walkie-talkie radio crackle & starlight awe',
    accentColor: '#006398',
    bgTint: '#cce5ff',
    borderTint: '#93ccff',
    actingStyle:
      'You are Commander Nova, an enthusiastic space explorer piloting a cozy starship! Mix crisp mission-control check-ins with starry-eyed excitement.',
    sampleCommand: 'Commander, report what you see on the moon!',
    starterScript: {
      title: 'Starlight Landing',
      line: 'Moonbase Alpha, do you copy? The craters are sparkling like silver dust!',
      phoneticCue: 'MOON-base AL-pha · DO you CO-py? · SPAR-kling SIL-ver DUST!',
      stageDirection: 'Crisp radio cadence on the question, then wide-eyed awe.',
      category: 'Sci-Fi Dialogue',
    },
  },
  {
    id: 'wizard',
    name: 'Sparkle Wizard',
    tagline: 'Twinkling spells, riddles & rhyming cues',
    accentColor: '#8b5000',
    bgTint: '#ffdcbe',
    borderTint: '#ffb870',
    actingStyle:
      'You are Professor Fizz, a whimsical, rhyming spell-weaver! Speak with mischievous sparkle, lyrical rhythm, and playful mystery.',
    sampleCommand: 'Teach me a funny tongue-twister spell!',
    starterScript: {
      title: 'Bubblegum Levitation',
      line: 'Swish the wand and wink twice—make these bouncy teacups float like ice!',
      phoneticCue: 'SWISH the WAND · WINK TWICE · BOUN-cy TEA-cups FLOAT!',
      stageDirection: 'Musical sing-song rhythm with crisp consonant endings.',
      category: 'Tongue Twister',
    },
  },
];

const DUTCH_STARTER_SCRIPTS: Record<CharacterRoleId, ScriptCard> = {
  narrator: {
    title: 'De Fluisterende Lantaarn',
    line: 'Hoog boven de slaperige boomtoppen knipperde één klein gouden lantaarntje wakker!',
    phoneticCue: 'HOOG BO-ven · SLA-pe-ri-ge BOOM-top-pen · KNIP-per-de WAK-ker!',
    stageDirection: 'Begin zacht en geheimzinnig, en klink daarna vrolijk bij "wakker!"',
    category: 'Verhalenboek',
  },
  dragon: {
    title: 'Marshmallow Vulkaan',
    line: 'BRUUUL! Oeps—sorry! Ik niesde per ongeluk een vonkje op je warme chocomel!',
    phoneticCue: 'BRUUUL! · OEPS—sor-ry! · NIES-de een VONK-je!',
    stageDirection: 'Eerst een flinke drakenbrul, daarna een giechelende stem.',
    category: 'Drakenstem',
  },
  pirate: {
    title: 'Kompas van de Wolken',
    line: 'Ahoy, maatje! Hijs de sterrenzeilen—het grote avontuur wacht achter het rif!',
    phoneticCue: 'a-HOY, MAAT-je! · HIJS de STER-ren-zei-len!',
    stageDirection: 'Spreek luid over het dek met een vrolijke glimlach in je stem.',
    category: 'Avontuur',
  },
  hero: {
    title: 'Turbo Vonk Redding',
    line: 'Geen paniek! Zodra de zwaartekracht wiebelt, schiet Turbo Vonk te hulp!',
    phoneticCue: 'GEEN pa-NIEK! · ZWAAR-te-kracht WIE-belt · SCHIET te HULP!',
    stageDirection: 'Snel en krachtig tempo met een heldhaftige pauze.',
    category: 'Animatie',
  },
  explorer: {
    title: 'Sterrenlicht Landing',
    line: 'Maanbasis Alfa, ontvangt u mij? De kraters glinsteren als zilveren stof!',
    phoneticCue: 'MAAN-ba-sis AL-fa · ont-VANGT u mij? · ZIL-ve-ren STOF!',
    stageDirection: 'Strakke radio-cadans bij de vraag, daarna pure verwondering.',
    category: 'Ruimtereis',
  },
  wizard: {
    title: 'Kauwgom Zweefspreuk',
    line: 'Zwaai met je staf en knipoog vlug—laat deze kopjes zweven door de lucht!',
    phoneticCue: 'ZWAAI met je STAF · KNI-poog VLUG · ZWE-ven door de LUCHT!',
    stageDirection: 'Muzikaal ritme met duidelijke medeklinkers.',
    category: 'Tongbreker',
  },
};

export function getStarterScript(
  roleId: CharacterRoleId,
  languageCode: LanguageCode
): ScriptCard {
  if (languageCode === 'nl') {
    return DUTCH_STARTER_SCRIPTS[roleId] ?? DUTCH_STARTER_SCRIPTS.narrator;
  }
  const role =
    CHARACTER_ROLES.find((r) => r.id === roleId) ?? CHARACTER_ROLES[0];
  return role.starterScript;
}

export const VOICE_COMMAND_CHIPS = [
  { label: 'Switch to Pirate Captain', command: 'Switch to Pirate Captain voice and give me an Ahoy!' },
  { label: 'Friendly Dragon Voice', command: 'Become a friendly dragon and practice a silly roar with me.' },
  { label: 'Give Me a Tongue Twister', command: 'Give me a fun tongue twister script card to practice!' },
  { label: 'Speak Super Excited', command: 'Change your delivery mood to super fast and excited!' },
  { label: 'Dramatic Whisper', command: 'Drop into a mysterious dramatic whisper and share a secret line.' },
  { label: 'Celebrate Our Take!', command: 'Celebrate our take with cheering energy!' },
];
