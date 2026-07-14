// ==UserScript==
// @name         MargoHelp Bestiariusz Podręczny
// @namespace    acesaff-margohelp-bestiary
// @version      2.2.2
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

  const LAUNCH_ICON = 'data:image/png;base64,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';

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
      cacheKey: 'ky_forum_heroes_items_v4'
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
  const SCRIPT_VERSION = '2.2.2';
  const SCRIPT_UPDATED_AT = new Date('2026-07-15T00:33:00+02:00').getTime();
  const STORE_SETTINGS = 'ky_forum_special_settings_v1';
  const STORE_LAUNCHER_POS = 'ky_forum_special_launcher_pos_v1';
  const STORE_PANEL_POS = 'ky_forum_special_panel_pos_v1';
  const STORE_COLLAPSED_GROUPS = 'ky_forum_special_collapsed_groups_v1';
  const STORE_CHANGE_LOG = 'ky_forum_special_change_log_v1';
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
  const categoryUpdatedAt = { elites: 0, elites2: 0, heroes: 0, colossi: 0, titans: 0 };
  let activeCategory = 'elites2';
  let filter = '';
  let changeLog = loadChangeLog();
  Object.keys(categoryUpdatedAt).forEach(category => {
    const lastEntry = changeLog.find(entry => entry && entry.category === category && Number(entry.timestamp));
    if (lastEntry) categoryUpdatedAt[category] = Number(lastEntry.timestamp);
  });
  const savedSettings = loadJson(STORE_SETTINGS, {});
  const savedCollapsedGroups = loadJson(STORE_COLLAPSED_GROUPS, {});
  const collapsedGroups = savedCollapsedGroups && typeof savedCollapsedGroups === 'object' && !Array.isArray(savedCollapsedGroups) ? savedCollapsedGroups : {};
  const preferences = {
    colorElements: !!savedSettings.colorElements,
    lootMultiplier: Math.round(clampNumber(savedSettings.lootMultiplier, 1, 5, 1)),
    lootBonus: clampNumber(savedSettings.lootBonus, 0, 100, 0),
    levelRange: Math.round(clampNumber(savedSettings.levelRange, 13, 50, 13)),
    e2Variant: E2_CHANCE_VARIANTS[savedSettings.e2Variant] ? savedSettings.e2Variant : 'standard'
  };
  cleanupObsoleteLocalCaches();
  Object.keys(categoryUpdatedAt).forEach(category => {
    const cached = loadCache(category);
    if (cached && Number(cached.savedAt) > categoryUpdatedAt[category]) categoryUpdatedAt[category] = Number(cached.savedAt);
  });

  const style = document.createElement('style');
  style.textContent = `
    #ky-forum-e2{position:fixed;right:22px;top:75px;width:570px;height:650px;z-index:2147483645;display:none;background:#091011;color:#e8f2ee;border:1px solid #438b70;border-radius:8px;box-shadow:0 14px 42px #000;font:11px Arial,sans-serif;overflow:hidden}
    #ky-forum-e2 *{box-sizing:border-box}.kyf-head{height:45px;display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:#101919;border-bottom:1px solid #29443d;cursor:move;user-select:none}.kyf-title{color:#6dffc0;font-size:14px;font-weight:bold}.kyf-sub{font-size:9px;color:#859b93}.kyf-sub a{color:#69dcae;text-decoration:none}.kyf-sub a:hover{text-decoration:underline;color:#8affc9}.kyf-head button,.kyf-btn{height:27px;border:1px solid #39745f;border-radius:5px;background:#10221c;color:#caffea;font-size:10px;font-weight:bold;cursor:pointer}.kyf-head button{width:27px;color:#ffb3b3;border-color:#744646;background:#251414}
    .kyf-body{height:calc(100% - 45px);display:flex;flex-direction:column;padding:7px;gap:6px}.kyf-tabs{display:grid;grid-template-columns:repeat(5,1fr);gap:4px}.kyf-tab{height:29px;padding:0 3px;border:1px solid #29433e;border-radius:5px;background:#0c1515;color:#9db1aa;font-size:10px;font-weight:bold;cursor:pointer}.kyf-tab.active{border-color:#50d69f;background:#123328;color:#7cffc4}.kyf-tools{display:grid;grid-template-columns:1fr auto;gap:5px}.kyf-input{height:29px;border:1px solid #29433e;border-radius:5px;background:#050a0b;color:#eef8f4;padding:0 8px;outline:none}.kyf-main{display:grid;grid-template-columns:205px 1fr;gap:7px;min-height:0;flex:1}.kyf-list,.kyf-items{min-height:0;overflow:auto;overscroll-behavior:contain;border:1px solid #203531;border-radius:6px;background:#05090a;scrollbar-width:thin}.kyf-count{position:sticky;top:0;z-index:3;padding:5px 6px;background:#0e1717;border-bottom:1px solid #203531;color:#8fa79f;font-size:9px}.kyf-mob{min-height:45px;padding:4px;display:grid;grid-template-columns:38px 1fr;gap:5px;align-items:center;border-bottom:1px solid #172522;cursor:pointer}.kyf-mob:hover{background:#101b19}.kyf-mob.active{background:#17362b;color:#75ffc0}.kyf-mob-image,.kyf-selected-image{width:36px;height:36px;display:flex;align-items:center;justify-content:center;border:1px solid #263a36;border-radius:4px;background:#0c1211;overflow:hidden}.kyf-mob-image img,.kyf-selected-image img{max-width:36px;max-height:36px}.kyf-mob-name{font-weight:bold}.kyf-meta{margin-top:1px;color:#8c9f99;font-size:9px}.kyf-items{padding:6px}.kyf-selected{position:sticky;top:0;z-index:3;display:grid;grid-template-columns:42px 1fr;gap:6px;align-items:center;margin:-6px -6px 6px;padding:5px 6px;background:#0e1717;border-bottom:1px solid #203531}.kyf-selected-name{font-weight:bold;color:#dff9ee}.kyf-empty{padding:10px;color:#8c9e98;line-height:14px}.kyf-source{border:1px solid #203531;border-radius:5px;background:#0d1616;padding:5px 6px;color:#91a69f;font-size:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kyf-source a{color:#64eeb2}
    .kyf-group{margin-bottom:5px;border:1px solid #233733;border-radius:6px;overflow:hidden}.kyf-group h4{margin:0;padding:5px 6px;background:#101919;display:flex;justify-content:space-between;font-size:10px;cursor:pointer;user-select:none}.kyf-group h4:hover{background:#152421}.kyf-collapse-marker{display:inline-block;width:12px;color:#7fa69a}.kyf-group.collapsed .kyf-grid{display:none}.kyf-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(39px,1fr));gap:5px;padding:6px}.kyf-item{height:39px;display:flex;align-items:center;justify-content:center;border:1px solid var(--rarity);border-radius:5px;background:#050707;cursor:help;position:relative}.kyf-item img{max-width:35px;max-height:35px}.kyf-tip{position:fixed;z-index:2147483647;display:none;width:320px;max-height:80vh;overflow:auto;padding:6px;border:2px solid var(--rarity);background:rgba(3,5,4,.98);color:#edf3ef;box-shadow:0 8px 25px #000;pointer-events:none;font:11px/14px Verdana,Arial,sans-serif}.kyf-tip-head{display:grid;grid-template-columns:38px 1fr;gap:7px;align-items:center;padding:4px;border:1px solid #35443f;background:#151a18;margin-bottom:5px}.kyf-tip-head img{max-width:35px;max-height:35px}.kyf-tip-name{font-weight:bold;color:var(--rarity)}.kyf-tip-rarity{font-weight:bold;color:var(--rarity);border-bottom:1px solid var(--rarity);padding-bottom:3px;margin-bottom:3px}.kyf-stat{padding:1px 0}.kyf-stat b{color:#ffb52e}.kyf-legbon{color:#58ef70;font-weight:bold;margin-top:4px;padding-top:3px;border-top:1px solid #3b4641}.kyf-legbon-desc{color:#58ef70;padding:1px 0 4px;border-bottom:1px solid #3b4641}.kyf-opis{color:#aeb9b4;margin-top:4px;padding:4px 0;border-bottom:1px solid #3b4641}.kyf-bind{margin-top:5px;padding-bottom:4px;border-bottom:1px solid #3b4641}.kyf-footer{padding-top:4px}.kyf-footer .kyf-stat{font-weight:bold}.kyf-launch{position:fixed;right:8px;top:75px;z-index:2147483644;width:39px;height:39px;border:2px solid #4c7869;border-radius:6px;background:#081512;color:#72ffc2;font:bold 12px Arial;cursor:pointer;box-shadow:0 0 0 2px #050807}
    .kyf-route-group h4{color:#77e8bd}.kyf-route-body{padding:6px;color:#c7d8d2;font-size:10px;line-height:14px;background:#08100f}.kyf-route-missing{color:#81958e;font-style:italic}.kyf-group.collapsed .kyf-route-body{display:none}
    .kyf-launch{padding:1px;overflow:hidden}.kyf-launch img{display:block;width:100%;height:100%;object-fit:contain;pointer-events:none}
    .kyf-head-actions{display:flex;gap:5px}.kyf-head .kyf-options-btn{width:auto;padding:0 8px;color:#caffea;border-color:#39745f;background:#10221c}.kyf-options{display:none;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;align-items:center;padding:7px;border:1px solid #29433e;border-radius:6px;background:#0d1716}.kyf-options.open{display:grid}.kyf-options label{display:flex;align-items:center;gap:5px;color:#b9c9c3;font-size:9px}.kyf-options select,.kyf-options input[type=number]{height:25px;border:1px solid #34564d;border-radius:4px;background:#050a0b;color:#eaf6f1;padding:0 5px}.kyf-options input[type=number]{width:52px}.kyf-range{color:#70cfa9}.kyf-selected{grid-template-columns:42px 1fr auto}.kyf-chance-wrap{position:relative;align-self:start}.kyf-chance-btn{width:23px;height:23px;border:1px solid #3c8069;border-radius:50%;background:#10211c;color:#7cffc2;font-weight:bold;cursor:pointer}.kyf-chance-popover{display:none;position:absolute;z-index:30;right:0;top:27px;width:280px;max-height:390px;overflow:auto;padding:8px;border:1px solid #4c9b7e;border-radius:6px;background:rgba(5,11,10,.99);box-shadow:0 8px 24px #000;color:#dce9e4;font-size:10px;line-height:14px}.kyf-chance-wrap.open .kyf-chance-popover{display:block}.kyf-chance-title{font-weight:bold;color:#77ffc2;margin-bottom:5px}.kyf-chance-row{display:flex;justify-content:space-between;gap:10px;padding:2px 0;border-bottom:1px solid #172824}.kyf-chance-row span:last-child{text-align:right}.kyf-chance-adjusted{display:block;color:#70eeb1;font-size:9px}.kyf-chance-note{margin-top:6px;color:#8fa39b;font-size:9px;line-height:12px}.kyf-chance-select{width:100%;height:26px;margin:3px 0 6px;border:1px solid #34564d;border-radius:4px;background:#07100e;color:#e9f6f1}.kyf-tip.kyf-color-elements .kyf-element-fire{color:#ff5757}.kyf-tip.kyf-color-elements .kyf-element-frost{color:#62aaff}.kyf-tip.kyf-color-elements .kyf-element-light{color:#ffe34f}.kyf-tip.kyf-color-elements .kyf-element-poison{color:#52e86f}.kyf-launch{cursor:grab;user-select:none;touch-action:none}.kyf-launch.dragging{cursor:grabbing}
    .kyf-change-system{grid-column:1/-1;border-top:1px solid #29433e;padding-top:6px}.kyf-change-head{display:flex;align-items:center;justify-content:space-between;color:#72efba;font-size:10px;font-weight:bold}.kyf-change-head button{height:22px;padding:0 7px;border:1px solid #4f6a62;border-radius:4px;background:#111a18;color:#aebdb8;font-size:9px;cursor:pointer}.kyf-update-times{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2px 8px;margin:5px 0;color:#91a79f;font-size:9px}.kyf-update-time b{color:#c8d8d2}.kyf-script-update{grid-column:1/-1;color:#76dcb4}.kyf-change-log{max-height:135px;overflow:auto;border:1px solid #223a34;border-radius:4px;background:#07100e;scrollbar-width:thin}.kyf-change-empty{padding:7px;color:#778a84;font-size:9px}.kyf-change-entry{padding:6px;border-bottom:1px solid #172923;font-size:9px;line-height:12px}.kyf-change-entry:last-child{border-bottom:0}.kyf-change-entry-title{color:#6ff0b7;font-weight:bold}.kyf-change-entry-summary{color:#c3d2cd}.kyf-change-detail{color:#91a49e;padding-left:8px}.kyf-change-more{color:#6f837d;font-style:italic;padding-left:8px}

    /* Motyw inspirowany klasycznym interfejsem Margonem */
    #ky-forum-e2{background:#1a1917;color:#e6e0d2;border:3px ridge #8b806e;border-radius:3px;box-shadow:0 0 0 2px #17110d,0 13px 36px rgba(0,0,0,.9),inset 0 0 18px rgba(0,0,0,.65);font-family:Verdana,Arial,sans-serif}
    #ky-forum-e2:after{content:"";position:absolute;inset:2px;z-index:20;border:1px solid rgba(218,194,143,.22);pointer-events:none}
    .kyf-head{position:relative;z-index:21;height:47px;padding:7px 10px;background:repeating-linear-gradient(0deg,rgba(255,255,255,.025) 0,rgba(255,255,255,.025) 1px,transparent 1px,transparent 3px),linear-gradient(180deg,#503a2e 0%,#35251d 48%,#211711 51%,#2f211a 100%);border-bottom:3px ridge #877965;box-shadow:inset 0 1px #8b6b50,inset 0 -1px #100b08}
    .kyf-title{color:#f2d681;font-size:14px;letter-spacing:.4px;text-shadow:1px 1px #1b1008,0 0 5px rgba(255,210,100,.25)}
    .kyf-sub{color:#b9aa91;text-shadow:1px 1px #17100c}.kyf-sub a{color:#dbc27b}.kyf-sub a:hover{color:#fff0aa}
    .kyf-body{height:calc(100% - 47px);padding:8px;gap:6px;background:radial-gradient(circle at 50% 0,rgba(119,98,67,.12),transparent 40%),linear-gradient(135deg,rgba(255,255,255,.012) 25%,transparent 25%) 0 0/5px 5px,#181817}
    .kyf-head button,.kyf-btn,.kyf-tab,.kyf-change-head button{border:2px ridge #776d5e;border-radius:3px;background:linear-gradient(#494a44,#262724 52%,#1b1c1a 53%,#30312d);color:#e5dfd1;text-shadow:1px 1px #111;box-shadow:inset 0 0 0 1px rgba(255,255,255,.06);font-family:Verdana,Arial,sans-serif}
    .kyf-head button:hover,.kyf-btn:hover,.kyf-tab:hover,.kyf-change-head button:hover{filter:brightness(1.18);color:#fff4c6}
    .kyf-head .kyf-options-btn{color:#e8dfc9;border-color:#817665;background:linear-gradient(#55534a,#292a26 52%,#1d1e1b 53%,#34342f)}
    .kyf-head #kyf-close{color:#ffc2b4;border-color:#8d635b;background:linear-gradient(#61372f,#321c18 52%,#251310 53%,#49251f)}
    .kyf-tabs{gap:5px}.kyf-tab{height:30px;color:#bdb8ac}.kyf-tab.active{border-color:#7c916d;background:linear-gradient(#47613c,#24391f 52%,#182b16 53%,#314d29);color:#e4f5bf;box-shadow:inset 0 0 7px rgba(114,171,77,.35);text-shadow:1px 1px #10200d}
    .kyf-input,.kyf-options select,.kyf-options input[type=number],.kyf-chance-select{border:2px inset #70695d;border-radius:2px;background:#111211;color:#eee9dc;box-shadow:inset 0 2px 6px #000;font-family:Verdana,Arial,sans-serif}.kyf-input:focus,.kyf-options input:focus,.kyf-options select:focus{outline:1px solid #98855e}
    .kyf-main{gap:8px}.kyf-list,.kyf-items{border:2px inset #6e685d;border-radius:2px;background:#111211;box-shadow:inset 0 0 12px #000;scrollbar-color:#665d50 #181715}
    .kyf-count{padding:6px;background:linear-gradient(#35342f,#24231f);border-bottom:2px ridge #665e51;color:#c5bcaa;text-shadow:1px 1px #111}
    .kyf-mob{border-bottom:1px solid #37352f;background:linear-gradient(90deg,rgba(255,255,255,.018),transparent);transition:background .08s,color .08s}.kyf-mob:hover{background:#2a2924}.kyf-mob.active{background:linear-gradient(90deg,#34452d,#202c1d);color:#eff5cf;box-shadow:inset 3px 0 #78975e,inset 0 1px rgba(255,255,255,.05)}
    .kyf-mob-name{color:#ece5d6;text-shadow:1px 1px #090909}.kyf-mob.active .kyf-mob-name{color:#f5e69a}.kyf-meta{color:#a9a394}.kyf-range{color:#91bd76}
    .kyf-mob-image,.kyf-selected-image{border:2px ridge #655f55;border-radius:2px;background:#171715;box-shadow:inset 0 0 5px #000}
    .kyf-items{padding:0 6px 6px}.kyf-selected{top:0;z-index:12;margin:0 -6px 6px;isolation:isolate;background:linear-gradient(#37352f,#24231f);border-bottom:2px ridge #6b6254;box-shadow:0 2px 5px #000}.kyf-selected-name{color:#f1df9c;text-shadow:1px 1px #111}
    .kyf-group{border:2px ridge #575249;border-radius:2px;background:#121311;box-shadow:0 1px 3px #000}.kyf-group h4{padding:6px 7px;background:linear-gradient(#34332f,#23231f 52%,#1b1b19 53%,#292925);border-bottom:1px solid #0b0b0a;text-shadow:1px 1px #090909}.kyf-group h4:hover{background:linear-gradient(#44413a,#2c2b27)}.kyf-collapse-marker{color:#c3ad72}
    .kyf-grid{gap:6px;padding:7px;background:radial-gradient(circle at top,rgba(122,105,74,.06),transparent 55%),#111210}.kyf-item{height:40px;border-width:2px;border-radius:3px;background:linear-gradient(145deg,#20211e,#0c0d0c 65%);box-shadow:inset 0 0 0 1px rgba(255,255,255,.05),0 1px 2px #000}.kyf-item:hover{filter:brightness(1.22);box-shadow:0 0 5px var(--rarity),inset 0 0 0 1px rgba(255,255,255,.08)}
    .kyf-route-body{background:#161714;color:#d2cbbb}.kyf-route-group h4{color:#d8bd72}
    .kyf-source{border:2px inset #655f54;border-radius:2px;background:linear-gradient(#282722,#191917);color:#afa895}.kyf-source a{color:#d4b965}
    .kyf-options{border:2px ridge #655d50;border-radius:2px;background:linear-gradient(#302b25,#191715);box-shadow:inset 0 0 9px #090706}.kyf-options label{color:#d0c7b6}
    .kyf-change-system{border-top:2px ridge #665e51}.kyf-change-head{color:#e1c878}.kyf-update-times{color:#afa797}.kyf-update-time b{color:#ddd4c3}.kyf-script-update{color:#cbb36d}.kyf-change-log{border:2px inset #625c52;border-radius:2px;background:#121311}.kyf-change-entry{border-bottom:1px solid #37342e}.kyf-change-entry-title{color:#dfc36d}.kyf-change-entry-summary{color:#d2cbbb}.kyf-change-detail{color:#aaa392}
    .kyf-chance-btn{border:2px ridge #867a65;background:linear-gradient(#4f5945,#273223);color:#f1df91;box-shadow:inset 0 0 4px rgba(255,255,255,.12)}.kyf-chance-popover{border:3px ridge #8a7d68;border-radius:2px;background:#171816;color:#e5dfd1;box-shadow:0 8px 24px #000,inset 0 0 10px #000}.kyf-chance-title{color:#e2c66e}.kyf-chance-row{border-bottom:1px solid #3a3730}.kyf-chance-note{color:#aaa292}
    .kyf-tip{padding:7px;border-width:2px;background:rgba(18,18,16,.98);color:#eee9dc;box-shadow:0 8px 25px #000,inset 0 0 12px #000}.kyf-tip-head{border:2px ridge #625c52;background:linear-gradient(#33332f,#20211e)}.kyf-opis{color:#bdb6a7}.kyf-bind{border-color:#4d493f}
    .kyf-launch{border:3px ridge #93866f;border-radius:4px;background:linear-gradient(#46352a,#211912);box-shadow:0 0 0 2px #17110d,0 3px 8px #000}.kyf-launch:hover{filter:brightness(1.12)}
    #ky-forum-e2 ::-webkit-scrollbar{width:10px;height:10px}#ky-forum-e2 ::-webkit-scrollbar-track{background:#171614;border-left:1px solid #3b3832}#ky-forum-e2 ::-webkit-scrollbar-thumb{background:linear-gradient(90deg,#403c35,#746a5a,#403c35);border:1px solid #1a1815;border-radius:1px}#ky-forum-e2 ::-webkit-scrollbar-thumb:hover{background:linear-gradient(90deg,#514b41,#8a7c67,#514b41)}

  `;
  document.head.appendChild(style);

  const launch = document.createElement('button');
  launch.className = 'kyf-launch';
  const launchIcon = document.createElement('img');
  launchIcon.src = LAUNCH_ICON;
  launchIcon.alt = 'B';
  launch.appendChild(launchIcon);
  launch.title = 'Bestiariusz';
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
    <div class="kyf-head"><div><div class="kyf-title">BESTIARIUSZ ${SCRIPT_VERSION}</div><div class="kyf-sub">Autor: <a href="https://www.margonem.pl/profile/view,10050726#char_5601,luvia" target="_blank" rel="noopener">Król Yss</a> • Elity • Herosi • Kolosi • Tytani</div></div><div class="kyf-head-actions"><button class="kyf-options-btn" id="kyf-options-btn">Opcje</button><button id="kyf-close">X</button></div></div>
    <div class="kyf-body">
      <div class="kyf-tabs"><button class="kyf-tab" data-category="elites">Elity</button><button class="kyf-tab active" data-category="elites2">Elity II</button><button class="kyf-tab" data-category="heroes">Herosi</button><button class="kyf-tab" data-category="colossi">Kolosi</button><button class="kyf-tab" data-category="titans">Tytani</button></div>
      <div class="kyf-options" id="kyf-options"><label><input type="checkbox" id="kyf-color-elements"> Koloruj żywioły i odporności</label><label>Mnożnik <select id="kyf-loot-multiplier"><option value="1">×1</option><option value="2">×2</option><option value="3">×3</option><option value="4">×4</option><option value="5">×5</option></select></label><label>Zmniejszenie pustego łupu <input type="number" id="kyf-loot-bonus" min="0" max="100" step="1">%</label><label>Zakres pełnego łupu Elit i Herosów ± <input type="number" id="kyf-level-range" min="13" max="50" step="1"> lvl</label><div class="kyf-change-system"><div class="kyf-change-head"><span>System aktualizacji danych</span><button id="kyf-clear-history">Wyczyść historię</button></div><div class="kyf-update-times" id="kyf-update-times"></div><div class="kyf-change-log" id="kyf-change-log"></div></div></div>
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
  panel.querySelector('#kyf-clear-history').addEventListener('click', () => {
    changeLog = [];
    saveChangeLog();
    renderChangeSystem();
  });
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
    preferences.levelRange = Math.round(clampNumber(event.target.value, 13, 50, 13));
    event.target.value = String(preferences.levelRange);
    savePreferences();
    renderList();
    renderItems();
  });
  [panel.querySelector('#kyf-list'), panel.querySelector('#kyf-items'), panel.querySelector('#kyf-change-log')].forEach(enableWheelScroll);
  panel.addEventListener('wheel', event => event.stopPropagation(), { passive: true });
  document.addEventListener('click', () => panel.querySelectorAll('.kyf-chance-wrap.open').forEach(element => element.classList.remove('open')));

  renderChangeSystem();
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
        categoryUpdatedAt[category] = Number(cached.savedAt) || 0;
        finishLoad('Dane z pamięci podręcznej', category, categoryUpdatedAt[category]);
        return;
      }
      const html = await request(config.source);
      const previousData = cached && Array.isArray(cached.data) ? cached.data : databases[category];
      const freshData = parseForum(html);
      const updatedAt = Date.now();
      databases[category] = freshData;
      categoryUpdatedAt[category] = updatedAt;
      recordDataCheck(category, previousData, freshData, updatedAt);
      const cacheSaved = saveCache(category, freshData, updatedAt);
      finishLoad(cacheSaved ? 'Pobrano bezpośrednio z forum' : 'Pobrano z forum (bez zapisu cache)', category, updatedAt);
    } catch (error) {
      console.warn('[Forum Elity]', config.label, error);
      setStatus('Nie udało się pobrać forum: ' + error.message, category);
    }
  }

  function finishLoad(message, category, updatedAt = categoryUpdatedAt[category]) {
    const database = databases[category];
    if (updatedAt) categoryUpdatedAt[category] = updatedAt;
    if (!selectedMobs[category] || !database.some(mob => normalize(mob.name) === normalize(selectedMobs[category].name))) selectedMobs[category] = database[0] || null;
    if (category !== activeCategory) return;
    renderList();
    renderItems();
    renderChangeSystem();
    setStatus(`${message}: ${database.length} potworów, ${database.reduce((sum, mob) => sum + mob.items.length, 0)} przedmiotów.${updatedAt ? ` Aktualizacja: ${formatDateTime(updatedAt)}.` : ''}`, category);
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

  function saveCache(category, data, savedAt = Date.now()) {
    const key = CATEGORIES[category].cacheKey;
    const payload = JSON.stringify({ savedAt, data });
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

  function loadChangeLog() {
    try {
      const stored = GM_getValue(STORE_CHANGE_LOG, '[]');
      const parsed = typeof stored === 'string' ? JSON.parse(stored) : stored;
      return Array.isArray(parsed) ? parsed.slice(0, 40) : [];
    } catch (error) {
      return [];
    }
  }

  function saveChangeLog() {
    changeLog = changeLog.slice(0, 40);
    try { GM_setValue(STORE_CHANGE_LOG, JSON.stringify(changeLog)); } catch (error) { console.warn('[Forum Elity] Zapis historii zmian:', error); }
  }

  function recordDataCheck(category, previousData, freshData, timestamp) {
    const changes = compareForumData(previousData, freshData);
    changeLog.unshift({ timestamp, category, summary: changes.summary, details: changes.details, hidden: changes.hidden });
    saveChangeLog();
    renderChangeSystem();
  }

  function compareForumData(previousData, freshData) {
    const previous = Array.isArray(previousData) ? previousData : [];
    const fresh = Array.isArray(freshData) ? freshData : [];
    if (!previous.length) {
      const itemCount = fresh.reduce((sum, mob) => sum + (Array.isArray(mob.items) ? mob.items.length : 0), 0);
      return { summary: `Pierwsze pobranie: ${fresh.length} potworów i ${itemCount} przedmiotów.`, details: [], hidden: 0 };
    }
    const oldMobs = new Map(previous.map(mob => [normalize(mob.name), mob]));
    const newMobs = new Map(fresh.map(mob => [normalize(mob.name), mob]));
    const counters = { addedMobs: 0, removedMobs: 0, changedMobs: 0, addedItems: 0, removedItems: 0, changedItems: 0 };
    const details = [];
    let detailCount = 0;
    const addDetail = text => {
      detailCount++;
      if (details.length < 35) details.push(text);
    };
    for (const [key, mob] of newMobs) {
      if (!oldMobs.has(key)) {
        const itemCount = Array.isArray(mob.items) ? mob.items.length : 0;
        counters.addedMobs++;
        counters.addedItems += itemCount;
        addDetail(`Dodano potwora: ${mob.name} (${itemCount} przedmiotów)`);
      }
    }
    for (const [key, mob] of oldMobs) {
      if (!newMobs.has(key)) {
        const itemCount = Array.isArray(mob.items) ? mob.items.length : 0;
        counters.removedMobs++;
        counters.removedItems += itemCount;
        addDetail(`Usunięto potwora: ${mob.name} (${itemCount} przedmiotów)`);
      }
    }
    for (const [key, newMob] of newMobs) {
      const oldMob = oldMobs.get(key);
      if (!oldMob) continue;
      const oldMobInfo = JSON.stringify([oldMob.level, oldMob.profile, oldMob.route, oldMob.mapAccessRange, oldMob.legendaryChestChance, oldMob.image]);
      const newMobInfo = JSON.stringify([newMob.level, newMob.profile, newMob.route, newMob.mapAccessRange, newMob.legendaryChestChance, newMob.image]);
      if (oldMobInfo !== newMobInfo) {
        counters.changedMobs++;
        addDetail(`Zmieniono informacje: ${newMob.name}`);
      }
      const oldItems = new Map((oldMob.items || []).map(item => [changeItemKey(item), item]));
      const newItems = new Map((newMob.items || []).map(item => [changeItemKey(item), item]));
      for (const [itemKeyValue, item] of newItems) {
        if (!oldItems.has(itemKeyValue)) {
          counters.addedItems++;
          addDetail(`Dodano przedmiot: ${item.name} — ${newMob.name}`);
        } else if (changeItemSignature(oldItems.get(itemKeyValue)) !== changeItemSignature(item)) {
          counters.changedItems++;
          addDetail(`Zmieniono przedmiot: ${item.name} — ${newMob.name}`);
        }
      }
      for (const [itemKeyValue, item] of oldItems) {
        if (!newItems.has(itemKeyValue)) {
          counters.removedItems++;
          addDetail(`Usunięto przedmiot: ${item.name} — ${newMob.name}`);
        }
      }
    }
    const totalChanges = Object.values(counters).reduce((sum, value) => sum + value, 0);
    const summary = totalChanges
      ? `Potwory: +${counters.addedMobs}, -${counters.removedMobs}, zm. ${counters.changedMobs}; przedmioty: +${counters.addedItems}, -${counters.removedItems}, zm. ${counters.changedItems}.`
      : 'Sprawdzono — brak zmian w danych.';
    return { summary, details, hidden: Math.max(0, detailCount - details.length) };
  }

  function changeItemKey(item) {
    return normalize(item && item.name) + '|' + String(item && item.itemClass || '') + '|' + String(item && item.lootSource || 'regular');
  }

  function changeItemSignature(item) {
    return JSON.stringify([item && item.raw, item && item.rarity, item && item.image, item && item.value, item && item.itemClass, item && item.lootSource]);
  }

  function renderChangeSystem() {
    if (!panel || !panel.querySelector) return;
    const timesBox = panel.querySelector('#kyf-update-times');
    const logBox = panel.querySelector('#kyf-change-log');
    if (!timesBox || !logBox) return;
    timesBox.innerHTML = `<div class="kyf-update-time kyf-script-update"><b>Data aktualizacji dodatku v${escapeHtml(SCRIPT_VERSION)}:</b> ${escapeHtml(formatDateTime(SCRIPT_UPDATED_AT))}</div>`
      + Object.entries(CATEGORIES).map(([category, config]) => `<div class="kyf-update-time"><b>${escapeHtml(config.label)}:</b> ${categoryUpdatedAt[category] ? escapeHtml(formatDateTime(categoryUpdatedAt[category])) : 'brak danych'}</div>`).join('');
    if (!changeLog.length) {
      logBox.innerHTML = '<div class="kyf-change-empty">Historia jest pusta. Pojawi się po pobraniu danych z forum.</div>';
      return;
    }
    logBox.innerHTML = changeLog.map(entry => {
      const categoryLabel = CATEGORIES[entry.category] ? CATEGORIES[entry.category].label : entry.category;
      const details = (entry.details || []).map(detail => `<div class="kyf-change-detail">• ${escapeHtml(detail)}</div>`).join('');
      const more = entry.hidden ? `<div class="kyf-change-more">…oraz ${entry.hidden} kolejnych zmian</div>` : '';
      return `<div class="kyf-change-entry"><div class="kyf-change-entry-title">${escapeHtml(categoryLabel)} • ${escapeHtml(formatDateTime(entry.timestamp))}</div><div class="kyf-change-entry-summary">${escapeHtml(entry.summary || '')}</div>${details}${more}</div>`;
    }).join('');
  }

  function cleanupObsoleteLocalCaches() {
    [
      'ky_forum_elites_items_v1',
      'ky_forum_e2_items_v1', 'ky_forum_e2_items_v2',
      'ky_forum_heroes_items_v1', 'ky_forum_heroes_items_v2', 'ky_forum_heroes_items_v3',
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
      const updatedAt = categoryUpdatedAt[category];
      setStatus(`Wczytano: ${database.length} potworów, ${database.reduce((sum, mob) => sum + mob.items.length, 0)} przedmiotów.${updatedAt ? ` Aktualizacja: ${formatDateTime(updatedAt)}.` : ''}`, category);
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
        const chestMarker = body.search(/Przedmioty\s+do\s+zdobycia\s+ze\s+skrz/i);
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
      const isNeutralHeroLoot = activeCategory === 'heroes' && source === 'regular' && Number(item.itemClass) === 15;
      const key = isNeutralHeroLoot ? 'regular:neutral' : source + ':' + item.rarity;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    });
    const groupsHtml = [...groups.entries()].sort((a, b) => lootGroupInfo(a[0]).order - lootGroupInfo(b[0]).order).map(([key, list]) => {
      const group = lootGroupInfo(key);
      const collapseKey = activeCategory + '|' + key;
      const collapsed = !!collapsedGroups[collapseKey];
      return `<div class="kyf-group${collapsed ? ' collapsed' : ''}" data-collapse-key="${escapeHtml(collapseKey)}"><h4 style="color:${group.color}" aria-expanded="${collapsed ? 'false' : 'true'}"><span><span class="kyf-collapse-marker">${collapsed ? '▶' : '▼'}</span>${escapeHtml(group.label)}</span><span>${list.length}</span></h4><div class="kyf-grid">${list.map((item, index) => `<div class="kyf-item" style="--rarity:${rarity(item.rarity).color}" data-key="${escapeHtml(key + ':' + index)}">${item.image ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}">` : escapeHtml(item.name.slice(0, 2))}</div>`).join('')}</div></div>`;
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
  function formatDateTime(timestamp) {
    const value = Number(timestamp);
    if (!Number.isFinite(value) || value <= 0) return 'brak danych';
    return new Date(value).toLocaleString('pl-PL', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  }
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
    if (category === 'elites' || category === 'elites2' || category === 'heroes') text = combatRangeText(mob.level);
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
    if (String(key) === 'regular:neutral') return { color: '#9da8aa', label: 'Neutralne', order: 1.5 };
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
