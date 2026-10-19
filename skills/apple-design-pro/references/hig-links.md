# HIG Links

> Links point to Apple's Human Interface Guidelines. Apple's pages are **not copied** here; read them at the source. The descriptions are the author's own. These are **native-app guidelines**: use them for principles and reasoning, and translate to the web rather than copying iOS patterns literally.
>
> **Verification status:** the slugs were derived from a list of topic file names. Each slug was checked against Apple's public content endpoint (`https://developer.apple.com/tutorials/data/design/human-interface-guidelines/<slug>.json`), which returned HTTP 200 for all of them. The public page URLs shown below were **not opened individually**. Apple renames and moves pages; if a link 404s, search the HIG index at https://developer.apple.com/design/human-interface-guidelines/. To re-check, request the JSON endpoint for each slug.

## Foundations

- [design-principles](https://developer.apple.com/design/human-interface-guidelines/design-principles) — Apple's overall design philosophy; start here for the reasoning behind the rest
- [accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) — baseline for inclusive design: vision, hearing, mobility, cognitive needs
- [color](https://developer.apple.com/design/human-interface-guidelines/color) — semantic color, contrast, and not relying on color alone
- [dark-mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode) — how a dark appearance should keep hierarchy and contrast
- [typography](https://developer.apple.com/design/human-interface-guidelines/typography) — type scale, weight, and legibility reasoning
- [layout](https://developer.apple.com/design/human-interface-guidelines/layout) — alignment, grouping, spacing, and adapting to different sizes
- [materials](https://developer.apple.com/design/human-interface-guidelines/materials) — translucency and blur as a depth and hierarchy tool
- [motion](https://developer.apple.com/design/human-interface-guidelines/motion) — when animation helps and when it distracts
- [images](https://developer.apple.com/design/human-interface-guidelines/images) — resolution, scaling, and image handling decisions
- [icons](https://developer.apple.com/design/human-interface-guidelines/icons) — when an icon communicates and when a label is needed
- [branding](https://developer.apple.com/design/human-interface-guidelines/branding) — where brand expression fits without fighting the interface
- [writing](https://developer.apple.com/design/human-interface-guidelines/writing) — tone, concision, and clarity of interface text
- [inclusion](https://developer.apple.com/design/human-interface-guidelines/inclusion) — language and imagery that works for a wide audience
- [privacy](https://developer.apple.com/design/human-interface-guidelines/privacy) — asking for data at the right moment and only what is needed
- [right-to-left](https://developer.apple.com/design/human-interface-guidelines/right-to-left) — mirroring layouts for RTL languages
- [sf-symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols) — Apple's icon set; useful for seeing how weights and sizes pair with text
- [app-icons](https://developer.apple.com/design/human-interface-guidelines/app-icons) — icon design principles; background reading for favicons and touch icons

## Patterns

- [feedback](https://developer.apple.com/design/human-interface-guidelines/feedback) — kinds of feedback and how to communicate status, success and errors
- [loading](https://developer.apple.com/design/human-interface-guidelines/loading) — showing progress and avoiding dead waiting states
- [modality](https://developer.apple.com/design/human-interface-guidelines/modality) — when to interrupt the user with a modal and how to keep it dismissible
- [onboarding](https://developer.apple.com/design/human-interface-guidelines/onboarding) — introducing a product without a wall of instructions
- [entering-data](https://developer.apple.com/design/human-interface-guidelines/entering-data) — reducing typing effort and making forms forgiving
- [searching](https://developer.apple.com/design/human-interface-guidelines/searching) — search entry, suggestions and results
- [undo-and-redo](https://developer.apple.com/design/human-interface-guidelines/undo-and-redo) — forgiving mistakes instead of asking for confirmation
- [drag-and-drop](https://developer.apple.com/design/human-interface-guidelines/drag-and-drop) — direct manipulation of items and what feedback it needs
- [launching](https://developer.apple.com/design/human-interface-guidelines/launching) — first-impression behavior when an app opens
- [managing-accounts](https://developer.apple.com/design/human-interface-guidelines/managing-accounts) — sign-in and account flows with less friction
- [managing-notifications](https://developer.apple.com/design/human-interface-guidelines/managing-notifications) — notification etiquette and permission timing
- [settings](https://developer.apple.com/design/human-interface-guidelines/settings) — what to expose as a setting and what to decide for the user
- [offering-help](https://developer.apple.com/design/human-interface-guidelines/offering-help) — contextual help and discoverability
- [collaboration-and-sharing](https://developer.apple.com/design/human-interface-guidelines/collaboration-and-sharing) — sharing flows and shared-content expectations
- [file-management](https://developer.apple.com/design/human-interface-guidelines/file-management) — handling documents and user content
- [generative-ai](https://developer.apple.com/design/human-interface-guidelines/generative-ai) — designing around AI output, uncertainty and user control
- [ratings-and-reviews](https://developer.apple.com/design/human-interface-guidelines/ratings-and-reviews) — asking for ratings without annoying people

## Components: structure and navigation

- [sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars) — persistent navigation for larger layouts
- [tab-bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars) — top-level navigation between a few sections
- [toolbars](https://developer.apple.com/design/human-interface-guidelines/toolbars) — frequently used actions grouped near the content
- [split-views](https://developer.apple.com/design/human-interface-guidelines/split-views) — multi-pane layouts
- [tab-views](https://developer.apple.com/design/human-interface-guidelines/tab-views) — switching between peer content views
- [page-controls](https://developer.apple.com/design/human-interface-guidelines/page-controls) — paging indicators for sequential views
- [scroll-views](https://developer.apple.com/design/human-interface-guidelines/scroll-views) — scrolling behavior, edges and indicators
- [collections](https://developer.apple.com/design/human-interface-guidelines/collections) — grids and galleries of items
- [lists-and-tables](https://developer.apple.com/design/human-interface-guidelines/lists-and-tables) — dense, scannable rows of information
- [outline-views](https://developer.apple.com/design/human-interface-guidelines/outline-views) — hierarchical, expandable data
- [column-views](https://developer.apple.com/design/human-interface-guidelines/column-views) — browsing nested content in columns
- [boxes](https://developer.apple.com/design/human-interface-guidelines/boxes) — grouping related content visually
- [disclosure-controls](https://developer.apple.com/design/human-interface-guidelines/disclosure-controls) — expand and collapse patterns
- [windows](https://developer.apple.com/design/human-interface-guidelines/windows) — window behavior, useful for thinking about dialogs and panels on desktop web
- [panels](https://developer.apple.com/design/human-interface-guidelines/panels) — auxiliary surfaces next to the main content

## Components: presentation

- [sheets](https://developer.apple.com/design/human-interface-guidelines/sheets) — secondary tasks presented over the main content
- [alerts](https://developer.apple.com/design/human-interface-guidelines/alerts) — short, rare interruptions that need a decision
- [action-sheets](https://developer.apple.com/design/human-interface-guidelines/action-sheets) — choosing between a few actions after a user trigger
- [popovers](https://developer.apple.com/design/human-interface-guidelines/popovers) — transient content anchored to its trigger
- [activity-views](https://developer.apple.com/design/human-interface-guidelines/activity-views) — share and action menus
- [web-views](https://developer.apple.com/design/human-interface-guidelines/web-views) — embedding web content inside an app

## Components: menus and buttons

- [buttons](https://developer.apple.com/design/human-interface-guidelines/buttons) — button hierarchy, labeling, size and role
- [menus](https://developer.apple.com/design/human-interface-guidelines/menus) — menu structure and what belongs in one
- [context-menus](https://developer.apple.com/design/human-interface-guidelines/context-menus) — secondary actions on demand
- [pull-down-buttons](https://developer.apple.com/design/human-interface-guidelines/pull-down-buttons) — a button that reveals related actions
- [pop-up-buttons](https://developer.apple.com/design/human-interface-guidelines/pop-up-buttons) — choosing one value from a list
- [edit-menus](https://developer.apple.com/design/human-interface-guidelines/edit-menus) — cut, copy, paste and selection commands
- [the-menu-bar](https://developer.apple.com/design/human-interface-guidelines/the-menu-bar) — desktop menu conventions
- [dock-menus](https://developer.apple.com/design/human-interface-guidelines/dock-menus) — app-level shortcuts on desktop
- [home-screen-quick-actions](https://developer.apple.com/design/human-interface-guidelines/home-screen-quick-actions) — shortcuts from an icon; analog to PWA shortcuts

## Components: selection and input

- [toggles](https://developer.apple.com/design/human-interface-guidelines/toggles) — on/off switches and what their labels should say
- [segmented-controls](https://developer.apple.com/design/human-interface-guidelines/segmented-controls) — choosing between a few mutually exclusive views
- [sliders](https://developer.apple.com/design/human-interface-guidelines/sliders) — continuous value selection with direct manipulation
- [steppers](https://developer.apple.com/design/human-interface-guidelines/steppers) — incremental value changes
- [pickers](https://developer.apple.com/design/human-interface-guidelines/pickers) — selecting from lists or dates
- [text-fields](https://developer.apple.com/design/human-interface-guidelines/text-fields) — single-line input behavior and affordances
- [text-views](https://developer.apple.com/design/human-interface-guidelines/text-views) — multi-line text input
- [search-fields](https://developer.apple.com/design/human-interface-guidelines/search-fields) — search input design
- [combo-boxes](https://developer.apple.com/design/human-interface-guidelines/combo-boxes) — typing or choosing from suggestions
- [token-fields](https://developer.apple.com/design/human-interface-guidelines/token-fields) — entering multiple discrete values
- [color-wells](https://developer.apple.com/design/human-interface-guidelines/color-wells) — color selection controls
- [image-wells](https://developer.apple.com/design/human-interface-guidelines/image-wells) — drop zones for images
- [path-controls](https://developer.apple.com/design/human-interface-guidelines/path-controls) — breadcrumb-style location display
- [labels](https://developer.apple.com/design/human-interface-guidelines/labels) — static text that describes controls
- [virtual-keyboards](https://developer.apple.com/design/human-interface-guidelines/virtual-keyboards) — keyboard types and what to request for each input
- [focus-and-selection](https://developer.apple.com/design/human-interface-guidelines/focus-and-selection) — how focus moves and how selection is shown

## Components: status and content

- [progress-indicators](https://developer.apple.com/design/human-interface-guidelines/progress-indicators) — determinate and indeterminate progress
- [gauges](https://developer.apple.com/design/human-interface-guidelines/gauges) — showing a value within a range
- [rating-indicators](https://developer.apple.com/design/human-interface-guidelines/rating-indicators) — star-style rating display
- [charts](https://developer.apple.com/design/human-interface-guidelines/charts) — presenting data visually with clarity
- [charting-data](https://developer.apple.com/design/human-interface-guidelines/charting-data) — choosing and annotating a chart
- [image-views](https://developer.apple.com/design/human-interface-guidelines/image-views) — displaying images within the layout
- [widgets](https://developer.apple.com/design/human-interface-guidelines/widgets) — glanceable content surfaces
- [live-activities](https://developer.apple.com/design/human-interface-guidelines/live-activities) — real-time status surfaces
- [status-bars](https://developer.apple.com/design/human-interface-guidelines/status-bars) — system status area and its content rules
- [snippets](https://developer.apple.com/design/human-interface-guidelines/snippets) — compact result surfaces

## Inputs and interaction

- [gestures](https://developer.apple.com/design/human-interface-guidelines/gestures) — standard gestures and what people expect them to do
- [keyboards](https://developer.apple.com/design/human-interface-guidelines/keyboards) — keyboard shortcuts and hardware keyboard support
- [pointing-devices](https://developer.apple.com/design/human-interface-guidelines/pointing-devices) — pointer behavior, hover and precision
- [playing-haptics](https://developer.apple.com/design/human-interface-guidelines/playing-haptics) — tactile feedback principles; for web, the Vibration API is limited
- [playing-audio](https://developer.apple.com/design/human-interface-guidelines/playing-audio) — sound design and audio feedback
- [playing-video](https://developer.apple.com/design/human-interface-guidelines/playing-video) — video playback controls and behavior
- [controls](https://developer.apple.com/design/human-interface-guidelines/controls) — overview of control types and when to use which
- [voiceover](https://developer.apple.com/design/human-interface-guidelines/voiceover) — screen reader behavior; background for ARIA decisions
- [multitasking](https://developer.apple.com/design/human-interface-guidelines/multitasking) — behaving well when space and focus change
- [designing-for-ios](https://developer.apple.com/design/human-interface-guidelines/designing-for-ios) — how an iPhone-first product thinks about content and hierarchy
- [designing-for-ipados](https://developer.apple.com/design/human-interface-guidelines/designing-for-ipados) — larger touch screens and pointer support
- [designing-for-macos](https://developer.apple.com/design/human-interface-guidelines/designing-for-macos) — desktop conventions for dense, pointer-driven work

## Less relevant for websites (native or hardware specific)

Listed for completeness, without commentary: 
[airplay](https://developer.apple.com/design/human-interface-guidelines/airplay), [app-clips](https://developer.apple.com/design/human-interface-guidelines/app-clips), [app-shortcuts](https://developer.apple.com/design/human-interface-guidelines/app-shortcuts), [apple-in-app-purchase](https://developer.apple.com/design/human-interface-guidelines/apple-in-app-purchase), [apple-pay](https://developer.apple.com/design/human-interface-guidelines/apple-pay), [apple-pencil-and-scribble](https://developer.apple.com/design/human-interface-guidelines/apple-pencil-and-scribble), [augmented-reality](https://developer.apple.com/design/human-interface-guidelines/augmented-reality), [designing-for-games](https://developer.apple.com/design/human-interface-guidelines/designing-for-games), [designing-for-iphone-duo](https://developer.apple.com/design/human-interface-guidelines/designing-for-iphone-duo), [game-controls](https://developer.apple.com/design/human-interface-guidelines/game-controls), [going-full-screen](https://developer.apple.com/design/human-interface-guidelines/going-full-screen), [gyro-and-accelerometer](https://developer.apple.com/design/human-interface-guidelines/gyro-and-accelerometer), [icloud](https://developer.apple.com/design/human-interface-guidelines/icloud), [live-viewing-apps](https://developer.apple.com/design/human-interface-guidelines/live-viewing-apps), [machine-learning](https://developer.apple.com/design/human-interface-guidelines/machine-learning), [maps](https://developer.apple.com/design/human-interface-guidelines/maps), [nfc](https://developer.apple.com/design/human-interface-guidelines/nfc), [notifications](https://developer.apple.com/design/human-interface-guidelines/notifications), [printing](https://developer.apple.com/design/human-interface-guidelines/printing), [siri](https://developer.apple.com/design/human-interface-guidelines/siri), [sign-in-with-apple](https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple)

Note: the `liquid-glass` slug did not resolve on the content endpoint (HTTP 404) and is intentionally not linked. For Apple's current material system, read [materials](https://developer.apple.com/design/human-interface-guidelines/materials).
