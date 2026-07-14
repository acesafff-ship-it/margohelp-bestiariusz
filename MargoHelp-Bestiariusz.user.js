// ==UserScript==
// @name         MargoHelp Bestiariusz Podręczny
// @namespace    acesaff-margohelp-bestiary
// @version      2.0.3
// @author       Król Yss
// @homepageURL  https://www.margonem.pl/profile/view,10050726#char_5601,luvia
// @description  Podręczny bestiariusz Elit, Elit II, Herosów, Kolosów i Tytanów z przedmiotami pobieranymi z oficjalnych tematów forum Margonem.
// @updateURL    https://raw.githubusercontent.com/acesafff-ship-it/margohelp-bestiariusz/main/MargoHelp-Bestiariusz.user.js
// @downloadURL  https://raw.githubusercontent.com/acesafff-ship-it/margohelp-bestiariusz/main/MargoHelp-Bestiariusz.user.js
// @match        *://*.margonem.pl/*
// @exclude      *://margonem.pl/*
// @exclude      *://www.margonem.pl/*
// @exclude      *://forum.margonem.pl/*
// @exclude      *://pomoc.margonem.pl/*
// @exclude      *://new.margonem.pl/*
// @exclude      *://commons.margonem.pl/*
// @exclude      *://dev-commons.margonem.pl/*
// @exclude      *://public-api.margonem.pl/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @connect      forum.margonem.pl
// ==/UserScript==

(function () {
  'use strict';

  if (window.__KROL_YSS_FORUM_ELITE_ITEMS__) return;
  window.__KROL_YSS_FORUM_ELITE_ITEMS__ = true;

  const CATEGORIES = {
    elites: {
      label: 'Elity',
      source: 'https://forum.margonem.pl/?task=forum&show=posts&id=514832&ps=0',
      cacheKey: 'ky_forum_elites_items_v2'
    },
    elites2: {
      label: 'Elity II',
      source: 'https://forum.margonem.pl/?task=forum&show=posts&id=514805&ps=0',
      cacheKey: 'ky_forum_e2_items_v3'
    },
    heroes: {
      label: 'Herosi',
      source: 'https://forum.margonem.pl/?task=forum&show=posts&id=514740&ps=0',
      cacheKey: 'ky_forum_heroes_items_v3'
    },
    colossi: {
      label: 'Kolosi',
      source: 'https://forum.margonem.pl/?task=forum&show=posts&id=514732&ps=0',
      cacheKey: 'ky_forum_colossi_items_v3'
    },
    titans: {
      label: 'Tytani',
      source: 'https://forum.margonem.pl/?task=forum&show=posts&id=514733&ps=0',
      cacheKey: 'ky_forum_titans_items_v3'
    }
  };
  const CACHE_MS = 6 * 60 * 60 * 1000;
  const STORE_SETTINGS = 'ky_forum_special_settings_v1';
  const STORE_LAUNCHER_POS = 'ky_forum_special_launcher_pos_v1';
  const STORE_PANEL_POS = 'ky_forum_special_panel_pos_v1';
  const STORE_COLLAPSED_GROUPS = 'ky_forum_special_collapsed_groups_v1';
  const DROP_CHANCES = {
    elites: {
      label: 'Elity',
      rows: [['Brak łupu', '~50%'], ['Pospolite', '~45%'], ['Unikatowe', '~4%'], ['Heroiczne', '~1%']]
    },
    heroes: {
      label: 'Herosi — szablon główny',
      rows: [['Skrzynia / pospolite / brak łupu', '~28,56%'], ['Unikatowe', '~50,32%'], ['Heroiczne', '~20,41%'], ['Legendarne', '~0,71%']],
      secondaryLabel: 'Przedmioty ze skrytki',
      secondaryRows: [['Pospolite', '38,34%'], ['Unikatowe', '35%'], ['Heroiczne', '24,92%'], ['Legendarne', '1,74%']]
    },
    colossi: {
      label: 'Kolosi',
      rows: [['Unikatowe', '~70%'], ['Heroiczne', '~29,7%'], ['Legendarne', '~0,3%']]
    },
    titans: {
      label: 'Tytani',
      rows: [['Unikatowe', '~54,1%'], ['Heroiczne', '~45%'], ['Legendarne', '~0,9%']]
    }
  };
  const E2_CHANCE_VARIANTS = {
    standard: { label: 'Standardowe Elity II', rows: [['Brak łupu', '~50%'], ['Pospolite', '~39,94%'], ['Unikatowe', '~8%'], ['Heroiczne', '~2%'], ['Legendarne', '~0,06%']] },
    soloMaps: { label: 'Mapy bez grupowania', rows: [['Brak łupu', '~50%'], ['Pospolite', '~36,825%'], ['Unikatowe', '~10%'], ['Heroiczne', '~2,5%'], ['Legendarne', '~0,075%']] },
    sharedTemplate: { label: 'Współdzielony szablon', rows: [['Brak łupu', '~60,58%'], ['Pospolite', '~31,13%'], ['Unikatowe', '~6,62%'], ['Heroiczne', '~1,62%'], ['Legendarne', '~0,05%']] },
    mechanismItems: { label: 'Przedmioty do mechanizmów', rows: [['Brak łupu', '~50%'], ['Pospolite', '~20%'], ['Unikatowe', '~28% (w tym 20% na klucz)'], ['Heroiczne', '~2%']] },
    mechanismMobs: { label: 'Wywoływane mechanizmem', rows: [['Brak łupu', '~49,7%'], ['Unikatowe', '~40%'], ['Heroiczne', '~10%'], ['Legendarne', '~0,3%']] }
  };
  const RARITY = {
    legendary: { label: 'Legendarne', color: '#ffaa32', order: 1 },
    heroic: { label: 'Heroiczne', color: '#55b9ff', order: 2 },
    unique: { label: 'Unikatowe', color: '#ffe44d', order: 3 },
    upgraded: { label: 'Ulepszone', color: '#a783ff', order: 4 },
    common: { label: 'Pospolite', color: '#9da8aa', order: 5 },
    unknown: { label: 'Pozostałe', color: '#65736f', order: 6 }
  };
  const LABELS = {
    ac: 'Pancerz', dmg: 'Atak', pdmg: 'Obrażenia fizyczne', acdmg: 'Niszczenie pancerza',
    fire: 'Obrażenia od ognia', frost: 'Obrażenia od zimna', cold: 'Obrażenia od zimna',
    light: 'Obrażenia od błyskawic', poison: 'Obrażenia od trucizny', wound: 'Głęboka rana',
    resfire: 'Odporność na ogień', resfrost: 'Odporność na zimno', rescold: 'Odporność na zimno',
    reslight: 'Odporność na błyskawice', act: 'Odporność na truciznę', resdmg: 'Niszczenie odporności',
    crit: 'Cios krytyczny', critval: 'Moc ciosu krytycznego fizycznego', critmval: 'Moc ciosu krytycznego magicznego',
    lowcrit: 'Obniżenie krytyka', lowevade: 'Obniżenie uniku', evade: 'Unik', blok: 'Blok',
    da: 'Wszystkie cechy', ds: 'Siła', dz: 'Zręczność', di: 'Intelekt', hp: 'Życie',
    mana: 'Mana', manabon: 'Mana', energy: 'Energia', energybon: 'Energia', sa: 'SA',
    heal: 'Leczenie podczas walki', slow: 'Obniżenie SA przeciwnika', pierce: 'Przebicie pancerza',
    pierceb: 'Blokowanie przebicia', contra: 'Kontra', absorb: 'Absorpcja fizyczna',
    absorbm: 'Absorpcja magiczna', lvl: 'Wymagany poziom', reqp: 'Profesja', amount: 'Ilość',
    capacity: 'Maksimum w stosie', runes: 'Smocze Runy', ttl: 'Czas trwania', gold: 'Złoto',
    opis: 'Opis', legbon: 'Bonus legendarny', teleport: 'Teleport', lootbox2: 'Skrytka',
    abdest: 'Niszczenie absorpcji', adest: 'Obniżenie leczenia', afterheal: 'Leczenie po walce',
    bag: 'Miejsca w torbie', btype: 'Ograniczenie zawartości', respred: 'Szybsze wracanie do siebie',
    manafatig: 'Zmęczenie many', enfatig: 'Zmęczenie energii', hpbon: 'Życie za siłę',
    leczy: 'Leczenie', dmgmul: 'Wszystkie obrażenia', dmgmulabsolute: 'Obrażenia bezpośrednie',
    dmgmulfire: 'Obrażenia od ognia', dmgmulfrost: 'Obrażenia od zimna', dmgmullight: 'Obrażenia od błyskawic',
    dmgmulphysical: 'Obrażenia fizyczne', dmgmulpoison: 'Obrażenia od trucizny', dmgmulwound: 'Obrażenia od rany',
    enhancement_refund: 'Ekstrakcja ulepszenia', personal: 'Przedmiot osobisty', soulbound: 'Związany z właścicielem',
    socket_content: 'Zawartość gniazda', socket_fleeting_legbon: 'Bonus w gnieździe'
  };
  const SKIP = new Set(['rarity', 'binds', 'bind', 'permbound', 'cansplit', 'canpreview', 'nodesc', 'loot', 'lootbox2']);
  const PROFESSIONS = { w: 'wojownik', p: 'paladyn', m: 'mag', t: 'tropiciel', h: 'łowca', b: 'tancerz ostrzy' };
  const BAG_TYPES = { 18: 'klucze', 25: 'błogosławieństwa', 30: 'stroje', 31: 'maskotki', 32: 'teleporty' };
  const MAP_ACCESS_RANGES = {
    'mamlambo': '22–61 lvl',
    'regulus metnooki': '49–88 lvl',
    'amaimon soploreki': '69–108 lvl',
    'umibozu': '100–139 lvl',
    'vashkar': '130–169 lvl',
    'hydrokora chimeryczna': '153–192 lvl',
    'lulukav': '176–215 lvl',
    'arachin podstepny': '199–238 lvl',
    'reuzen': '230–269 lvl',
    'wernoradzki drakolisz': '265–500 lvl',
    'dziewicza orlica': '38–64 lvl',
    'zabojczy krolik': '57–83 lvl',
    'renegat baulus': '88–114 lvl',
    'piekielny arcymag': '118–144 lvl',
    'versus zoons': '141–167 lvl',
    'lowczyni wspomnien': '164–190 lvl',
    'przyzywacz demonow': '191–217 lvl',
    'maddok magua': '218–244 lvl',
    'tezcatlipoca': '245–271 lvl',
    'barbatos smoczy straznik': '272+ lvl',
    'tanroth': '287+ lvl'
  };
  const ITEM_TYPES = { 1: 'Jednoręczne', 2: 'Dwuręczne', 3: 'Półtoraręczne', 4: 'Dystansowe', 5: 'Pomocnicze', 6: 'Różdżki', 7: 'Orby magiczne', 8: 'Zbroje', 9: 'Hełmy', 10: 'Buty', 11: 'Rękawice', 12: 'Pierścienie', 13: 'Naszyjniki', 14: 'Tarcze', 15: 'Neutralne', 16: 'Konsumpcyjne', 18: 'Klucze', 19: 'Questowe', 21: 'Strzały', 22: 'Talizmany', 23: 'Książki', 24: 'Torby', 25: 'Mikstury', 26: 'Ulepszenia', 29: 'Kołczany', 32: 'Konsumpcyjne' };
  const LEGENDARY_BONUSES = {
    verycrit: 'Cios bardzo krytyczny', holytouch: 'Dotyk anioła', curse: 'Klątwa',
    lastheal: 'Ostatni ratunek', critred: 'Krytyczna osłona', shield: 'Krytyczna osłona',
    glare: 'Oślepiający blask', facade: 'Fasada opieki', cleanse: 'Płomienne oczyszczenie',
    flamecleanse: 'Płomienne oczyszczenie', anguish: 'Krwawa udręka', puncture: 'Przeszywająca skuteczność'
  };
  const LEGENDARY_DESCRIPTIONS = {
    verycrit: '17% szansy na zwiększenie mocy ciosu krytycznego o 75%.',
    holytouch: 'Podczas ataku 7% szansy na regenerację po 6% życia przez trzy najbliższe tury.',
    curse: 'Podczas udanego ataku 9% szans na aktywację klątwy, która zablokuje najbliższą wykonywaną przez przeciwnika akcję.',
    lastheal: 'Jednorazowe zregenerowanie znacznej ilości punktów życia, gdy po otrzymaniu obrażeń życie spadnie poniżej 18%.',
    critred: 'Przyjmowane ciosy krytyczne są o 25% słabsze.', shield: 'Przyjmowane ciosy krytyczne są o 25% słabsze.',
    glare: 'Podczas przyjmowania ataku 9% szansy na oślepienie przeciwnika i zablokowanie jego najbliższej akcji.',
    facade: 'Przyjmowane ciosy są o 13% słabsze.',
    cleanse: 'Podczas otrzymywania celnego ataku 12% szans na usunięcie z postaci efektów obezwładnienia, spowolnienia i obrażeń warunkowych.',
    flamecleanse: 'Podczas otrzymywania celnego ataku 12% szans na usunięcie z postaci efektów obezwładnienia, spowolnienia i obrażeń warunkowych.',
    anguish: 'Trafiony atak ma 8% szansy na wywołanie u przeciwnika krwawienia na pięć tur.',
    puncture: 'Cel ataku ma obniżone o 12% zdolności defensywne.'
  };
  const STAT_ORDER = ['ac','dmg','pdmg','acdmg','fire','light','frost','poison','resfire','resfrost','rescold','reslight','act','resdmg','crit','critval','critmval','lowcrit','dmgmul','dmgmulphysical','dmgmulfire','dmgmulfrost','dmgmullight','dmgmulpoison','dmgmulwound','dmgmulabsolute','all','da','ds','dz','di','evade','lowevade','heal','afterheal','hp','hpbon','mana','manabon','energy','energybon','sa','absorb','absorbm','abdest','adest','blok','pierce','pierceb','contra','slow','wound','enfatig','manafatig','leczy','bag','btype','runes','ttl','gold','amount','capacity','teleport','socket_content'];
  const STRUCTURAL_KEYS = new Set(['opis','legbon','socket_fleeting_legbon','binds','bind','permbound','soulbound','lvl','reqp','rarity']);

  const databases = { elites: [], elites2: [], heroes: [], colossi: [], titans: [] };
  const selectedMobs = { elites: null, elites2: null, heroes: null, colossi: null, titans: null };
  let activeCategory = 'elites2';
  let filter = '';
  const savedSettings = loadJson(STORE_SETTINGS, {});
  const savedCollapsedGroups = loadJson(STORE_COLLAPSED_GROUPS, {});
  const collapsedGroups = savedCollapsedGroups && typeof savedCollapsedGroups === 'object' && !Array.isArray(savedCollapsedGroups) ? savedCollapsedGroups : {};
  const preferences = {
    colorElements: !!savedSettings.colorElements,
    lootMultiplier: Math.round(clampNumber(savedSettings.lootMultiplier, 1, 5, 1)),
    lootBonus: clampNumber(savedSettings.lootBonus, 0, 100, 0),
    levelRange: Math.round(clampNumber(savedSettings.levelRange, 0, 100, 13)),
    e2Variant: E2_CHANCE_VARIANTS[savedSettings.e2Variant] ? savedSettings.e2Variant : 'standard'
  };
  cleanupObsoleteLocalCaches();

  const style = document.createElement('style');
  style.textContent = `
    #ky-forum-e2{position:fixed;right:22px;top:75px;width:570px;height:650px;z-index:2147483645;display:none;background:#091011;color:#e8f2ee;border:1px solid #438b70;border-radius:8px;box-shadow:0 14px 42px #000;font:11px Arial,sans-serif;overflow:hidden}
    #ky-forum-e2 *{box-sizing:border-box}.kyf-head{height:45px;display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:#101919;border-bottom:1px solid #29443d;cursor:move;user-select:none}.kyf-title{color:#6dffc0;font-size:14px;font-weight:bold}.kyf-sub{font-size:9px;color:#859b93}.kyf-sub a{color:#69dcae;text-decoration:none}.kyf-sub a:hover{text-decoration:underline;color:#8affc9}.kyf-head button,.kyf-btn{height:27px;border:1px solid #39745f;border-radius:5px;background:#10221c;color:#caffea;font-size:10px;font-weight:bold;cursor:pointer}.kyf-head button{width:27px;color:#ffb3b3;border-color:#744646;background:#251414}
    .kyf-body{height:calc(100% - 45px);display:flex;flex-direction:column;padding:7px;gap:6px}.kyf-tabs{display:grid;grid-template-columns:repeat(5,1fr);gap:4px}.kyf-tab{height:29px;padding:0 3px;border:1px solid #29433e;border-radius:5px;background:#0c1515;color:#9db1aa;font-size:10px;font-weight:bold;cursor:pointer}.kyf-tab.active{border-color:#50d69f;background:#123328;color:#7cffc4}.kyf-tools{display:grid;grid-template-columns:1fr auto;gap:5px}.kyf-input{height:29px;border:1px solid #29433e;border-radius:5px;background:#050a0b;color:#eef8f4;padding:0 8px;outline:none}.kyf-main{display:grid;grid-template-columns:205px 1fr;gap:7px;min-height:0;flex:1}.kyf-list,.kyf-items{min-height:0;overflow:auto;overscroll-behavior:contain;border:1px solid #203531;border-radius:6px;background:#05090a;scrollbar-width:thin}.kyf-count{position:sticky;top:0;z-index:3;padding:5px 6px;background:#0e1717;border-bottom:1px solid #203531;color:#8fa79f;font-size:9px}.kyf-mob{min-height:45px;padding:4px;display:grid;grid-template-columns:38px 1fr;gap:5px;align-items:center;border-bottom:1px solid #172522;cursor:pointer}.kyf-mob:hover{background:#101b19}.kyf-mob.active{background:#17362b;color:#75ffc0}.kyf-mob-image,.kyf-selected-image{width:36px;height:36px;display:flex;align-items:center;justify-content:center;border:1px solid #263a36;border-radius:4px;background:#0c1211;overflow:hidden}.kyf-mob-image img,.kyf-selected-image img{max-width:36px;max-height:36px}.kyf-mob-name{font-weight:bold}.kyf-meta{margin-top:1px;color:#8c9f99;font-size:9px}.kyf-items{padding:6px}.kyf-selected{position:sticky;top:0;z-index:3;display:grid;grid-template-columns:42px 1fr;gap:6px;align-items:center;margin:-6px -6px 6px;padding:5px 6px;background:#0e1717;border-bottom:1px solid #203531}.kyf-selected-name{font-weight:bold;color:#dff9ee}.kyf-empty{padding:10px;color:#8c9e98;line-height:14px}.kyf-source{border:1px solid #203531;border-radius:5px;background:#0d1616;padding:5px 6px;color:#91a69f;font-size:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kyf-source a{color:#64eeb2}
    .kyf-group{margin-bottom:5px;border:1px solid #233733;border-radius:6px;overflow:hidden}.kyf-group h4{margin:0;padding:5px 6px;background:#101919;display:flex;justify-content:space-between;font-size:10px;cursor:pointer;user-select:none}.kyf-group h4:hover{background:#152421}.kyf-collapse-marker{display:inline-block;width:12px;color:#7fa69a}.kyf-group.collapsed .kyf-grid{display:none}.kyf-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(39px,1fr));gap:5px;padding:6px}.kyf-item{height:39px;display:flex;align-items:center;justify-content:center;border:1px solid var(--rarity);border-radius:5px;background:#050707;cursor:help;position:relative}.kyf-item img{max-width:35px;max-height:35px}.kyf-tip{position:fixed;z-index:2147483647;display:none;width:320px;max-height:80vh;overflow:auto;padding:6px;border:2px solid var(--rarity);background:rgba(3,5,4,.98);color:#edf3ef;box-shadow:0 8px 25px #000;pointer-events:none;font:11px/14px Verdana,Arial,sans-serif}.kyf-tip-head{display:grid;grid-template-columns:38px 1fr;gap:7px;align-items:center;padding:4px;border:1px solid #35443f;background:#151a18;margin-bottom:5px}.kyf-tip-head img{max-width:35px;max-height:35px}.kyf-tip-name{font-weight:bold;color:var(--rarity)}.kyf-tip-rarity{font-weight:bold;color:var(--rarity);border-bottom:1px solid var(--rarity);padding-bottom:3px;margin-bottom:3px}.kyf-stat{padding:1px 0}.kyf-stat b{color:#ffb52e}.kyf-legbon{color:#58ef70;font-weight:bold;margin-top:4px;padding-top:3px;border-top:1px solid #3b4641}.kyf-legbon-desc{color:#58ef70;padding:1px 0 4px;border-bottom:1px solid #3b4641}.kyf-opis{color:#aeb9b4;margin-top:4px;padding:4px 0;border-bottom:1px solid #3b4641}.kyf-bind{margin-top:5px;padding-bottom:4px;border-bottom:1px solid #3b4641}.kyf-footer{padding-top:4px}.kyf-footer .kyf-stat{font-weight:bold}.kyf-launch{position:fixed;right:8px;top:75px;z-index:2147483644;width:39px;height:39px;border:2px solid #4c7869;border-radius:6px;background:#081512;color:#72ffc2;font:bold 12px Arial;cursor:pointer;box-shadow:0 0 0 2px #050807}
    .kyf-route-group h4{color:#77e8bd}.kyf-route-body{padding:6px;color:#c7d8d2;font-size:10px;line-height:14px;background:#08100f}.kyf-route-missing{color:#81958e;font-style:italic}.kyf-group.collapsed .kyf-route-body{display:none}
    .kyf-head-actions{display:flex;gap:5px}.kyf-head .kyf-options-btn{width:auto;padding:0 8px;color:#caffea;border-color:#39745f;background:#10221c}.kyf-options{display:none;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;align-items:center;padding:7px;border:1px solid #29433e;border-radius:6px;background:#0d1716}.kyf-options.open{display:grid}.kyf-options label{display:flex;align-items:center;gap:5px;color:#b9c9c3;font-size:9px}.kyf-options select,.kyf-options input[type=number]{height:25px;border:1px solid #34564d;border-radius:4px;background:#050a0b;color:#eaf6f1;padding:0 5px}.kyf-options input[type=number]{width:52px}.kyf-range{color:#70cfa9}.kyf-selected{grid-template-columns:42px 1fr auto}.kyf-chance-wrap{position:relative;align-self:start}.kyf-chance-btn{width:23px;height:23px;border:1px solid #3c8069;border-radius:50%;background:#10211c;color:#7cffc2;font-weight:bold;cursor:pointer}.kyf-chance-popover{display:none;position:absolute;z-index:30;right:0;top:27px;width:280px;max-height:390px;overflow:auto;padding:8px;border:1px solid #4c9b7e;border-radius:6px;background:rgba(5,11,10,.99);box-shadow:0 8px 24px #000;color:#dce9e4;font-size:10px;line-height:14px}.kyf-chance-wrap.open .kyf-chance-popover{display:block}.kyf-chance-title{font-weight:bold;color:#77ffc2;margin-bottom:5px}.kyf-chance-row{display:flex;justify-content:space-between;gap:10px;padding:2px 0;border-bottom:1px solid #172824}.kyf-chance-row span:last-child{text-align:right}.kyf-chance-adjusted{display:block;color:#70eeb1;font-size:9px}.kyf-chance-note{margin-top:6px;color:#8fa39b;font-size:9px;line-height:12px}.kyf-chance-select{width:100%;height:26px;margin:3px 0 6px;border:1px solid #34564d;border-radius:4px;background:#07100e;color:#e9f6f1}.kyf-tip.kyf-color-elements .kyf-element-fire{color:#ff5757}.kyf-tip.kyf-color-elements .kyf-element-frost{color:#62aaff}.kyf-tip.kyf-color-elements .kyf-element-light{color:#ffe34f}.kyf-tip.kyf-color-elements .kyf-element-poison{color:#52e86f}.kyf-launch{cursor:grab;user-select:none;touch-action:none}.kyf-launch.dragging{cursor:grabbing}
  `;
  document.head.appendChild(style);

  const launch = document.createElement('button');
  launch.className = 'kyf-launch';
  launch.textContent = 'FE';
  launch.title = 'Forumowe przedmioty potworów specjalnych';
  const savedLauncherPos = loadJson(STORE_LAUNCHER_POS, null);
  if (savedLauncherPos && Number.isFinite(savedLauncherPos.left) && Number.isFinite(savedLauncherPos.top)) {
    launch.style.right = 'auto';
    launch.style.left = Math.max(0, Math.min(innerWidth - 39, savedLauncherPos.left)) + 'px';
    launch.style.top = Math.max(0, Math.min(innerHeight - 39, savedLauncherPos.top)) + 'px';
  }
  document.body.appendChild(launch);

  const panel = document.createElement('div');
  panel.id = 'ky-forum-e2';
  panel.innerHTML = `
    <div class="kyf-head"><div><div class="kyf-title">FORUMOWE PRZEDMIOTY 2.0</div><div class="kyf-sub">Autor: <a href="https://www.margonem.pl/profile/view,10050726#char_5601,luvia" target="_blank" rel="noopener">Król Yss</a> • Elity • Herosi • Kolosi • Tytani • v2.0.3</div></div><div class="kyf-head-actions"><button class="kyf-options-btn" id="kyf-options-btn">Opcje</button><button id="kyf-close">X</button></div></div>
    <div class="kyf-body">
      <div class="kyf-tabs"><button class="kyf-tab" data-category="elites">Elity</button><button class="kyf-tab active" data-category="elites2">Elity II</button><button class="kyf-tab" data-category="heroes">Herosi</button><button class="kyf-tab" data-category="colossi">Kolosi</button><button class="kyf-tab" data-category="titans">Tytani</button></div>
      <div class="kyf-options" id="kyf-options"><label><input type="checkbox" id="kyf-color-elements"> Koloruj żywioły i odporności</label><label>Mnożnik <select id="kyf-loot-multiplier"><option value="1">×1</option><option value="2">×2</option><option value="3">×3</option><option value="4">×4</option><option value="5">×5</option></select></label><label>Zmniejszenie pustego łupu <input type="number" id="kyf-loot-bonus" min="0" max="100" step="1">%</label><label>Zakres pełnego łupu Elit ± <input type="number" id="kyf-level-range" min="0" max="100" step="1"> lvl</label></div>
      <div class="kyf-tools"><input class="kyf-input" id="kyf-search" placeholder="Szukaj elity lub przedmiotu"><button class="kyf-btn" id="kyf-refresh">Odśwież forum</button></div>
      <div class="kyf-main"><div class="kyf-list" id="kyf-list"></div><div class="kyf-items" id="kyf-items"><div class="kyf-empty">Pobieram dane z forum…</div></div></div>
      <div class="kyf-source" id="kyf-status"></div>
    </div>`;
  document.body.appendChild(panel);
  const savedPanelPos = loadJson(STORE_PANEL_POS, null);
  if (savedPanelPos && Number.isFinite(savedPanelPos.left) && Number.isFinite(savedPanelPos.top)) {
    panel.style.right = 'auto';
    panel.style.left = Math.max(0, Math.min(innerWidth - 570, savedPanelPos.left)) + 'px';
    panel.style.top = Math.max(0, Math.min(innerHeight - 650, savedPanelPos.top)) + 'px';
  }

  const tip = document.createElement('div');
  tip.className = 'kyf-tip';
  document.body.appendChild(tip);

  bindLauncherDrag();
  bindPanelDrag();
  panel.querySelector('#kyf-close').addEventListener('click', () => panel.style.display = 'none');
  panel.querySelector('#kyf-options-btn').addEventListener('click', () => panel.querySelector('#kyf-options').classList.toggle('open'));
  panel.querySelector('#kyf-search').addEventListener('input', event => { filter = event.target.value; renderList(); });
  panel.querySelector('#kyf-refresh').addEventListener('click', () => loadForum(true));
  panel.querySelectorAll('.kyf-tab').forEach(button => button.addEventListener('click', () => switchCategory(button.dataset.category)));
  panel.querySelector('#kyf-color-elements').checked = preferences.colorElements;
  panel.querySelector('#kyf-loot-multiplier').value = String(preferences.lootMultiplier);
  panel.querySelector('#kyf-loot-bonus').value = String(preferences.lootBonus);
  panel.querySelector('#kyf-level-range').value = String(preferences.levelRange);
  panel.querySelector('#kyf-color-elements').addEventListener('change', event => {
    preferences.colorElements = !!event.target.checked;
    tip.classList.toggle('kyf-color-elements', preferences.colorElements);
    savePreferences();
  });
  panel.querySelector('#kyf-loot-multiplier').addEventListener('change', event => {
    preferences.lootMultiplier = Math.round(clampNumber(event.target.value, 1, 5, 1));
    event.target.value = String(preferences.lootMultiplier);
    savePreferences();
    renderItems();
  });
  panel.querySelector('#kyf-loot-bonus').addEventListener('change', event => {
    preferences.lootBonus = clampNumber(event.target.value, 0, 100, 0);
    event.target.value = String(preferences.lootBonus);
    savePreferences();
    renderItems();
  });
  panel.querySelector('#kyf-level-range').addEventListener('change', event => {
    preferences.levelRange = Math.round(clampNumber(event.target.value, 0, 100, 13));
    event.target.value = String(preferences.levelRange);
    savePreferences();
    renderList();
    renderItems();
  });
  [panel.querySelector('#kyf-list'), panel.querySelector('#kyf-items')].forEach(enableWheelScroll);
  panel.addEventListener('wheel', event => event.stopPropagation(), { passive: true });
  document.addEventListener('click', () => panel.querySelectorAll('.kyf-chance-wrap.open').forEach(element => element.classList.remove('open')));

  loadForum(false);

  function bindLauncherDrag() {
    let dragging = false;
    let dragged = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;
    launch.addEventListener('mousedown', event => {
      if (event.button !== 0) return;
      const rect = launch.getBoundingClientRect();
      dragging = true;
      dragged = false;
      startX = event.clientX;
      startY = event.clientY;
      startLeft = rect.left;
      startTop = rect.top;
      launch.style.right = 'auto';
      launch.style.left = rect.left + 'px';
      launch.classList.add('dragging');
      event.preventDefault();
    });
    document.addEventListener('mousemove', event => {
      if (!dragging) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (Math.abs(dx) + Math.abs(dy) > 3) dragged = true;
      launch.style.left = Math.max(0, Math.min(innerWidth - launch.offsetWidth, startLeft + dx)) + 'px';
      launch.style.top = Math.max(0, Math.min(innerHeight - launch.offsetHeight, startTop + dy)) + 'px';
    });
    document.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      launch.classList.remove('dragging');
      if (dragged) saveJson(STORE_LAUNCHER_POS, { left: launch.offsetLeft, top: launch.offsetTop });
    });
    launch.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      if (dragged) {
        dragged = false;
        return;
      }
      panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
    });
  }

  function bindPanelDrag() {
    const handle = panel.querySelector('.kyf-head');
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;
    handle.addEventListener('mousedown', event => {
      if (event.button !== 0 || event.target.closest('button, input, select, a')) return;
      const rect = panel.getBoundingClientRect();
      dragging = true;
      startX = event.clientX;
      startY = event.clientY;
      startLeft = rect.left;
      startTop = rect.top;
      panel.style.right = 'auto';
      panel.style.left = rect.left + 'px';
      panel.style.top = rect.top + 'px';
      event.preventDefault();
    });
    document.addEventListener('mousemove', event => {
      if (!dragging) return;
      const maxLeft = Math.max(0, innerWidth - panel.offsetWidth);
      const maxTop = Math.max(0, innerHeight - panel.offsetHeight);
      panel.style.left = Math.max(0, Math.min(maxLeft, startLeft + event.clientX - startX)) + 'px';
      panel.style.top = Math.max(0, Math.min(maxTop, startTop + event.clientY - startY)) + 'px';
    });
    document.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      saveJson(STORE_PANEL_POS, { left: panel.offsetLeft, top: panel.offsetTop });
    });
  }

  function savePreferences() {
    saveJson(STORE_SETTINGS, preferences);
  }

  function enableWheelScroll(element) {
    element.addEventListener('wheel', event => {
      event.preventDefault();
      event.stopPropagation();
      const multiplier = event.deltaMode === 1 ? 18 : event.deltaMode === 2 ? element.clientHeight : 1;
      element.scrollTop += event.deltaY * multiplier;
    }, { passive: false });
  }

  function request(url) {
    return new Promise((resolve, reject) => GM_xmlhttpRequest({
      method: 'GET', url,
      onload: response => response.status >= 200 && response.status < 300 ? resolve(response.responseText) : reject(new Error('HTTP ' + response.status)),
      onerror: reject
    }));
  }

  async function loadForum(force) {
    const category = activeCategory;
    const config = CATEGORIES[category];
    setStatus(`Pobieram temat: ${config.label}…`, category);
    try {
      const cached = loadCache(category);
      if (!force && cached && Date.now() - cached.savedAt < CACHE_MS && Array.isArray(cached.data)) {
        databases[category] = cached.data;
        finishLoad('Dane z pamięci podręcznej', category);
        return;
      }
      const html = await request(config.source);
      databases[category] = parseForum(html);
      const cacheSaved = saveCache(category, databases[category]);
      finishLoad(cacheSaved ? 'Pobrano bezpośrednio z forum' : 'Pobrano z forum (bez zapisu cache)', category);
    } catch (error) {
      console.warn('[Forum Elity]', config.label, error);
      setStatus('Nie udało się pobrać forum: ' + error.message, category);
    }
  }

  function finishLoad(message, category) {
    const database = databases[category];
    if (!selectedMobs[category] || !database.some(mob => normalize(mob.name) === normalize(selectedMobs[category].name))) selectedMobs[category] = database[0] || null;
    if (category !== activeCategory) return;
    renderList();
    renderItems();
    setStatus(`${message}: ${database.length} potworów, ${database.reduce((sum, mob) => sum + mob.items.length, 0)} przedmiotów.`, category);
  }

  function loadCache(category) {
    const key = CATEGORIES[category].cacheKey;
    try {
      const stored = GM_getValue(key, null);
      if (stored) return typeof stored === 'string' ? JSON.parse(stored) : stored;
    } catch (error) {
      console.warn('[Forum Elity] Odczyt cache Tampermonkey:', error);
    }
    try {
      const legacy = JSON.parse(localStorage.getItem(key) || 'null');
      if (legacy) {
        try {
          GM_setValue(key, JSON.stringify(legacy));
          localStorage.removeItem(key);
        } catch (error) { /* migracja jest opcjonalna */ }
      }
      return legacy;
    } catch (error) {
      return null;
    }
  }

  function saveCache(category, data) {
    const key = CATEGORIES[category].cacheKey;
    const payload = JSON.stringify({ savedAt: Date.now(), data });
    try {
      GM_setValue(key, payload);
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('[Forum Elity] Zapis cache Tampermonkey:', error);
    }
    try {
      localStorage.setItem(key, payload);
      return true;
    } catch (error) {
      console.warn('[Forum Elity] Brak miejsca na cache, dane pozostają w pamięci:', error);
      return false;
    }
  }

  function cleanupObsoleteLocalCaches() {
    [
      'ky_forum_elites_items_v1',
      'ky_forum_e2_items_v1', 'ky_forum_e2_items_v2',
      'ky_forum_heroes_items_v1', 'ky_forum_heroes_items_v2',
      'ky_forum_colossi_items_v1', 'ky_forum_colossi_items_v2',
      'ky_forum_titans_items_v1', 'ky_forum_titans_items_v2'
    ].forEach(key => {
      try { localStorage.removeItem(key); } catch (error) { /* brak dostępu nie blokuje dodatku */ }
      try { GM_deleteValue(key); } catch (error) { /* starsze wpisy nie muszą istnieć */ }
    });
    try {
      Object.keys(localStorage).filter(key => key.startsWith('mh_bestiary_')).forEach(key => localStorage.removeItem(key));
    } catch (error) { /* stare dane Bestiariusza 1.x nie mogą blokować wersji 2.0 */ }
  }

  function switchCategory(category) {
    if (!CATEGORIES[category] || category === activeCategory) return;
    activeCategory = category;
    panel.querySelectorAll('.kyf-tab').forEach(button => button.classList.toggle('active', button.dataset.category === category));
    panel.querySelector('#kyf-search').placeholder = `Szukaj: ${CATEGORIES[category].label.toLowerCase()} lub przedmiotu`;
    tip.style.display = 'none';
    if (databases[category].length) {
      renderList();
      renderItems();
      const database = databases[category];
      setStatus(`Wczytano: ${database.length} potworów, ${database.reduce((sum, mob) => sum + mob.items.length, 0)} przedmiotów.`, category);
    } else {
      panel.querySelector('#kyf-list').innerHTML = '<div class="kyf-empty">Pobieram listę…</div>';
      panel.querySelector('#kyf-items').innerHTML = '<div class="kyf-empty">Pobieram dane z forum…</div>';
      loadForum(false);
    }
  }

  function parseForum(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const posts = [...doc.querySelectorAll('td')].filter(td => /Szablon zdobyczy/i.test(td.textContent || '') && td.querySelector('img[stats]'));
    const mobs = [];
    for (const post of posts) {
      const source = post.innerHTML;
      const marker = /<b[^>]*>([^<]{2,100})<\/b>\s*(?:-\s*)?<i[^>]*>([^<]*?)(\d+)\s*lvl[^<]*<\/i>/gi;
      const sections = [];
      let match;
      while ((match = marker.exec(source))) sections.push({ index: match.index, end: marker.lastIndex, name: decode(match[1]), profile: decode(match[2]).replace(/,\s*$/, '').trim(), level: Number(match[3]) });
      sections.forEach((section, index) => {
        let body = source.slice(section.end, sections[index + 1] ? sections[index + 1].index : source.length);
        body = body.split(/Legendarne kryształy wymienią|Powyższe kryształy wymienimy/i)[0];
        const mobImageMatch = body.match(/<img\b[^>]*\bsrc=(['"])([^'"]*\/obrazki\/npc\/[^'"]+)\1/i);
        const mobImage = mobImageMatch ? absoluteImage(decode(mobImageMatch[2])) : '';
        const chestChanceMatch = body.match(/Szansa na legendarn[aą] skrytk[^:<]*:<\/b>\s*([0-9.,]+)%/i);
        const legendaryChestChance = chestChanceMatch ? chestChanceMatch[1].replace('.', ',') + '%' : '';
        const mapAccessRange = parseMapAccessRange(body) || MAP_ACCESS_RANGES[normalize(section.name)] || '';
        const route = parseRoute(body);
        const chestMarker = body.search(/Przedmioty do zdobycia ze skrzyni/i);
        const regularItems = parseItems(chestMarker >= 0 ? body.slice(0, chestMarker) : body, 'regular');
        const chestItems = chestMarker >= 0 ? parseItems(body.slice(chestMarker), 'chest') : [];
        const items = regularItems.concat(chestItems);
        if (!items.length) return;
        const existing = mobs.find(mob => normalize(mob.name) === normalize(section.name));
        if (existing) {
          existing.items.push(...items.filter(item => !existing.items.some(old => itemKey(old) === itemKey(item))));
          if (!existing.image && mobImage) existing.image = mobImage;
          if (!existing.legendaryChestChance && legendaryChestChance) existing.legendaryChestChance = legendaryChestChance;
          if (!existing.mapAccessRange && mapAccessRange) existing.mapAccessRange = mapAccessRange;
          if (!existing.route && route) existing.route = route;
        } else mobs.push({ name: section.name, profile: section.profile, level: section.level, image: mobImage, legendaryChestChance, mapAccessRange, route, items });
      });
    }
    return mobs.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name, 'pl'));
  }

  function parseMapAccessRange(html) {
    const text = new DOMParser().parseFromString(html, 'text/html').body.textContent.replace(/\s+/g, ' ').trim();
    const closed = text.match(/Wejście na mapę:\s*(\d+)\s*[-–—]\s*(\d+)\s*lvl/i);
    if (closed) return `${closed[1]}–${closed[2]} lvl`;
    const open = text.match(/Wejście na mapę:\s*(\d+)\s*(?:lvl\s*)?\+/i);
    return open ? `${open[1]}+ lvl` : '';
  }

  function parseRoute(html) {
    const source = String(html).replace(/<br\s*\/?\s*>/gi, '\n');
    const text = new DOMParser().parseFromString(source, 'text/html').body.textContent.replace(/\r/g, '');
    const match = text.match(/Dojście\s*:\s*([\s\S]*?)(?=\n\s*(?:Tryb PvP|Dostępność lokacji|Wejście na mapę|Podgląd mapy|Szablon zdobyczy|Miejsca respawnu|Szansa na|Statystyki|Występowanie|Specjalne umiejętności|$))/i);
    return match ? match[1].replace(/\s+/g, ' ').trim() : '';
  }

  function parseItems(html, lootSource = 'regular') {
    const items = [];
    const image = /<img\b([^>]*?)\bstats=(['"])([\s\S]*?)\2([^>]*)>/gi;
    let match;
    while ((match = image.exec(html))) {
      const attrs = match[1] + ' ' + match[4];
      const srcMatch = attrs.match(/\bsrc=(['"])(.*?)\1/i);
      const raw = decode(match[3]);
      const parts = raw.split('||');
      const stats = parseStats(parts[1] || '');
      items.push({ name: parts[0] || 'Przedmiot', raw, stats, rarity: stats.rarity || 'unknown', lootSource, image: srcMatch ? absoluteImage(decode(srcMatch[2])) : '', itemClass: parts[2] || '', value: parts[3] || '' });
    }
    return items;
  }

  function parseStats(raw) {
    const stats = {};
    String(raw).split(';').forEach(part => {
      if (!part) return;
      const [key, ...value] = part.split('=');
      stats[key.trim().toLowerCase()] = value.length ? value.join('=').trim() : true;
    });
    return stats;
  }

  function renderList() {
    const database = databases[activeCategory];
    const previousSelectedMob = selectedMobs[activeCategory];
    const query = normalize(filter);
    const visible = database.filter(mob => !query || normalize(mob.name + ' ' + mob.profile).includes(query) || mob.items.some(item => normalize(item.name).includes(query)));
    if (query && selectedMobs[activeCategory] && !visible.includes(selectedMobs[activeCategory])) selectedMobs[activeCategory] = visible[0] || null;
    const selectedMob = selectedMobs[activeCategory];
    const box = panel.querySelector('#kyf-list');
    box.innerHTML = `<div class="kyf-count">${visible.length} / ${database.length} potworów</div>` + visible.map(mob => `<div class="kyf-mob${selectedMob && selectedMob.name === mob.name ? ' active' : ''}" data-index="${database.indexOf(mob)}"><div class="kyf-mob-image">${mob.image ? `<img src="${escapeHtml(mob.image)}" alt="">` : '?'}</div><div><div class="kyf-mob-name">${escapeHtml(mob.name)}</div><div class="kyf-meta">${mob.level} lvl | ${escapeHtml(mob.profile || 'brak profesji')}</div>${monsterRangeLine(activeCategory, mob)}</div></div>`).join('');
    box.querySelectorAll('.kyf-mob').forEach(row => row.addEventListener('click', () => { selectedMobs[activeCategory] = database[Number(row.dataset.index)]; renderList(); renderItems(); }));
    if (selectedMob !== previousSelectedMob) renderItems();
  }

  function renderItems() {
    const selectedMob = selectedMobs[activeCategory];
    const box = panel.querySelector('#kyf-items');
    if (!selectedMob) { box.innerHTML = '<div class="kyf-empty">Brak pasujących elit.</div>'; return; }
    const query = normalize(filter);
    const items = selectedMob.items.filter(item => !query || normalize(selectedMob.name).includes(query) || normalize(item.name).includes(query));
    const groups = new Map();
    items.forEach(item => {
      const source = activeCategory === 'heroes' && item.lootSource === 'chest' ? 'chest' : 'regular';
      const key = source + ':' + item.rarity;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    });
    const groupsHtml = [...groups.entries()].sort((a, b) => lootGroupInfo(a[0]).order - lootGroupInfo(b[0]).order).map(([key, list]) => {
      const group = lootGroupInfo(key);
      const collapseKey = activeCategory + '|' + key;
      const collapsed = !!collapsedGroups[collapseKey];
      return `<div class="kyf-group${collapsed ? ' collapsed' : ''}" data-collapse-key="${escapeHtml(collapseKey)}"><h4 style="color:${group.color}" aria-expanded="${collapsed ? 'false' : 'true'}"><span><span class="kyf-collapse-marker">${collapsed ? '▶' : '▼'}</span>${escapeHtml(group.label)}</span><span>${list.length}</span></h4><div class="kyf-grid">${list.map((item, index) => `<div class="kyf-item" style="--rarity:${group.color}" data-key="${escapeHtml(key + ':' + index)}">${item.image ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}">` : escapeHtml(item.name.slice(0, 2))}</div>`).join('')}</div></div>`;
    }).join('');
    const routeHtml = renderRouteSection(activeCategory, selectedMob);
    box.innerHTML = `<div class="kyf-selected"><div class="kyf-selected-image">${selectedMob.image ? `<img src="${escapeHtml(selectedMob.image)}" alt="">` : '?'}</div><div><div class="kyf-selected-name">${escapeHtml(selectedMob.name)}</div><div class="kyf-meta">${selectedMob.level} lvl | ${escapeHtml(selectedMob.profile || 'brak profesji')}</div>${monsterRangeLine(activeCategory, selectedMob)}</div><div class="kyf-chance-wrap"><button class="kyf-chance-btn" title="Przybliżone szanse na łup">?</button><div class="kyf-chance-popover">${renderDropChancePopover(activeCategory, selectedMob)}</div></div></div>${routeHtml}${groupsHtml}`;
    const chanceWrap = box.querySelector('.kyf-chance-wrap');
    chanceWrap.querySelector('.kyf-chance-btn').addEventListener('click', event => {
      event.stopPropagation();
      chanceWrap.classList.toggle('open');
    });
    const chancePopover = chanceWrap.querySelector('.kyf-chance-popover');
    chancePopover.addEventListener('click', event => event.stopPropagation());
    enableWheelScroll(chancePopover);
    const variantSelect = chanceWrap.querySelector('#kyf-e2-variant');
    if (variantSelect) variantSelect.addEventListener('change', event => {
      preferences.e2Variant = E2_CHANCE_VARIANTS[event.target.value] ? event.target.value : 'standard';
      savePreferences();
      renderItems();
    });
    const lookup = {};
    [...groups.entries()].forEach(([key, list]) => list.forEach((item, index) => lookup[key + ':' + index] = item));
    box.querySelectorAll('.kyf-group > h4').forEach(header => header.addEventListener('click', () => {
      const group = header.closest('.kyf-group');
      const collapseKey = group.dataset.collapseKey;
      const collapsed = group.classList.toggle('collapsed');
      if (collapsed) collapsedGroups[collapseKey] = true;
      else delete collapsedGroups[collapseKey];
      header.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      header.querySelector('.kyf-collapse-marker').textContent = collapsed ? '▶' : '▼';
      saveJson(STORE_COLLAPSED_GROUPS, collapsedGroups);
    }));
    box.querySelectorAll('.kyf-item').forEach(element => {
      const item = lookup[element.dataset.key];
      element.addEventListener('mouseenter', event => showTip(item, event.clientX, event.clientY));
      element.addEventListener('mousemove', event => moveTip(event.clientX, event.clientY));
      element.addEventListener('mouseleave', () => tip.style.display = 'none');
    });
  }

  function renderDropChancePopover(category, mob) {
    if (category === 'elites2') {
      const variant = E2_CHANCE_VARIANTS[preferences.e2Variant] || E2_CHANCE_VARIANTS.standard;
      const options = Object.entries(E2_CHANCE_VARIANTS).map(([key, entry]) => `<option value="${escapeHtml(key)}"${key === preferences.e2Variant ? ' selected' : ''}>${escapeHtml(entry.label)}</option>`).join('');
      return `<div class="kyf-chance-title">Szanse na łup — Elity II</div><select class="kyf-chance-select" id="kyf-e2-variant">${options}</select>${renderChanceRows(variant.rows)}${renderLootFactorNote(variant.rows)}`;
    }
    const data = DROP_CHANCES[category];
    if (!data) return '<div class="kyf-chance-note">Brak danych o szansach.</div>';
    const individualChance = mob && mob.legendaryChestChance ? `<div class="kyf-chance-row"><span>Legendarna skrytka tego Herosa</span><span><strong>${escapeHtml(mob.legendaryChestChance)}</strong></span></div>` : '';
    const secondary = data.secondaryRows ? `<div class="kyf-chance-title" style="margin-top:8px">${escapeHtml(data.secondaryLabel)}</div>${renderChanceRows(data.secondaryRows)}` : '';
    return `<div class="kyf-chance-title">Szanse na łup — ${escapeHtml(data.label)}</div>${individualChance}${renderChanceRows(data.rows)}${secondary}${renderLootFactorNote(data.rows)}`;
  }

  function renderChanceRows(rows) {
    const emptyRow = (rows || []).find(row => normalize(row[0]) === 'brak lupu');
    const emptyChance = emptyRow ? firstPercentValue(emptyRow[1]) : null;
    return (rows || []).map(row => {
      const adjusted = adjustedChanceText(row[0], row[1], emptyChance);
      return `<div class="kyf-chance-row"><span>${escapeHtml(row[0])}</span><span><strong>${escapeHtml(row[1])}</strong>${adjusted ? `<small class="kyf-chance-adjusted">Po bonusie: ${escapeHtml(adjusted)}</small>` : ''}</span></div>`;
    }).join('');
  }

  function renderLootFactorNote(rows) {
    const modified = preferences.lootMultiplier !== 1 || preferences.lootBonus !== 0;
    const hasSeparateEmptyChance = (rows || []).some(row => normalize(row[0]) === 'brak lupu');
    const base = '<div class="kyf-chance-note">Wartości przybliżone, pobrane z oficjalnego tematu forum.';
    if (!modified) return base + '</div>';
    if (!hasSeparateEmptyChance) return base + '<br>Bonus jest ustawiony, ale źródło nie podaje osobno pustego łupu, więc nie pokazuję zgadywanego przeliczenia.</div>';
    return base + `<br>Przeliczenie: mnożnik ×${escapeHtml(preferences.lootMultiplier)}; zmniejszenie pustego łupu: ${escapeHtml(preferences.lootBonus)}%.</div>`;
  }

  function adjustedChanceText(label, rawChance, emptyChance) {
    if (emptyChance == null || emptyChance < 0 || emptyChance >= 100) return '';
    const isEmpty = normalize(label) === 'brak lupu';
    const baseEmpty = emptyChance / 100;
    const denominator = 1 - baseEmpty + baseEmpty / preferences.lootMultiplier;
    const worldEmpty = (baseEmpty / preferences.lootMultiplier) / denominator;
    const adjustedEmpty = worldEmpty * (1 - preferences.lootBonus / 100);
    if (isEmpty) {
      if (preferences.lootMultiplier === 1 && preferences.lootBonus === 0) return '';
      return formatChanceNumber(adjustedEmpty * 100) + '%';
    }
    const factor = (1 - adjustedEmpty) / (1 - baseEmpty);
    if (Math.abs(factor - 1) < 0.000001) return '';
    const chance = firstPercentValue(rawChance);
    return chance == null ? '' : formatChanceNumber(Math.min(100, chance * factor)) + '%';
  }

  function firstPercentValue(value) {
    const match = String(value || '').match(/(\d+(?:[.,]\d+)?)\s*%/);
    return match ? Number(match[1].replace(',', '.')) : null;
  }

  function formatChanceNumber(value) {
    return Number(value.toFixed(4)).toString().replace('.', ',');
  }

  function showTip(item, x, y) {
    const info = rarity(item.rarity);
    const stats = item.stats || {};
    const knownRows = STAT_ORDER.filter(key => stats[key] != null && !SKIP.has(key)).map(key => formatStatRow(key, stats[key])).filter(Boolean);
    const extraRows = Object.keys(stats).filter(key => !SKIP.has(key) && !STRUCTURAL_KEYS.has(key) && !STAT_ORDER.includes(key)).map(key => formatStatRow(key, stats[key])).filter(Boolean);
    const rows = knownRows.concat(extraRows).join('');
    const bonusRaw = stats.socket_fleeting_legbon || stats.legbon || '';
    const bonusCode = String(bonusRaw).split(',')[0];
    const bonusName = LEGENDARY_BONUSES[bonusCode] || bonusCode;
    const bonusHtml = bonusRaw ? `<div class="kyf-legbon">${escapeHtml(bonusName)}</div>${LEGENDARY_DESCRIPTIONS[bonusCode] ? `<div class="kyf-legbon-desc">${escapeHtml(LEGENDARY_DESCRIPTIONS[bonusCode])}</div>` : ''}` : '';
    const descriptionHtml = stats.opis ? `<div class="kyf-opis">${formatDescription(stats.opis)}</div>` : '';
    const bindHtml = stats.permbound || stats.soulbound ? '<div class="kyf-bind">Związany z właścicielem na stałe</div>' : stats.binds || stats.bind ? '<div class="kyf-bind">Wiąże po założeniu</div>' : '';
    const footer = [
      stats.reqp ? `<div class="kyf-stat">Wymagana profesja: <b>${escapeHtml(formatProfessions(stats.reqp))}</b></div>` : '',
      stats.lvl ? `<div class="kyf-stat">Wymagany poziom: <b>${escapeHtml(stats.lvl)}</b></div>` : '',
      item.value && item.value !== '0' ? `<div class="kyf-stat">Wartość: <b>${escapeHtml(formatItemValue(item.value))}</b></div>` : ''
    ].join('');
    tip.style.setProperty('--rarity', info.color);
    tip.classList.toggle('kyf-color-elements', preferences.colorElements);
    tip.innerHTML = `<div class="kyf-tip-head">${item.image ? `<img src="${escapeHtml(item.image)}" alt="">` : '<span></span>'}<div><div class="kyf-tip-name">${escapeHtml(item.name)}</div><div class="kyf-meta">Typ: ${escapeHtml(ITEM_TYPES[item.itemClass] || 'nieznany')}</div></div></div><div class="kyf-tip-rarity">${info.label}</div>${rows}${bonusHtml}${descriptionHtml}${bindHtml}${footer ? `<div class="kyf-footer">${footer}</div>` : ''}`;
    tip.style.display = 'block';
    moveTip(x, y);
  }

  function moveTip(x, y) {
    const rect = tip.getBoundingClientRect();
    let left = x + 14, top = y + 14;
    if (left + rect.width > innerWidth - 7) left = x - rect.width - 14;
    if (top + rect.height > innerHeight - 7) top = y - rect.height - 14;
    tip.style.left = Math.max(5, left) + 'px'; tip.style.top = Math.max(5, top) + 'px';
  }

  function formatStatRow(key, value) {
    if (key === 'opis') return `<div class="kyf-opis">${formatDescription(value)}</div>`;
    const pair = String(value).split(',').map(part => part.trim());
    const element = elementForStat(key);
    const strong = (text, useElementColor = true) => `<b${useElementColor && element ? ` class="kyf-element-${element}"` : ''}>${escapeHtml(text)}</b>`;
    if (key === 'teleport') {
      const destination = formatTeleportDestination(value);
      const punctuation = /[.!?]$/.test(destination) ? '' : '.';
      return `<div class="kyf-stat">Teleportuje gracza<br>na ${strong(destination + punctuation)}</div>`;
    }
    if (key === 'respred') return `<div class="kyf-stat">Przyśpiesza wracanie do siebie o ${strong(stripPercent(value) + '%')}</div>`;
    if (key === 'afterheal' && pair.length >= 2) return `<div class="kyf-stat">${strong(pair[0] + '%')} szans na wyleczenie ${strong(pair[1])} obrażeń po walce</div>`;
    if (key === 'enfatig' && pair.length >= 2) return `<div class="kyf-stat">${strong(pair[0] + '%')} szans na utratę ${strong(pair[1])} energii przez przeciwnika podczas obrony</div>`;
    if (key === 'manafatig' && pair.length >= 2) return `<div class="kyf-stat">${strong(pair[0] + '%')} szans na utratę ${strong(pair[1])} many przez przeciwnika podczas obrony</div>`;
    if (key === 'wound' && pair.length >= 2) return `<div class="kyf-stat">Głęboka rana, ${strong(pair[0] + '%')} szans na ${strong('+' + pair[1])} obrażeń</div>`;
    if ((key === 'frost' || key === 'poison') && pair.length >= 2) return `<div class="kyf-stat">${escapeHtml(LABELS[key])}: ${strong('+' + pair[1])}<br>oraz spowalnia cel o ${strong(formatHundredths(pair[0]) + ' SA', false)}</div>`;
    if (key === 'absorb') return `<div class="kyf-stat">Absorbuje do ${strong(formatLargeNumber(value))} obrażeń fizycznych</div>`;
    if (key === 'absorbm') return `<div class="kyf-stat">Absorbuje do ${strong(formatLargeNumber(value))} obrażeń magicznych</div>`;
    if (key === 'abdest') return `<div class="kyf-stat">Niszczenie ${strong(value)} absorpcji przed atakiem</div>`;
    if (key === 'adest') return `<div class="kyf-stat">Obniża właścicielowi ${strong(value)} punktów przywracania życia podczas walki</div>`;
    if (key === 'hpbon') return `<div class="kyf-stat">${strong('+' + stripPlus(value))} życia za 1 pkt siły</div>`;
    if (key === 'heal') return `<div class="kyf-stat">Przywraca ${strong(value)} punktów życia podczas walki</div>`;
    if (key === 'leczy') return `<div class="kyf-stat">Leczy ${strong(value)} punktów życia</div>`;
    if (key === 'bag') return `<div class="kyf-stat">Mieści ${strong(value)} przedmiotów</div>`;
    if (key === 'btype') return `<div class="kyf-stat">Tylko ${strong(String(value).split(',').map(code => BAG_TYPES[code] || code).join(', '))}</div>`;
    if (key === 'enhancement_refund') return `<div class="kyf-stat">Ekstrakcja przywróci wszystkie zasoby</div>`;
    if (key === 'personal') return `<div class="kyf-stat">Przedmiot osobisty</div>`;
    if (key === 'soulbound') return `<div class="kyf-stat">Związany z właścicielem na stałe</div>`;
    if (key === 'runes') return `<div class="kyf-stat">Dodaje ${strong(value)} Smoczych Run</div>`;
    if (key === 'reqp') return `<div class="kyf-stat">Wymagana profesja: ${strong(formatProfessions(value))}</div>`;
    if (key === 'legbon' || key === 'socket_fleeting_legbon') return `<div class="kyf-stat">${escapeHtml(LABELS[key] || 'Bonus legendarny')}: ${strong(formatLegendaryBonus(value))}</div>`;
    if (key === 'sa') return `<div class="kyf-stat">SA: ${strong('+' + formatHundredths(value))}</div>`;
    if (key === 'slow') return `<div class="kyf-stat">Obniża SA przeciwnika o ${strong(formatHundredths(value))}</div>`;
    if (key === 'resdmg') return `<div class="kyf-stat">Niszczenie odporności magicznych o ${strong(stripPercent(value) + '%')} podczas ciosu</div>`;
    if (key === 'pierceb') return `<div class="kyf-stat">${strong(stripPercent(value) + '%')} szans na zablokowanie przebicia</div>`;
    if (key === 'ttl') return `<div class="kyf-stat">Czas trwania: ${strong(value + ' min')}</div>`;
    if (/^dmgmul(?:absolute|fire|frost|light|physical|poison|wound)?$/.test(key)) return `<div class="kyf-stat">${escapeHtml(LABELS[key] || 'Wszystkie obrażenia')}: ${strong('+' + stripPercent(value) + '%')}</div>`;
    return `<div class="kyf-stat">${escapeHtml(LABELS[key] || readableKey(key))}: ${strong(formatValue(key, value))}</div>`;
  }

  function formatValue(key, value) {
    if (value === true) return 'tak';
    if (['crit', 'critval', 'critmval', 'resfire', 'resfrost', 'rescold', 'reslight', 'act', 'pierce', 'contra', 'lowcrit'].includes(key)) return '+' + stripPercent(value) + '%';
    if (['ac', 'dmg', 'pdmg', 'acdmg', 'absorb', 'absorbm', 'hp', 'mana', 'manabon', 'energy', 'energybon', 'da', 'ds', 'dz', 'di', 'evade', 'blok', 'heal', 'lowevade'].includes(key)) return (/^-/.test(String(value)) ? '' : '+') + String(value).replace(/,/g, '–');
    return String(value).replace(/,/g, '–');
  }

  function elementForStat(key) {
    if (['fire', 'resfire', 'dmgmulfire'].includes(key)) return 'fire';
    if (['frost', 'cold', 'resfrost', 'rescold', 'dmgmulfrost'].includes(key)) return 'frost';
    if (['light', 'reslight', 'dmgmullight'].includes(key)) return 'light';
    if (['poison', 'act', 'dmgmulpoison'].includes(key)) return 'poison';
    return '';
  }

  function formatProfessions(value) { return [...new Set(String(value).toLowerCase().split('').map(code => PROFESSIONS[code]).filter(Boolean))].map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(', ') || String(value); }
  function formatLegendaryBonus(value) { const code = String(value).split(',')[0]; return LEGENDARY_BONUSES[code] || code; }
  function formatTeleportDestination(value) {
    const raw = String(value || '').trim();
    const parts = raw.split(',');
    if (parts.length >= 4) return parts.slice(3).join(',').trim();
    const legacy = raw.match(/^\d+\s*[-|]\s*-?\d+\s*[-|]\s*-?\d+\s*[-|]\s*(.+)$/);
    return legacy ? legacy[1].trim() : raw;
  }
  function formatHundredths(value) { const number = Number(String(value).replace(',', '.')); return Number.isFinite(number) ? String(Number((number / 100).toFixed(2))) : String(value); }
  function formatItemValue(value) { const number = Number(String(value).replace(/\s/g, '')); if (!Number.isFinite(number)) return String(value); return number >= 1000 ? Number((number / 1000).toFixed(1)) + 'k' : String(number); }
  function stripPlus(value) { return String(value).replace(/^\+/, ''); }
  function stripPercent(value) { return stripPlus(value).replace(/%$/, ''); }
  function formatLargeNumber(value) { return String(value).replace(/\d{4,}/g, number => number.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')); }
  function readableKey(key) { return String(key).replace(/_/g, ' ').replace(/^./, letter => letter.toUpperCase()); }

  function combatRangeText(level) {
    const mobLevel = Number(level);
    if (!Number.isFinite(mobLevel) || mobLevel <= 0) return 'Pełny loot: brak danych';
    const minimum = Math.max(1, mobLevel - preferences.levelRange);
    const maximum = mobLevel + preferences.levelRange;
    return `Pełny loot: ${minimum}–${maximum} lvl (±${preferences.levelRange})`;
  }

  function monsterRangeLine(category, mob) {
    let text = '';
    if (category === 'elites' || category === 'elites2') text = combatRangeText(mob.level);
    else if ((category === 'colossi' || category === 'titans') && mob.mapAccessRange) text = `Wejście na mapę: ${mob.mapAccessRange}`;
    return text ? `<div class="kyf-meta kyf-range">${escapeHtml(text)}</div>` : '';
  }

  function renderRouteSection(category, mob) {
    if (!['elites', 'elites2', 'colossi', 'titans'].includes(category)) return '';
    const collapseKey = category + '|route';
    const collapsed = !!collapsedGroups[collapseKey];
    const route = String(mob.route || '').trim();
    const body = route ? escapeHtml(route) : '<span class="kyf-route-missing">Brak informacji o dojściu w temacie forum.</span>';
    return `<div class="kyf-group kyf-route-group${collapsed ? ' collapsed' : ''}" data-collapse-key="${escapeHtml(collapseKey)}"><h4 aria-expanded="${collapsed ? 'false' : 'true'}"><span><span class="kyf-collapse-marker">${collapsed ? '▶' : '▼'}</span>Dojście</span><span>${route ? 'trasa' : 'brak danych'}</span></h4><div class="kyf-route-body">${body}</div></div>`;
  }

  function formatDescription(value) { return escapeHtml(String(value).replace(/\[br\]/gi, '\n').replace(/\[\/?(?:i|b|u)\]/gi, '')).replace(/\n/g, '<br>'); }
  function rarity(key) { return RARITY[key] || RARITY.unknown; }
  function lootGroupInfo(key) {
    const chest = String(key).startsWith('chest:');
    const rarityKey = String(key).replace(/^(?:regular|chest):/, '');
    const info = rarity(rarityKey);
    return { color: info.color, label: chest ? `Ze skrytki — ${info.label}` : info.label, order: info.order + (chest ? 100 : 0) };
  }
  function itemKey(item) { return normalize(item.name) + '|' + item.image + '|' + (item.lootSource || 'regular'); }
  function normalize(value) { return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim(); }
  function absoluteImage(url) { return url.startsWith('//') ? 'https:' + url : url; }
  function decode(value) { const box = document.createElement('textarea'); box.innerHTML = value; return box.value; }
  function escapeHtml(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
  function clampNumber(value, min, max, fallback) {
    const parsed = Number(String(value == null ? '' : value).replace(',', '.'));
    return Number.isFinite(parsed) ? Math.max(min, Math.min(max, parsed)) : fallback;
  }
  function loadJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value == null ? fallback : value;
    } catch (error) {
      return fallback;
    }
  }
  function saveJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { /* brak miejsca nie blokuje dodatku */ }
  }
  function setStatus(text, category = activeCategory) {
    if (category !== activeCategory) return;
    const config = CATEGORIES[category];
    panel.querySelector('#kyf-status').innerHTML = `${escapeHtml(text)} | <a href="${config.source}" target="_blank" rel="noopener">otwórz ${escapeHtml(config.label)}</a>`;
  }
})();
