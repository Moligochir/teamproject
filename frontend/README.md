# Хэлний Орчуулга / Language Translation Setup

## 🇲🇳 Монгол хэлээр

### Суулгалт

1. **Файлуудыг хуулах:**
   - `LanguageContext.tsx` - Context Provider
   - `Navbar.jsx` - Шинэчилсэн Navbar
   - `Home.tsx` - Шинэчилсэн Home page

2. **Layout файлыг шинэчлэх:**

   ```tsx
   // app/layout.tsx эсвэл _app.tsx
   import { LanguageProvider } from "./LanguageContext";

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           <LanguageProvider>
             <Navbar />
             {children}
           </LanguageProvider>
         </body>
       </html>
     );
   }
   ```

3. **Бусад хуудсанд ашиглах:**

   ```tsx
   import { useLanguage } from "./LanguageContext";

   export default function MyPage() {
     const { language } = useLanguage();

     const translations = {
       mn: { title: "Гарчиг" },
       en: { title: "Title" },
     };

     return <h1>{translations[language].title}</h1>;
   }
   ```

### Хэрхэн ажилладаг

- **EN** товч дарахад: Монгол → English
- **МОН** товч дарахад: English → Монгол
- Navbar болон Home page автоматаар хамтдаа солигдоно

### Файлын бүтэц

```
├── LanguageContext.tsx    # Хэлний төлөв удирдах Context
├── Navbar.jsx            # Орчуулгатай Navbar
├── Home.tsx              # Орчуулгатай Home page
└── layout-example.tsx    # Layout жишээ
```

---

## 🇬🇧 In English

### Installation

1. **Copy the files:**
   - `LanguageContext.tsx` - Context Provider
   - `Navbar.jsx` - Updated Navbar
   - `Home.tsx` - Updated Home page

2. **Update your Layout file:**

   ```tsx
   // app/layout.tsx or _app.tsx
   import { LanguageProvider } from "./LanguageContext";

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           <LanguageProvider>
             <Navbar />
             {children}
           </LanguageProvider>
         </body>
       </html>
     );
   }
   ```

3. **Use in other pages:**

   ```tsx
   import { useLanguage } from "./LanguageContext";

   export default function MyPage() {
     const { language } = useLanguage();

     const translations = {
       mn: { title: "Гарчиг" },
       en: { title: "Title" },
     };

     return <h1>{translations[language].title}</h1>;
   }
   ```

### How it works

- **Click EN button**: Mongolian → English
- **Click МОН button**: English → Mongolian
- Navbar and Home page automatically sync together

### File Structure

```
├── LanguageContext.tsx    # Language state management
├── Navbar.jsx            # Navbar with translations
├── Home.tsx              # Home page with translations
└── layout-example.tsx    # Layout example
```

---

## 🎯 Key Features / Онцлог шинж чанарууд

✅ Navbar болон Home хоёр хамтдаа солигдоно / Navbar and Home sync together  
✅ Бусад хуудсанд амархан нэмэх боломжтой / Easy to add to other pages  
✅ Хэлний төлөв бүх компонентод хуваалцагддаг / Language state shared across components  
✅ TypeScript дэмжлэгтэй / TypeScript support

## 📝 Adding More Pages / Өөр хуудас нэмэх

Аль ч хуудсанд орчуулга нэмэхийн тулд / To add translation to any page:

```tsx
import { useLanguage } from "./LanguageContext";

const { language } = useLanguage();

const translations = {
  mn: {
    /* Монгол текстүүд */
  },
  en: {
    /* English texts */
  },
};

const t = translations[language];
```
