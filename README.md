# RenovaTuMundo - Landing Page

Professional landing page for RenovaTuMundo renovation company in Valencia, Spain.

## 📁 Project Structure

```
├── index.html                 # Main landing page
├── css/
│   └── style.css             # Main stylesheet
├── js/
│   ├── vendor/               # Third-party libraries
│   │   ├── bootstrap.bundle.min.js
│   │   ├── jquery.min.js
│   │   ├── swiper-bundle.min.js
│   │   ├── isotope.pkgd.min.js
│   │   └── fslightbox.js
│   ├── script.js             # Main JavaScript
│   ├── swiper-script.js      # Swiper configuration
│   ├── video-carousel.js     # Video carousel functionality
│   ├── estimate-form.js      # Form handling
│   └── language-detection.js # Language switching
├── image/                    # Image assets
│   ├── logo.png             # Company logo
│   ├── favicon.png          # Site favicon
│   ├── projects-*.jpg       # Project portfolio images
│   ├── clients-*.jpg        # Client testimonial images
│   └── worker-*.png         # Team/worker images
├── video/
│   └── hero-1.mp4           # Hero section background video
└── README.md                # Project documentation
```

## 🚀 Quick Start

### Prerequisites

- Modern web browser with JavaScript enabled
- Git for version control

### Local Development

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd renovatumundo-landing
   ```

2. **Open the project**

   - Open `index.html` in your browser directly, or
   - Use a local server (recommended):

     ```bash
     # Using Python
     python -m http.server 8000

     # Using Node.js
     npx serve .
     ```

3. **View the site**
   - Direct: `file:///path/to/index.html`
   - Local server: `http://localhost:8000`

## 🔧 Making Changes

### Deployment

The project is deployed on **Vercel** with automatic updates:

- **Push to main branch** → Automatic deployment
- **Pull requests** → Preview deployments
- **Live URL**: [https://renovatumundo.com]

### Content Updates

#### Text Content

- Edit directly in `index.html`
- Find sections by their IDs: `#about`, `#services`, `#portfolio`
- Update company information, prices, and descriptions

#### Images

- Replace files in `image/` directory
- Keep the same filenames for automatic updates
- Optimize images for web (recommended: WebP format)

#### Styling

- Main styles: `css/style.css`
- Bootstrap variables can be customized
- Color scheme defined in CSS custom properties

#### Interactive Features

- Form handling: `js/estimate-form.js`
- Carousel settings: `js/swiper-script.js`
- General functionality: `js/script.js`

### Development Workflow

1. **Make changes locally**
2. **Test in browser**
3. **Commit changes**
   ```bash
   git add .
   git commit -m "Update: description of changes"
   ```
4. **Push to repository**
   ```bash
   git push origin main
   ```
5. **Vercel automatically deploys** (usually takes 1-2 minutes)

### EmailJS Configuration (Optional)

To enable contact form submissions:

1. Create account at [EmailJS](https://www.emailjs.com/)
2. Update service configuration in `js/estimate-form.js`
3. Replace placeholder IDs with your EmailJS credentials

---

**Auto-deployed with Vercel** 🚀
