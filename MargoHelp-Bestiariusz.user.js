// ==UserScript==
// @name         MargoHelp Bestiariusz Podręczny
// @namespace    acesaff-margohelp-bestiary
// @version      1.8
// @author       Król Yss
// @description  Podreczny bestiariusz elit, elit II, herosow, kolosow i tytanow z lootami pobieranymi z MargoHelp.
// @updateURL    https://raw.githubusercontent.com/acesafff-ship-it/margohelp-bestiariusz/main/MargoHelp-Bestiariusz.user.js
// @downloadURL  https://raw.githubusercontent.com/acesafff-ship-it/margohelp-bestiariusz/main/MargoHelp-Bestiariusz.user.js
// @match        *://*.margonem.pl/*
// @match        *://margonem.pl/*
// @exclude      *://margohelp.pl/*
// @exclude      *://*.margohelp.pl/*
// @exclude      *://margonem.pl/*
// @exclude      *://www.margonem.pl/*
// @exclude      *://forum.margonem.pl/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @connect      margohelp.pl
// @connect      www.margohelp.pl
// ==/UserScript==

(function () {
  'use strict';

  const CFG = {
    version: '1.8',
    base: 'https://margohelp.pl',
    cacheHours: 24,
    detailCacheHours: 72,
    itemCacheHours: 168,
    itemRequestDelayMs: 40,
    itemRequestConcurrency: 5,
    lists: [
      { id: 'elity', label: 'Elity', url: '/elity' },
      { id: 'elity-ii', label: 'Elity II', url: '/elity-ii' },
      { id: 'herosi', label: 'Herosi', url: '/herosi' },
      { id: 'kolosi', label: 'Kolosi', url: '/kolosi' },
      { id: 'tytani', label: 'Tytani', url: '/tytani' }
    ]
  };

  const STORE_CACHE = 'mh_bestiary_v41_cache';
  const STORE_ITEM_DATA = 'mh_bestiary_v428_item_data';
  const STORE_MOB_DATA = 'mh_bestiary_v428_mob_data';
  const STORE_STAT_KEYS = 'mh_bestiary_v41_stat_keys';
  let statKeyMemory = loadJson(STORE_STAT_KEYS, {});
  const STORE_POS = 'mh_bestiary_v10_pos';
  const STORE_SIZE = 'mh_bestiary_v10_size';
  const STORE_VISIBLE = 'mh_bestiary_v433_visible';
  const STORE_LAUNCHER_POS = 'mh_bestiary_v434_launcher_pos';
  const STORE_COLOR_ELEMENTS = 'mh_bestiary_v442_color_elements';
  const STORE_E2_CHANCE_VARIANT = 'mh_bestiary_v13_e2_chance_variant';

  const RARITIES = {
    legendary: { label: 'Legendarne', order: 1, cls: 'mhb-leg' },
    heroic: { label: 'Heroiczne', order: 2, cls: 'mhb-her' },
    unique: { label: 'Unikatowe', order: 3, cls: 'mhb-uni' },
    upgraded: { label: 'Ulepszone', order: 4, cls: 'mhb-upg' },
    common: { label: 'Pospolite', order: 8, cls: 'mhb-com' },
    unknown: { label: 'Pozostale', order: 9, cls: 'mhb-unk' }
  };

  const DROP_CHANCES = {
    'Elity II': [
      ['Brak lupu', 'ok. 50%'],
      ['Pospolite', 'ok. 39.94%'],
      ['Unikatowe', 'ok. 8%'],
      ['Heroiczne', 'ok. 2%'],
      ['Legendarne', 'ok. 0.06%']
    ],
    'Elity': [
      ['Brak łupu', '~50%'],
      ['Pospolite', '~45%'],
      ['Unikatowe', '~4%'],
      ['Heroiczne', '~1%']
    ],
    'Herosi': [
      ['Pospolite', '38,34%'],
      ['Unikatowe', '35%'],
      ['Heroiczne', '24,92%'],
      ['Legendarne', '1,74%'],
      ['Legendarna skrytka', '0,15%–0,21%']
    ],
    'Kolosi': [
      ['Unikatowe', 'ok. 70%'],
      ['Heroiczne', 'ok. 29,7%'],
      ['Legendarne', 'ok. 0,3%']
    ],
    'Tytani': [
      ['Unikatowe', '~54,1%'],
      ['Heroiczne', '~45%'],
      ['Legendarne', '~0,9%']
    ]
  };

  const ELITY_II_CHANCE_VARIANTS = {
    standard: {
      label: 'Standardowe Elity II',
      rows: [['Brak łupu', '~50%'], ['Pospolite', '~39,94%'], ['Unikatowe', '~8%'], ['Heroiczne', '~2%'], ['Legendarne', '~0,06%']]
    },
    solo_maps: {
      label: 'Mapy bez grupowania',
      rows: [['Brak łupu', '~50%'], ['Pospolite', '~36,825%'], ['Unikatowe', '~10%'], ['Heroiczne', '~2,5%'], ['Legendarne', '~0,075%']]
    },
    shared_template: {
      label: 'Współdzielony szablon',
      rows: [['Brak łupu', '~60,58%'], ['Zwykłe', '~31,13%'], ['Unikatowe', '~6,62%'], ['Heroiczne', '~1,62%'], ['Legendarne', '~0,05%']]
    },
    mechanism_items: {
      label: 'Przedmioty do mechanizmów',
      rows: [['Brak łupu', '~50%'], ['Pospolite', '~20%'], ['Unikatowe', '~28% (w tym 20% na klucz)'], ['Heroiczne', '~2%']]
    },
    mechanism_mobs: {
      label: 'Elity wywoływane mechanizmem',
      rows: [['Brak łupu', '~49,7%'], ['Unikatowe', '~40%'], ['Heroiczne', '~10%'], ['Legendarne', '~0,3%']]
    }
  };

  const HIDDEN_STAT_KEYS = new Set([
    'id','name','rarity','opis',
    'legendary','heroic','unique','upgraded','common',
    'cansplit','capacity','lootbox2','btype','teleport',
    'permbound'
  ]);

  const STAT_LABELS = {
    type: 'Typ',
    lvl: 'Wymagany poziom',
    reqp: 'Wymagana profesja',
    ac: 'Pancerz',
    dmg: 'Atak',
    pdmg: 'Obrażenia fizyczne',
    acdmg: 'Niszczenie pancerza',
    fire: 'Obrażenia od ognia',
    cold: 'Obrażenia od zimna',
    frost: 'Obrażenia od zimna',
    light: 'Obrażenia od błyskawic',
    poison: 'Obrażenia od trucizny',
    wound: 'Głęboka rana',
    pierce: 'Przebicie pancerza',
    pierceb: 'Przebicie bloku',
    resfire: 'Odporność na ogień',
    rescold: 'Odporność na zimno',
    resfrost: 'Odporność na zimno',
    reslight: 'Odporność na błyskawice',
    resdmg: 'Odporność na obrażenia',
    respred: 'Redukcja otrzymywanych obrażeń',
    abs: 'Absorpcja',
    absorb: 'Absorpcja fizyczna',
    absorbm: 'Absorpcja magiczna',
    abdest: 'Niszczenie absorpcji',
    adest: 'Niszczenie pancerza',
    blok: 'Blok',
    contra: 'Kontra',
    slow: 'Spowolnienie',
    lowcrit: 'Obniżenie krytyka',
    lowevade: 'Obniżenie uniku',
    lowdmg: 'Obniżenie obrażeń',
    crit: 'Cios krytyczny',
    critval: 'Siła krytyka fizycznego',
    critmval: 'Siła krytyka magicznego',
    evade: 'Unik',
    dz: 'Zręczność',
    ds: 'Siła',
    di: 'Intelekt',
    str: 'Siła',
    agi: 'Zręczność',
    int: 'Intelekt',
    all: 'Wszystkie cechy',
    da: 'Wszystkie cechy',
    act: 'Odporność na truciznę',
    heal: 'Leczenie w walce',
    afterheal: 'Leczenie po walce',
    leczy: 'Leczy',
    hp: 'Życie',
    hpbon: 'Bonus życia',
    mana: 'Mana',
    manabon: 'Mana',
    manafor: 'Mana za turę',
    manafatig: 'Zmęczenie many',
    energy: 'Energia',
    energybon: 'Energia',
    enfatig: 'Zmęczenie energii',
    sa: 'SA',
    legbon: 'Bonus legendarny',
    bind: 'Wiązanie',
    binds: 'Wiązanie',
    ttl: 'Czas trwania',
    value: 'Wartość',
    gold: 'Złoto',
    ammo: 'Amunicja',
    amount: 'Ilość',
    price: 'Cena',
    bag: 'Miejsca w torbie',
    runes: 'Runy',
    dmgmulphysical: 'Bonus do obrażeń fizycznych',
    dmgmulfire: 'Bonus do obrażeń od ognia',
    dmgmulfrost: 'Bonus do obrażeń od zimna',
    dmgmullight: 'Bonus do obrażeń od błyskawic',
    dmgmulpoison: 'Bonus do obrażeń od trucizny',
    dmgmulwound: 'Bonus do głębokiej rany',
    dmgmulabsolute: 'Bonus do obrażeń absolutnych'
  };

  const LEGENDARY_BONUS_LABELS = {
    verycrit: 'Cios bardzo krytyczny',
    holytouch: 'Dotyk anioła',
    curse: 'Klątwa',
    lastheal: 'Ostatni ratunek',
    critred: 'Krytyczna osłona',
    glare: 'Oślepienie',
    facade: 'Fasada opieki',
    cleanse: 'Płomienne oczyszczenie',
    flamecleanse: 'Płomienne oczyszczenie',
    anguish: 'Krwawa udręka',
    puncture: 'Przeszywająca skuteczność',
    shield: 'Krytyczna osłona'
  };

  const LEGENDARY_BONUS_DESCRIPTIONS = {
    verycrit: '17% szansy na zwiększenie mocy ciosu krytycznego o 75%.',
    holytouch: 'Podczas ataku 7% szansy na regenerację po 6% życia przez trzy najbliższe tury.',
    curse: 'Podczas udanego ataku 9% szans na aktywację klątwy, która zablokuje najbliższą wykonywaną przez przeciwnika akcję.',
    lastheal: 'Jednorazowe zregenerowanie znacznej ilości punktów życia, gdy po otrzymaniu obrażeń życie spadnie poniżej 18%.',
    critred: 'Przyjmowane ciosy krytyczne są o 25% słabsze.',
    shield: 'Przyjmowane ciosy krytyczne są o 25% słabsze.',
    glare: 'Podczas przyjmowania ataku 9% szansy na oślepienie przeciwnika i zablokowanie jego najbliższej akcji.',
    facade: 'Przyjmowane ciosy są o 13% słabsze.',
    cleanse: 'podczas otrzymywania celnego ataku 12% szans na usunięcie z postaci efektów obezwładnienia, spowolnienia i obrażeń warunkowych.',
    flamecleanse: 'Podczas otrzymywania celnego ataku 12% szans na usunięcie z Postaci efektów obezwładnienia, spowolnienia i obrażeń warunkowych.',
    anguish: 'Trafiony atak ma 8% szansy na wywołanie u przeciwnika krwawienia na pięć tur.',
    puncture: 'Cel ataku ma obniżone o 12% zdolności defensywne.'
  };

  if (['margonem.pl', 'www.margonem.pl', 'forum.margonem.pl'].includes(location.hostname.toLowerCase())) return;

  if (document.getElementById('mh-bestiary')) return;

  let activeTab = 'elity-ii';
  let mobs = [];
  let selectedMob = null;
  let selectedDetails = null;
  let loadingLists = false;
  let listPromise = null;
  const minimized = false;
  let panelVisible = loadJson(STORE_VISIBLE, false);
  let colorElements = loadJson(STORE_COLOR_ELEMENTS, false);
  let e2ChanceVariant = loadJson(STORE_E2_CHANCE_VARIANT, 'standard');
  if (!ELITY_II_CHANCE_VARIANTS[e2ChanceVariant]) e2ChanceVariant = 'standard';

  const css = `
    #mh-bestiary{position:fixed;top:80px;right:24px;width:470px;height:650px;min-width:340px;min-height:320px;max-width:96vw;max-height:96vh;z-index:2147483647;background:#0b0e10;color:#e7ecef;border:1px solid #2d6b56;border-radius:8px;box-shadow:0 16px 48px rgba(0,0,0,.55);font:12px Arial,sans-serif;overflow:hidden}
    #mh-bestiary *{box-sizing:border-box}
    .mhb-head{height:46px;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px;background:#101719;border-bottom:1px solid rgba(104,255,190,.18);cursor:move;user-select:none}
    .mhb-brand{line-height:15px}
    .mhb-title{font-weight:800;color:#62ffb6;font-size:15px}
    .mhb-sub{color:#8fa39b;font-size:10px}
    .mhb-author{color:#8fffc9;text-decoration:none}
    .mhb-author:hover{color:#fff;text-decoration:underline}
    .mhb-head-actions{display:flex;align-items:center;gap:6px}
    .mhb-icon{width:26px;height:26px;border:1px solid #2c735b;border-radius:6px;background:#101b1d;color:#bfffe2;font-weight:bold;cursor:pointer}
    .mhb-head-btn{height:26px;border:1px solid #2c735b;border-radius:6px;background:#101b1d;color:#bfffe2;font-size:10px;font-weight:bold;cursor:pointer;padding:0 8px}
    .mhb-head-btn:hover,.mhb-icon:hover{border-color:#58e5a9}
    .mhb-body{height:calc(100% - 46px);display:flex;flex-direction:column;gap:8px;padding:9px;overflow:hidden}
    .mhb-tabs{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}
    .mhb-options{display:none;align-items:center;padding:7px 9px;border:1px solid #26383a;border-radius:6px;background:#0b1315;color:#c9d6d2}
    .mhb-options.open{display:flex}
    .mhb-options label{display:flex;align-items:center;gap:7px;cursor:pointer;user-select:none}
    .mhb-tab{height:32px;border:1px solid #26383a;border-radius:6px;background:#11191b;color:#c9d6d2;font-weight:bold;cursor:pointer}
    .mhb-tab.active{border-color:#5df0ad;background:#173026;color:#74ffc0}
    .mhb-controls{display:grid;grid-template-columns:1fr 76px 76px;gap:6px}
    .mhb-input,.mhb-select{height:32px;border:1px solid #26383a;border-radius:6px;background:#081012;color:#e9f5f0;padding:0 9px;outline:none}
    .mhb-input:focus,.mhb-select:focus{border-color:#58e5a9}
    .mhb-main{display:grid;grid-template-columns:180px 1fr;gap:24px;min-height:0;flex:1;position:relative}
    .mhb-list,.mhb-details{border:1px solid #1f3032;border-radius:7px;background:#080c0e;min-height:0;overflow:auto;scrollbar-width:thin;scrollbar-color:#3b514d #0a1112}
    .mhb-list{overflow-x:hidden;overflow-y:auto;scrollbar-width:thin}
    .mhb-list::-webkit-scrollbar,.mhb-details::-webkit-scrollbar,.mhb-location::-webkit-scrollbar,.mhb-chances::-webkit-scrollbar{width:9px;height:9px}
    .mhb-list::-webkit-scrollbar-track,.mhb-details::-webkit-scrollbar-track,.mhb-location::-webkit-scrollbar-track,.mhb-chances::-webkit-scrollbar-track{background:#0a1112}
    .mhb-list::-webkit-scrollbar-thumb,.mhb-details::-webkit-scrollbar-thumb,.mhb-location::-webkit-scrollbar-thumb,.mhb-chances::-webkit-scrollbar-thumb{background:#3b514d;border:2px solid #0a1112;border-radius:8px}
    .mhb-list::-webkit-scrollbar-thumb:hover,.mhb-details::-webkit-scrollbar-thumb:hover,.mhb-location::-webkit-scrollbar-thumb:hover,.mhb-chances::-webkit-scrollbar-thumb:hover{background:#58726c}
    .mhb-list-head{position:sticky;top:0;background:#0f1618;border-bottom:1px solid #1f3032;padding:6px 7px;color:#9db3ac;font-size:10px;z-index:1}
    .mhb-mob{display:grid;grid-template-columns:34px minmax(0,1fr);gap:7px;align-items:center;padding:6px;border-bottom:1px solid rgba(255,255,255,.05);cursor:pointer;max-width:100%;overflow:hidden}
    .mhb-mob:hover{background:#101719}
    .mhb-mob.active{background:#163126;outline:1px solid #46c78d}
    .mhb-imgbox{width:34px;height:34px;border:1px solid #29393b;border-radius:5px;background:#030607;display:flex;align-items:center;justify-content:center;overflow:hidden}
    .mhb-imgbox img{max-width:34px;max-height:34px}
    .mhb-placeholder{width:16px;height:16px;border-radius:50%;background:#203033}
    .mhb-name{font-weight:bold;color:#f2f8f5;line-height:14px;max-height:29px;overflow:hidden}
    .mhb-meta{color:#93a39f;font-size:10px;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .mhb-details{padding:8px}
    .mhb-card{border:1px solid #1f3032;background:#0d1315;border-radius:7px;padding:8px;margin-bottom:8px}
    .mhb-mob-top{display:grid;grid-template-columns:56px 1fr;gap:9px;align-items:center}
    .mhb-bigimg{width:56px;height:56px;border:1px solid #304143;border-radius:6px;background:#030607;display:flex;align-items:center;justify-content:center;overflow:hidden}
    .mhb-bigimg img{max-width:56px;max-height:56px}
    .mhb-row{display:flex;justify-content:space-between;gap:8px;margin:3px 0;color:#aebdb8}
    .mhb-value{color:#fff;font-weight:bold;text-align:right}
    .mhb-actions{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px}
    .mhb-btn{height:30px;border:1px solid #2b4548;border-radius:6px;background:#131d20;color:#e6f3ee;font-weight:bold;cursor:pointer}
    .mhb-btn:hover{border-color:#58e5a9}
    .mhb-section-title{font-weight:800;color:#e9f5f0;margin:8px 0 6px;border-bottom:1px solid #1f3032;padding-bottom:5px}
    .mhb-rarity{border:1px solid #243538;background:#0a1012;border-radius:7px;margin-bottom:7px;overflow:hidden}
    .mhb-rarity h4{margin:0;padding:6px 8px;font-size:11px;background:#11191b;display:flex;justify-content:space-between}
    .mhb-loot{display:grid;grid-template-columns:repeat(auto-fill,minmax(38px,1fr));gap:6px;padding:7px}
    .mhb-item{height:38px;border:1px solid #344244;border-radius:6px;background:#06090a;display:flex;align-items:center;justify-content:center;position:relative;cursor:pointer}
    .mhb-item:hover{border-color:#e7ecef}
    .mhb-item img{max-width:34px;max-height:34px}
    .mhb-leg{border-color:#ffaa32;box-shadow:inset 0 0 8px rgba(255,170,50,.16)}
    .mhb-her{border-color:#55b9ff;box-shadow:inset 0 0 8px rgba(85,185,255,.14)}
    .mhb-uni{border-color:#ffe44d;box-shadow:inset 0 0 8px rgba(255,228,77,.13)}
    .mhb-upg{border-color:#a783ff}
    .mhb-com{border-color:#9da8aa}
    .mhb-unk{border-color:#344244}
    .mhb-location,.mhb-chances{border:1px solid #1f3032;border-radius:7px;background:#081012;padding:7px;color:#d9e4e0;line-height:16px;white-space:pre-wrap;max-height:130px;overflow:auto}
    .mhb-chance-row{display:flex;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.06);padding:3px 0}
    .mhb-chance-row:last-child{border-bottom:0}
    .mhb-chance-head{display:flex;align-items:center;justify-content:space-between;gap:7px;margin-bottom:5px;font-weight:bold}
    .mhb-chance-select{min-width:0;max-width:165px;height:26px;border:1px solid #2b4548;border-radius:5px;background:#10191b;color:#dff7ed;font-size:10px;padding:0 5px}
    .mhb-chance-note{margin-top:5px;color:#82958f;font-size:9px;line-height:12px}
    .mhb-section-title.mhb-title-row{display:flex;align-items:center;justify-content:space-between;overflow:visible}
    .mhb-drop-help{position:relative;display:inline-flex;align-items:center;justify-content:center;width:19px;height:19px;border:1px solid #3c8069;border-radius:50%;color:#7cffc2;background:#10211c;font-weight:bold;font-size:11px;cursor:help}
    .mhb-drop-popover{display:none;position:absolute;z-index:20;right:-3px;top:18px;width:235px;padding:8px;border:1px solid #4c9b7e;border-radius:6px;background:rgba(5,11,10,.98);box-shadow:0 8px 24px rgba(0,0,0,.75);color:#dce9e4;font-weight:normal;font-size:10px;line-height:14px}
    .mhb-drop-help:hover .mhb-drop-popover,.mhb-drop-help:focus-within .mhb-drop-popover,.mhb-drop-help.open .mhb-drop-popover{display:block}
    .mhb-drop-popover .mhb-chance-head{font-size:10px}
    .mhb-status{height:30px;border:1px solid #1f3032;border-radius:7px;background:#0d1717;color:#b8cac4;padding:7px 9px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
    .mhb-tip{position:fixed;z-index:2147483647;display:none;max-width:min(340px,calc(100vw - 24px));min-width:260px;background:rgba(3,5,4,.97);color:#eef2ef;border:2px solid #6d6d61;border-radius:2px;padding:5px;box-shadow:0 0 0 2px #111,0 10px 28px rgba(0,0,0,.8);pointer-events:none;font:12px Verdana,Arial,sans-serif;line-height:15px;white-space:normal;overflow-wrap:break-word}
    .mhb-tip-head{display:grid;grid-template-columns:38px minmax(0,1fr);gap:6px;align-items:center;border:1px solid #3b443f;background:rgba(30,34,31,.72);padding:3px;margin-bottom:4px;min-height:44px}
    .mhb-tip-title{font-weight:bold;color:#fff;border:0;padding:0;margin:0 0 2px}
    .mhb-tip-type{color:#aeb8b2;font-size:11px}
    .mhb-tip-img{width:36px;height:36px;border:1px solid #5c675f;border-radius:1px;background:#090c0a;display:flex;align-items:center;justify-content:center}
    .mhb-tip-img img{max-width:34px;max-height:34px}
    .mhb-tip-rarity{display:block;margin:0 0 3px;padding:0 0 2px;border:0;border-bottom:1px solid #555b56;border-radius:0;font-weight:bold;background:none}
    .mhb-tip-stat-value{color:#ffb326;font-weight:bold}
    .mhb-tip-stat-special{color:#ffb326}
    .mhb-tip.mhb-color-elements .mhb-tip-stat-value.mhb-stat-fire{color:#ff5757}
    .mhb-tip.mhb-color-elements .mhb-tip-stat-value.mhb-stat-frost{color:#62aaff}
    .mhb-tip.mhb-color-elements .mhb-tip-stat-value.mhb-stat-light{color:#ffe34f}
    .mhb-tip.mhb-color-elements .mhb-tip-stat-value.mhb-stat-poison{color:#52e86f}
    .mhb-tip-legbon{color:#55f26c;font-weight:bold}
    .mhb-tip-legbon-desc{display:block;color:#55f26c;white-space:normal;overflow-wrap:break-word;margin-top:2px;padding-bottom:4px;border-bottom:1px solid #4e554f}
    .mhb-tip-legendary{border-color:#ffaa32;box-shadow:0 0 18px rgba(255,170,50,.18)}
    .mhb-tip-legendary .mhb-tip-title,.mhb-tip-legendary .mhb-tip-rarity{color:#ffd27c;border-color:#ffaa32}
    .mhb-tip-heroic{border-color:#55b9ff;box-shadow:0 0 18px rgba(85,185,255,.16)}
    .mhb-tip-heroic .mhb-tip-title,.mhb-tip-heroic .mhb-tip-rarity{color:#9bd6ff;border-color:#55b9ff}
    .mhb-tip-unique{border-color:#ffe44d;box-shadow:0 0 18px rgba(255,228,77,.14)}
    .mhb-tip-unique .mhb-tip-title,.mhb-tip-unique .mhb-tip-rarity{color:#fff19a;border-color:#ffe44d}
    .mhb-tip-upgraded{border-color:#a783ff;box-shadow:0 0 18px rgba(167,131,255,.14)}
    .mhb-tip-upgraded .mhb-tip-title,.mhb-tip-upgraded .mhb-tip-rarity{color:#c9b7ff;border-color:#a783ff}
    .mhb-tip-common{border-color:#9da8aa}
    .mhb-tip-common .mhb-tip-rarity{color:#dce4e5;border-color:#9da8aa}
    .mhb-resize{position:absolute;right:0;bottom:0;width:18px;height:18px;cursor:nwse-resize;background:linear-gradient(135deg,transparent 0 45%,#5a7770 46% 55%,transparent 56%),linear-gradient(135deg,transparent 0 65%,#5a7770 66% 75%,transparent 76%)}
    .mhb-empty{color:#9baaa6;padding:10px;line-height:16px}
    #mhb-launcher{position:fixed;left:7px;top:7px;width:38px;height:38px;z-index:2147483646;border:2px solid #51675f;border-radius:5px;background:radial-gradient(circle at 50% 40%,#173e34,#07110f 72%);box-shadow:0 0 0 2px #080b0a,0 2px 7px #000;color:#70ffc2;font:bold 20px Georgia,serif;line-height:32px;text-align:center;cursor:grab;padding:0;user-select:none;touch-action:none}
    #mhb-launcher.dragging{cursor:grabbing}
    #mhb-launcher:hover,#mhb-launcher.active{border-color:#69ffc0;box-shadow:0 0 0 2px #080b0a,0 0 10px rgba(82,255,181,.65)}
    #mhb-launcher .mhb-launcher-book{display:block;transform:translateY(-1px)}
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const panel = document.createElement('div');
  panel.id = 'mh-bestiary';
  panel.innerHTML = `
    <div class="mhb-head" id="mhb-head">
      <div class="mhb-brand">
        <div class="mhb-title">BESTIARIUSZ v${esc(CFG.version)}</div>
        <div class="mhb-sub">Autor: <a class="mhb-author" href="https://www.margonem.pl/profile/view,10050726#char_5601,luvia" target="_blank" rel="noopener noreferrer">Król Yss</a> | MargoHelp pod ręką | v${esc(CFG.version)}</div>
      </div>
      <div class="mhb-head-actions">
        <button class="mhb-head-btn" id="mhb-clear-cache" title="Wyczysc pobrane dane">Wyczysc</button>
        <button class="mhb-head-btn" id="mhb-options-btn" title="Ustawienia dodatku">Opcje</button>
      </div>
    </div>
    <div class="mhb-body">
      <div class="mhb-tabs" id="mhb-tabs">
        ${CFG.lists.map(tab => `<button class="mhb-tab ${tab.id === activeTab ? 'active' : ''}" data-tab="${tab.id}">${esc(tab.label)}</button>`).join('')}
      </div>
      <div class="mhb-options" id="mhb-options">
        <label><input type="checkbox" id="mhb-color-elements"> Koloruj wartości żywiołów i odporności</label>
      </div>
      <div class="mhb-controls">
        <input class="mhb-input" id="mhb-search" placeholder="Szukaj potwora">
        <input class="mhb-input" id="mhb-minlvl" placeholder="od lvl" inputmode="numeric">
        <input class="mhb-input" id="mhb-maxlvl" placeholder="do lvl" inputmode="numeric">
      </div>
      <div class="mhb-main">
        <div class="mhb-list" id="mhb-list"></div>
        <div class="mhb-details" id="mhb-details">
          <div class="mhb-empty">Wybierz potwora z listy.</div>
        </div>
      </div>
      <div class="mhb-status" id="mhb-status">Gotowy</div>
    </div>
    <div class="mhb-resize" id="mhb-resize"></div>
  `;
  document.body.appendChild(panel);

  const tooltip = document.createElement('div');
  tooltip.className = 'mhb-tip';
  document.body.appendChild(tooltip);

  createLauncher();

  restorePanel();
  applyPreferences();
  applyPanelVisibility();
  bindPanel();
  loadLists(false).then(() => renderList()).catch(err => {
    console.warn('[MHB] init', err);
    setStatus('Nie udalo sie pobrac listy z MargoHelp.');
  });

  function bindPanel() {
    document.getElementById('mhb-tabs').addEventListener('click', e => {
      const btn = e.target.closest('.mhb-tab');
      if (!btn) return;

      activeTab = btn.dataset.tab;
      selectedMob = null;
      selectedDetails = null;
      document.querySelectorAll('#mhb-tabs .mhb-tab').forEach(el => {
        el.classList.toggle('active', el.dataset.tab === activeTab);
      });
      renderList();
      renderEmptyDetails('Wybierz potwora z listy.');
    });

    ['mhb-search', 'mhb-minlvl', 'mhb-maxlvl'].forEach(id => {
      document.getElementById(id).addEventListener('input', renderList);
    });

    document.getElementById('mhb-clear-cache').addEventListener('click', e => {
      e.stopPropagation();
      clearBestiaryMemory();
    });

    document.getElementById('mhb-options-btn').addEventListener('click', e => {
      e.stopPropagation();
      document.getElementById('mhb-options').classList.toggle('open');
    });
    document.getElementById('mhb-color-elements').addEventListener('change', e => {
      colorElements = !!e.target.checked;
      saveJson(STORE_COLOR_ELEMENTS, colorElements);
      applyPreferences();
    });

    enableDrag();
    enableResize();
    enableListWheel();
    enableDetailsWheel();
  }

  function applyPreferences() {
    const checkbox = document.getElementById('mhb-color-elements');
    if (checkbox) checkbox.checked = !!colorElements;
    tooltip.classList.toggle('mhb-color-elements', !!colorElements);
  }

  async function loadLists(force) {
    if (loadingLists && listPromise) return listPromise;

    loadingLists = true;
    listPromise = (async () => {
      setStatus('Pobieram listy z MargoHelp...');
      const all = [];

      for (const tab of CFG.lists) {
        const html = await getCachedText('list:' + tab.id, abs(tab.url), force, CFG.cacheHours);
        const parsed = parseMobList(html, tab);
        all.push(...parsed);
      }

      mobs = uniqueMobs(all).sort((a, b) => (a.level || 999) - (b.level || 999) || a.name.localeCompare(b.name, 'pl'));
      setStatus('Baza gotowa: ' + mobs.length + ' potworow.');
      return mobs;
    })().finally(() => {
      loadingLists = false;
      listPromise = null;
    });

    return listPromise;
  }

  function parseMobList(html, tab) {
    const doc = parseHtml(html);
    const list = [];

    Array.from(doc.querySelectorAll('a[href*="/mob/"]')).forEach(a => {
      const href = abs(a.getAttribute('href') || '');
      const id = extractMobId(href);
      if (!id) return;

      const raw = clean(a.textContent || a.getAttribute('title') || '');
      const meta = parseMobText(raw);
      const img = findImageNear(a);

      list.push({
        id,
        url: href,
        name: meta.name || raw.replace(/Ilość lootów:.*/i, '').trim() || 'Potwor',
        level: meta.level,
        prof: meta.prof,
        lootCount: meta.lootCount,
        category: tab.label,
        tabId: tab.id,
        image: img,
        raw
      });
    });

    return list;
  }

  function parseMobText(text) {
    const value = clean(text);
    const match = value.match(/^(.+?)\s*\((\d{1,3})\s*lvl\s*([^)]*)\)/i);
    const lootMatch = value.match(/Ilość lootów:\s*(\d+)/i) || value.match(/Ilosc lootow:\s*(\d+)/i);

    if (!match) {
      return {
        name: value.replace(/Ilość lootów:.*/i, '').trim(),
        level: null,
        prof: '',
        lootCount: lootMatch ? Number(lootMatch[1]) : null
      };
    }

    return {
      name: clean(match[1]),
      level: Number(match[2]),
      prof: clean(match[3]),
      lootCount: lootMatch ? Number(lootMatch[1]) : null
    };
  }

  function findImageNear(a) {
    const img = a.querySelector('img') || a.closest('li,div,article')?.querySelector('img');
    return img ? abs(img.getAttribute('src') || img.getAttribute('data-src') || img.getAttribute('data-original') || '') : '';
  }

  function uniqueMobs(items) {
    const map = new Map();
    items.forEach(mob => {
      if (!map.has(mob.id)) map.set(mob.id, mob);
    });
    return Array.from(map.values());
  }

  function renderList() {
    const box = document.getElementById('mhb-list');
    if (!box) return;

    const search = norm(document.getElementById('mhb-search').value);
    const min = Number(document.getElementById('mhb-minlvl').value || 0);
    const max = Number(document.getElementById('mhb-maxlvl').value || 999);

    const filtered = mobs
      .filter(mob => mob.tabId === activeTab)
      .filter(mob => !search || norm(mob.name).includes(search))
      .filter(mob => !Number.isFinite(mob.level) || (mob.level >= min && mob.level <= max));

    box.innerHTML = `
      <div class="mhb-list-head">${filtered.length} / ${mobs.filter(m => m.tabId === activeTab).length} potworow</div>
      ${filtered.map(mob => renderMobRow(mob)).join('') || '<div class="mhb-empty">Nic nie znaleziono.</div>'}
    `;

    box.querySelectorAll('.mhb-mob').forEach(row => {
      row.addEventListener('click', () => {
        const mob = mobs.find(m => m.id === row.dataset.id);
        if (mob) selectMob(mob);
      });
    });
  }

  function renderMobRow(mob) {
    return `
      <div class="mhb-mob ${selectedMob && selectedMob.id === mob.id ? 'active' : ''}" data-id="${esc(mob.id)}">
        <div class="mhb-imgbox">${mob.image ? `<img src="${esc(mob.image)}" alt="">` : '<span class="mhb-placeholder"></span>'}</div>
        <div>
          <div class="mhb-name">${esc(mob.name)}</div>
          <div class="mhb-meta">${mob.level ? mob.level + ' lvl' : '? lvl'}${mob.prof ? ' | ' + esc(mob.prof) : ''}${mob.lootCount ? ' | ' + mob.lootCount + ' loot' : ''}</div>
        </div>
      </div>
    `;
  }

  async function selectMob(mob) {
    selectedMob = mob;
    selectedDetails = null;
    renderList();
    renderEmptyDetails('Laduje szczegoly: ' + mob.name + '...');
    setStatus('Sprawdzam pamiec lokalna: ' + mob.name);

    const cachedDetails = loadCachedMobDetails(mob);
    if (cachedDetails) {
      selectedDetails = cachedDetails;
      if (selectedDetails.image && !mob.image) mob.image = selectedDetails.image;
      renderDetails(selectedDetails);
      setStatus('Wybrano: ' + selectedDetails.name + ' | lootow: ' + selectedDetails.items.length + ' | z pamieci lokalnej');
      await enrichLootItems(selectedDetails);
      return;
    }

    setStatus('Pobieram: ' + mob.name);

    try {
      const html = await getCachedText('mob:' + mob.id, mob.url, false, CFG.detailCacheHours);
      selectedDetails = parseMobDetails(html, mob);
      if (selectedDetails.image && !mob.image) mob.image = selectedDetails.image;
      renderDetails(selectedDetails);
      setStatus('Wybrano: ' + selectedDetails.name + ' | lootow: ' + selectedDetails.items.length);
      await enrichLootItems(selectedDetails);
    } catch (err) {
      console.warn('[MHB] mob details', err);
      renderEmptyDetails('Nie udalo sie pobrac szczegolow z MargoHelp.');
      setStatus('Blad pobierania szczegolow.');
    }
  }

  function loadCachedMobDetails(mob) {
    const cache = loadJson(STORE_MOB_DATA, {});
    const entry = cache[mobCacheKey(mob)];
    if (!entry || !entry.data || Date.now() - entry.ts > CFG.itemCacheHours * 60 * 60 * 1000) return null;
    if (mob.lootCount && Array.isArray(entry.data.items) && entry.data.items.length < mob.lootCount) return null;

    return {
      ...entry.data,
      mob,
      items: Array.isArray(entry.data.items) ? entry.data.items : []
    };
  }

  function saveCachedMobDetails(details) {
    if (!details || !details.mob || !details.mob.id || !details.items || !details.items.length) return;

    const cache = loadJson(STORE_MOB_DATA, {});
    cache[mobCacheKey(details.mob)] = {
      ts: Date.now(),
      data: {
        name: details.name || details.mob.name,
        image: details.image || details.mob.image || '',
        typeText: details.typeText || '',
        location: details.location || '',
        items: details.items.map(compactItemData)
      }
    };
    saveJson(STORE_MOB_DATA, cache);
  }

  function mobCacheKey(mob) {
    return 'mob:' + (mob && mob.id || '');
  }

  async function enrichLootItems(details) {
    details.items.forEach(item => {
      if (!item.stats || typeof item.stats !== 'object') item.stats = {};
      if (!item.stats.type) {
        item.stats.type = inferItemType(item, item.name, item.stats);
      }
    });
    if (selectedDetails === details) renderDetails(details);

    const items = details.items.filter(item => item.href);
    if (!items.length) return;

    const itemDataCache = loadJson(STORE_ITEM_DATA, {});
    let fromLocal = 0;

    items.forEach(item => {
      const cached = findCachedItemData(itemDataCache, item);
      if (!cached) return;
      mergeItemData(item, cached);
      if (item.stats && item.stats.type) {
        item._mhbReadyLocal = true;
        fromLocal++;
      }
    });

    let recognized = details.items.filter(item => item.rarity && item.rarity !== 'unknown').length;
    const missing = items.filter(item => !item._mhbReadyLocal);

    if (!missing.length) {
      if (selectedDetails === details) {
        renderDetails(details);
        saveCachedMobDetails(details);
        setStatus('Wybrano: ' + details.name + ' | lootow: ' + details.items.length + ' | z pamieci lokalnej');
      }
      items.forEach(item => delete item._mhbReadyLocal);
      return;
    }

    let done = 0;

    setStatus('Rozpoznaje brakujace itemy: 0/' + missing.length + ' | lokalnie ' + fromLocal);

    let cursor = 0;
    const workers = Array.from({ length: Math.min(CFG.itemRequestConcurrency, missing.length) }, async () => {
      if (selectedDetails !== details) return;

      while (selectedDetails === details) {
        const item = missing[cursor++];
        if (!item) return;

        try {
          let enriched = null;

          const key = 'item:' + (item.id || item.href);
          const html = await getCachedText(key, item.href, false, CFG.itemCacheHours);
          enriched = parseItemPage(html, item);
          if (enriched) {
            saveCachedItemData(itemDataCache, item, enriched);
          }

          if (enriched) {
            mergeItemData(item, enriched);
            saveCachedItemData(itemDataCache, item, item);
            if (!item.rarity || item.rarity === 'unknown') {
              console.log('[MHB] nierozpoznany item:', {
                id: item.id,
                name: item.name,
                imgFile: item.imgFile,
                href: item.href
              });
            }
          }
        } catch (err) {
          console.warn('[MHB] item details', item.name, item.href, err);
        }

        done++;
        recognized = details.items.filter(entry => entry.rarity && entry.rarity !== 'unknown').length;

        if (selectedDetails === details) {
          renderDetails(details);
          setStatus('Rozpoznaje brakujace itemy: ' + done + '/' + missing.length + ' | rozpoznane ' + recognized + ' | lokalnie ' + fromLocal + ' | rownolegle ' + Math.min(CFG.itemRequestConcurrency, missing.length));
        }

        if (done < missing.length) {
          await wait(CFG.itemRequestDelayMs);
        }
      }
    });

    await Promise.all(workers);

    items.forEach(item => delete item._mhbReadyLocal);

    if (selectedDetails === details) {
      saveCachedMobDetails(details);
      setStatus('Wybrano: ' + details.name + ' | lootow: ' + details.items.length + ' | rozpoznane ' + recognized + ' | lokalnie ' + fromLocal);
    }
  }

  function itemDataKey(item) {
    return itemDataKeys(item).join('|') || '';
  }

  function itemDataKeys(item) {
    if (!item) return [];
    return uniqueText([
      item.id ? 'id:' + item.id : '',
      item.href ? 'url:' + item.href : ''
    ].filter(Boolean));
  }

  function findCachedItemData(cache, item) {
    const keys = itemDataKeys(item);
    const legacyKey = legacyItemDataKey(item);
    if (legacyKey) keys.push(legacyKey);

    for (const key of uniqueText(keys)) {
      const entry = cache[key];
      if (entry && entry.data && Date.now() - entry.ts < CFG.itemCacheHours * 60 * 60 * 1000) {
        return entry.data;
      }
    }

    return null;
  }

  function saveCachedItemData(cache, baseItem, enriched) {
    const data = compactItemData({ ...baseItem, ...enriched });
    const keys = uniqueText([
      ...itemDataKeys(baseItem),
      ...itemDataKeys(enriched),
      itemDataKey(baseItem),
      itemDataKey(enriched),
      legacyItemDataKey(baseItem),
      legacyItemDataKey(enriched)
    ].filter(Boolean));
    const entry = { ts: Date.now(), data };

    keys.forEach(key => {
      cache[key] = entry;
    });
    saveJson(STORE_ITEM_DATA, cache);
  }

  function legacyItemDataKey(item) {
    if (!item) return '';
    return [
      item.id ? 'id:' + item.id : '',
      item.href ? 'url:' + item.href : ''
    ].filter(Boolean).join('|');
  }

  function compactItemData(item) {
    return {
      id: item.id || '',
      name: item.name || '',
      nameKey: item.nameKey || norm(item.name || ''),
      href: item.href || '',
      img: item.img || '',
      imgKey: item.imgKey || imageKey(item.img || ''),
      imgFile: item.imgFile || imageFile(item.img || ''),
      sourceIndex: Number.isFinite(item.sourceIndex) ? item.sourceIndex : null,
      rarity: item.rarity || 'unknown',
      stats: item.stats || {},
      tipHtml: item.tipHtml || '',
      fallbackHtml: item.fallbackHtml || ''
    };
  }

  function uniqueText(values) {
    return Array.from(new Set(values.filter(Boolean).map(String)));
  }

  function parseItemPage(html, baseItem) {
    const doc = parseHtml(html);
    const h1 = clean(doc.querySelector('h1')?.textContent || '');
    const text = clean(doc.body.textContent || '');
    const rawHtml = deepDecode(html || '');
    const classText = Array.from(doc.querySelectorAll('[class]')).slice(0, 240).map(el => el.className).join(' ');

    let best = null;
    let bestContext = '';

    Array.from(doc.querySelectorAll('img')).forEach(img => {
      const item = makeItemFromElement(img, baseItem.href);
      if (!item) return;
      if (isPlaceholderLoot(item) || isSiteAssetItem(item)) return;

      const sameId = item.id && baseItem.id && item.id === baseItem.id;
      const sameImg = item.imgFile && baseItem.imgFile && item.imgFile === baseItem.imgFile;
      const sameName = item.nameKey && baseItem.nameKey && item.nameKey === baseItem.nameKey;

      if (sameId || sameImg || sameName || !best) {
        best = item;
        bestContext = getElementContextText(img);
      }
    });

    const pageStats = extractItemPageStats(doc, rawHtml, baseItem, h1);
    const bestStats = best && hasStats(best.stats) ? best.stats : null;
    const stats = Object.assign({}, baseItem.stats || {}, bestStats || {}, pageStats || {});
    const legendaryDescription = extractLegendaryDescription(doc, rawHtml);
    if (stats && legendaryDescription) stats._legbonDescription = legendaryDescription;
    const pageItemType = extractPageItemType(doc);
    if (stats) stats.type = itemClassType(stats._itemClass) || normalizeItemType(pageItemType || stats.type) || inferItemType(best || baseItem, h1 || baseItem.name, stats);
    const fallbackHtml = formatStats(stats) || best && best.fallbackHtml || baseItem.fallbackHtml;

    const rarity = detectRarity([
      detectRarityFromRawHtml(rawHtml, baseItem),
      pageStats && pageStats.rarity,
      best && best.rarity,
      best && best.tipHtml,
      best && best.fallbackHtml,
      fallbackHtml,
      bestContext,
      h1,
      text,
      classText
    ].join(' '));

    return {
      id: best && best.id || baseItem.id,
      name: cleanItemName(best && best.name) || cleanItemName(h1) || cleanItemName(baseItem.name) || 'Przedmiot',
      img: best && best.img || baseItem.img,
      rarity,
      stats,
      tipHtml: best && best.tipHtml || baseItem.tipHtml,
      fallbackHtml
    };
  }

  function hasStats(stats) {
    if (!stats || typeof stats !== 'object') return false;
    return Object.keys(stats).some(key => !/^(_|id$|rarity$)/.test(key));
  }

  function extractPageItemType(doc) {
    const candidates = [];

    Array.from(doc.querySelectorAll('[data-type],[data-item-type],p,li,div,span,strong,b')).forEach(el => {
      const attr = getAttr(el, ['data-item-type', 'data-type']);
      if (attr) candidates.push(clean(attr));

      const text = clean(el.textContent || '');
      const match = text.match(/^Typ\s*:\s*([^|,;]{2,40})$/i);
      if (match) candidates.push(clean(match[1]));
    });

    for (const candidate of candidates) {
      const type = normalizeItemType(candidate);
      if (type) return type;
    }
    return '';
  }

  function extractLegendaryDescription(doc, rawHtml) {
    const labels = Array.from(new Set(Object.values(LEGENDARY_BONUS_LABELS)))
      .sort((a, b) => b.length - a.length);
    const candidates = [];

    const addCandidate = value => {
      const text = clean(value || '');
      if (!text || !text.includes(':')) return;

      for (const label of labels) {
        const labelKey = norm(label);
        const colon = text.indexOf(':');
        if (colon < 0 || norm(text.slice(0, colon)) !== labelKey) continue;

        let description = clean(text.slice(colon + 1));
        if (description.length < 8) return;

        const sentence = description.match(/^(.{8,500}?[.!?])(?:\s|$)/);
        if (sentence) description = clean(sentence[1]);
        if (description.length >= 8 && description.length <= 520) candidates.push(description);
        return;
      }
    };

    Array.from(doc.querySelectorAll('p,li,div,span,strong,em,b')).forEach(el => {
      const text = clean(el.textContent || '');
      if (text.length <= 650) addCandidate(text);

      if (text.endsWith(':') && el.parentElement) {
        const parentText = clean(el.parentElement.textContent || '');
        if (parentText.length <= 900) addCandidate(parentText);
      }
    });

    const visibleText = String(doc.body && doc.body.textContent || '').replace(/\s+/g, ' ');
    labels.forEach(label => {
      const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const match = visibleText.match(new RegExp(escaped + '\\s*:\\s*(.{8,500}?[.!?])(?:\\s|$)', 'i'));
      if (match) addCandidate(label + ': ' + match[1]);
    });

    const decodedRaw = clean(deepDecode(rawHtml || ''));
    labels.forEach(label => {
      const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const match = decodedRaw.match(new RegExp(escaped + '\\s*:\\s*(.{8,500}?[.!?])(?:\\s|<|$)', 'i'));
      if (match) addCandidate(label + ': ' + stripHtml(match[1]));
    });

    if (!candidates.length) return '';
    candidates.sort((a, b) => a.length - b.length);
    return candidates[0];
  }

  function extractItemPageStats(doc, rawHtml, baseItem, h1) {
    const fromAttrs = extractStatsFromRawHtml(rawHtml, baseItem);
    const fromVisibleText = extractVisibleItemStats(doc, h1 || baseItem.name);
    const merged = Object.assign({}, fromVisibleText, fromAttrs);
    if (fromVisibleText.type) merged.type = fromVisibleText.type;
    if (fromVisibleText.reqp) merged.reqp = fromVisibleText.reqp;
    if (fromVisibleText.value) merged.value = fromVisibleText.value;
    if (fromVisibleText._rows || fromAttrs._rows) {
      merged._rows = [].concat(fromVisibleText._rows || [], fromAttrs._rows || []);
    }
    if (hasStats(merged)) return merged;

    return {};
  }

  function extractStatsFromRawHtml(rawHtml, item) {
    const chunks = collectItemChunks(rawHtml, item);
    const candidates = [];
    const patterns = [
      /(?:stats|stat|itemStats|data-stats|data-item-stats)\s*[:=]\s*["']([^"']*(?:lvl|reqp|dmg|ac|hp|sa|crit|opis|legbon)[^"']*)["']/gi,
      /["']([^"']*(?:lvl|reqp|dmg|ac|hp|sa|crit|opis|legbon)=[^"']*)["']/gi
    ];

    chunks.forEach(chunk => {
      patterns.forEach(pattern => {
        pattern.lastIndex = 0;
        let match;
        while ((match = pattern.exec(chunk))) {
          candidates.push(decodeJsAttr(match[1]));
        }
      });
    });

    let best = {};
    candidates.forEach(raw => {
      const parsed = parseStats(raw);
      if (Object.keys(parsed).length > Object.keys(best).length) best = parsed;
    });

    return best;
  }

  function collectItemChunks(rawHtml, item) {
    const raw = String(rawHtml || '');
    const needles = [
      item && item.id,
      item && item.imgFile,
      item && item.name,
      item && item.nameKey
    ].filter(Boolean).map(String);
    const chunks = [];

    needles.forEach(needle => {
      let index = raw.indexOf(needle);
      let guard = 0;
      while (index !== -1 && guard < 8) {
        chunks.push(raw.slice(Math.max(0, index - 2600), Math.min(raw.length, index + 2600)));
        index = raw.indexOf(needle, index + needle.length);
        guard++;
      }
    });

    chunks.push(raw.slice(0, 12000));
    return chunks;
  }

  function decodeJsAttr(value) {
    return deepDecode(String(value || '')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\x3c/gi, '<')
      .replace(/\\x3e/gi, '>')
      .replace(/\\x22/gi, '"')
      .replace(/\\x27/gi, "'"));
  }

  function extractVisibleItemStats(doc, itemName) {
    const root = findLikelyItemRoot(doc, itemName);
    const text = cleanMultiline(root ? root.textContent : doc.body.textContent || '');
    return parseVisibleStatsText(text);
  }

  function findLikelyItemRoot(doc, itemName) {
    const h1 = Array.from(doc.querySelectorAll('h1,h2,h3')).find(el => {
      const name = norm(itemName || '');
      return name && norm(el.textContent).includes(name);
    }) || doc.querySelector('h1');

    let node = h1;
    for (let i = 0; node && i < 5; i++) {
      const text = norm(node.textContent || '');
      if (
        text.includes('wymagany poziom') ||
        text.includes('profesja') ||
        text.includes('obrazenia') ||
        text.includes('pancerz') ||
        text.includes('bonus legendarny')
      ) return node;
      node = node.parentElement;
    }

    return h1 && h1.parentElement || doc.body;
  }

  function parseVisibleStatsText(text) {
    const stats = {};
    const rows = [];
    const value = cleanMultiline(text);
    const add = (key, label, raw) => {
      const found = clean(raw);
      if (!found) return;
      stats[key] = found;
      rows.push(label + ': ' + found);
    };
    const find = (key, label, regex) => {
      const match = value.match(regex);
      if (match) add(key, label, match[1]);
    };

    find('type', 'Typ', /typ\s*:?\s*([^\n]+)/i);
    find('lvl', 'Wymagany poziom', /(?:wymagany\s+poziom|poziom)\s*:?\s*(\d{1,3})/i);
    find('reqp', 'Profesja', /(?:wymagana\s+)?profesj[ae]\s*:?\s*([^\n]+)/i);
    find('ac', 'Pancerz', /pancerz\s*:?\s*([+\-]?\d+(?:\.\d+)?)/i);
    find('dmg', 'Obrazenia', /(?:obrazenia|atak)\s*:?\s*([+\-]?\d+(?:\s*-\s*\d+)?)/i);
    find('hp', 'Zycie', /(?:zycie|hp)\s*:?\s*\+?(\d+)/i);
    find('mana', 'Mana', /mana\s*:?\s*\+?(\d+)/i);
    find('energy', 'Energia', /energia\s*:?\s*\+?(\d+)/i);
    find('sa', 'SA', /\bSA\s*:?\s*\+?([\d.,]+)/i);
    find('crit', 'Krytyk', /kryt(?:yk|yczne)?\s*:?\s*\+?([\d.,]+%?)/i);
    find('evade', 'Unik', /unik\s*:?\s*\+?([\d.,]+%?)/i);
    find('all', 'Wszystkie cechy', /wszystkie\s+cechy\s*:?\s*\+?(\d+)/i);
    find('legbon', 'Bonus legendarny', /bonus\s+legendarny\s*:?\s*([^\n]+)/i);
    find('bind', 'Wiazanie', /wia[zs][ze]?\s+po\s+([^\n.]+)/i);
    find('value', 'Wartosc', /warto[sc][c]?\s*:?\s*([^\n]+)/i);

    if (rows.length) stats._rows = rows;
    return stats;
  }

  function cleanMultiline(value) {
    return stripHtml(value)
      .replace(/&nbsp;/g, ' ')
      .replace(/\r/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n\s+/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  function getElementContextText(el) {
    const parts = [];
    let node = el;

    for (let i = 0; node && i < 6; i++) {
      parts.push(
        node.className || '',
        node.id || '',
        getAttr(node, ['class', 'data-rarity', 'data-type', 'data-quality', 'data-item-type', 'title', 'alt', 'tip', 'data-tip', 'stats'])
      );

      if (node.previousElementSibling) {
        parts.push(node.previousElementSibling.textContent || '', node.previousElementSibling.className || '');
      }
      if (node.nextElementSibling) {
        parts.push(node.nextElementSibling.textContent || '', node.nextElementSibling.className || '');
      }

      node = node.parentElement;
    }

    return parts.join(' ');
  }

  function detectRarityFromRawHtml(html, item) {
    const raw = String(html || '');
    const id = item && item.id ? String(item.id) : '';
    const imgFile = item && item.imgFile ? String(item.imgFile) : '';
    const name = item && item.name ? String(item.name) : '';
    const needles = [id, imgFile, name].filter(Boolean);
    const chunks = [];

    needles.forEach(needle => {
      let index = raw.indexOf(needle);
      let guard = 0;

      while (index !== -1 && guard < 6) {
        chunks.push(raw.slice(Math.max(0, index - 1200), Math.min(raw.length, index + 1200)));
        index = raw.indexOf(needle, index + needle.length);
        guard++;
      }
    });

    chunks.push(raw.slice(0, 5000));
    return detectRarity(chunks.join(' '));
  }

  function mergeItemData(item, enriched) {
    if (!enriched) return;

    if (enriched.id) item.id = enriched.id;
    const enrichedName = cleanItemName(enriched.name);
    if (enrichedName) {
      item.name = enrichedName;
      item.nameKey = norm(enrichedName);
    }
    if (enriched.img) {
      item.img = enriched.img;
      item.imgKey = imageKey(enriched.img);
      item.imgFile = imageFile(enriched.img);
    }
    if (enriched.rarity && enriched.rarity !== 'unknown') item.rarity = enriched.rarity;
    if (enriched.stats && Object.keys(enriched.stats).length) item.stats = enriched.stats;
    if (enriched.tipHtml) item.tipHtml = enriched.tipHtml;
    if (enriched.fallbackHtml) item.fallbackHtml = enriched.fallbackHtml;
  }

  function parseMobDetails(html, mob) {
    const doc = parseHtml(html);
    const h1 = doc.querySelector('h1');
    const name = clean(h1 ? h1.textContent : mob.name);
    const image = extractMainImage(doc, name) || mob.image;
    const typeText = extractTypeText(doc, h1) || `${mob.category} ${mob.level || ''}${mob.prof || ''}`;
    const location = extractSectionText(doc, 'Lokacja') || 'Brak danych';
    const items = extractLootItems(doc, mob.url, mob.lootCount);

    return {
      mob,
      name,
      image,
      typeText: clean(typeText),
      location,
      items
    };
  }

  function extractMainImage(doc, name) {
    const imgs = Array.from(doc.querySelectorAll('img'));
    const npcImg = imgs.find(img => {
      const src = imgSrc(img);
      return src.includes('/npc/') || src.includes('obrazki/npc');
    });
    if (npcImg) return abs(imgSrc(npcImg));

    const nameKey = norm(name);
    const byAlt = imgs.find(img => norm(img.getAttribute('alt') || img.getAttribute('title') || '').includes(nameKey));
    return byAlt ? abs(imgSrc(byAlt)) : '';
  }

  function extractTypeText(doc, h1) {
    if (!h1) return '';
    let node = h1.nextSibling;
    let guard = 0;
    while (node && guard < 12) {
      const text = clean(node.textContent || '');
      if (text && text.includes('(') && text.includes(')')) return text;
      node = node.nextSibling;
      guard++;
    }
    return '';
  }

  function extractSectionText(doc, heading) {
    const h = Array.from(doc.querySelectorAll('h1,h2,h3,h4,h5'))
      .find(el => norm(el.textContent).includes(norm(heading)));
    if (!h) return '';

    const chunks = [];
    let node = h.nextElementSibling;
    let guard = 0;
    while (node && guard < 20) {
      if (/^h[1-5]$/i.test(node.tagName || '')) break;
      const text = clean(node.textContent || '');
      if (text) chunks.push(text);
      node = node.nextElementSibling;
      guard++;
    }

    return chunks.join('\n');
  }

  function extractLootItems(doc, sourceUrl, expectedCount) {
    const lootHeading = Array.from(doc.querySelectorAll('h1,h2,h3,h4,h5'))
      .find(el => norm(el.textContent).includes('looty'));

    const container = document.createElement('div');
    if (lootHeading) {
      let node = lootHeading.nextElementSibling;
      let guard = 0;
      while (node && guard < 25) {
        if (/^h[1-5]$/i.test(node.tagName || '') && !norm(node.textContent).includes('looty')) break;
        container.appendChild(node.cloneNode(true));
        node = node.nextElementSibling;
        guard++;
      }
    } else {
      container.innerHTML = doc.body.innerHTML;
    }

    let items = collectLootItemsFromRoot(container, sourceUrl);
    if (expectedCount && items.length < expectedCount) {
      const wideItems = collectLootItemsFromRoot(doc.body, sourceUrl);
      if (wideItems.length > items.length) items = wideItems;
    }
    items = normalizeLootItems(items, expectedCount);

    return items.sort((a, b) => rarityInfo(a.rarity).order - rarityInfo(b.rarity).order || a.name.localeCompare(b.name, 'pl'));
  }

  function normalizeLootItems(items, expectedCount) {
    let result = items.filter(item => item && item.img && !isPlaceholderLoot(item) && !isSiteAssetItem(item));
    if (!result.length) result = items.filter(item => item && !isPlaceholderLoot(item) && !isSiteAssetItem(item));
    if (expectedCount && result.length > expectedCount) {
      result = result
        .map((item, index) => ({ item, index, score: lootScore(item) }))
        .sort((a, b) => b.score - a.score || a.index - b.index)
        .slice(0, expectedCount)
        .sort((a, b) => a.index - b.index)
        .map(entry => entry.item);
    }
    return result;
  }

  function lootScore(item) {
    let score = 0;
    if (item.img) score += 20;
    if (item.href) score += 8;
    if (item.rarity && item.rarity !== 'unknown') score += 12;
    if (item.name && item.name !== 'Przedmiot') score += 4;
    if (item.tipHtml || item.fallbackHtml) score += 4;
    if (item.imgFile && !/logo|placeholder|blank|default|empty|margohelp/i.test(item.imgFile)) score += 8;
    if (imageKey(item.img).includes('/obrazki/itemy/')) score += 8;
    if (imageKey(item.img).includes('/obrazki/npc/')) score -= 40;
    if (isSiteAssetItem(item)) score -= 1000;
    return score;
  }

  function isPlaceholderLoot(item) {
    const key = imageKey(item && item.img || '');
    const file = imageFile(item && item.img || '');
    if (!key && !item.href) return true;
    if (/logo|placeholder|blank|default|empty|margohelp-dark/i.test(file)) return true;
    if (key.includes('/obrazki/npc/')) return true;
    return false;
  }

  function isSiteAssetItem(item) {
    if (!item) return true;
    const raw = [item.name, item.href, item.img, item.imgFile, item.imgKey].join(' ').toLowerCase();
    const nameText = norm(item.name || '');
    const fileText = norm(item.imgFile || imageFile(item.img || ''));
    const text = norm(raw);
    if (!text) return false;
    if (nameText === 'margohelp pl' || nameText === 'margohelp' || nameText === 'margonemhelp') return true;
    if (fileText.includes('margohelp dark') || fileText.includes('margohelp logo')) return true;
    if (raw.includes('/assets/') || raw.includes('/static/') || raw.includes('/images/logo')) return true;
    if (/\b(logo|brand|favicon|sprite|placeholder|blank|default|empty)\b/.test(text)) return true;
    return false;
  }

  function collectLootItemsFromRoot(root, sourceUrl) {
    const items = [];
    const seenFallback = new Set();
    const lootNodes = collectLootNodes(root);

    lootNodes.forEach(({ el, kind }, index) => {
      const item = makeItemFromElement(el, sourceUrl);
      if (!item) return;
      if (isPlaceholderLoot(item) || isSiteAssetItem(item)) return;
      if (!item.rarity || item.rarity === 'unknown') {
        item.rarity = inferRarityAroundElement(el);
      }
      if (kind !== 'img') {
        const key = item.href || item.id || itemExactLootKey(item) || 'loot-link:' + index;
        if (seenFallback.has(key)) return;
        seenFallback.add(key);
      }
      item.sourceIndex = index;
      items.push(item);
    });

    return items;
  }

  function collectLootNodes(root) {
    const imgNodes = Array.from(root.querySelectorAll('img')).map(el => ({ el, kind: 'img' }));
    const bgNodes = Array.from(root.querySelectorAll('[style],[data-bg],[data-background],[data-image],[data-img],[data-src],[data-original],[data-lazy-src]'))
      .filter(el => !el.matches('img') && !el.querySelector('img') && elementImageSrc(el))
      .map(el => ({ el, kind: 'bg' }));
    const linkNodes = Array.from(root.querySelectorAll('a[href*="/przedmioty/"],a[href*="/item/"],a[href*="/items/"],a[href*="/przedmiot/"]'))
      .filter(a => !a.querySelector('img') && !elementImageSrc(a))
      .map(el => ({ el, kind: 'link' }));

    return [...imgNodes, ...bgNodes, ...linkNodes];
  }

  function itemExactLootKey(item) {
    if (!item) return '';
    const parts = [
      item.href || '',
      item.imgKey || '',
      item.nameKey || '',
      item.rarity || ''
    ].filter(Boolean);
    return parts.length ? parts.join('|') : '';
  }

  function inferRarityAroundElement(el) {
    const texts = [];

    let node = el;
    for (let i = 0; node && i < 5; i++) {
      texts.push(node.className || '', node.getAttribute && node.getAttribute('data-rarity') || '');

      let prev = node.previousElementSibling;
      let guard = 0;
      while (prev && guard < 6) {
        if (/^h[1-6]$/i.test(prev.tagName || '') || norm(prev.className).includes('title')) {
          texts.push(prev.textContent || '', prev.className || '');
          break;
        }
        prev = prev.previousElementSibling;
        guard++;
      }

      node = node.parentElement;
    }

    return detectRarity(texts.join(' '));
  }

  function makeItemFromElement(el, sourceUrl) {
    const link = el.matches && el.matches('a') ? el : el.closest && el.closest('a');
    const img = el.tagName && el.tagName.toLowerCase() === 'img' ? el : link && link.querySelector('img');
    const bgSrc = !img ? elementImageSrc(el) || elementImageSrc(link) : '';

    const dataItemRaw = deepDecode(
      getAttrDeep(el, ['data-item', 'data-item-data', 'data-object', 'data-entry', 'data-stats-json']) ||
      getAttrDeep(link, ['data-item', 'data-item-data', 'data-object', 'data-entry', 'data-stats-json']) ||
      getAttrDeep(img, ['data-item', 'data-item-data', 'data-object', 'data-entry', 'data-stats-json'])
    );
    const dataItem = parseItemDataObject(dataItemRaw);

    if (!img && !link && !bgSrc && !dataItem.icon && !dataItem.img) return null;

    const href = link ? abs(link.getAttribute('href') || '') : '';
    const src =
      (img ? abs(imgSrc(img), sourceUrl) : '') ||
      abs(bgSrc, sourceUrl) ||
      itemIconUrl(dataItem.icon || dataItem.img || '', sourceUrl);

    const statsRaw = deepDecode(
      dataItem.stat ||
      dataItem.stats ||
      getAttrDeep(el, ['stats', 'stat', 'data-stats', 'data-stat', 'data-item-stats', 'data-tip-stats']) ||
      getAttrDeep(link, ['stats', 'stat', 'data-stats', 'data-stat', 'data-item-stats', 'data-tip-stats']) ||
      getAttrDeep(img, ['stats', 'stat', 'data-stats', 'data-stat', 'data-item-stats', 'data-tip-stats']) ||
      dataItemRaw
    );

    const tipRaw = deepDecode(
      getAttrDeep(el, ['tip', 'data-tip', 'data-original-title', 'title', 'alt']) ||
      getAttrDeep(link, ['tip', 'data-tip', 'data-original-title', 'title', 'alt']) ||
      getAttrDeep(img, ['tip', 'data-tip', 'data-original-title', 'title', 'alt'])
    );

    const stats = parseStats(statsRaw);
    const attrItemClass = getAttrDeep(el, ['data-cl', 'cl']) ||
      getAttrDeep(link, ['data-cl', 'cl']) ||
      getAttrDeep(img, ['data-cl', 'cl']);
    if (dataItem.id && !stats.id) stats.id = String(dataItem.id);
    if (dataItem.name && !stats.name) stats.name = dataItem.name;
    if (dataItem.cl != null) stats._itemClass = dataItem.cl;
    if (attrItemClass !== '') stats._itemClass = attrItemClass;
    if (!stats.type) stats.type = dataItem.itemType || dataItem.item_type || dataItem.type || dataItem.category || '';
    if (dataItem.cl && !stats.rarity && !/^\d+$/.test(String(dataItem.cl))) stats.rarity = rarityFromItemClass(dataItem.cl);

    const dataName = cleanItemName(dataItem.name || '');
    const name = dataName || extractItemName(link, img, statsRaw, tipRaw);
    stats.type = itemClassType(stats._itemClass) || normalizeItemType(stats.type) || inferItemType({ name, img: src, imgFile: imageFile(src), href }, name, stats);
    if (!name && !src && !href) return null;

    const rarity = detectRarity([
      stats.rarity,
      dataItem.rarity,
      dataItem.cl,
      statsRaw,
      dataItemRaw,
      tipRaw,
      link && link.className,
      img && img.className,
      el && el.className
    ].join(' '));

    return {
      id: extractItemId(href) || stats.id || dataItem.id || '',
      name: name || 'Przedmiot',
      nameKey: norm(name || ''),
      href,
      img: src,
      imgKey: imageKey(src),
      imgFile: imageFile(src),
      rarity,
      stats,
      tipHtml: tipRaw && !looksLikeRawStats(tipRaw) ? sanitizeTip(tipRaw) : '',
      fallbackHtml: formatStats(stats)
    };
  }

  function parseItemDataObject(raw) {
    let text = deepDecode(String(raw || '')).trim();
    if (!text || !text.includes('{')) return {};

    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) return {};

    text = text.slice(start, end + 1);

    try {
      return JSON.parse(text);
    } catch (e) {}

    try {
      return JSON.parse(
        text
          .replace(/&quot;/g, '"')
          .replace(/&#34;/g, '"')
          .replace(/&#39;/g, "'")
      );
    } catch (e) {}

    return {};
  }

  function getAttrDeep(el, attrs, depth = 7) {
    let node = el;

    for (let i = 0; node && i < depth; i++) {
      const value = getAttr(node, attrs);
      if (value) return value;
      node = node.parentElement;
    }

    return '';
  }

  function itemIconUrl(icon, sourceUrl) {
    const value = String(icon || '').trim();
    if (!value) return '';

    if (/^https?:\/\//i.test(value)) return value;
    if (value.startsWith('/')) return abs(value, sourceUrl);
    if (value.includes('/obrazki/itemy/')) return abs(value, sourceUrl);

    return 'https://micc.garmory-cdn.cloud/obrazki/itemy/' + value.replace(/^\/+/, '');
  }

  function rarityFromItemClass(cl) {
    const value = String(cl || '').toLowerCase();

    if (value.includes('legend')) return 'legendary';
    if (value.includes('hero')) return 'heroic';
    if (value.includes('unique') || value.includes('unik')) return 'unique';
    if (value.includes('upg') || value.includes('ulep')) return 'upgraded';
    if (value.includes('common') || value.includes('posp')) return 'common';

    return '';
  }

  function extractItemName(link, img, statsRaw, tipRaw) {
    const tipTitle = String(tipRaw || '').match(/<b[^>]*>(.*?)<\/b>/i) || String(tipRaw || '').match(/<span[^>]*class=["'][^"']*name[^"']*["'][^>]*>(.*?)<\/span>/i);
    const tipName = tipTitle ? clean(stripHtml(tipTitle[1])) : '';
    if (tipName && !isBadItemName(tipName)) return tipName;

    const title = clean(
      getAttr(img, ['alt', 'title', 'data-original-title', 'aria-label']) ||
      getAttr(link, ['title', 'data-original-title', 'aria-label']) ||
      (link ? link.textContent : '')
    );
    if (title && !title.includes('||') && !isBadItemName(title)) return title;

    const statsName = clean((String(statsRaw || '').split('||')[0]) || '');
    if (statsName && !isBadItemName(statsName)) return statsName;

    return '';
  }

  function looksLikeRawStats(value) {
    const raw = stripHtml(deepDecode(String(value || '')))
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!raw) return false;

    const equalStats = raw.match(/(?:^|;)\s*[a-z_]+\s*=/gi) || [];
    if (equalStats.length >= 2) return true;

    if (/(?:^|;)\s*(lvl|reqp|ac|dmg|hp|mana|energy|sa|crit|evade|da|dz|reslight|resfire|rescold|resdmg|opis|rarity|legbon)\s*=/i.test(raw) && raw.includes(';')) return true;
    if (/^(binds|legendary|heroic|unique|upgraded|common)\s*;/i.test(raw) && raw.includes('=')) return true;
    if (/\|\|.*(?:lvl|reqp|ac|dmg|hp|sa|crit|opis|legbon)=/i.test(raw)) return true;

    return false;
  }

  function isBadItemName(name) {
    const value = clean(name || '');
    const text = norm(value);
    if (!text || text === 'przedmiot') return true;
    if (looksLikeRawStats(value)) return true;
    if (text.includes('margohelp') || text.includes('margonemhelp')) return true;
    if (/^(di|ds|da|sa|ac|hp|mana|energy|blok|crit|evade|dmg|lvl)\s*[:+=-]?\s*\d/i.test(text)) return true;
    if (/^(di|ds|da|sa|ac|hp|mana|energy|blok|crit|evade|dmg|lvl)\b/i.test(text) && text.length <= 8) return true;
    if (/\.(png|gif|jpg|jpeg|webp|svg)$/i.test(value)) return true;
    return false;
  }

  function cleanItemName(name) {
    const value = clean(name || '');
    return isBadItemName(value) ? '' : value;
  }

  function renderDetails(details) {
    const box = document.getElementById('mhb-details');
    const groups = groupItems(details.items);
    const rarityCount = details.items.filter(i => i.rarity && i.rarity !== 'unknown').length;

    box.innerHTML = `
      <div class="mhb-card">
        <div class="mhb-mob-top">
          <div class="mhb-bigimg">${details.image ? `<img src="${esc(details.image)}" alt="">` : '<span class="mhb-placeholder"></span>'}</div>
          <div>
            <div class="mhb-row"><span>Mob:</span><span class="mhb-value">${esc(details.name)}</span></div>
            <div class="mhb-row"><span>Typ:</span><span class="mhb-value">${esc(details.typeText)}</span></div>
            <div class="mhb-row"><span>Looty:</span><span class="mhb-value">${details.items.length} | rozpoznane ${rarityCount}</span></div>
          </div>
        </div>
        <div class="mhb-actions">
          <button class="mhb-btn" id="mhb-open">Otworz MargoHelp</button>
          <button class="mhb-btn" id="mhb-copy">Kopiuj nazwe</button>
        </div>
      </div>

      <div class="mhb-section-title mhb-title-row"><span>Looty</span>${renderDropChanceHelp(details)}</div>
      ${groups.map(group => renderItemGroup(group)).join('') || '<div class="mhb-empty">Brak lootow na stronie.</div>'}
    `;

    document.getElementById('mhb-open').addEventListener('click', () => window.open(details.mob.url, '_blank'));
    document.getElementById('mhb-copy').addEventListener('click', () => copyText(details.name));
    const chanceSelect = document.getElementById('mhb-e2-chance-variant');
    if (chanceSelect) {
      chanceSelect.addEventListener('change', e => {
        e2ChanceVariant = ELITY_II_CHANCE_VARIANTS[e.target.value] ? e.target.value : 'standard';
        saveJson(STORE_E2_CHANCE_VARIANT, e2ChanceVariant);
        const rowsBox = document.getElementById('mhb-e2-chance-rows');
        const variant = ELITY_II_CHANCE_VARIANTS[e2ChanceVariant];
        if (rowsBox && variant) rowsBox.innerHTML = renderChanceRows(variant.rows);
      });
    }
    const chanceHelp = document.querySelector('#mhb-details .mhb-drop-help');
    if (chanceHelp) {
      chanceHelp.addEventListener('click', e => {
        if (e.target.closest('select, option')) return;
        e.stopPropagation();
        chanceHelp.classList.toggle('open');
      });
    }
    bindItemTooltips(details);
  }

  function renderDropChanceHelp(details) {
    if (!details || !details.mob) return '';
    const category = details.mob.category;
    if (category !== 'Elity II') {
      if (!['Elity', 'Herosi', 'Kolosi', 'Tytani'].includes(category)) return '';
      const rows = DROP_CHANCES[category] || [['Brak danych', 'Brak pewnych danych']];
      const hasData = !(rows.length === 1 && rows[0][0] === 'Brak danych');
      return `
        <div class="mhb-drop-help" tabindex="0" aria-label="Przybliżone szanse na łup">?
          <div class="mhb-drop-popover">
            <strong>Przybliżone szanse na łup — ${esc(category)}</strong>
            <div id="mhb-chance-static-rows">${renderChanceRows(rows)}</div>
            <div class="mhb-chance-note">${hasData ? 'Wartości są przybliżone i mogą różnić się zależnie od mechanizmu.' : 'Nie ma obecnie pewnych, publicznie potwierdzonych wartości dla tej kategorii.'}</div>
          </div>
        </div>
      `;
    }
    const variant = ELITY_II_CHANCE_VARIANTS[e2ChanceVariant] || ELITY_II_CHANCE_VARIANTS.standard;
    const options = Object.entries(ELITY_II_CHANCE_VARIANTS).map(([key, entry]) =>
      `<option value="${esc(key)}"${key === e2ChanceVariant ? ' selected' : ''}>${esc(entry.label)}</option>`
    ).join('');

    return `
      <div class="mhb-drop-help" tabindex="0" aria-label="Przybliżone szanse na łup">?
        <div class="mhb-drop-popover">
          <strong>Przybliżone szanse na łup</strong>
        <div class="mhb-chance-head">
          <span>Wariant:</span>
          <select class="mhb-chance-select" id="mhb-e2-chance-variant">${options}</select>
        </div>
        <div id="mhb-e2-chance-rows">${renderChanceRows(variant.rows)}</div>
        <div class="mhb-chance-note">Wartości są przybliżone. Wybierz wariant odpowiadający mechanizmowi danej Elity II.</div>
        </div>
      </div>
    `;
  }

  function renderChanceRows(rows) {
    return (rows || []).map(row => `<div class="mhb-chance-row"><span>${esc(row[0])}</span><strong>${esc(row[1])}</strong></div>`).join('');
  }

  function groupItems(items) {
    const map = new Map();
    items.forEach(item => {
      const rarity = item.rarity || 'unknown';
      if (!map.has(rarity)) {
        map.set(rarity, { rarity, label: rarityInfo(rarity).label, items: [] });
      }
      map.get(rarity).items.push(item);
    });

    return Array.from(map.values()).sort((a, b) => rarityInfo(a.rarity).order - rarityInfo(b.rarity).order);
  }

  function renderItemGroup(group) {
    const info = rarityInfo(group.rarity);
    return `
      <div class="mhb-rarity">
        <h4><span>${esc(group.label)}</span><span>${group.items.length}</span></h4>
        <div class="mhb-loot">
          ${group.items.map((item, index) => `
            <div class="mhb-item ${info.cls}" data-item="${esc(group.rarity + ':' + index)}" aria-label="${esc(item.name)}">
              ${item.img ? `<img src="${esc(item.img)}" alt="${esc(item.name)}">` : esc(item.name.slice(0, 2))}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function bindItemTooltips(details) {
    const byKey = {};
    groupItems(details.items).forEach(group => {
      group.items.forEach((item, index) => {
        byKey[group.rarity + ':' + index] = item;
      });
    });

    document.querySelectorAll('#mhb-details .mhb-item').forEach(el => {
      const item = byKey[el.dataset.item];
      if (!item) return;

      el.addEventListener('mouseenter', e => showItemTip(item, e.clientX, e.clientY));
      el.addEventListener('mousemove', e => moveTip(e.clientX, e.clientY));
      el.addEventListener('mouseleave', () => tooltip.style.display = 'none');
      el.addEventListener('click', () => {
        if (item.href) window.open(item.href, '_blank');
      });
    });
  }

  function showItemTip(item, x, y) {
    const rarity = item.rarity || 'unknown';
    const title = cleanItemName(item.name) || 'Przedmiot';
    const itemType = clean(item.stats && item.stats.type || '');
    const rarityLabels = {
      legendary: 'Legendarny', heroic: 'Heroiczny', unique: 'Unikatowy',
      upgraded: 'Ulepszony', common: 'Pospolity', unknown: 'Przedmiot'
    };
    const safeTipHtml = item.tipHtml && !looksLikeRawStats(item.tipHtml) ? item.tipHtml : '';
    const bodyHtml = item.fallbackHtml || safeTipHtml || '';

    tooltip.className = 'mhb-tip mhb-tip-' + rarity + (colorElements ? ' mhb-color-elements' : '');
    tooltip.innerHTML = `
      <div class="mhb-tip-head">
        <div class="mhb-tip-img">${item.img ? `<img src="${esc(item.img)}" alt="">` : ''}</div>
        <div>
          <div class="mhb-tip-title">${esc(title)}</div>
          ${itemType ? `<div class="mhb-tip-type">Typ: ${esc(itemType)}</div>` : ''}
        </div>
      </div>
      <div class="mhb-tip-rarity">${esc(rarityLabels[rarity] || rarityInfo(rarity).label)}</div>
      ${bodyHtml ? `<div class="mhb-tip-body">${bodyHtml}</div>` : ''}
    `;
    tooltip.style.display = 'block';
    moveTip(x, y);
  }

  function moveTip(x, y) {
    const pad = 14;
    const rect = tooltip.getBoundingClientRect();
    let left = x + pad;
    let top = y + pad;

    if (left + rect.width > window.innerWidth - 8) left = x - rect.width - pad;
    if (top + rect.height > window.innerHeight - 8) top = y - rect.height - pad;

    tooltip.style.left = Math.max(6, left) + 'px';
    tooltip.style.top = Math.max(6, top) + 'px';
  }

  function renderEmptyDetails(text) {
    const box = document.getElementById('mhb-details');
    box.innerHTML = `<div class="mhb-empty">${esc(text)}</div>`;
  }

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function getCachedText(key, url, force, hours) {
    const cache = loadJson(STORE_CACHE, {});
    const fresh = cache[key] && Date.now() - cache[key].ts < hours * 60 * 60 * 1000;
    if (!force && fresh && cache[key].text) return cache[key].text;

    const text = await gmGet(url);
    cache[key] = { ts: Date.now(), text };
    saveJson(STORE_CACHE, cache);
    return text;
  }

  function gmGet(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        anonymous: false,
        withCredentials: true,
        headers: { Accept: 'text/html,application/xhtml+xml,*/*' },
        onload: res => {
          const status = Number(res.status || 0);
          const text = String(res.responseText || '');
          if (status && (status < 200 || status >= 300)) {
            reject(new Error('HTTP ' + status + ' ' + url));
            return;
          }
          if (!text.trim()) {
            reject(new Error('Pusta odpowiedz ' + url));
            return;
          }
          resolve(text);
        },
        onerror: err => reject(err)
      });
    });
  }

  function parseHtml(html) {
    return new DOMParser().parseFromString(deepDecode(html || ''), 'text/html');
  }

  function parseStats(raw) {
    const stats = {};
    let text = deepDecode(String(raw || '')).trim();

    if (!text) return stats;

    const dataObj = parseItemDataObject(text);
    if (dataObj && Object.keys(dataObj).length) {
      if (dataObj.id) stats.id = String(dataObj.id);
      if (dataObj.rarity) stats.rarity = String(dataObj.rarity);
      if (dataObj.cl != null) stats._itemClass = dataObj.cl;
      if (!stats.type) stats.type = dataObj.itemType || dataObj.item_type || dataObj.type || dataObj.category || '';
      if (dataObj.cl && !stats.rarity && !/^\d+$/.test(String(dataObj.cl))) stats.rarity = rarityFromItemClass(dataObj.cl);
      if (dataObj.name) stats.name = String(dataObj.name);

      if (dataObj.stat || dataObj.stats) {
        text = deepDecode(String(dataObj.stat || dataObj.stats || ''));
      }
    }

    const statMatch =
      text.match(/["']stat["']\s*:\s*["']([^"']+)["']/i) ||
      text.match(/&quot;stat&quot;\s*:\s*&quot;([^&]+)&quot;/i);

    if (statMatch) {
      text = deepDecode(statMatch[1]);
    }

    const parts = text.split('||');
    const line = parts[1] && parts[1].includes('=') ? parts[1] : text;

    String(line).split(';').forEach(pair => {
      if (!pair) return;

      const [keyRaw, ...rest] = pair.split('=');
      const key = normalizeStatKey(keyRaw);
      if (!isAllowedStatKey(key)) return;

      stats[key] = rest.length ? clean(rest.join('=')) : true;
    });

    if (parts[3] && !stats.id) stats.id = clean(parts[3]);
    rememberStatKeys(stats);
    return stats;
  }

  function normalizeStatKey(key) {
    return clean(key || '').trim().toLowerCase();
  }

  function isAllowedStatKey(key) {
    if (!key) return false;
    if (key.length > 32) return false;
    return /^[a-z][a-z0-9_]*$/i.test(key);
  }

  function shouldHideStatKey(key) {
    return HIDDEN_STAT_KEYS.has(normalizeStatKey(key));
  }

  function formatPlainStat(label, value) {
    return `${esc(label)}: <span class="mhb-tip-stat-value">${esc(value)}</span>`;
  }

  function formatPlusStat(label, value) {
    const text = String(value || '');
    return formatPlainStat(label, /^[+\-]/.test(text) ? text : '+' + text);
  }

  function formatPercentPlusStat(label, value) {
    const text = String(value || '');
    if (text.includes('%')) return formatPlainStat(label, text);
    return formatPlainStat(label, /^[+\-]/.test(text) ? text + '%' : '+' + text + '%');
  }

  function colorStatValues(html, element) {
    return String(html || '').replace('class="mhb-tip-stat-value"', `class="mhb-tip-stat-value mhb-stat-${element}"`);
  }

  function formatStats(stats) {
    if (!stats || !Object.keys(stats).length) return '';

    const rows = [];
    const used = new Set();
    const handled = new Set();
    const prof = { w: 'wojownik', p: 'paladyn', m: 'mag', l: 'łowca', h: 'łowca', r: 'łowca', b: 'tancerz ostrzy', t: 'tropiciel' };

    const add = (key, text, html) => {
      key = normalizeStatKey(key);
      if (!key || shouldHideStatKey(key) || !text || used.has(key + ':' + text)) return;
      handled.add(key);
      used.add(key + ':' + text);
      rows.push({ text, html: !!html });
    };

    const addPlain = (key, label, value) => {
      if (value === true || value === '' || value == null) return;
      add(key, formatPlainStat(label, value), true);
    };

    const addPlus = (key, label, value) => {
      if (value === true || value === '' || value == null) return;
      add(key, formatPlusStat(label, value), true);
    };

    const addPercent = (key, label, value) => {
      if (value === true || value === '' || value == null) return;
      add(key, formatPercentPlusStat(label, value), true);
    };

    if (stats.type) handled.add('type');
    if (stats.ac) addPlain('ac', STAT_LABELS.ac, stats.ac);
    if (stats.dmg) addPlain('dmg', STAT_LABELS.dmg, stats.dmg);
    if (stats.pdmg) addPlus('pdmg', STAT_LABELS.pdmg, stats.pdmg);
    if (stats.acdmg) add('acdmg', `Niszczy <span class="mhb-tip-stat-value">${esc(stats.acdmg)}</span> punktów pancerza podczas ciosu`, true);

    if (stats.fire) add('fire', colorStatValues(formatPlusStat(STAT_LABELS.fire, stats.fire), 'fire'), true);
    if (stats.cold) add('cold', colorStatValues(formatFrostStat(stats.cold), 'frost'), true);
    if (stats.frost) add('frost', colorStatValues(formatFrostStat(stats.frost), 'frost'), true);
    if (stats.light) add('light', colorStatValues(formatPlusStat(STAT_LABELS.light, stats.light), 'light'), true);
    if (stats.poison) add('poison', colorStatValues(formatPoisonStat(stats.poison), 'poison'), true);
    if (stats.wound) add('wound', formatWoundStat(stats.wound), true);

    if (stats.resfire) add('resfire', colorStatValues(formatPercentPlusStat(STAT_LABELS.resfire, stats.resfire), 'fire'), true);
    if (stats.rescold) add('rescold', colorStatValues(formatPercentPlusStat(STAT_LABELS.rescold, stats.rescold), 'frost'), true);
    if (stats.resfrost) add('resfrost', colorStatValues(formatPercentPlusStat(STAT_LABELS.resfrost, stats.resfrost), 'frost'), true);
    if (stats.reslight) add('reslight', colorStatValues(formatPercentPlusStat(STAT_LABELS.reslight, stats.reslight), 'light'), true);
    if (stats.act) add('act', colorStatValues(formatPercentPlusStat(STAT_LABELS.act, stats.act), 'poison'), true);
    if (stats.resdmg) add('resdmg', `Niszczenie odporności magicznych o <span class="mhb-tip-stat-value">${esc(stats.resdmg)}%</span> podczas ciosu`, true);
    if (stats.respred) {
      const recovery = String(stats.respred).replace(/^\+/, '').replace(/%$/, '');
      add('respred', `Przyśpiesza wracanie do siebie o <span class="mhb-tip-stat-value">${esc(recovery)}%</span>`, true);
    }

    if (stats.crit) addPercent('crit', STAT_LABELS.crit, stats.crit);
    if (stats.critmval) addPercent('critmval', STAT_LABELS.critmval, stats.critmval);
    if (stats.critval) addPercent('critval', STAT_LABELS.critval, stats.critval);
    if (stats.lowcrit) addPercent('lowcrit', STAT_LABELS.lowcrit, stats.lowcrit);
    if (stats.lowevade) add('lowevade', `Podczas ataku unik przeciwnika jest mniejszy o <span class="mhb-tip-stat-value">${esc(stats.lowevade)}</span>`, true);
    if (stats.lowdmg) addPercent('lowdmg', STAT_LABELS.lowdmg, stats.lowdmg);
    if (stats.evade) addPlus('evade', STAT_LABELS.evade, stats.evade);

    if (stats.all) addPlus('all', STAT_LABELS.all, stats.all);
    else if (stats.da) addPlus('da', STAT_LABELS.da, stats.da);
    if (stats.dz) addPlus('dz', STAT_LABELS.dz, stats.dz);
    if (stats.ds) addPlus('ds', STAT_LABELS.ds, stats.ds);
    if (stats.di) addPlus('di', STAT_LABELS.di, stats.di);
    if (stats.str) addPlus('str', STAT_LABELS.str, stats.str);
    if (stats.agi) addPlus('agi', STAT_LABELS.agi, stats.agi);
    if (stats.int) addPlus('int', STAT_LABELS.int, stats.int);

    if (stats.hpbon) {
      const hpPerStrength = String(stats.hpbon).replace(/^\+/, '').replace(/%$/, '');
      add('hpbon', `<span class="mhb-tip-stat-value">+${esc(hpPerStrength)}</span> życia za 1 pkt siły`, true);
    }
    if (stats.hp) addPlus('hp', STAT_LABELS.hp, stats.hp);
    if (stats.manabon) addPlus('manabon', STAT_LABELS.manabon, stats.manabon);
    if (stats.mana) addPlus('mana', STAT_LABELS.mana, stats.mana);
    if (stats.energybon) addPlus('energybon', STAT_LABELS.energybon, stats.energybon);
    if (stats.energy) addPlus('energy', STAT_LABELS.energy, stats.energy);
    if (stats.sa) addPlain('sa', STAT_LABELS.sa, '+' + formatHundredths(stats.sa));

    if (stats.heal) add('heal', `Przywraca <span class="mhb-tip-stat-value">${esc(stats.heal)}</span> ${pointWord(stats.heal)} życia podczas walki`, true);
    if (stats.afterheal) addPlain('afterheal', STAT_LABELS.afterheal, stats.afterheal);
    if (stats.leczy) addPlain('leczy', STAT_LABELS.leczy, stats.leczy);
    if (stats.manafatig) addPlain('manafatig', STAT_LABELS.manafatig, stats.manafatig);
    if (stats.enfatig) addPlain('enfatig', STAT_LABELS.enfatig, stats.enfatig);

    if (stats.abs) addPlain('abs', STAT_LABELS.abs, stats.abs);
    if (stats.absorb) add('absorb', `Absorbuje do <span class="mhb-tip-stat-value">${esc(stats.absorb)}</span> obrażeń fizycznych`, true);
    if (stats.absorbm) add('absorbm', `Absorbuje do <span class="mhb-tip-stat-value">${esc(stats.absorbm)}</span> obrażeń magicznych`, true);
    if (stats.abdest) addPlain('abdest', STAT_LABELS.abdest, stats.abdest);
    if (stats.adest) addPlain('adest', STAT_LABELS.adest, stats.adest);
    if (stats.blok) addPlus('blok', STAT_LABELS.blok, stats.blok);
    if (stats.contra) addPercent('contra', STAT_LABELS.contra, stats.contra);
    if (stats.pierce) addPercent('pierce', STAT_LABELS.pierce, stats.pierce);
    if (stats.pierceb) add('pierceb', `<span class="mhb-tip-stat-value">${esc(stats.pierceb)}%</span> szans na zablokowanie przebicia`, true);
    if (stats.slow) add('slow', `Obniża SA przeciwnika o <span class="mhb-tip-stat-value">${esc(formatHundredths(stats.slow))}</span>`, true);

    if (stats.dmgmulphysical) addPercent('dmgmulphysical', STAT_LABELS.dmgmulphysical, stats.dmgmulphysical);
    if (stats.dmgmulfire) addPercent('dmgmulfire', STAT_LABELS.dmgmulfire, stats.dmgmulfire);
    if (stats.dmgmulfrost) addPercent('dmgmulfrost', STAT_LABELS.dmgmulfrost, stats.dmgmulfrost);
    if (stats.dmgmullight) addPercent('dmgmullight', STAT_LABELS.dmgmullight, stats.dmgmullight);
    if (stats.dmgmulpoison) addPercent('dmgmulpoison', STAT_LABELS.dmgmulpoison, stats.dmgmulpoison);
    if (stats.dmgmulwound) addPercent('dmgmulwound', STAT_LABELS.dmgmulwound, stats.dmgmulwound);
    if (stats.dmgmulabsolute) addPercent('dmgmulabsolute', STAT_LABELS.dmgmulabsolute, stats.dmgmulabsolute);

    if (stats.legbon) add('legbon', formatLegendaryBonus(stats.legbon, stats._legbonDescription), true);
    if (stats.bind || stats.binds) add('binds', 'Wiąże po założeniu');
    if (stats.lvl) addPlain('lvl', STAT_LABELS.lvl, stats.lvl);
    if (stats.reqp) addPlain('reqp', STAT_LABELS.reqp, formatProf(stats.reqp, prof));
    if (stats.value) addPlain('value', STAT_LABELS.value, stats.value);
    if (stats.gold) addPlain('gold', STAT_LABELS.gold, stats.gold);
    if (stats.ammo) addPlain('ammo', STAT_LABELS.ammo, stats.ammo);
    if (stats.amount) addPlain('amount', STAT_LABELS.amount, stats.amount);
    if (stats.capacity && normalizeItemType(stats.type) === 'Konsumpcyjne') {
      rows.push({ text: `Maksimum <span class="mhb-tip-stat-value">${esc(stats.capacity)}</span> sztuk razem`, html: true });
      handled.add('capacity');
    }
    if (stats.opis && normalizeItemType(stats.type) === 'Konsumpcyjne') {
      let description = clean(String(stats.opis).replace(/\[br\]/gi, ' '));
      if (stats.teleport && description && !/^teleportuje\b/i.test(description)) description = 'Teleportuje gracza ' + description;
      if (description) rows.push({ text: esc(description), html: true });
      handled.add('opis');
      handled.add('teleport');
    }
    if (stats.price) addPlain('price', STAT_LABELS.price, stats.price);
    if (stats.bag) {
      rows.push({ text: `Mieści <span class="mhb-tip-stat-value">${esc(stats.bag)}</span> przedmiotów`, html: true });
      handled.add('bag');
      if (String(stats.btype) === '18') rows.push({ text: 'Tylko klucze', html: false });
      handled.add('btype');
    }
    if (stats.runes) add('runes', specialLine('Dodaje ' + stats.runes + ' Smoczych Run'), true);
    if (stats.ttl) addPlain('ttl', STAT_LABELS.ttl, stats.ttl);

    Object.keys(stats).forEach(rawKey => {
      const key = normalizeStatKey(rawKey);
      if (!isAllowedStatKey(key) || shouldHideStatKey(key) || handled.has(key)) return;
      if (stats[rawKey] === true || stats[rawKey] === '' || stats[rawKey] == null) return;
      add(key, (STAT_LABELS[key] || key) + ': ' + stats[rawKey]);
    });

    return rows.map(row => row.html ? row.text : esc(row.text)).join('<br>');
  }

  function formatPoisonStat(value) {
    const text = String(value || '').trim();
    const parts = text.split(',').map(part => part.trim()).filter(Boolean);

    if (parts.length === 2 && parts.every(part => /^[-+]?\d+(?:\.\d+)?$/.test(part))) {
      const slow = formatHundredths(parts[0]);
      const damage = /^[+\-]/.test(parts[1]) ? parts[1] : '+' + parts[1];
      return `Obrażenia od trucizny: <span class="mhb-tip-stat-value">${esc(damage)}</span><br>` +
        `oraz spowalnia cel o <span class="mhb-tip-stat-value">${esc(slow)} SA</span>`;
    }

    return formatPlusStat(STAT_LABELS.poison, text);
  }

  function formatFrostStat(value) {
    const text = String(value || '').trim();
    const parts = text.split(',').map(part => part.trim()).filter(Boolean);

    if (parts.length === 2 && parts.every(part => /^[-+]?\d+(?:\.\d+)?$/.test(part))) {
      const slow = formatHundredths(parts[0]);
      const damage = /^[+\-]/.test(parts[1]) ? parts[1] : '+' + parts[1];
      return `Obrażenia od zimna: <span class="mhb-tip-stat-value">${esc(damage)}</span><br>` +
        `oraz spowalnia cel o <span class="mhb-tip-stat-value">${esc(slow)} SA</span>`;
    }

    return formatPlusStat(STAT_LABELS.frost, text);
  }

  function formatWoundStat(value) {
    const text = String(value || '').trim();
    const parts = text.split(',').map(part => part.trim()).filter(Boolean);

    if (parts.length === 2 && parts.every(part => /^[-+]?\d+(?:\.\d+)?$/.test(part))) {
      const chance = String(parts[0]).replace(/^\+/, '').replace(/%$/, '');
      const damage = /^[+\-]/.test(parts[1]) ? parts[1] : '+' + parts[1];
      return `Głęboka rana, <span class="mhb-tip-stat-value">${esc(chance)}%</span> szans na ` +
        `<span class="mhb-tip-stat-value">${esc(damage)}</span> obrażeń`;
    }

    return formatPlusStat(STAT_LABELS.wound, text);
  }

  function pointWord(value) {
    const num = Math.abs(parseInt(String(value || '').replace(/\D+/g, ''), 10));
    if (!Number.isFinite(num)) return 'punktów';
    const last = num % 10;
    const lastTwo = num % 100;
    if (num === 1) return 'punkt';
    if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) return 'punkty';
    return 'punktów';
  }

  function formatProf(value, prof) {
    return String(value || '')
      .split(/[,\s/]+/)
      .filter(Boolean)
      .flatMap(part => /^[wpmhlrbt]+$/i.test(part) ? part.toLowerCase().split('') : [part])
      .map(part => prof[String(part).toLowerCase()] || part)
      .join(', ');
  }

  function statLine(label, value) {
    return `${esc(label)} <span class="mhb-tip-stat-value">${esc(value)}</span>`;
  }

  function specialLine(text) {
    return `<span class="mhb-tip-stat-special">${esc(text)}</span>`;
  }

  function normalizeItemType(value) {
    const text = norm(value);
    if (!text || /^\d+$/.test(text) || /^(?:t\s+)?(?:equip|equipment|item|przedmiot)$/.test(text)) return '';
    if (/jednorecz/.test(text)) return 'Jednoręczne';
    if (/poltorarecz/.test(text)) return 'Półtoraręczne';
    if (/dwurecz/.test(text)) return 'Dwuręczne';
    if (/pomocnic|orb/.test(text)) return 'Pomocnicze';
    if (/tarc/.test(text)) return 'Tarcze';
    if (/helm/.test(text)) return 'Hełmy';
    if (/zbroj|armor/.test(text)) return 'Zbroje';
    if (/rekawic|glove/.test(text)) return 'Rękawice';
    if (/but|boot/.test(text)) return 'Buty';
    if (/piersc|ring/.test(text)) return 'Pierścienie';
    if (/naszyj|necklace/.test(text)) return 'Naszyjniki';
    if (/talizman|charm|trinket/.test(text)) return 'Talizmany';
    if (/strzal|ammo|amunic/.test(text)) return 'Amunicja';
    if (/torb|bag/.test(text)) return 'Torby';
    if (/mikstur|potion/.test(text)) return 'Mikstury';
    if (/konsump|consum|jedzeni|food/.test(text)) return 'Konsumpcyjne';
    if (/neutral/.test(text)) return 'Neutralne';
    if (/quest|zadaniow/.test(text)) return 'Questowe';
    if (/bron|weapon/.test(text)) return 'Broń';
    return '';
  }

  function itemClassType(value) {
    const itemClass = Number(value);
    const types = {
      1: 'Jednoręczne',
      2: 'Dwuręczne',
      3: 'Półtoraręczne',
      4: 'Dystansowe',
      5: 'Pomocnicze',
      6: 'Różdżki',
      7: 'Orby magiczne',
      8: 'Zbroje',
      9: 'Hełmy',
      10: 'Buty',
      11: 'Rękawice',
      12: 'Pierścienie',
      13: 'Naszyjniki',
      14: 'Tarcze',
      15: 'Neutralne',
      16: 'Konsumpcyjne',
      18: 'Klucze',
      19: 'Questowe',
      21: 'Strzały',
      22: 'Talizmany',
      23: 'Książki',
      24: 'Torby',
      25: 'Mikstury',
      26: 'Ulepszenia',
      29: 'Kołczany'
    };
    return types[itemClass] || '';
  }

  function inferItemType(item, fallbackName, stats = {}) {
    const imagePath = imageKey(item && (item.img || item.imgFile) || '');
    const directory = (imagePath.match(/\/itemy\/([^/]+)\//i) || [])[1] || '';
    const dir = norm(directory);
    const directoryTypes = {
      nas: 'Naszyjniki', necklace: 'Naszyjniki',
      pie: 'Pierścienie', piers: 'Pierścienie', ring: 'Pierścienie',
      rek: 'Rękawice', glove: 'Rękawice',
      but: 'Buty', boot: 'Buty',
      hel: 'Hełmy', helm: 'Hełmy',
      zbr: 'Zbroje', armor: 'Zbroje',
      tar: 'Tarcze', shield: 'Tarcze',
      pom: 'Pomocnicze', orb: 'Pomocnicze',
      str: 'Amunicja', ammo: 'Amunicja',
      tal: 'Talizmany',
      talisman: 'Talizmany', charm: 'Talizmany', trinket: 'Talizmany',
      tor: 'Torby', bag: 'Torby',
      kon: 'Konsumpcyjne', consumable: 'Konsumpcyjne', potion: 'Mikstury', mik: 'Mikstury',
      neu: 'Neutralne', neutral: 'Neutralne'
    };
    if (directoryTypes[dir]) return directoryTypes[dir];

    const text = norm([
      fallbackName,
      item && item.name,
      item && item.href,
      item && item.img,
      item && item.imgFile
    ].join(' '));

    // Nazwy, przy których strona MargoHelp nie przekazuje klasy przedmiotu.
    if (/\bpodwodna latarenka\b/.test(text)) return 'Talizmany';
    if (/\b(?:blyskotka gildii banitow|zuwaczka zadlaka)\b/.test(text)) return 'Neutralne';
    if (/\bmrozne wzmocnienie sprawiedliwego\b/.test(text)) return 'Mikstury';

    if (/\b(?:nimb|piersc|sygnet|obracz)\w*/.test(text)) return 'Pierścienie';
    if (/\b(?:but|bucior|obuw|chodak|trzewik|sabaton|pantof|lapci|cizem|kamasz|sandal)\w*/.test(text)) return 'Buty';
    if (/\b(?:rekawic|karwasz|bransolet|mankiet|dlon|piesc|lapk)\w*/.test(text)) return 'Rękawice';
    if (/\b(?:helm|kaptur|czapk|koron|diadem|mask|szyszak|czerep|glow)\w*/.test(text)) return 'Hełmy';
    if (/\b(?:zbroj|kaftan|pancerz|szat|plaszcz|kurtk|kirys|kolczug|napiersnik|oponcz|mundur|tunik|kamizel)\w*/.test(text)) return 'Zbroje';
    if (/\b(?:naszyj|amulet|wisior|wisiorek|koli|medalion|pektoral)\w*/.test(text)) return 'Naszyjniki';
    if (/\b(?:talizman|fetysz|relikwi|artefakt|totem|sekstant)\w*/.test(text)) return 'Talizmany';
    if (/\b(?:tarcz|pawez)\w*/.test(text)) return 'Tarcze';
    if (/\b(?:mikstur|eliksir|wzmocnieni)\w*/.test(text) || stats.heal) return 'Mikstury';
    if (/\b(?:napoj|jedzeni|ciastk|cukier|konsumpcyjn)\w*/.test(text)) return 'Konsumpcyjne';
    if (/\b(?:neutral|skladnik|material|surowiec|odlam|fragment|kawalek|pamiatk|trofeum)\w*/.test(text)) return 'Neutralne';
    if (/\b(miecz|topor|wlocznia|luk|rozga|rozdzka|kostur|ostrze|sztylet|noz|mlot|maczuga|korbacz)\b/.test(text)) return 'Broń';
    if (stats.ammo) return 'Amunicja';
    if (stats.bag) return 'Torby';
    if (stats.dmg || stats.pdmg || stats.fire || stats.cold || stats.frost || stats.light || stats.poison || stats.wound) return 'Broń';
    return '';
  }

  function formatLegendaryBonus(value, pageDescription) {
    const raw = String(value || '').trim();
    if (!raw) return '';

    const parts = raw.split(',').map(part => clean(part)).filter(Boolean);
    const code = parts[0] || raw;
    const key = norm(code);
    const bonusLevel = parts.find((part, index) => index > 0 && /^\d+$/.test(part));

    if (/^\d+$/.test(raw)) {
      return formatLegendaryLine('Bonus legendarny', '', raw);
    }

    const label = LEGENDARY_BONUS_LABELS[key] || 'Bonus legendarny';
    const desc = clean(pageDescription) || LEGENDARY_BONUS_DESCRIPTIONS[key] || '';

    if (label === 'Bonus legendarny') {
      return formatLegendaryLine(label, 'Nieznany kod bonusu: ' + code, bonusLevel);
    }

    return formatLegendaryLine(label, desc, bonusLevel);
  }

  function formatLegendaryLine(label, desc, bonusLevel) {
    const title = `<span class="mhb-tip-legbon">${esc(label)}</span>`;
    const rows = [title];

    if (desc) {
      rows.push(`<span class="mhb-tip-legbon-desc">${esc(desc)}</span>`);
    }


    return rows.join('<br>');
  }

  function formatSigned(value, plus) {
    const text = String(value || '');
    if (!plus || /^[+\-]/.test(text)) return text;
    return '+' + text;
  }

  function formatPercentStat(value) {
    const text = String(value || '');
    if (text.includes('%')) return text;
    const numeric = Number(text.replace(',', '.'));
    if (Number.isFinite(numeric) && Math.abs(numeric) <= 100) return '+' + text + '%';
    return text;
  }

  function formatHundredths(value) {
    const numeric = Number(String(value).replace(',', '.'));
    if (!Number.isFinite(numeric)) return value;
    if (Math.abs(numeric) >= 1) return trimNumber(numeric / 100);
    return String(value);
  }

  function trimNumber(value) {
    return Number(value).toFixed(2).replace(/\.?0+$/, '');
  }

  function formatPercent(value) {
    return String(value).includes('%') ? value : value + '%';
  }

  function detectRarity(value) {
    const text = norm(value);
    const raw = String(value || '').toLowerCase();

    if (
      text.includes('legend') ||
      /\bleg\b/.test(text) ||
      /rarity[-_: ]*(legendary|5|6)/i.test(raw) ||
      /item[-_: ]*(legendary|legend)/i.test(raw)
    ) return 'legendary';

    if (
      text.includes('heroic') ||
      text.includes('heroiczn') ||
      text.includes('heroiczne') ||
      /\bhero\b/.test(text) ||
      /rarity[-_: ]*(heroic|4)/i.test(raw) ||
      /item[-_: ]*(heroic|hero)/i.test(raw)
    ) return 'heroic';

    if (
      text.includes('unikat') ||
      text.includes('unique') ||
      /\buni\b/.test(text) ||
      /rarity[-_: ]*(unique|3)/i.test(raw) ||
      /item[-_: ]*(unique|unikat|uni)/i.test(raw)
    ) return 'unique';

    if (
      text.includes('ulepsz') ||
      text.includes('upgraded') ||
      /rarity[-_: ]*(upgraded|2)/i.test(raw)
    ) return 'upgraded';

    if (
      text.includes('pospolit') ||
      text.includes('common') ||
      /rarity[-_: ]*(common|1)/i.test(raw)
    ) return 'common';

    return 'unknown';
  }

  function rarityInfo(rarity) {
    return RARITIES[rarity] || RARITIES.unknown;
  }

  function sanitizeTip(html) {
    const doc = new DOMParser().parseFromString(String(html || ''), 'text/html');
    doc.querySelectorAll('script,style,iframe,object,embed,link,meta').forEach(el => el.remove());
    doc.querySelectorAll('*').forEach(el => {
      Array.from(el.attributes).forEach(attr => {
        const n = attr.name.toLowerCase();
        const v = String(attr.value || '').toLowerCase();
        if (n.startsWith('on') || n === 'style') el.removeAttribute(attr.name);
        if ((n === 'href' || n === 'src') && v.startsWith('javascript:')) el.removeAttribute(attr.name);
      });
    });
    return doc.body.innerHTML;
  }

  function getAttr(el, attrs) {
    if (!el) return '';
    for (const attr of attrs) {
      const value = el.getAttribute && el.getAttribute(attr);
      if (value) return value;
    }
    return '';
  }

  function imgSrc(img) {
    return getAttr(img, ['src', 'data-src', 'data-original', 'data-lazy-src', 'data-image', 'data-img', 'data-background', 'data-bg']);
  }

  function elementImageSrc(el) {
    if (!el) return '';

    const direct = getAttr(el, ['data-src', 'data-original', 'data-lazy-src', 'data-image', 'data-img', 'data-background', 'data-bg']);
    if (direct) return direct;

    const style = el.getAttribute && el.getAttribute('style') || '';
    const match = String(style).match(/url\((['"]?)(.*?)\1\)/i);
    return match ? match[2] : '';
  }

  function extractMobId(url) {
    const match = String(url || '').match(/\/mob\/(\d+)/);
    return match ? match[1] : '';
  }

  function extractItemId(url) {
    const match = String(url || '').match(/\/(?:przedmioty|przedmiot|item|items)\/(\d+)/i);
    return match ? match[1] : '';
  }

  function imageKey(url) {
    let value = String(url || '').split('?')[0].split('#')[0].toLowerCase();
    try { value = decodeURIComponent(value); } catch (e) {}
    value = value.replace(/^https?:\/\/[^/]+/i, '');
    const idx = value.indexOf('/obrazki/');
    if (idx !== -1) value = value.slice(idx);
    return value;
  }

  function imageFile(url) {
    const parts = imageKey(url).split('/');
    return parts[parts.length - 1] || '';
  }

  function abs(url, base = CFG.base) {
    if (!url) return '';
    try { return new URL(url, base).href; } catch (e) { return url; }
  }

  function deepDecode(value, rounds = 3) {
    let text = String(value || '');
    const textarea = document.createElement('textarea');
    for (let i = 0; i < rounds; i++) {
      textarea.innerHTML = text;
      const decoded = textarea.value
        .replace(/\\u003c/gi, '<')
        .replace(/\\u003e/gi, '>')
        .replace(/\\u0026/gi, '&')
        .replace(/\\u0022/gi, '"')
        .replace(/\\"/g, '"')
        .replace(/\\\//g, '/');
      if (decoded === text) break;
      text = decoded;
    }
    return text;
  }

  function clean(value) {
    return stripHtml(value)
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function stripHtml(value) {
    return String(value || '')
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]+>/g, ' ');
  }

  function norm(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ł/g, 'l')
      .replace(/[^a-z0-9 ]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function esc(value) {
    return String(value || '').replace(/[<>&"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));
  }

  function setStatus(text) {
    const el = document.getElementById('mhb-status');
    if (el) el.textContent = text;
  }

  function loadJson(key, fallback) {
    try {
      if (typeof GM_getValue === 'function') {
        const value = GM_getValue(key, null);
        if (value != null) return typeof value === 'string' ? JSON.parse(value) : value;
      }

      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function saveJson(key, value) {
    try {
      if (typeof GM_setValue === 'function') {
        try {
          GM_setValue(key, value);
        } catch (err) {
          GM_setValue(key, JSON.stringify(value));
        }
        return;
      }

      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  }

  function deleteJson(key) {
    try {
      if (typeof GM_deleteValue === 'function') GM_deleteValue(key);
    } catch (e) {}

    try {
      if (typeof GM_setValue === 'function') GM_setValue(key, null);
    } catch (e) {}

    try {
      localStorage.removeItem(key);
    } catch (e) {}
  }


  function rememberStatKeys(stats) {
    if (!stats || typeof stats !== 'object') return;
    if (!statKeyMemory || typeof statKeyMemory !== 'object') statKeyMemory = {};

    let changed = false;
    Object.keys(stats).forEach(key => {
      if (!key || key[0] === '_') return;
      const value = stats[key];
      const entry = statKeyMemory[key] || { count: 0, values: [] };
      entry.count = Number(entry.count || 0) + 1;

      if (value !== true && value !== false && value !== '' && value != null) {
        const text = String(value).slice(0, 60);
        if (!entry.values.includes(text) && entry.values.length < 8) entry.values.push(text);
      } else if (value === true && !entry.values.includes('true') && entry.values.length < 8) {
        entry.values.push('true');
      }

      statKeyMemory[key] = entry;
      changed = true;
    });

    if (changed) saveJson(STORE_STAT_KEYS, statKeyMemory);
  }

  function exportStatKeys() {
    const all = {};
    const legbons = {};
    const addLegbon = value => {
      if (!value) return;
      const code = clean(String(value).split(',')[0] || '');
      if (!code) return;
      const key = norm(code);
      const entry = legbons[key] || { count: 0, values: [] };
      entry.count++;
      const text = String(value).slice(0, 60);
      if (!entry.values.includes(text) && entry.values.length < 8) entry.values.push(text);
      legbons[key] = entry;
    };

    const addStats = stats => {
      if (!stats || typeof stats !== 'object') return;
      Object.keys(stats).forEach(key => {
        if (!key || key[0] === '_') return;
        const value = stats[key];
        const entry = all[key] || { count: 0, values: [] };
        entry.count++;
        if (value !== true && value !== false && value !== '' && value != null) {
          const text = String(value).slice(0, 60);
          if (!entry.values.includes(text) && entry.values.length < 8) entry.values.push(text);
        } else if (value === true && !entry.values.includes('true') && entry.values.length < 8) {
          entry.values.push('true');
        }
        all[key] = entry;
        if (normalizeStatKey(key) === 'legbon') addLegbon(value);
      });
    };

    const mergeMemory = memory => {
      if (!memory || typeof memory !== 'object') return;
      Object.keys(memory).forEach(key => {
        if (!key || key[0] === '_') return;
        const src = memory[key] || {};
        const entry = all[key] || { count: 0, values: [] };
        entry.count += Number(src.count || 0);
        (src.values || []).forEach(value => {
          const text = String(value).slice(0, 60);
          if (!entry.values.includes(text) && entry.values.length < 8) entry.values.push(text);
        });
        all[key] = entry;
      });
    };

    mergeMemory(statKeyMemory);
    mergeMemory(loadJson(STORE_STAT_KEYS, {}));

    const itemCache = loadJson(STORE_ITEM_DATA, {});
    Object.keys(itemCache || {}).forEach(key => addStats(itemCache[key] && itemCache[key].data && itemCache[key].data.stats));

    const mobCache = loadJson(STORE_MOB_DATA, {});
    Object.keys(mobCache || {}).forEach(key => {
      const items = mobCache[key] && mobCache[key].data && mobCache[key].data.items;
      if (Array.isArray(items)) items.forEach(item => addStats(item.stats));
    });

    if (selectedDetails && Array.isArray(selectedDetails.items)) {
      selectedDetails.items.forEach(item => addStats(item.stats));
    }

    const known = knownStatKeys();
    const keys = Object.keys(all).sort((a, b) => a.localeCompare(b, 'pl'));
    const unknown = keys.filter(key => !known.has(key));
    const legbonKeys = Object.keys(legbons).sort((a, b) => a.localeCompare(b, 'pl'));
    const unknownLegbons = legbonKeys.filter(key => !LEGENDARY_BONUS_LABELS[key]);

    const line = key => {
      const values = (all[key].values || []).join(', ');
      return key + ' = ' + (values || 'true') + '    [x' + all[key].count + ']';
    };
    const legbonLine = key => {
      const values = (legbons[key].values || []).join(', ');
      const label = LEGENDARY_BONUS_LABELS[key] || '???';
      return key + ' = ' + label + ' | ' + (values || 'true') + '    [x' + legbons[key].count + ']';
    };

    const text = [
      'NIEZNANE SKROTY DO TLUMACZENIA / UKRYCIA:',
      unknown.length ? unknown.map(line).join('\n') : 'brak',
      '',
      'NIEZNANE BONUSY LEGENDARNE:',
      unknownLegbons.length ? unknownLegbons.map(legbonLine).join('\n') : 'brak',
      '',
      'WSZYSTKIE BONUSY LEGENDARNE:',
      legbonKeys.length ? legbonKeys.map(legbonLine).join('\n') : 'brak',
      '',
      'WSZYSTKIE ZNALEZIONE SKROTY:',
      keys.length ? keys.map(line).join('\n') : 'brak'
    ].join('\n');

    copyText(text);
    console.log('[MHB] Skroty statystyk:\n' + text);
    setStatus('Skopiowano skroty statystyk: ' + keys.length + ' | nieznane: ' + unknown.length);
  }

  function knownStatKeys() {
    return new Set([
      ...Object.keys(STAT_LABELS),
      ...Array.from(HIDDEN_STAT_KEYS),
      'id','name','rarity','opis','legendary','heroic','unique','upgraded','common',
      'cold','rescold','restdmg','restrost','permbound'
    ]);
  }

  function clearBestiaryMemory() {
    [STORE_CACHE, STORE_ITEM_DATA, STORE_MOB_DATA, STORE_STAT_KEYS].forEach(deleteJson);

    statKeyMemory = {};
    selectedMob = null;
    selectedDetails = null;
    mobs = [];
    renderEmptyDetails('Pamiec wyczyszczona. Pobierz liste od nowa.');
    setStatus('Wyczyszczono pamiec dodatku v' + CFG.version + '. Odswiezam liste...');
    loadLists(true)
      .then(() => renderList())
      .then(() => setStatus('Pamiec wyczyszczona. Baza pobrana od nowa.'))
      .catch(err => {
        console.warn('[MHB] clear memory refresh', err);
        setStatus('Pamiec wyczyszczona. Odswiez strone, jesli lista nie wroci.');
      });
  }

  function createLauncher() {
    if (document.getElementById('mhb-launcher')) return;
    const button = document.createElement('button');
    button.id = 'mhb-launcher';
    button.type = 'button';
    button.title = 'Bestiariusz podręczny';
    button.setAttribute('aria-label', 'Otwórz lub zamknij Bestiariusz');
    button.innerHTML = '<span class="mhb-launcher-book">B</span>';
    const savedPos = loadJson(STORE_LAUNCHER_POS, null);
    if (savedPos && Number.isFinite(savedPos.left) && Number.isFinite(savedPos.top)) {
      button.style.left = Math.max(0, Math.min(window.innerWidth - 38, savedPos.left)) + 'px';
      button.style.top = Math.max(0, Math.min(window.innerHeight - 38, savedPos.top)) + 'px';
    }
    let dragged = false;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;
    button.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      dragging = true;
      dragged = false;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = button.offsetLeft;
      startTop = button.offsetTop;
      button.classList.add('dragging');
      e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) + Math.abs(dy) > 3) dragged = true;
      button.style.left = Math.max(0, Math.min(window.innerWidth - button.offsetWidth, startLeft + dx)) + 'px';
      button.style.top = Math.max(0, Math.min(window.innerHeight - button.offsetHeight, startTop + dy)) + 'px';
    });
    document.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      button.classList.remove('dragging');
      if (dragged) saveJson(STORE_LAUNCHER_POS, { left: button.offsetLeft, top: button.offsetTop });
    });
    button.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      if (dragged) {
        dragged = false;
        return;
      }
      panelVisible = !panelVisible;
      saveJson(STORE_VISIBLE, panelVisible);
      applyPanelVisibility();
    });
    document.body.appendChild(button);
  }

  function applyPanelVisibility() {
    panel.style.display = panelVisible ? '' : 'none';
    tooltip.style.display = 'none';
    const button = document.getElementById('mhb-launcher');
    if (button) button.classList.toggle('active', panelVisible);
  }
  function copyText(text) {
    if (typeof GM_setClipboard === 'function') {
      GM_setClipboard(text);
      setStatus('Skopiowano: ' + text);
      return;
    }
    navigator.clipboard.writeText(text).then(() => setStatus('Skopiowano: ' + text));
  }

  function restorePanel() {
    const pos = loadJson(STORE_POS, null);
    if (pos && pos.left && pos.top) {
      panel.style.right = 'auto';
      panel.style.left = pos.left;
      panel.style.top = pos.top;
    }

    const size = loadJson(STORE_SIZE, null);
    if (size && size.width && size.height) {
      panel.style.width = size.width;
      panel.style.height = size.height;
    }
  }

  function enableDrag() {
    const head = document.getElementById('mhb-head');
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;

    head.addEventListener('mousedown', e => {
      if (e.target.closest('button, a')) return;
      if (minimized) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = panel.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
      panel.style.right = 'auto';
      panel.style.left = startLeft + 'px';
      panel.style.top = startTop + 'px';
      e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      panel.style.left = Math.max(5, Math.min(window.innerWidth - 80, startLeft + e.clientX - startX)) + 'px';
      panel.style.top = Math.max(5, Math.min(window.innerHeight - 60, startTop + e.clientY - startY)) + 'px';
    });

    document.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      saveJson(STORE_POS, { left: panel.style.left, top: panel.style.top });
    });
  }

  function enableResize() {
    const grip = document.getElementById('mhb-resize');
    let resizing = false;
    let startX = 0;
    let startY = 0;
    let startW = 0;
    let startH = 0;

    grip.addEventListener('mousedown', e => {
      if (minimized) return;
      resizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startW = panel.offsetWidth;
      startH = panel.offsetHeight;
      e.preventDefault();
      e.stopPropagation();
    });

    document.addEventListener('mousemove', e => {
      if (!resizing) return;
      panel.style.width = Math.min(window.innerWidth * 0.96, Math.max(340, startW + e.clientX - startX)) + 'px';
      panel.style.height = Math.min(window.innerHeight * 0.96, Math.max(320, startH + e.clientY - startY)) + 'px';
    });

    document.addEventListener('mouseup', () => {
      if (!resizing) return;
      resizing = false;
      saveJson(STORE_SIZE, { width: panel.style.width, height: panel.style.height });
    });
  }

  function enableListWheel() {
    const list = document.getElementById('mhb-list');
    if (!list) return;

    list.addEventListener('wheel', e => {
      if (minimized) return;
      e.preventDefault();
      e.stopPropagation();
      list.scrollTop += e.deltaY;
    }, { passive: false });
  }

  function enableDetailsWheel() {
    const details = document.getElementById('mhb-details');
    if (!details) return;

    details.addEventListener('wheel', e => {
      if (minimized) return;
      e.preventDefault();
      e.stopPropagation();
      details.scrollTop += e.deltaY;
      tooltip.style.display = 'none';
    }, { passive: false });
  }

  function enableFoxScroll() {
    const list = document.getElementById('mhb-list');
    const fox = document.getElementById('mhb-fox-scroll');
    const foxTrack = document.getElementById('mhb-fox-track');
    if (!list || !fox || !foxTrack) return;

    const update = () => {
      const maxScroll = Math.max(0, list.scrollHeight - list.clientHeight);
      const track = Math.max(0, list.clientHeight - fox.offsetHeight);
      const ratio = maxScroll ? list.scrollTop / maxScroll : 0;
      fox.style.left = (list.offsetLeft + list.clientWidth + 1) + 'px';
      fox.style.top = (list.offsetTop + ratio * track) + 'px';
      fox.style.display = maxScroll > 0 ? 'flex' : 'none';
      foxTrack.style.left = (list.offsetLeft + list.clientWidth + fox.offsetWidth / 2 - foxTrack.offsetWidth / 2 + 1) + 'px';
      foxTrack.style.top = (list.offsetTop + fox.offsetHeight / 2) + 'px';
      foxTrack.style.height = Math.max(0, list.clientHeight - fox.offsetHeight) + 'px';
      foxTrack.style.display = maxScroll > 0 ? 'block' : 'none';
    };

    let dragging = false;
    let startY = 0;
    let startScroll = 0;

    fox.addEventListener('mousedown', e => {
      dragging = true;
      startY = e.clientY;
      startScroll = list.scrollTop;
      fox.classList.add('dragging');
      e.preventDefault();
      e.stopPropagation();
    });

    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      const track = Math.max(1, list.clientHeight - fox.offsetHeight);
      const maxScroll = Math.max(0, list.scrollHeight - list.clientHeight);
      list.scrollTop = startScroll + (e.clientY - startY) * maxScroll / track;
    });

    document.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      fox.classList.remove('dragging');
    });

    list.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    new MutationObserver(update).observe(list, { childList: true, subtree: true });
    requestAnimationFrame(update);
  }

  window.mhBestiaryRefresh = function () {
    return loadLists(true).then(() => {
      renderList();
      setStatus('Odswiezono MargoHelp.');
    });
  };
})();
