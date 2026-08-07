/*
 * ─────────────────────────────────────────────────────────────────────────────
 * TODO: REPLACE WITH REAL PHOTOGRAPHY
 * ─────────────────────────────────────────────────────────────────────────────
 * Every image on the site is referenced from this one map. To swap in the real
 * photos, just change the string values below — do not add image paths anywhere
 * else in the codebase.
 *
 * The current files are dark, atmospheric stand-ins so the layout reads
 * correctly. Drop the real photos into /public/images/ and either overwrite
 * these filenames or update the paths here. The target aspect ratio for each
 * slot is noted so crops land well.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const IMAGES = {
  /**
   * 16:9 or wider — full-bleed homepage hero.
   *
   * Real photo of the fire pit deck at dusk, supplied as a placeholder. It is
   * 893x720 (~1.24:1) — narrower than the hero box — so it upscales and crops
   * hard at full-bleed, losing the outer pergolas on wide screens. Worth
   * replacing with a wider, higher-resolution export when one is available.
   */
  heroCabin: '/images/hero-firepit-moonrise.jpg',
  /**
   * The Oasis Studio interior (the yoga space, not the Pine Forest Cabin). Real
   * photo — 1070x567 (~1.89:1 panoramic). Now only used in landscape slots (the
   * studio-hire card, the offerings page header and a wide gallery tile), which
   * suit it well.
   */
  studioInterior: '/images/studio-interior-wide.jpg',
  /** 3:2 landscape — the deck looking into the valley */
  deckValley: '/images/deck-valley.png',
  /*
   * ── Pine Forest Cabin ───────────────────────────────────────────────────────
   * Real photography, all three ~3:2 landscape. `cabinRoom` stays the canonical
   * single-slot image for the cabin (page headers, cards); the other two back
   * the small gallery on the booking page.
   */
  /** 3:2 landscape — the loft bedroom under the A-frame gable */
  cabinRoom: '/images/pine-forest-cabin-bedroom.jpg',
  /** 3:2 landscape — the A-frame on stilts among the pines at dusk */
  cabinExterior: '/images/pine-forest-cabin-exterior.jpg',
  /** 3:2 landscape — open-plan living room, wood stove and kitchen beyond */
  cabinLiving: '/images/pine-forest-cabin-living.jpg',
  /*
   * ── Infrared sauna ──────────────────────────────────────────────────────────
   * Both real photos, and both already in the gallery, so these slots point at
   * the gallery files rather than duplicating the assets (same approach as
   * `heroCabin`, which the gallery references back through this constant).
   */
  /**
   * Inside the sauna: cedar bench, glowing infrared panels, towels rolled ready.
   * ~3:2 landscape. The offering detail page boxes it 4:5 portrait, which keeps
   * the centre ~53% — bench, towels and the back wall of heaters — so it holds
   * up cropped either way.
   */
  sauna: '/images/gallery/sauna-interior.jpg',
  /** ~3:2 landscape — the sauna from the pergola, door open. Shorter session. */
  saunaShort: '/images/gallery/sauna-door-open.jpg',
  /**
   * The mountain trail up to Myburghs waterfall ravine, at golden hour. Real
   * photo — 1248x832 (1.5:1). Used both in the 4:5 portrait panel on the
   * homepage (which keeps the centre 53% — still the full path, stream, sunset
   * sky and valley) and as a wide gallery tile, so it crops well either way.
   */
  valleyTrail: '/images/valley-trail-dusk.jpg',
  /** 1:1 — yoga practice in the Oasis Studio */
  yoga: '/images/yoga.png',
  /** 1:1 — breathwork session */
  breathwork: '/images/breathwork.png',
} as const

/**
 * Gallery grid — real photography, ordered grounds first and interiors last.
 *
 * `feature` makes a tile 2 columns x 2 rows on desktop. Because every photo
 * here is 3:2, a 2x2 tile is also 3:2 (2 cols + gap by 2 rows + gap), so it
 * sits flush beside two stacked single tiles with nothing cropped.
 *
 * ORDERING IS LOAD-BEARING: the grid only packs without holes if each
 * `feature` is followed by exactly TWO singles (they fill the third column
 * across its two rows), and any remaining singles come in groups of three.
 * If you add or remove a photo, keep that rhythm.
 *
 * Features are given to the wide, open compositions that carry a large tile:
 * the fire pit, the mountain panorama, the ridge, the garden nook, the studio
 * and the kitchen.
 */
export const GALLERY: { src: string; alt: string; feature?: boolean }[] = [
  /* ── Arrival ─────────────────────────────────────────────────────────────
   * Opens on the cover shot, then walks the visitor up the drive the way they
   * would actually arrive. */
  {
    src: IMAGES.heroCabin,
    alt: 'The fire pit and festoon-lit deck at dusk, with the studio beyond in the pines',
    feature: true,
  },
  {
    src: '/images/gallery/arrival-driveway.jpg',
    alt: 'The private drive at dusk, lit timber fencing leading up to the cabins',
  },
  {
    src: '/images/gallery/cabin-aframe-dusk.jpg',
    alt: 'The A-frame cabin on stilts at dusk, its glazed gable glowing above the log store',
  },

  {
    src: '/images/gallery/arrival-buddha-steps.jpg',
    alt: 'A seated Buddha and clay urn beside the timber steps up to the cabin deck',
  },
  {
    src: '/images/gallery/parking-jeep-garage.jpg',
    alt: 'Off-street parking on grass-block paving in front of the timber garage doors',
  },
  {
    src: '/images/gallery/parking-dog.jpg',
    alt: 'The parking court with a border collie crossing the grass-block paving',
  },

  /* ── The buildings ──────────────────────────────────────────────────────── */
  {
    src: '/images/gallery/exterior-studio-dusk.jpg',
    alt: 'The A-frame studio lit from within at dusk, seen across the timber decks',
    feature: true,
  },
  {
    src: '/images/gallery/exterior-cabin-golden-hour.jpg',
    alt: 'The cabin among the pines at golden hour, lanterns glowing on the balcony',
  },
  {
    src: '/images/gallery/studio-office-dusk.jpg',
    alt: 'The timber and charcoal studio at dusk, sliding door open to a warm interior',
  },

  {
    src: '/images/gallery/aframe-open-kitchen-dusk.jpg',
    alt: 'The A-frame thrown open at dusk, the kitchen glowing beneath the glazed gable',
    feature: true,
  },
  {
    src: '/images/gallery/aframe-stairs-below-dusk.jpg',
    alt: 'The A-frame from below its lit staircase, warm light under the deck',
  },
  {
    src: '/images/gallery/aframe-stairs-buddha-dusk.jpg',
    alt: 'The lit stairs up to the A-frame, a Buddha seated on the rockery alongside',
  },

  {
    src: '/images/gallery/exterior-open-bifolds-dusk.jpg',
    alt: 'Bifold doors folded fully open onto the deck, the kitchen and fire glowing inside',
  },
  {
    src: '/images/gallery/exterior-timber-wall-mountain.jpg',
    alt: 'Timber cladding and awning windows, with the Hout Bay ridge beyond',
  },
  {
    src: '/images/gallery/cabin-mirror-wall.jpg',
    alt: 'A framed mirror on the timber cladding, stone steps rising through ferns alongside',
  },

  /* ── Pool, fire and sauna ───────────────────────────────────────────────── */
  {
    src: '/images/gallery/pool-lengthwise.jpg',
    alt: 'The pool running the length of the timber deck, bamboo screening one side',
    feature: true,
  },
  {
    src: '/images/gallery/pool-lounge-buddha.jpg',
    alt: 'Deck loungers and a turquoise Buddha beside the pool, cabins rising behind',
  },
  {
    src: '/images/gallery/pool-dusk-sky.jpg',
    alt: 'The pool at dusk, a pale sky above the pines and the terraces lit below',
  },

  {
    src: '/images/gallery/firepit-pool-axis-dusk.jpg',
    alt: 'Looking straight down the pool between the pergola posts, the fire pit lit in front',
    feature: true,
  },
  {
    src: '/images/gallery/pergola-sauna-pool-dusk.jpg',
    alt: 'The pergola lounge at dusk, sauna and hot tub on one side and the pool on the other',
  },
  {
    src: '/images/gallery/pool-pergola-heater-dusk.jpg',
    alt: 'The pool at dusk beside the pergola, patio heater and dining set on the lawn',
  },

  {
    src: '/images/gallery/firepit-braai.jpg',
    alt: 'The sunken fire pit lit between cushioned benches, braai and kamado alongside',
    feature: true,
  },
  {
    src: '/images/gallery/pergola-dining-lanterns.jpg',
    alt: 'The long table under the pergola, rattan pendants and paper lanterns overhead',
  },
  {
    src: '/images/gallery/pergola-dining-table.jpg',
    alt: 'The long dining table under the slatted pergola, lanterns overhead',
  },

  {
    src: '/images/gallery/outdoor-kitchen-kamado.jpg',
    alt: 'The outdoor kitchen — timber sink unit, kamado grill and braai under the pergola',
  },
  {
    src: IMAGES.saunaShort,
    alt: 'The infrared sauna with its door open, heaters glowing and towels rolled ready',
  },
  {
    src: '/images/gallery/outdoor-shower.jpg',
    alt: 'The outdoor rain shower on a timber wall beside an arched mirror',
  },

  /* ── Garden, decks and views ────────────────────────────────────────────── */
  {
    src: '/images/gallery/hammock-pond.jpg',
    alt: 'The hammock nook among banana palms, with the koi pond and cabin beyond',
    feature: true,
  },
  {
    src: '/images/gallery/garden-nook-wide.jpg',
    alt: 'The garden seating nook among monstera and palms, with statues in the rockery',
  },
  {
    src: '/images/gallery/garden-chairs-buddha.jpg',
    alt: 'Two weathered chairs beside a brass bowl and a reclining Buddha',
  },

  {
    src: '/images/gallery/hammock-logs.jpg',
    alt: 'A hammock strung before a stacked log wall, prayer flags and festoon lights above',
  },
  {
    src: '/images/gallery/cabin-garden-path-dusk.jpg',
    alt: 'The cabin seen from the garden path at dusk, ferns and a Buddha on the rock',
  },
  {
    src: '/images/gallery/balcony-table-forest.jpg',
    alt: 'A table for two on the private balcony, looking into the forest',
  },

  {
    src: '/images/gallery/deck-mountain-panorama.jpg',
    alt: 'A door opening onto the deck, looking out to the Hout Bay mountains',
    feature: true,
  },
  {
    src: '/images/gallery/decks-terraces-above.jpg',
    alt: 'Looking down over the terraced decks and walkways threading between the pines',
  },
  {
    src: '/images/gallery/hot-tub-deck-pool-view.jpg',
    alt: 'The hot tub set into the upper deck, the pool and pergola below',
  },

  {
    src: '/images/gallery/sun-deck-loungers.jpg',
    alt: 'Moulded loungers on the upper sun deck, the cabins beyond through the trees',
  },
  {
    src: '/images/gallery/deck-walkway.jpg',
    alt: 'The timber walkway running along the studio between the trees',
  },
  {
    src: '/images/gallery/hout-bay-ridge.jpg',
    alt: 'The rocky Hout Bay ridge rising above the indigenous bush and pines',
  },

  /* ── Inside ───────────────────────────────────────────────────────────────
   * Opens on the threshold shot — doors folded right back, the inside glowing —
   * so the move from grounds to interiors reads as stepping through, then the
   * shala, then the living spaces, and finally the details. */
  {
    src: '/images/gallery/exterior-dusk-open-wide.jpg',
    alt: 'The bifolds folded right back at dusk, kitchen and fire glowing, pergola lounge beyond',
    feature: true,
  },
  {
    src: '/images/gallery/living-swivel-chair-deck.jpg',
    alt: 'A swivel chair by the open doors, the writing desk and carved mirror beyond',
  },
  {
    src: '/images/gallery/dining-stove-deck-dusk.jpg',
    alt: 'Dining chairs along the counter, the stove lit and the deck open to the pines',
  },

  {
    src: '/images/gallery/shala-singing-bowls.jpg',
    alt: 'The Oasis Studio, crystal singing bowls and a salt lamp on wide timber floors',
    feature: true,
  },
  {
    src: '/images/gallery/shala-bowls-candles.jpg',
    alt: 'Seven crystal singing bowls on lace, with candles, a brass bell and a tray of feathers and sage',
  },
  {
    src: IMAGES.sauna,
    alt: 'Inside the cedar sauna, infrared panels glowing and towels on the bench',
  },

  {
    src: '/images/gallery/living-island-bifolds-open.jpg',
    alt: 'The kitchen island with the whole wall folded open onto the deck and forest',
    feature: true,
  },
  {
    src: '/images/gallery/living-island-proteas-dusk.jpg',
    alt: 'Proteas on the island, the stove lit and the doors open to the trees at dusk',
  },
  {
    src: '/images/gallery/living-loft-mezzanine.jpg',
    alt: 'The open-plan living under the glass-railed mezzanine, desk on the far wall',
  },

  {
    src: '/images/gallery/living-open-deck-daylight.jpg',
    alt: 'The living room with the bifolds folded right back, the Hout Bay mountains straight ahead',
    feature: true,
  },
  {
    src: '/images/gallery/living-tv-bifolds-mountain.jpg',
    alt: 'The television on its slatted timber panel, doors open to the deck and the ridge',
  },
  {
    src: '/images/gallery/living-stove-mountain.jpg',
    alt: 'The wood stove lit beside the leather sofa, glass framing the mountains',
  },

  {
    src: '/images/gallery/living-vaulted-wide.jpg',
    alt: 'The full vaulted living room, mezzanine and white stair with the kitchen beyond',
    feature: true,
  },
  {
    src: '/images/gallery/living-sectional-stove.jpg',
    alt: 'The leather sectional and live-edge table on a cowhide rug, stove lit alongside',
  },
  {
    src: '/images/gallery/living-from-mezzanine.jpg',
    alt: 'Looking straight down from the mezzanine onto the sofa and live-edge table',
  },

  {
    src: '/images/gallery/living-stair-mezzanine.jpg',
    alt: 'The white staircase climbing to the glass-railed mezzanine, kitchen beyond',
  },
  {
    src: '/images/gallery/wood-stove-armchair.jpg',
    alt: 'The wood-burning stove lit beside an armchair and a basket of firewood',
  },
  {
    src: '/images/gallery/sofa-detail.jpg',
    alt: 'A rolled towel and embroidered pouffe beside the sofa on timber floors',
  },

  {
    src: '/images/gallery/kitchen-living-fire.jpg',
    alt: 'The kitchen island and bar stools under the mezzanine, fire burning alongside',
    feature: true,
  },
  {
    src: '/images/gallery/kitchen-stove-beanbag.jpg',
    alt: 'The stove lit beside the island, a felted beanbag pulled up to the warmth',
  },
  {
    src: '/images/gallery/kitchen-peninsula-stove.jpg',
    alt: 'Live-edge stools at the peninsula, the stove lit and firewood stacked alongside',
  },

  {
    src: '/images/gallery/kitchen-island-orchid.jpg',
    alt: 'The island head-on, an orchid on the counter and the gas range behind',
  },
  {
    src: '/images/gallery/kitchen-peninsula-pothos.jpg',
    alt: 'The kitchen seen from the living room, trailing pothos framing the view',
  },
  {
    src: '/images/gallery/kitchen-counter-orchid.jpg',
    alt: 'The counter close up — orchid, subway tile and a welcome card for guests',
  },

  {
    src: '/images/gallery/kitchen-island-stools.jpg',
    alt: 'Four upholstered stools at the timber-topped island, shelves lit above',
  },
  {
    src: '/images/gallery/kitchen-island-front.jpg',
    alt: 'The island seen from the living room, spiral stair rising to the loft',
  },
  {
    src: '/images/gallery/kitchen-range-stair.jpg',
    alt: 'The gas range and coffee station, spiral stair to the loft alongside',
  },

  {
    src: '/images/gallery/living-peninsula-terracotta.jpg',
    alt: 'Live-edge stools at the white breakfast peninsula, sage and terracotta walls under the beamed ceiling',
    feature: true,
  },
  {
    src: '/images/gallery/kitchen-white-range-garden-door.jpg',
    alt: 'The white shaker kitchen with its gas range and bevelled tile, the door open to the garden',
  },
  {
    src: '/images/gallery/scullery-brass-tap-garden-door.jpg',
    alt: 'The scullery — brass tap over a farmhouse sink, laundry alongside and the door open to the deck',
  },

  {
    src: '/images/gallery/kitchen-range-detail.jpg',
    alt: 'Open shelving above the range, kettle and coffee machine on the timber top',
  },
  {
    src: '/images/gallery/kitchen-kettle-detail.jpg',
    alt: 'A black kettle and utensil pot on the butcher-block counter',
  },
  {
    src: '/images/gallery/desk-marshall-detail.jpg',
    alt: 'A Marshall speaker, brass lamp and an open book on the writing desk',
  },

  {
    src: '/images/gallery/desk-forest-doors.jpg',
    alt: 'A writing desk beside glass doors opening onto the deck and trees',
    feature: true,
  },
  {
    src: '/images/gallery/desk-overhead.jpg',
    alt: 'The desk from above, sheepskin chair on a jute rug beside the open door',
  },
  {
    src: '/images/gallery/desk-nook-fridge.jpg',
    alt: 'The desk nook and its carved mirror, beside the island and the fridge',
  },

  {
    src: '/images/gallery/living-aframe-gable-wide.jpg',
    alt: 'The full height of the A-frame, glazed gable and loft above the island',
    feature: true,
  },
  {
    src: '/images/gallery/loft-gable-windows.jpg',
    alt: 'The A-frame loft, its glazed gable looking straight into the pines',
  },
  {
    src: '/images/gallery/loft-chandelier.jpg',
    alt: 'The loft looking down through the gable, antler chandelier at the apex',
  },

  {
    src: '/images/gallery/loft-sofa.jpg',
    alt: 'The corner sofa in the loft beneath the timber rafters',
  },
  {
    src: '/images/gallery/loft-record-player.jpg',
    alt: 'A record player and sofa in the loft, forest through the windows',
  },
  {
    src: '/images/gallery/loft-armchair-detail.jpg',
    alt: 'The loft armchair with a woven throw, a succulent on the tripod side table',
  },

  /* ── Sleeping and bathing ───────────────────────────────────────────────────
   * Last on purpose: these are the most private spaces, and they are what a
   * guest pictures once the rest has already sold them on the place. */
  {
    src: '/images/gallery/loft-bedroom-length.jpg',
    alt: 'The loft bedroom down its length, terracotta A-frame beams over the bed and balcony door',
    feature: true,
  },
  {
    src: '/images/gallery/loft-nook-gable-window.jpg',
    alt: 'The reading nook in the gable, armchair framed by the triangular window and mountain',
  },
  {
    src: '/images/gallery/loft-bed-balcony-door.jpg',
    alt: 'The loft bed seen from the nook, balcony door open to the trees',
  },

  {
    src: '/images/gallery/bedroom-sage-loft-beyond.jpg',
    alt: 'A sage green bedroom opening through the A-frame to the loft nook beyond',
    feature: true,
  },
  {
    src: '/images/gallery/bedroom-loft-nook-mirror.jpg',
    alt: 'The bed with its mirrored wardrobe reflecting the room and the nook',
  },
  {
    src: '/images/gallery/bedroom-mirrored-wardrobes.jpg',
    alt: 'Mirrored sliding wardrobes along the bedroom wall, balcony door curtained beyond',
  },

  {
    src: '/images/gallery/bedroom-slatted-wall.jpg',
    alt: 'The bed against a slatted timber wall, twin lamps lit and a Persian rug underfoot',
    feature: true,
  },
  {
    src: '/images/gallery/bedroom-wood-stove.jpg',
    alt: 'The bedroom wood stove alight beside a basket of firewood',
  },
  {
    src: '/images/gallery/bedroom-open-deck-stove.jpg',
    alt: 'The bedroom with its glass wall slid fully open to the deck, stove lit and mountains beyond',
  },

  {
    src: '/images/gallery/bedroom-balcony-bistro.jpg',
    alt: 'The bedroom door open to a private balcony and its bistro table for two',
  },
  {
    src: '/images/gallery/bedroom-deck-mountain.jpg',
    alt: 'The bed looking out past the timber balustrade to the Hout Bay ridge',
  },
  {
    src: '/images/gallery/bathroom-vanity-bath-wide.jpg',
    alt: 'The ensuite — antique timber vanity, black stone basin and freestanding bath on pebbles',
  },

  {
    src: '/images/gallery/bathroom-vanity-basin.jpg',
    alt: 'The black stone basin on its timber washstand, amenities on a slim black shelf',
  },
  {
    src: '/images/gallery/bathroom-bath-rain-shower.jpg',
    alt: 'The black bath beside the rain shower, blinds open to the pines',
  },
  {
    src: '/images/gallery/bathroom-bath-pebbles.jpg',
    alt: 'The bath from above, a fern and pebble planter alongside and towels rolled on timber',
  },

  {
    src: '/images/gallery/bathroom-charcoal-wide.jpg',
    alt: 'The charcoal bathroom — sage vanity, black rain shower behind glass and warm towels on the rail',
    feature: true,
  },
  {
    src: '/images/gallery/bathroom-rain-shower-buddha.jpg',
    alt: 'The walk-in rain shower on black hex tile, a turquoise Buddha on the window ledge beyond',
  },
  {
    src: '/images/gallery/bathroom-shelf-amenities.jpg',
    alt: 'Africology amenities and a conch shell on the timber shelf, towels folded below',
  },
]
