# GOR MENSWEAR Image Directory Guide

Drop your custom high-resolution product photos, lookbook shots, and brand assets into these dedicated folders:

## 📁 Directory Layout

```
frontend/public/images/
├── products/       ← Put product photos here (e.g., navy-blazer.jpg, silk-shirt.png)
├── categories/     ← Put category cards banner images here (e.g., outerwear.jpg, footwear.jpg)
├── lookbook/       ← Put Instagram / Lookbook grid photos here (e.g., look-1.jpg)
└── brand/          ← Put custom logo SVG, watermarks, or badges here
```

## 📸 How to Use Images in Your Website Code

Whenever you place an image inside `frontend/public/images/products/my-jacket.jpg`, you can reference it in your code using the path:

```javascript
"/images/products/my-jacket.jpg"
```

### Example in `backend/db.js` / Database:
```javascript
images: [
  "/images/products/my-jacket-front.jpg",
  "/images/products/my-jacket-back.jpg"
]
```

### Example in React Component (`<img>` or Next `<Image>`):
```jsx
<img src="/images/products/my-jacket.jpg" alt="Savile Cashmere Blazer" />
```
