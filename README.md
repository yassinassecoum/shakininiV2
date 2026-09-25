# Shakinini 🍓

A web app for ordering shakers: pick your base, add your ingredients,
watch the shaker fill up in 3D with live calories and macros,
then confirm to get a QR code containing the order summary.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:5173

Production build: `npm run build` (output in `dist/`).

## Stack

- React 18 + Vite 5
- three.js via @react-three/fiber and @react-three/drei (3D shaker)
- qrcode.react (QR code)

## Flow (kiosk mode)

1. **Welcome**: choose "Eat in" or "Takeaway".
2. **Base**: size (250 / 350 / 500 ml) + liquid.
3. **Add-ons**: categories in the left rail, tap a tile to add a serving.
4. **Summary**: editable quantities, first name, confirmation.
5. **Order ready**: summary table, order number + QR code (all 3 steps are ticked at the bottom).

The logo is centred at the top; the steps, the total and the "Continue" button live in the bottom bar.
On mobile, the 3D shaker opens as a sheet when you tap the total in the bottom bar.

## Structure

```
src/
  data/ingredients.js       Catalogue: bases, add-ons, categories, prices, nutrition
  utils/nutrition.js        Calculations (calories, macros, price, mix colour, QR text)
  hooks/useAnimatedNumber.js Animated calorie counter
  components/
    Welcome.jsx             Welcome screen
    KioskHeader.jsx         Header (back, centred logo, mode)
    BottomBar.jsx           Bottom bar (cancel, steps, total, continue)
    BaseStep.jsx            Step 1: size + base
    AddonsStep.jsx          Step 2: category rail + tiles
    AddonTile.jsx           Ingredient tile (+/−, "+kcal" animation)
    SummaryStep.jsx         Step 3: editable summary + first name
    DoneStep.jsx            Order ready: table + QR ticket
    LivePanel.jsx           3D shaker + nutrition (column or mobile sheet)
    ShakerScene.jsx         3D scene
    NutritionPanel.jsx      Calories, macros, price
    ConfirmDialog.jsx       Cancel confirmation
    Logo.jsx, QtyControl.jsx
  App.jsx                   Screens, steps and order state
  index.css                 Styles
```

## Customising

The whole catalogue lives in `src/data/ingredients.js`:

- **Bases**: values per 100 ml, multiplied by the chosen volume.
- **Add-ons**: values for one serving (`portion`), `max` = number of servings allowed.
- `color` / `tint`: the ingredient's colour and its weight in the final colour of the 3D liquid.
- `particle: true`: the ingredient shows up as chunks floating in the shaker.
- `BASE_PRICE`, `VOLUMES`, `SHAKER_CAPACITY_ML` for prices and volumes.

Nutritional values are indicative averages (Ciqual tables / common product labels).

## The QR code

It contains plain text (order number, first name, date, ingredients, calories, macros, price),
readable by any QR code scanner without a dedicated app.
To hook up a real back office later, you can replace this text with JSON
or a URL like `https://your-site/order/SK-XXXXX` in `orderSummaryText()`.

## Art direction

Style of the very first version, as an app:
blueberry ink `#1E1B4B`, banana yellow `#FFD84D`, strawberry `#FF5A6E`, oat `#EFE8DA`, milk background `#F5F6FA`.
Headings and numbers in condensed Bricolage Grotesque, body text in DM Sans.
Blueberry primary buttons with a banana shadow, clearly numbered step pills in the bottom bar,
blueberry calorie panel with a macro split bar, final ticket with a dashed border and the QR on a banana background.




https://vendmachinery.com/protein-shake-vending-machine/
