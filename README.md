# અનંત હોમિયોપેથી ક્લિનિક

Official website for **અનંત હોમિયોપેથી ક્લિનિક** (Anant Homoeopathy Clinic) by **ડૉ. જીગ્નેશ મકવાણા** (B.H.M.S., S.C.P.H.).

## Live Website

Hosted on GitHub Pages: `https://ananthomeopathy.github.io/anantHomeopathy/`

---

## Project Structure

```
Anant_homeopathy_clinic/
├── index.html              # Main website page
├── css/
│   └── style.css           # All styles
├── js/
│   ├── main.js             # JavaScript functionality
│   ├── videos.json         # YouTube videos data (EDIT THIS)
│   └── reels.json          # Instagram Reels data (EDIT THIS)
├── blog/
│   └── posts.json          # Blog posts data (EDIT THIS)
├── assets/
│   └── images/             # All images
└── README.md               # This file
```
---

## How to Add / Edit Content

### 1. Adding a New Blog Post

1. **Add your blog image** to the `assets/images/` folder (e.g., `my-blog-image.jpg`)
2. **Open** `blog/posts.json` in any text editor
3. **Add a new entry** at the TOP of the list (before the first `{`):

```json
[
    {
        "title": "તમારા બ્લોગ પોસ્ટનું શીર્ષક અહીં",
        "excerpt": "કાર્ડ પર દેખાશે તેવો 1-2 વાક્યનો ટૂંકો સારાંશ.",
        "date": "માર્ચ 25, 2026",
        "image": "assets/images/my-blog-image.jpg",
        "content": "અહીં તમારો પૂરો બ્લોગ લેખ લખો. આ 'વધુ વાંચો' બટન ક્લિક કરવા પર દેખાશે.\n\nનવી લાઈન માટે \\n વાપરો.\n\n• બુલેટ પોઈન્ટ માટે • વાપરો."
    },
    ... (existing posts below)
]
```

**Fields explained:**
| Field     | What to write                                                                 |
|-----------|-------------------------------------------------------------------------------|
| `title`   | બ્લોગ પોસ્ટનું શીર્ષક (Gujarati or English)                                   |
| `excerpt` | ટૂંકો સારાંશ (1-2 વાક્ય) - કાર્ડ પર દેખાય છે                                 |
| `date`    | તારીખ: "માર્ચ 20, 2026" ફોર્મેટમાં                                            |
| `image`   | ઈમેજ પાથ: `assets/images/your-image.jpg` (images ફોલ્ડરમાં મૂકો)              |
| `content` | પૂરો લેખ - "વધુ વાંચો" ક્લિક કરવા પર પોપઅપમાં દેખાય છે. `\n` = નવી લાઈન     |

4. **Save** the file
5. **Commit and push** to GitHub (see "How to Deploy" section below)

---

### 2. Adding a YouTube Video

1. **Open** `js/videos.json` in any text editor
2. **Add a new entry** at the top:

```json
[
    {
        "title": "વિડિયોનું શીર્ષક અહીં",
        "url": "https://www.youtube.com/watch?v=VIDEO_ID"
    },
    ... (existing videos below)
]
```

**YouTube URL કેવી રીતે મેળવવો:**
1. YouTube વિડિયો પર જાઓ
2. વિડિયો નીચે **Share** બટન ક્લિક કરો
3. લિંક કૉપી કરો (e.g., `https://youtu.be/abc123`)
4. `url` ફીલ્ડમાં પેસ્ટ કરો

**Supported URL formats:**
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://youtube.com/shorts/VIDEO_ID` (Shorts supported!)
- `https://www.youtube.com/embed/VIDEO_ID`

3. **Save** the file
4. **Commit and push** to GitHub

---

### 3. Adding an Instagram Reel

1. **Open** `js/reels.json` in any text editor
2. **Add a new entry** at the top:

```json
[
    {
        "title": "રીલનું શીર્ષક અહીં",
        "url": "https://www.instagram.com/reel/REEL_ID/"
    },
    ... (existing reels below)
]
```

**Instagram Reel URL કેવી રીતે મેળવવો:**
1. Instagram પર રીલ ખોલો
2. રીલ પર **⋯** (three dots) ક્લિક કરો
3. **Link Copy** / **Copy Link** ક્લિક કરો
4. `url` ફીલ્ડમાં પેસ્ટ કરો

**Supported URL format:**
- `https://www.instagram.com/reel/REEL_ID/`

3. **Save** the file
4. **Commit and push** to GitHub

---

### 4. Adding / Changing Images

1. **ઈમેજ** `assets/images/` ફોલ્ડરમાં મૂકો
2. `assets/images/your-image-name.jpg` પાથ વાપરો

**Tips:**
- ઈમેજ સાઈઝ 500KB થી ઓછી રાખો (ઝડપી લોડિંગ માટે)
- ફોટો માટે `.jpg` અથવા `.webp` ફોર્મેટ વાપરો
- લોગો માટે `.png` વાપરો
- ફાઈલ નામમાં space ન વાપરો (hyphens વાપરો: `my-image.jpg`)

---

### 5. Editing Clinic Information

ફોન નંબર, સરનામું, સમય, અથવા અન્ય ક્લિનિક વિગતો અપડેટ કરવા:

1. `index.html` ટેક્સ્ટ એડિટરમાં ખોલો
2. જે ટેક્સ્ટ બદલવું છે તે શોધો (e.g., ફોન નંબર શોધો)
3. ટેક્સ્ટ અપડેટ કરો
4. Save કરો અને GitHub પર push કરો

---

## Quick Reference

| હું આ કરવા માંગું છું...     | આ ફાઈલ એડિટ કરો     | પછી...                      |
|------------------------------|----------------------|-----------------------------|
| બ્લોગ પોસ્ટ ઉમેરો            | `blog/posts.json`    | GitHub પર Push કરો          |
| YouTube વિડિયો ઉમેરો         | `js/videos.json`     | GitHub પર Push કરો          |
| Instagram રીલ ઉમેરો          | `js/reels.json`      | GitHub પર Push કરો          |
| ઈમેજ ઉમેરો                   | `assets/images/`     | ફાઈલ અપલોડ, Push કરો       |
| ક્લિનિક માહિતી બદલો         | `index.html`         | GitHub પર Push કરો          |
| વેબસાઈટ સ્ટાઈલ બદલો         | `css/style.css`      | GitHub પર Push કરો          |

---

## Contact

- **ડૉ. જીગ્નેશ મકવાણા**
- ફોન: +91 97732 73169 / +91 92747 43169
- ઈમેઈલ: ananthomeopathy01@gmail.com
- Instagram: [@anant_homoeopathy](https://www.instagram.com/anant_homoeopathy)
- Location: [Google Maps](https://maps.app.goo.gl/4vAHgqCaqWVkmEkP9)
