// ==UserScript==
// @name         MargoHelp Bestiariusz Podręczny
// @namespace    acesaff-margohelp-bestiary
// @version      2.2.35
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
  const SOURCE_LINK_LABELS = { elites: 'Elity', elites2: 'Elity II', heroes: 'Herosów', colossi: 'Kolosów', titans: 'Tytanów' };
  const SCRIPT_VERSION = '2.2.35';
  const SCRIPT_UPDATED_AT = new Date('2026-07-23T00:34:54+02:00').getTime();
  const SCRIPT_RELEASE_NOTES = 'Dodano anonimowy licznik użytkowników aktywnych w ciągu ostatnich 3 minut. Licznik nie przesyła nicku, świata ani danych postaci.';
  const PRESENCE_URL = 'https://ysspack-bestiary-online.acesaff.workers.dev';
  const STORE_PRESENCE_ID = 'ky_forum_bestiary_presence_id_v1';
  const STORE_SETTINGS = 'ky_forum_special_settings_v1';
  const STORE_LAUNCHER_POS = 'ky_forum_special_launcher_pos_v1';
  const STORE_WIDGET_SLOT = 'ky_forum_special_widget_slot_v1';
  const STORE_PANEL_POS = 'ky_forum_special_panel_pos_v1';
  const STORE_COLLAPSED_GROUPS = 'ky_forum_special_collapsed_groups_v1';
  const STORE_CHANGE_LOG = 'ky_forum_special_change_log_v1';
  const STORE_SEEN_RELEASE = 'ky_forum_special_seen_release_v1';
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
    lootMultiplier: Math.round(clampNumber(savedSettings.lootMultiplier, 1, 6, 1)),
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
    .kyf-body{height:calc(100% - 45px);display:flex;flex-direction:column;padding:7px;gap:6px}.kyf-tabs{display:grid;grid-template-columns:repeat(5,1fr);gap:4px}.kyf-tab{height:29px;padding:0 3px;border:1px solid #29433e;border-radius:5px;background:#0c1515;color:#9db1aa;font-size:10px;font-weight:bold;cursor:pointer}.kyf-tab.active{border-color:#50d69f;background:#123328;color:#7cffc4}.kyf-tools{display:grid;grid-template-columns:1fr auto;gap:5px}.kyf-input{height:29px;border:1px solid #29433e;border-radius:5px;background:#050a0b;color:#eef8f4;padding:0 8px;outline:none}.kyf-main{display:grid;grid-template-columns:205px 1fr;gap:7px;min-height:0;flex:1}.kyf-list,.kyf-items{min-height:0;overflow:auto;overscroll-behavior:contain;border:1px solid #203531;border-radius:6px;background:#05090a;scrollbar-width:thin}.kyf-count{position:sticky;top:0;z-index:3;padding:5px 6px;background:#0e1717;border-bottom:1px solid #203531;color:#8fa79f;font-size:9px}.kyf-mob{min-height:45px;padding:4px;display:grid;grid-template-columns:38px 1fr;gap:5px;align-items:center;border-bottom:1px solid #172522;cursor:pointer}.kyf-mob:hover{background:#101b19}.kyf-mob.active{background:#17362b;color:#75ffc0}.kyf-mob-image,.kyf-selected-image{display:flex;align-items:center;justify-content:center;border:1px solid #263a36;border-radius:4px;background:#0c1211;overflow:hidden}.kyf-mob-image{width:36px;height:36px}.kyf-mob-image img{max-width:36px;max-height:36px}.kyf-selected-image{width:72px;height:72px}.kyf-selected-image img{max-width:70px;max-height:70px;image-rendering:auto}.kyf-mob-name{font-weight:bold}.kyf-meta{margin-top:1px;color:#8c9f99;font-size:9px}.kyf-items{padding:6px}.kyf-selected{position:sticky;top:0;z-index:3;display:grid;grid-template-columns:78px 1fr;gap:6px;align-items:center;margin:-6px -6px 6px;padding:5px 6px;background:#0e1717;border-bottom:1px solid #203531}.kyf-selected-name{font-weight:bold;color:#dff9ee}.kyf-empty{padding:10px;color:#8c9e98;line-height:14px}.kyf-source{border:1px solid #203531;border-radius:5px;background:#0d1616;padding:5px 6px;color:#91a69f;font-size:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kyf-source a{color:#64eeb2}
    .kyf-group{margin-bottom:5px;border:1px solid #233733;border-radius:6px;overflow:hidden}.kyf-group h4{margin:0;padding:5px 6px;background:#101919;display:flex;justify-content:space-between;font-size:10px;cursor:pointer;user-select:none}.kyf-group h4:hover{background:#152421}.kyf-collapse-marker{display:inline-block;width:12px;color:#7fa69a}.kyf-group.collapsed .kyf-grid{display:none}.kyf-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(39px,1fr));gap:5px;padding:6px}.kyf-item{height:39px;display:flex;align-items:center;justify-content:center;border:1px solid var(--rarity);border-radius:5px;background:#050707;cursor:help;position:relative}.kyf-item img{max-width:35px;max-height:35px}.kyf-tip{position:fixed;z-index:2147483647;display:none;width:320px;max-height:80vh;overflow:auto;padding:6px;border:2px solid var(--rarity);background:rgba(3,5,4,.98);color:#edf3ef;box-shadow:0 8px 25px #000;pointer-events:none;font:11px/14px Verdana,Arial,sans-serif}.kyf-tip-head{display:grid;grid-template-columns:40px 1fr;gap:7px;align-items:center;padding:4px;border:1px solid #35443f;background:#151a18;margin-bottom:5px}.kyf-tip-icon{width:40px;height:40px;display:flex;align-items:center;justify-content:center;overflow:hidden;border:2px solid var(--rarity);border-radius:3px;background:linear-gradient(145deg,#20211e,#090a09 70%);box-shadow:0 0 5px var(--rarity),inset 0 0 0 1px rgba(255,255,255,.08),inset 0 0 6px #000}.kyf-tip-icon img{display:block;max-width:35px;max-height:35px}.kyf-tip-name{font-weight:bold;color:var(--rarity)}.kyf-tip-rarity{font-weight:bold;color:var(--rarity);border-bottom:1px solid var(--rarity);padding-bottom:3px;margin-bottom:3px}.kyf-stat{padding:1px 0}.kyf-stat b{color:#ffb52e}.kyf-legbon{color:#58ef70;font-weight:bold;margin-top:4px;padding-top:3px;border-top:1px solid #3b4641}.kyf-legbon-desc{color:#58ef70;padding:1px 0 4px;border-bottom:1px solid #3b4641}.kyf-opis{color:#aeb9b4;margin-top:4px;padding:4px 0;border-bottom:1px solid #3b4641}.kyf-bind{margin-top:5px;padding-bottom:4px;border-bottom:1px solid #3b4641}.kyf-footer{padding-top:4px}.kyf-footer .kyf-stat{font-weight:bold}.kyf-launch{position:fixed;right:8px;top:75px;z-index:2147483644;width:39px;height:39px;border:2px solid #4c7869;border-radius:6px;background:#081512;color:#72ffc2;font:bold 12px Arial;cursor:pointer;box-shadow:0 0 0 2px #050807}
    .kyf-route-group h4{color:#77e8bd}.kyf-route-body{padding:6px;color:#c7d8d2;font-size:10px;line-height:14px;background:#08100f}.kyf-route-missing{color:#81958e;font-style:italic}.kyf-group.collapsed .kyf-route-body{display:none}
    .kyf-launch{padding:1px;overflow:hidden}.kyf-launch img{display:block;width:100%;height:100%;object-fit:contain;pointer-events:none}
    .kyf-head-actions{display:flex;gap:5px}.kyf-head .kyf-options-btn{width:auto;padding:0 8px;color:#caffea;border-color:#39745f;background:#10221c}.kyf-options{display:none;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;align-items:center;padding:7px;border:1px solid #29433e;border-radius:6px;background:#0d1716}.kyf-options.open{display:grid}.kyf-options label{display:flex;align-items:center;gap:5px;color:#b9c9c3;font-size:9px}.kyf-options select,.kyf-options input[type=number]{height:25px;border:1px solid #34564d;border-radius:4px;background:#050a0b;color:#eaf6f1;padding:0 5px}.kyf-options input[type=number]{width:52px}.kyf-range{color:#70cfa9}.kyf-selected{grid-template-columns:78px 1fr auto}.kyf-chance-wrap{position:relative;align-self:start}.kyf-chance-btn{width:23px;height:23px;border:1px solid #3c8069;border-radius:50%;background:#10211c;color:#7cffc2;font-weight:bold;cursor:pointer}.kyf-chance-popover{display:none;position:absolute;z-index:30;right:0;top:27px;width:280px;max-height:390px;overflow:auto;padding:8px;border:1px solid #4c9b7e;border-radius:6px;background:rgba(5,11,10,.99);box-shadow:0 8px 24px #000;color:#dce9e4;font-size:10px;line-height:14px}.kyf-chance-wrap.open .kyf-chance-popover{display:block}.kyf-chance-title{font-weight:bold;color:#77ffc2;margin-bottom:5px}.kyf-chance-row{display:flex;justify-content:space-between;gap:10px;padding:2px 0;border-bottom:1px solid #172824}.kyf-chance-row span:last-child{text-align:right}.kyf-chance-summary{margin-bottom:4px;padding:4px;border:1px solid #35594d;border-radius:3px;background:#101b18}.kyf-chance-summary span:first-child{font-weight:bold;color:#d8e9e2}.kyf-chance-adjusted{display:block;color:#70eeb1;font-size:9px}.kyf-chance-note{margin-top:6px;color:#8fa39b;font-size:9px;line-height:12px}.kyf-chance-select{width:100%;height:26px;margin:3px 0 6px;border:1px solid #34564d;border-radius:4px;background:#07100e;color:#e9f6f1}.kyf-tip.kyf-color-elements .kyf-element-fire{color:#ff5757}.kyf-tip.kyf-color-elements .kyf-element-frost{color:#62aaff}.kyf-tip.kyf-color-elements .kyf-element-light{color:#ffe34f}.kyf-tip.kyf-color-elements .kyf-element-poison{color:#52e86f}.kyf-launch{cursor:grab;user-select:none;touch-action:none}.kyf-launch.dragging{cursor:grabbing}
    .kyf-change-system{grid-column:1/-1;border-top:1px solid #29433e;padding-top:6px}.kyf-change-head{display:flex;align-items:center;justify-content:space-between;color:#72efba;font-size:10px;font-weight:bold}.kyf-change-head button{height:22px;padding:0 7px;border:1px solid #4f6a62;border-radius:4px;background:#111a18;color:#aebdb8;font-size:9px;cursor:pointer}.kyf-update-times{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2px 8px;margin:5px 0;color:#91a79f;font-size:9px}.kyf-update-time b{color:#c8d8d2}.kyf-script-update,.kyf-release-note{grid-column:1/-1}.kyf-script-update{color:#76dcb4}.kyf-release-note{margin-top:2px;padding:4px 5px;border:1px solid #3b3326;background:rgba(63,49,27,.32);color:#cfc5b2;line-height:12px}.kyf-release-note b{color:#e2c66e}.kyf-change-log{max-height:135px;overflow:auto;border:1px solid #223a34;border-radius:4px;background:#07100e;scrollbar-width:thin}.kyf-change-empty{padding:7px;color:#778a84;font-size:9px}.kyf-change-entry{padding:6px;border-bottom:1px solid #172923;font-size:9px;line-height:12px}.kyf-change-entry:last-child{border-bottom:0}.kyf-change-entry-title{color:#6ff0b7;font-weight:bold}.kyf-change-entry-summary{color:#c3d2cd}.kyf-change-detail{color:#91a49e;padding-left:8px}.kyf-change-more{color:#6f837d;font-style:italic;padding-left:8px}

    /* Motyw inspirowany klasycznym interfejsem Margonem */
    #ky-forum-e2{background:#1a1917;color:#e6e0d2;border:3px ridge #8b806e;border-radius:3px;box-shadow:0 0 0 2px #17110d,0 13px 36px rgba(0,0,0,.9),inset 0 0 18px rgba(0,0,0,.65);font-family:Verdana,Arial,sans-serif}
    #ky-forum-e2:after{content:"";position:absolute;inset:2px;z-index:20;border:1px solid rgba(218,194,143,.22);pointer-events:none}
    .kyf-head{position:relative;z-index:21;height:47px;padding:7px 10px;background:repeating-linear-gradient(0deg,rgba(255,255,255,.025) 0,rgba(255,255,255,.025) 1px,transparent 1px,transparent 3px),linear-gradient(180deg,#503a2e 0%,#35251d 48%,#211711 51%,#2f211a 100%);border-bottom:3px ridge #877965;box-shadow:inset 0 1px #8b6b50,inset 0 -1px #100b08}
    .kyf-title{color:#f2d681;font-size:14px;letter-spacing:.4px;text-shadow:1px 1px #1b1008,0 0 5px rgba(255,210,100,.25)}.kyf-online{color:#79c995;font-weight:bold}.kyf-online.offline{color:#8d8a82}
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
    .kyf-items{padding:0 6px 6px}.kyf-selected{top:0;z-index:12;margin:0 -6px 6px;isolation:isolate;background:linear-gradient(#37352f,#24231f);border-bottom:2px ridge #6b6254;box-shadow:0 2px 5px #000}.kyf-selected-info{min-height:72px;display:flex;flex-direction:column;justify-content:center;gap:2px;padding:3px 0}.kyf-selected-name{color:#f1df9c;font-size:12px;line-height:14px;text-shadow:1px 1px #111}.kyf-selected-info .kyf-meta{font-size:10px;line-height:12px}.kyf-selected-info .kyf-range{line-height:12px}
    .kyf-group{border:2px ridge #575249;border-radius:2px;background:#121311;box-shadow:0 1px 3px #000}.kyf-group h4{padding:6px 7px;background:linear-gradient(#34332f,#23231f 52%,#1b1b19 53%,#292925);border-bottom:1px solid #0b0b0a;text-shadow:1px 1px #090909}.kyf-group h4:hover{background:linear-gradient(#44413a,#2c2b27)}.kyf-collapse-marker{color:#c3ad72}
    .kyf-grid{gap:6px;padding:7px;background:radial-gradient(circle at top,rgba(122,105,74,.06),transparent 55%),#111210}.kyf-item{height:40px;border-width:2px;border-radius:3px;background:linear-gradient(145deg,#20211e,#0c0d0c 65%);box-shadow:inset 0 0 0 1px rgba(255,255,255,.05),0 1px 2px #000}.kyf-item:hover{filter:brightness(1.22);box-shadow:0 0 5px var(--rarity),inset 0 0 0 1px rgba(255,255,255,.08)}
    .kyf-route-body{background:#161714;color:#d2cbbb}.kyf-route-group h4{color:#d8bd72}
    .kyf-source{border:2px inset #655f54;border-radius:2px;background:linear-gradient(#282722,#191917);color:#afa895}.kyf-source a{color:#d4b965}
    .kyf-options{border:2px ridge #655d50;border-radius:2px;background:linear-gradient(#302b25,#191715);box-shadow:inset 0 0 9px #090706}.kyf-options label{color:#d0c7b6}
    .kyf-change-system{border-top:2px ridge #665e51}.kyf-change-head{color:#e1c878}.kyf-update-times{color:#afa797}.kyf-update-time b{color:#ddd4c3}.kyf-script-update{color:#cbb36d}.kyf-change-log{border:2px inset #625c52;border-radius:2px;background:#121311}.kyf-change-entry{border-bottom:1px solid #37342e}.kyf-change-entry-title{color:#dfc36d}.kyf-change-entry-summary{color:#d2cbbb}.kyf-change-detail{color:#aaa392}
    .kyf-chance-btn{border:2px ridge #867a65;background:linear-gradient(#4f5945,#273223);color:#f1df91;box-shadow:inset 0 0 4px rgba(255,255,255,.12)}.kyf-chance-popover{border:3px ridge #8a7d68;border-radius:2px;background:#171816;color:#e5dfd1;box-shadow:0 8px 24px #000,inset 0 0 10px #000}.kyf-chance-title{color:#e2c66e}.kyf-chance-row{border-bottom:1px solid #3a3730}.kyf-chance-summary{border-color:#655d4e;background:linear-gradient(#302f2a,#20201d)}.kyf-chance-note{color:#aaa292}
    .kyf-tip{padding:7px;border-width:2px;background:rgba(18,18,16,.98);color:#eee9dc;box-shadow:0 8px 25px #000,inset 0 0 12px #000}.kyf-tip-head{border:2px ridge #625c52;background:linear-gradient(#33332f,#20211e)}.kyf-opis{color:#bdb6a7}.kyf-bind{border-color:#4d493f}
    .kyf-launch{border:3px ridge #93866f;border-radius:4px;background:linear-gradient(#46352a,#211912);box-shadow:0 0 0 2px #17110d,0 3px 8px #000}.kyf-launch:hover{filter:brightness(1.12)}
    .kyf-tip-icon{box-sizing:border-box}
    .kyf-profession-ok,.kyf-profession-bad,.kyf-profession-unknown,.kyf-level-ok,.kyf-level-bad,.kyf-level-unknown{color:#eee9dc}.kyf-requirement-marker-ok,.kyf-profession-match,.kyf-level-ok b{color:#73f08a!important}.kyf-requirement-marker-bad,.kyf-profession-mismatch,.kyf-level-bad b{color:#ff6969!important}.kyf-profession-option,.kyf-level-unknown b{color:#f0a82b!important}
    #ky-forum-e2 ::-webkit-scrollbar{width:10px;height:10px}#ky-forum-e2 ::-webkit-scrollbar-track{background:#171614;border-left:1px solid #3b3832}#ky-forum-e2 ::-webkit-scrollbar-thumb{background:linear-gradient(90deg,#403c35,#746a5a,#403c35);border:1px solid #1a1815;border-radius:1px}#ky-forum-e2 ::-webkit-scrollbar-thumb:hover{background:linear-gradient(90deg,#514b41,#8a7c67,#514b41)}

    /* Przycisk w natywnym pasku interfejsu, zgodny ze strukturą widżetów Maddonz. */
    .main-buttons-container > .kyf-launch{position:absolute!important;top:0!important;right:auto!important;z-index:3!important;box-sizing:border-box!important;width:44px!important;min-width:44px!important;max-width:44px!important;height:44px!important;min-height:44px!important;max-height:44px!important;padding:0!important;margin:0!important;border:1px solid #0c0d0d!important;border-radius:4px!important;background:linear-gradient(to top,#12210d,#396b29)!important;box-shadow:inset 0 0 1px 1px #cecece,inset 0 0 0 3px #0c0d0d!important;line-height:0!important;cursor:grab!important;overflow:hidden!important;touch-action:none!important}
    .main-buttons-container > .kyf-launch .kyf-launch-icon{position:absolute;inset:2px;display:flex;align-items:center;justify-content:center;box-sizing:border-box;width:38px;height:38px;margin:0!important;background:transparent;overflow:hidden}
    .main-buttons-container > .kyf-launch .kyf-launch-icon img{display:block;box-sizing:border-box;width:38px;height:38px;max-width:38px;max-height:38px;aspect-ratio:1/1;object-fit:contain;object-position:center;pointer-events:none;filter:drop-shadow(0 1px 2px #000)}
    .main-buttons-container > .kyf-launch:hover .kyf-launch-icon{filter:brightness(1.15)}
    .main-buttons-container > .kyf-launch .red-notification{position:absolute;top:4px;right:4px;width:8px;height:8px;border-radius:50%;background:#d82929;z-index:2}
    .main-buttons-container > .kyf-launch .red-notification[hidden]{display:none!important}
    .main-buttons-container > .kyf-launch .amount{position:absolute;right:2px;bottom:1px;z-index:2;color:#fff;font:bold 10px Arial;text-shadow:1px 1px 2px #000}
    .kyf-launch.kyf-widget-dragging{position:fixed!important;z-index:2147483646!important;cursor:grabbing!important;pointer-events:none!important;opacity:.9}
    .kyf-widget-tooltip{position:fixed;display:none;z-index:2147483647;min-width:132px;padding:8px 14px;border:2px solid #7d858c;outline:2px solid #17191a;background:linear-gradient(#111,#050505);box-shadow:0 2px 7px #000,inset 0 0 0 1px #30363a;color:#eee;text-align:center;white-space:nowrap;pointer-events:none;font:12px/15px Verdana,Arial,sans-serif;text-shadow:1px 1px #000}

    /* Motyw z oryginalnych tekstur klasycznego interfejsu Margonem. */
    #ky-forum-e2{border:0!important;border-radius:0!important;background:radial-gradient(ellipse at 28% 18%,rgba(78,74,72,.16),transparent 38%),radial-gradient(ellipse at 76% 72%,rgba(66,62,60,.13),transparent 42%),repeating-linear-gradient(117deg,rgba(255,255,255,.012) 0 1px,transparent 1px 5px),#242323!important;box-shadow:0 14px 40px #000,0 0 0 2px #080909!important}
    #ky-forum-e2:before,#ky-forum-e2:after{content:""!important;position:absolute!important;top:0!important;bottom:0!important;width:10px!important;height:auto!important;z-index:40!important;pointer-events:none!important;border:0!important;background-image:url('/img/gui/chat-powtarzalny-podklad.png')!important;background-position:-251px 0!important;background-repeat:repeat-y!important}
    #ky-forum-e2:before{left:0!important;right:auto!important}
    #ky-forum-e2:after{right:0!important;left:auto!important}
    #ky-forum-e2 .kyf-frame-horizontal{position:absolute;left:8px;right:8px;height:8px;z-index:41;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,.08),rgba(0,0,0,.38)),url('/img/gui/belka-gora-dol.png');background-repeat:repeat-x;background-position:center top;background-size:auto 54px;box-shadow:0 1px 2px #000,inset 0 1px rgba(220,199,158,.22),inset 0 -1px #0b0806}
    #ky-forum-e2 .kyf-frame-top{top:0;background-position:center top}
    #ky-forum-e2 .kyf-frame-bottom{bottom:0;transform:scaleY(-1);box-shadow:0 -1px 2px #000,inset 0 1px rgba(220,199,158,.18),inset 0 -1px #090706}
    #ky-forum-e2 .kyf-head{margin:0 8px;height:54px;padding:8px 12px;background-image:linear-gradient(rgba(0,0,0,.05),rgba(0,0,0,.2)),url('/img/gui/belka-gora-dol.png')!important;background-repeat:repeat-x!important;background-position:center top!important;background-size:auto 58px!important;border:0!important;box-shadow:inset 0 -1px #080808,0 2px 3px #000!important}
    #ky-forum-e2 .kyf-body{height:calc(100% - 54px);margin:0 8px;padding:8px 10px;background:radial-gradient(ellipse at 20% 30%,rgba(82,78,75,.11),transparent 35%),radial-gradient(ellipse at 82% 68%,rgba(72,68,65,.1),transparent 40%),repeating-linear-gradient(135deg,rgba(255,255,255,.01) 0 1px,transparent 1px 6px),rgba(25,24,24,.94)!important}
    #ky-forum-e2 .kyf-group h4,#ky-forum-e2 .kyf-count,#ky-forum-e2 .kyf-selected,#ky-forum-e2 .kyf-change-head{background-image:linear-gradient(rgba(0,0,0,.08),rgba(0,0,0,.34)),url('/img/gui/belka-gora-dol.png')!important;background-repeat:repeat-x!important;background-position:center top!important;background-size:auto 48px!important;border-bottom:2px ridge #766b5c!important;color:#e8d38c!important;text-shadow:1px 1px 2px #080604!important}
    #ky-forum-e2 .kyf-selected{background-size:auto 84px!important;background-color:#24231f!important}
    #ky-forum-e2 .kyf-group,#ky-forum-e2 .kyf-list,#ky-forum-e2 .kyf-items,#ky-forum-e2 .kyf-options,#ky-forum-e2 .kyf-source,#ky-forum-e2 .kyf-change-log{border:2px ridge #777268!important;background-color:rgba(12,12,12,.72)!important;box-shadow:inset 0 0 8px #000,0 1px 2px #000!important}
    #ky-forum-e2 .kyf-tabs{padding:3px;border-top:2px ridge #756b5c;border-bottom:2px ridge #756b5c;background:linear-gradient(rgba(15,10,7,.38),rgba(0,0,0,.35)),url('/img/gui/belka-gora-dol.png') repeat-x center/auto 54px}
    #ky-forum-e2 .kyf-tab.button.small.green{position:relative;display:flex;align-items:center;justify-content:center;height:30px!important;padding:0!important;border:1px solid #0c0d0d!important;border-radius:8px!important;background:#000 linear-gradient(to top,#12210d,#396b29)!important;box-shadow:inset 0 0 1px 1px #cecece,inset 0 0 0 3px #0c0d0d!important;color:#e6d6bf!important;cursor:pointer;font:12.8px/24px Arimo,Calibri,"Segoe UI",Arial,sans-serif!important;text-shadow:none!important}
    #ky-forum-e2 .kyf-tab.button.small.green .background{position:absolute;inset:0;border-radius:8px;pointer-events:none}
    #ky-forum-e2 .kyf-tab.button.small.green .label{position:relative;padding:0 11px;color:#e6d6bf;font:14px/24px Arimo,Calibri,"Segoe UI",Arial,sans-serif;font-weight:normal;text-shadow:1px 1px #000;pointer-events:none}
    #ky-forum-e2 .kyf-tab.button.small.green:hover{filter:brightness(1.18)!important}
    #ky-forum-e2 .kyf-tab.button.small.green.active{background:#000 linear-gradient(to top,#1d3c16,#4e843d)!important;box-shadow:inset 0 0 1px 1px #e2e2c8,inset 0 0 0 3px #11150f,0 0 4px #779a4d!important}
    #ky-forum-e2 .kyf-tab.button.small.green.active .label{color:#fff0a0!important;font-weight:bold}
    #ky-forum-e2 .kyf-tools{padding:3px;border-top:1px solid #766c5d;border-bottom:1px solid #292622;background:rgba(10,10,10,.45)}
    #ky-forum-e2 .kyf-title{color:#f4db77!important;text-shadow:1px 1px #100b06,0 0 4px #6e491c!important}
    #ky-forum-e2 .kyf-native-button.button.small{position:relative;display:flex;align-items:center;justify-content:center;height:27px!important;width:auto;padding:0!important;border:1px solid #0c0d0d!important;border-radius:8px!important;box-shadow:inset 0 0 1px 1px #cecece,inset 0 0 0 3px #0c0d0d!important;cursor:pointer!important;overflow:hidden;font:12.8px/24px Arimo,Calibri,"Segoe UI",Arial,sans-serif!important}
    #ky-forum-e2 .kyf-native-button.button.green{background:#000 linear-gradient(to top,#12210d,#396b29)!important;color:#e6d6bf!important}
    #ky-forum-e2 .kyf-native-button.button.red{background:#000 linear-gradient(to top,#321411,#6a2d27)!important;color:#f0d7cf!important}
    #ky-forum-e2 .kyf-native-button .background{position:absolute;inset:0;pointer-events:none}
    #ky-forum-e2 .kyf-native-button .label{position:relative;padding:0 11px;color:inherit;font:13px/24px Arimo,Calibri,"Segoe UI",Arial,sans-serif;text-shadow:1px 1px #000;pointer-events:none;white-space:nowrap}
    #ky-forum-e2 .kyf-native-button:hover{filter:brightness(1.2)}
    #ky-forum-e2 #kyf-close{width:28px!important}
    #ky-forum-e2 #kyf-close .label{padding:0!important;font-weight:bold}
    #ky-forum-e2 #kyf-clear-history{height:24px!important}
    #ky-forum-e2 #kyf-refresh{height:29px!important}
    #ky-forum-e2 .kyf-list,#ky-forum-e2 .kyf-items,#ky-forum-e2 .kyf-change-log{scrollbar-width:thin;scrollbar-color:#776d5e #171614}
    #ky-forum-e2 ::-webkit-scrollbar{width:9px;height:9px}
    #ky-forum-e2 ::-webkit-scrollbar-track{background:#171614;border:1px solid #080808;box-shadow:inset 0 0 3px #000}
    #ky-forum-e2 ::-webkit-scrollbar-thumb{background:linear-gradient(90deg,#302d28 0%,#817665 48%,#4c463d 52%,#292723 100%);border:1px solid #111;border-radius:2px;box-shadow:inset 0 0 1px #b8aa91}
    #ky-forum-e2 ::-webkit-scrollbar-thumb:hover{background:linear-gradient(90deg,#3b3730 0%,#998a74 48%,#5c5549 52%,#33302a)}
    #ky-forum-e2 ::-webkit-scrollbar-corner{background:#171614}
    .kyf-release-overlay{position:fixed;inset:0;z-index:2147483646;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.48);font-family:Verdana,Arial,sans-serif}.kyf-release-popup{position:relative;width:410px;border:3px ridge #8b806e;background:#1b1a18;color:#ded6c7;box-shadow:0 14px 42px #000,0 0 0 2px #17110d,inset 0 0 14px #000}.kyf-release-popup-head{display:flex;align-items:center;justify-content:space-between;padding:9px 12px;background:linear-gradient(rgba(0,0,0,.08),rgba(0,0,0,.3)),url('/img/gui/belka-gora-dol.png') repeat-x center top/auto 54px;border-bottom:2px ridge #766b5c;color:#f4db77;font:bold 13px Verdana,Arial,sans-serif;text-shadow:1px 1px #100b06}.kyf-release-popup-close{width:25px;height:25px;border:1px solid #0c0d0d;border-radius:7px;background:linear-gradient(to top,#321411,#6a2d27);box-shadow:inset 0 0 1px 1px #cecece,inset 0 0 0 3px #0c0d0d;color:#f0d7cf;font-weight:bold;cursor:pointer}.kyf-release-popup-body{padding:13px 15px;background:radial-gradient(ellipse at top,rgba(100,85,60,.12),transparent 55%),#242323;font-size:11px;line-height:16px}.kyf-release-popup-body ul{margin:7px 0 13px;padding-left:20px}.kyf-release-popup-body li{margin:4px 0}.kyf-release-popup-button{display:block;min-width:120px;height:29px;margin:0 auto;border:1px solid #0c0d0d;border-radius:8px;background:linear-gradient(to top,#12210d,#396b29);box-shadow:inset 0 0 1px 1px #cecece,inset 0 0 0 3px #0c0d0d;color:#f1e5cf;font:bold 12px Arial,sans-serif;text-shadow:1px 1px #000;cursor:pointer}.kyf-release-popup-button:hover,.kyf-release-popup-close:hover{filter:brightness(1.18)}

  `;
  document.head.appendChild(style);

  const launch = document.createElement('div');
  launch.className = 'widget-button green mz-widget widget-in-interface-bar widget-margohelp_bestiary ui-draggable ui-draggable-handle kyf-launch';
  launch.setAttribute('widget-name', 'margohelp_bestiary');
  launch.setAttribute('widget-pos', 'top-right');
  launch.setAttribute('role', 'button');
  launch.setAttribute('tabindex', '0');
  launch.setAttribute('aria-label', 'Otwórz Bestiariusz');
  const launchIconWrap = document.createElement('div');
  launchIconWrap.className = 'icon margohelp_bestiary kyf-launch-icon';
  const launchIcon = document.createElement('img');
  launchIcon.src = LAUNCH_ICON;
  launchIcon.alt = '';
  launchIconWrap.appendChild(launchIcon);
  launch.appendChild(launchIconWrap);
  const launchNotification = document.createElement('div');
  launchNotification.className = 'red-notification interface-element-red-notification';
  launchNotification.hidden = true;
  launch.appendChild(launchNotification);
  const launchAmount = document.createElement('div');
  launchAmount.className = 'amount';
  launch.appendChild(launchAmount);
  const widgetTooltip = document.createElement('div');
  widgetTooltip.className = 'kyf-widget-tooltip';
  widgetTooltip.textContent = 'Bestiariusz';
  document.body.appendChild(widgetTooltip);

  function mountLauncherInInterfaceBar() {
    const savedSlot = loadJson(STORE_WIDGET_SLOT, null);
    const savedPosition = savedSlot && /^(top|bottom)-(left|right)$/.test(savedSlot.position) ? savedSlot.position : 'top-right';
    const interfaceBar = document.querySelector(`.${savedPosition}.main-buttons-container`) || document.querySelector('.top-right.main-buttons-container');
    if (!interfaceBar) return false;
    if (launch.parentElement === interfaceBar) return true;
    const occupiedIndexes = new Set(
      [...interfaceBar.querySelectorAll(':scope > .widget-button[widget-index]')]
        .map(widget => Number(widget.getAttribute('widget-index')))
        .filter(Number.isFinite)
    );
    let widgetIndex = savedSlot && Number.isInteger(savedSlot.index) ? Math.max(0, Math.min(6, savedSlot.index)) : 0;
    while (occupiedIndexes.has(widgetIndex)) widgetIndex += 1;
    if (widgetIndex > 6) widgetIndex = [...Array(7).keys()].find(index => !occupiedIndexes.has(index)) ?? 0;
    launch.setAttribute('widget-index', String(widgetIndex));
    launch.setAttribute('widget-pos', savedPosition);
    launch.style.left = widgetIndex * 44 + 'px';
    launch.style.top = '0px';
    launch.style.right = 'auto';
    launch.style.width = '44px';
    launch.style.height = '44px';
    launch.style.position = 'absolute';
    interfaceBar.appendChild(launch);
    return true;
  }

  mountLauncherInInterfaceBar();
  const interfaceObserver = new MutationObserver(() => {
    if (!launch.isConnected) mountLauncherInInterfaceBar();
  });
  interfaceObserver.observe(document.documentElement, { childList: true, subtree: true });

  const panel = document.createElement('div');
  panel.id = 'ky-forum-e2';
  panel.innerHTML = `
    <div class="kyf-frame-horizontal kyf-frame-top" aria-hidden="true"></div>
    <div class="kyf-head"><div><div class="kyf-title">BESTIARIUSZ ${SCRIPT_VERSION}</div><div class="kyf-sub">Autor: <a href="https://www.margonem.pl/profile/view,10050726#char_5601,luvia" target="_blank" rel="noopener">Król Yss</a> • <span class="kyf-online offline" id="kyf-online">Online: —</span> • Elity • Herosi • Kolosi • Tytani</div></div><div class="kyf-head-actions"><div class="kyf-native-button button small green kyf-options-btn" id="kyf-options-btn" role="button" tabindex="0"><div class="background"></div><div class="label">Opcje</div></div><div class="kyf-native-button button small red" id="kyf-close" role="button" tabindex="0"><div class="background"></div><div class="label">X</div></div></div></div>
    <div class="kyf-body">
      <div class="kyf-tabs"><div class="kyf-tab button small green" role="button" tabindex="0" data-category="elites"><div class="background"></div><div class="label">Elity</div></div><div class="kyf-tab button small green active" role="button" tabindex="0" data-category="elites2"><div class="background"></div><div class="label">Elity II</div></div><div class="kyf-tab button small green" role="button" tabindex="0" data-category="heroes"><div class="background"></div><div class="label">Herosi</div></div><div class="kyf-tab button small green" role="button" tabindex="0" data-category="colossi"><div class="background"></div><div class="label">Kolosi</div></div><div class="kyf-tab button small green" role="button" tabindex="0" data-category="titans"><div class="background"></div><div class="label">Tytani</div></div></div>
      <div class="kyf-options" id="kyf-options"><label><input type="checkbox" id="kyf-color-elements"> Koloruj żywioły i odporności</label><label>Zmniejszenie wagi pustego łupu (Elity+) <select id="kyf-loot-multiplier"><option value="1">×1</option><option value="2">×2</option><option value="3">×3</option><option value="4">×4</option><option value="5">×5</option><option value="6">×6</option></select></label><label>Bonus gracza do pustego łupu <input type="number" id="kyf-loot-bonus" min="0" max="100" step="1">%</label><label>Zakres pełnego łupu Elit i Herosów ± <input type="number" id="kyf-level-range" min="13" max="50" step="1"> lvl</label><div class="kyf-change-system"><div class="kyf-change-head"><span>System aktualizacji danych</span><div class="kyf-native-button button small red" id="kyf-clear-history" role="button" tabindex="0"><div class="background"></div><div class="label">Wyczyść historię</div></div></div><div class="kyf-update-times" id="kyf-update-times"></div><div class="kyf-change-log" id="kyf-change-log"></div></div></div>
      <div class="kyf-tools"><input class="kyf-input" id="kyf-search" placeholder="Szukaj elity lub przedmiotu"><div class="kyf-native-button button small green" id="kyf-refresh" role="button" tabindex="0"><div class="background"></div><div class="label">Odśwież forum</div></div></div>
      <div class="kyf-main"><div class="kyf-list" id="kyf-list"></div><div class="kyf-items" id="kyf-items"><div class="kyf-empty">Pobieram dane z forum…</div></div></div>
      <div class="kyf-source" id="kyf-status"></div>
    </div>
    <div class="kyf-frame-horizontal kyf-frame-bottom" aria-hidden="true"></div>`;
  document.body.appendChild(panel);
  let presenceInterval = 0;
  let presenceVisibilityHandler = null;
  window.__KROL_YSS_BESTIARY_PRESENCE__ = { start: startPresence, stop: stopPresence };
  startPresence();
  showReleasePopup();
  const savedPanelPos = loadJson(STORE_PANEL_POS, null);
  if (savedPanelPos && Number.isFinite(savedPanelPos.left) && Number.isFinite(savedPanelPos.top)) {
    panel.style.right = 'auto';
    panel.style.left = Math.max(0, Math.min(innerWidth - 570, savedPanelPos.left)) + 'px';
    panel.style.top = Math.max(0, Math.min(innerHeight - 650, savedPanelPos.top)) + 'px';
  }

  const tip = document.createElement('div');
  tip.className = 'kyf-tip';
  document.body.appendChild(tip);

  bindLauncher();
  bindPanelDrag();
  panel.querySelector('#kyf-close').addEventListener('click', () => panel.style.display = 'none');
  panel.querySelector('#kyf-options-btn').addEventListener('click', () => panel.querySelector('#kyf-options').classList.toggle('open'));
  panel.querySelectorAll('.kyf-native-button').forEach(button => button.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      button.click();
    }
  }));
  panel.querySelector('#kyf-search').addEventListener('input', event => { filter = event.target.value; renderList(); });
  panel.querySelector('#kyf-refresh').addEventListener('click', () => loadForum(true));
  panel.querySelectorAll('.kyf-tab').forEach(button => {
    button.addEventListener('click', () => switchCategory(button.dataset.category));
    button.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        switchCategory(button.dataset.category);
      }
    });
  });
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
  const lootMultiplierControl = panel.querySelector('#kyf-loot-multiplier');
  const lootBonusControl = panel.querySelector('#kyf-loot-bonus');
  const handleLootSettings = () => {
    if (syncLootPreferencesFromControls()) renderItemsKeepingChanceOpen();
  };
  lootMultiplierControl.addEventListener('input', handleLootSettings);
  lootMultiplierControl.addEventListener('change', handleLootSettings);
  lootBonusControl.addEventListener('input', handleLootSettings);
  lootBonusControl.addEventListener('change', () => {
    syncLootPreferencesFromControls();
    lootBonusControl.value = String(preferences.lootBonus);
    renderItemsKeepingChanceOpen();
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

  function showReleasePopup() {
    let seenVersion = '';
    try { seenVersion = String(GM_getValue(STORE_SEEN_RELEASE, '')); } catch (error) { /* brak zapisu nie blokuje dodatku */ }
    if (seenVersion === SCRIPT_VERSION) return;

    const overlay = document.createElement('div');
    overlay.className = 'kyf-release-overlay';
    overlay.innerHTML = `
      <div class="kyf-release-popup" role="dialog" aria-modal="true" aria-labelledby="kyf-release-title">
        <div class="kyf-release-popup-head"><span id="kyf-release-title">Bestiariusz ${escapeHtml(SCRIPT_VERSION)} — co nowego?</span><button class="kyf-release-popup-close" type="button" aria-label="Zamknij">X</button></div>
        <div class="kyf-release-popup-body">
          <ul><li>Dodano licznik osób korzystających aktualnie z Bestiariusza.</li><li>Aktywność jest liczona anonimowo przez 3 minuty od ostatniego sygnału.</li><li>Dodatek nie przesyła nicku, świata ani żadnych danych postaci.</li></ul>
          <button class="kyf-release-popup-button" type="button">Rozumiem</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    const closePopup = () => {
      try { GM_setValue(STORE_SEEN_RELEASE, SCRIPT_VERSION); } catch (error) { /* popup może zostać zamknięty bez zapisu */ }
      overlay.remove();
    };
    overlay.querySelector('.kyf-release-popup-close').addEventListener('click', closePopup);
    overlay.querySelector('.kyf-release-popup-button').addEventListener('click', closePopup);
  }

  function bindLauncher() {
    let dragging = false;
    let dragged = false;
    let startX = 0;
    let startY = 0;
    let offsetX = 0;
    let offsetY = 0;

    const showWidgetTooltip = () => {
      if (dragging || dragged) return;
      const rect = launch.getBoundingClientRect();
      widgetTooltip.style.display = 'block';
      const tooltipRect = widgetTooltip.getBoundingClientRect();
      let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
      left = Math.max(6, Math.min(innerWidth - tooltipRect.width - 6, left));
      let top = rect.bottom + 8;
      if (top + tooltipRect.height > innerHeight - 6) top = rect.top - tooltipRect.height - 8;
      widgetTooltip.style.left = left + 'px';
      widgetTooltip.style.top = Math.max(6, top) + 'px';
    };
    const hideWidgetTooltip = () => { widgetTooltip.style.display = 'none'; };
    launch.addEventListener('mouseenter', showWidgetTooltip);
    launch.addEventListener('mouseleave', hideWidgetTooltip);

    launch.addEventListener('mousedown', event => {
      if (event.button !== 0) return;
      const rect = launch.getBoundingClientRect();
      dragging = true;
      hideWidgetTooltip();
      dragged = false;
      startX = event.clientX;
      startY = event.clientY;
      offsetX = event.clientX - rect.left;
      offsetY = event.clientY - rect.top;
      event.preventDefault();
    });

    document.addEventListener('mousemove', event => {
      if (!dragging) return;
      if (!dragged && Math.abs(event.clientX - startX) + Math.abs(event.clientY - startY) < 5) return;
      if (!dragged) {
        dragged = true;
        launch.classList.add('kyf-widget-dragging');
        document.body.appendChild(launch);
      }
      launch.style.left = event.clientX - offsetX + 'px';
      launch.style.top = event.clientY - offsetY + 'px';
    });

    document.addEventListener('mouseup', event => {
      if (!dragging) return;
      dragging = false;
      if (!dragged) return;
      launch.classList.remove('kyf-widget-dragging');
      const bars = [...document.querySelectorAll('.main-buttons-container')].filter(bar => {
        const rect = bar.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
      let targetBar = bars.find(bar => {
        const rect = bar.getBoundingClientRect();
        return event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top - 25 && event.clientY <= rect.bottom + 25;
      });
      if (!targetBar) targetBar = document.querySelector(`.${launch.getAttribute('widget-pos')}.main-buttons-container`) || document.querySelector('.top-right.main-buttons-container');
      const barRect = targetBar.getBoundingClientRect();
      const requestedIndex = Math.max(0, Math.min(6, Math.round((event.clientX - barRect.left - 22) / 44)));
      const occupied = new Set([...targetBar.querySelectorAll(':scope > .widget-button[widget-index]')]
        .filter(widget => widget !== launch)
        .map(widget => Number(widget.getAttribute('widget-index'))));
      const freeIndexes = [...Array(7).keys()].filter(index => !occupied.has(index));
      const widgetIndex = freeIndexes.reduce((best, index) => Math.abs(index - requestedIndex) < Math.abs(best - requestedIndex) ? index : best, freeIndexes[0] ?? requestedIndex);
      const position = [...targetBar.classList].find(name => /^(top|bottom)-(left|right)$/.test(name)) || 'top-right';
      launch.setAttribute('widget-index', String(widgetIndex));
      launch.setAttribute('widget-pos', position);
      launch.style.position = 'absolute';
      launch.style.left = widgetIndex * 44 + 'px';
      launch.style.top = '0px';
      launch.style.right = 'auto';
      targetBar.appendChild(launch);
      saveJson(STORE_WIDGET_SLOT, { position, index: widgetIndex });
      setTimeout(() => { dragged = false; }, 0);
    });

    const togglePanel = event => {
      event.preventDefault();
      event.stopPropagation();
      if (dragged) return;
      panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
    };
    launch.addEventListener('click', togglePanel);
    launch.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') togglePanel(event);
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

  function syncLootPreferencesFromControls() {
    const multiplierControl = panel.querySelector('#kyf-loot-multiplier');
    const bonusControl = panel.querySelector('#kyf-loot-bonus');
    const nextMultiplier = Math.round(clampNumber(multiplierControl && multiplierControl.value, 1, 6, 1));
    const nextBonus = clampNumber(bonusControl && bonusControl.value, 0, 100, 0);
    const changed = nextMultiplier !== preferences.lootMultiplier || nextBonus !== preferences.lootBonus;
    preferences.lootMultiplier = nextMultiplier;
    preferences.lootBonus = nextBonus;
    if (multiplierControl) multiplierControl.value = String(nextMultiplier);
    savePreferences();
    return changed;
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
    timesBox.innerHTML = `<div class="kyf-update-time kyf-script-update"><b>Data aktualizacji dodatku v${escapeHtml(SCRIPT_VERSION)}:</b> ${escapeHtml(formatDateTime(SCRIPT_UPDATED_AT))}</div><div class="kyf-update-time kyf-release-note"><b>Co nowego:</b> ${escapeHtml(SCRIPT_RELEASE_NOTES)}</div>`
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
    box.innerHTML = `<div class="kyf-selected"><div class="kyf-selected-image">${selectedMob.image ? `<img src="${escapeHtml(selectedMob.image)}" alt="">` : '?'}</div><div class="kyf-selected-info"><div class="kyf-selected-name">${escapeHtml(selectedMob.name)}</div><div class="kyf-meta">${selectedMob.level} lvl | ${escapeHtml(selectedMob.profile || 'brak profesji')}</div>${monsterRangeLine(activeCategory, selectedMob)}</div><div class="kyf-chance-wrap"><button class="kyf-chance-btn" title="Przybliżone szanse na łup">?</button><div class="kyf-chance-popover">${renderDropChancePopover(activeCategory, selectedMob)}</div></div></div>${routeHtml}${groupsHtml}`;
    const chanceWrap = box.querySelector('.kyf-chance-wrap');
    const chancePopover = chanceWrap.querySelector('.kyf-chance-popover');
    chanceWrap.querySelector('.kyf-chance-btn').addEventListener('click', event => {
      event.stopPropagation();
      if (!chanceWrap.classList.contains('open')) {
        syncLootPreferencesFromControls();
        chancePopover.innerHTML = renderDropChancePopover(activeCategory, selectedMobs[activeCategory]);
      }
      chanceWrap.classList.toggle('open');
    });
    chancePopover.addEventListener('click', event => event.stopPropagation());
    chancePopover.addEventListener('change', event => {
      if (!event.target.matches('#kyf-e2-variant')) return;
      preferences.e2Variant = E2_CHANCE_VARIANTS[event.target.value] ? event.target.value : 'standard';
      savePreferences();
      chancePopover.innerHTML = renderDropChancePopover(activeCategory, selectedMobs[activeCategory]);
    });
    enableWheelScroll(chancePopover);
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

  function renderItemsKeepingChanceOpen() {
    const wasOpen = !!panel.querySelector('.kyf-chance-wrap.open');
    renderItems();
    if (!wasOpen) return;
    const chanceWrap = panel.querySelector('.kyf-chance-wrap');
    if (chanceWrap) chanceWrap.classList.add('open');
  }

  function renderDropChancePopover(category, mob) {
    if (category === 'elites2') {
      const variant = E2_CHANCE_VARIANTS[preferences.e2Variant] || E2_CHANCE_VARIANTS.standard;
      const options = Object.entries(E2_CHANCE_VARIANTS).map(([key, entry]) => `<option value="${escapeHtml(key)}"${key === preferences.e2Variant ? ' selected' : ''}>${escapeHtml(entry.label)}</option>`).join('');
      return `<div class="kyf-chance-title">Szanse na łup — Elity II</div><select class="kyf-chance-select" id="kyf-e2-variant">${options}</select>${renderChanceSummary(variant.rows)}${renderChanceRows(variant.rows)}${renderLootFactorNote(variant.rows, category)}`;
    }
    const data = DROP_CHANCES[category];
    if (!data) return '<div class="kyf-chance-note">Brak danych o szansach.</div>';
    const individualChance = mob && mob.legendaryChestChance ? `<div class="kyf-chance-row"><span>Legendarna skrytka tego Herosa</span><span><strong>${escapeHtml(mob.legendaryChestChance)}</strong></span></div>` : '';
    const secondary = data.secondaryRows ? `<div class="kyf-chance-title" style="margin-top:8px">${escapeHtml(data.secondaryLabel)}</div>${renderChanceRows(data.secondaryRows)}` : '';
    return `<div class="kyf-chance-title">Szanse na łup — ${escapeHtml(data.label)}</div>${individualChance}${renderChanceSummary(data.rows)}${renderChanceRows(data.rows)}${secondary}${renderLootFactorNote(data.rows, category)}`;
  }

  function renderChanceRows(rows) {
    const emptyChance = separateEmptyChance(rows);
    return (rows || []).map(row => {
      const adjusted = adjustedChanceText(row[0], row[1], emptyChance);
      return `<div class="kyf-chance-row"><span>${escapeHtml(row[0])}</span><span><strong>${escapeHtml(row[1])}</strong>${adjusted ? `<small class="kyf-chance-adjusted">Po ustawieniach: ${escapeHtml(adjusted)}</small>` : ''}</span></div>`;
    }).join('');
  }

  function renderChanceSummary(rows) {
    const emptyChance = separateEmptyChance(rows);
    if (emptyChance == null) return '';
    const adjustedEmpty = calculateAdjustedEmptyChance(emptyChance);
    const baseLoot = 100 - emptyChance;
    const adjustedLoot = 100 - adjustedEmpty;
    const modified = preferences.lootMultiplier !== 1 || preferences.lootBonus !== 0;
    return `<div class="kyf-chance-row kyf-chance-summary"><span>Szansa na dowolny przedmiot</span><span><strong>~${escapeHtml(formatChanceNumber(baseLoot))}%</strong>${modified ? `<small class="kyf-chance-adjusted">Po ustawieniach: ~${escapeHtml(formatChanceNumber(adjustedLoot))}%</small>` : ''}</span></div>`;
  }

  function renderLootFactorNote(rows, category) {
    const modified = preferences.lootMultiplier !== 1 || preferences.lootBonus !== 0;
    const hasSeparateEmptyChance = separateEmptyChance(rows) != null;
    const base = '<div class="kyf-chance-note">Wartości przybliżone, pobrane z oficjalnego tematu forum.';
    if (!modified) return base + '</div>';
    if (!hasSeparateEmptyChance && category === 'heroes') return base + '<br>Ustawienia zapisano. Dla Herosów źródło łączy pusty łup, pospolity przedmiot i skrzynię w jedną wartość, dlatego dokładnego przeliczenia nie da się wyświetlić.</div>';
    if (!hasSeparateEmptyChance && category === 'colossi') return base + '<br>Kolosi korzystają z gwarantowanego łupu osobistego, dlatego ustawienie pustego łupu nie zmienia tej tabeli.</div>';
    if (!hasSeparateEmptyChance) return base + '<br>Ustawienia zapisano, ale źródło nie podaje osobnej szansy na pusty łup, więc nie pokazuję zgadywanego wyniku.</div>';
    return base + `<br>Przeliczenie: zmniejszenie wagi pustego łupu dla Elit+ ×${escapeHtml(preferences.lootMultiplier)}; bonus gracza: ${escapeHtml(preferences.lootBonus)}%.</div>`;
  }

  function separateEmptyChance(rows) {
    const emptyRow = (rows || []).find(row => normalize(row[0]) === 'brak lupu');
    return emptyRow ? firstPercentValue(emptyRow[1]) : null;
  }

  function calculateAdjustedEmptyChance(emptyChance) {
    if (emptyChance == null || emptyChance < 0 || emptyChance >= 100) return emptyChance;
    const baseEmpty = emptyChance / 100;
    const denominator = 1 - baseEmpty + baseEmpty / preferences.lootMultiplier;
    const worldEmpty = (baseEmpty / preferences.lootMultiplier) / denominator;
    return worldEmpty * (1 - preferences.lootBonus / 100) * 100;
  }

  function adjustedChanceText(label, rawChance, emptyChance) {
    if (emptyChance == null || emptyChance < 0 || emptyChance >= 100) return '';
    const isEmpty = normalize(label) === 'brak lupu';
    const baseEmpty = emptyChance / 100;
    const adjustedEmpty = calculateAdjustedEmptyChance(emptyChance) / 100;
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
      stats.reqp ? formatProfessionRequirement(stats.reqp) : '',
      stats.lvl ? formatLevelRequirement(stats.lvl) : '',
      item.value && item.value !== '0' ? `<div class="kyf-stat">Wartość: <b>${escapeHtml(formatItemValue(item.value))}</b></div>` : ''
    ].join('');
    tip.style.setProperty('--rarity', info.color);
    tip.classList.toggle('kyf-color-elements', preferences.colorElements);
    tip.innerHTML = `<div class="kyf-tip-head"><div class="kyf-tip-icon">${item.image ? `<img src="${escapeHtml(item.image)}" alt="">` : ''}</div><div><div class="kyf-tip-name">${escapeHtml(item.name)}</div><div class="kyf-meta">Typ: ${escapeHtml(ITEM_TYPES[item.itemClass] || 'nieznany')}</div></div></div><div class="kyf-tip-rarity">${info.label}</div>${rows}${bonusHtml}${descriptionHtml}${bindHtml}${footer ? `<div class="kyf-footer">${footer}</div>` : ''}`;
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
    if (key === 'reqp') return formatProfessionRequirement(value);
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

  function currentProfessionCode() {
    const candidates = [
      window.Engine?.hero?.d?.profession,
      window.Engine?.hero?.d?.prof,
      window.Engine?.hero?.profession,
      window.Engine?.hero?.prof,
      window.g?.hero?.profession,
      window.g?.hero?.prof,
      window.hero?.profession,
      window.hero?.prof,
    ];
    for (const candidate of candidates) {
      const code = String(candidate || '').trim().toLowerCase();
      if (Object.prototype.hasOwnProperty.call(PROFESSIONS, code)) return code;
    }
    const heroName = document.querySelector('.heroname')?.textContent || '';
    const headerMatch = heroName.match(/\(\s*\d+\s*([wpmtbh])\s*\)\s*$/i);
    if (headerMatch) return headerMatch[1].toLowerCase();
    return '';
  }

  function currentHeroLevel() {
    const candidates = [
      window.Engine?.hero?.d?.lvl,
      window.Engine?.hero?.d?.level,
      window.Engine?.hero?.lvl,
      window.Engine?.hero?.level,
      window.g?.hero?.lvl,
      window.g?.hero?.level,
      window.hero?.lvl,
      window.hero?.level,
    ];
    for (const candidate of candidates) {
      const level = Number(candidate);
      if (Number.isFinite(level) && level > 0) return level;
    }
    const heroNames = [...document.querySelectorAll('.heroname')];
    for (const element of heroNames) {
      const match = (element.textContent || '').match(/\(\s*(\d+)\s*[wpmtbh]\s*\)\s*$/i);
      if (match) return Number(match[1]);
    }
    return NaN;
  }

  function professionCompatibility(required) {
    const current = currentProfessionCode();
    if (!current) return 'unknown';
    const accepted = [...new Set(String(required || '').toLowerCase().match(/[wpmtbh]/g) || [])];
    if (!accepted.length) return 'unknown';
    return accepted.includes(current) ? 'ok' : 'bad';
  }

  function formatProfessionRequirement(value) {
    const compatibility = professionCompatibility(value);
    const current = currentProfessionCode();
    const accepted = [...new Set(String(value || '').toLowerCase().match(/[wpmtbh]/g) || [])];
    const marker = compatibility === 'ok'
      ? '<b class="kyf-requirement-marker-ok">✓</b> '
      : compatibility === 'bad'
        ? '<b class="kyf-requirement-marker-bad">✕</b> '
        : '';
    const professions = accepted.length
      ? accepted.map(code => {
          const name = PROFESSIONS[code];
          const label = name.charAt(0).toUpperCase() + name.slice(1);
          const stateClass = compatibility === 'bad' ? 'kyf-profession-mismatch' : code === current ? 'kyf-profession-match' : 'kyf-profession-option';
          return `<b class="${stateClass}">${escapeHtml(label)}</b>`;
        }).join(', ')
      : `<b class="kyf-profession-option">${escapeHtml(formatProfessions(value))}</b>`;
    return `<div class="kyf-stat kyf-profession-${compatibility}">${marker}Wymagana profesja: ${professions}</div>`;
  }

  function formatLevelRequirement(value) {
    const requiredMatch = String(value || '').match(/\d+/);
    const required = requiredMatch ? Number(requiredMatch[0]) : NaN;
    const current = currentHeroLevel();
    const compatibility = Number.isFinite(required) && Number.isFinite(current) ? (current >= required ? 'ok' : 'bad') : 'unknown';
    const marker = compatibility === 'ok'
      ? '<b class="kyf-requirement-marker-ok">✓</b> '
      : compatibility === 'bad'
        ? '<b class="kyf-requirement-marker-bad">✕</b> '
        : '';
    return `<div class="kyf-stat kyf-level-${compatibility}">${marker}Wymagany poziom: <b>${escapeHtml(value)}</b></div>`;
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
  function normalize(value) { return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l').replace(/\s+/g, ' ').trim(); }
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
  function getPresenceId() {
    try {
      let id = localStorage.getItem(STORE_PRESENCE_ID) || '';
      if (/^[a-zA-Z0-9_-]{16,64}$/.test(id)) return id;
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      id = [...bytes].map(value => value.toString(16).padStart(2, '0')).join('');
      localStorage.setItem(STORE_PRESENCE_ID, id);
      return id;
    } catch (error) {
      return '';
    }
  }
  function startPresence() {
    const label = panel.querySelector('#kyf-online');
    const clientId = getPresenceId();
    if (!label || !clientId || presenceInterval) return;

    const heartbeat = async () => {
      if (document.visibilityState !== 'visible') return;
      try {
        const response = await fetch(`${PRESENCE_URL}/heartbeat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clientId })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const online = Math.max(0, Number(data?.online) || 0);
        label.textContent = `Online: ${online}`;
        label.classList.remove('offline');
      } catch (error) {
        label.textContent = 'Online: —';
        label.classList.add('offline');
      }
    };

    heartbeat();
    presenceInterval = setInterval(heartbeat, 60000);
    presenceVisibilityHandler = () => {
      if (document.visibilityState === 'visible') heartbeat();
    };
    document.addEventListener('visibilitychange', presenceVisibilityHandler);
  }
  function stopPresence() {
    if (presenceInterval) clearInterval(presenceInterval);
    presenceInterval = 0;
    if (presenceVisibilityHandler) document.removeEventListener('visibilitychange', presenceVisibilityHandler);
    presenceVisibilityHandler = null;
    const label = panel.querySelector('#kyf-online');
    if (label) {
      label.textContent = 'Online: —';
      label.classList.add('offline');
    }
  }
  function setStatus(_text, category = activeCategory) {
    if (category !== activeCategory) return;
    const config = CATEGORIES[category];
    const linkLabel = SOURCE_LINK_LABELS[category] || config.label;
    panel.querySelector('#kyf-status').innerHTML = `Wykorzystane grafiki są własnością Garmory. | <a href="${config.source}" target="_blank" rel="noopener">Otwórz ${escapeHtml(linkLabel)}</a>`;
  }
})();
