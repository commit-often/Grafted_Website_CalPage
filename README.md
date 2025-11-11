# Hebrew Calendar Script

A responsive Hebrew calendar for WordPress websites that displays Hebrew holidays, Torah portions, and custom blog post events. Built with FullCalendar v5.11.3 and the Hebcal API.

## Features

- ✅ **Responsive Design** - Works perfectly on Desktop, Tablet, and Mobile devices
- ✅ **Hebrew Events** - Automatically fetches holidays and Torah portions from Hebcal API
- ✅ **Custom Blog Posts** - Add your own events that link to blog posts
- ✅ **Interactive** - Hover tooltips, clickable events, and multiple view modes
- ✅ **Color-Coded** - Different colors for Torah portions, holidays, and blog posts
- ✅ **Lightweight** - Uses CDN links, no heavy plugins needed

## Installation

### Step 1: Copy the Calendar Script

1. Open the `Calendar.js` file in this repository
2. Copy **ALL** the code (all 262 lines)

### Step 2: Add to WordPress

1. Log in to your WordPress admin panel
2. Go to the page where you want the calendar to appear
3. Click **Edit** (using your page builder - e.g., WPBakery, Elementor, etc.)
4. Add a **Custom HTML** block
5. Paste the entire calendar code into the Custom HTML block

![WPBakery Custom HTML Block](Calendar_Page_Example.png)

### Step 3: Save & Publish

Click **Save** and then **Publish**. Your calendar should now appear on your page!

## Customizing the Calendar

### Change Calendar Dimensions

Located near the top of the `<style>` section (around line 155):

```css
#hebrew-calendar {
  max-width: 1100px !important;  /* Change maximum width */
  height: 550px;                 /* Change height for desktop */
}
```

**Responsive Sizes by Device:**

- **Desktop (1024px+)**: `max-width: 1100px` & `height: 550px`
- **Tablet (768px-1023px)**: `max-width: 95%` & `height: 500px`
- **Mobile (<768px)**: `max-width: 100%` & `height: auto`

### Change Calendar Colors & Styling

In the `<style>` section, you can modify:

```css
/* Border & Shadow */
#hebrew-calendar {
  border: 2px solid #333;              /* Change border color/width */
  border-radius: 8px;                  /* Change rounded corners */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);  /* Change shadow */
}

/* Hover Effect */
#hebrew-calendar:hover {
  box-shadow: 0 4px 15px rgba(168, 23, 16, 0.6);  /* Hover shadow color */
}
```

### Event Colors

These can be modified in the `events:` callback function (around line 42):

```javascript
if (item.category === 'holiday') {
  eventColor = '#e74c3c'; // Red for holidays - CHANGE THIS
} else if (item.category === 'parashat') {
  eventColor = '#3498db'; // Blue for Torah portions - CHANGE THIS
}
```

**Legend Colors** (matching event colors, around line 122):

```html
<div><span style="background: #3498db;"></span>Torah Portions</div>
<div><span style="background: #e74c3c;"></span>Holidays</div>
<div><span style="background: #337786;"></span>Blog Posts</div>
```

## Adding Custom Blog Post Events

### How It Works

Blog posts appear on specific dates on the calendar. They are stored in the `customEvents` array and link to your blog posts (opening on the same page).

### Add a Blog Post Event

1. Find the `customEvents` array (around line 25):

```javascript
var customEvents = [
  // Example: { title: 'My Blog Post Title', start: '2026-01-03', url: 'https://example.com/blog-post', category: 'blog' }
  // Add more custom events below this line:
  
];
```

2. **Add a new blog post entry** following this format:

```javascript
var customEvents = [
  { title: 'My First Blog Post', start: '2026-01-03', url: 'https://example.com/blog-post-1', category: 'blog' },
  { title: 'My Second Blog Post', start: '2026-02-15', url: 'https://example.com/blog-post-2', category: 'blog' },
  { title: 'My Third Blog Post', start: '2026-03-22', url: 'https://example.com/blog-post-3', category: 'blog' }
];
```

### Event Format Breakdown

Each blog post event has these fields:

| Field | Description | Example |
|-------|-------------|---------|
| `title` | Blog post title (displayed on calendar) | `'Parashat Vayigash Insights'` |
| `start` | Date in YYYY-MM-DD format | `'2026-01-03'` |
| `url` | Full URL to your blog post | `'https://graftedinagain.com/blog/vayigash'` |
| `category` | Always use `'blog'` for blog posts | `'blog'` |

**Important:** 
- Dates must be in `YYYY-MM-DD` format
- Always include `category: 'blog'`
- URLs should be the full link including `https://`

## Event Types & Colors

| Event Type | Color | Opens In | Details |
|------------|-------|----------|---------|
| **Torah Portions** | Blue `#3498db` | New Tab | Links to Hebcal commentary |
| **Holidays** | Red `#e74c3c` | N/A | No link - informational only |
| **Blog Posts** | Teal `#337786` | Same Page | Your custom events |

## Multiple View Options

Users can switch between:
- **Month View** - See entire month at once
- **Week View** - See week details
- **List View** - See events in list format

Navigation buttons appear at the top of the calendar.

## Troubleshooting

### Calendar Not Appearing?
- Make sure you're using a **Custom HTML block** (not a text block)
- Check that all code was copied correctly
- Clear your browser cache

### Events Not Showing?
- Check your internet connection (calendar fetches from Hebcal API)
- Verify dates are in `YYYY-MM-DD` format
- Make sure blog post URLs are complete with `https://`

### Mobile View Issues?
- Calendar automatically adjusts for mobile
- Font sizes and heights are optimized for smaller screens
- Try rotating your device to see different layouts

## Support

For issues with the Hebcal API, visit: https://www.hebcal.com/

For FullCalendar documentation, visit: https://fullcalendar.io/

## File Structure

```
Calendar_Page/
├── Calendar.js          # Main calendar file (paste this into WordPress)
├── README.md            # This file
└── .eslintrc.json       # ESLint configuration (development only)
```

## License

This calendar uses:
- **FullCalendar** - MIT License (https://fullcalendar.io/)
- **Hebcal API** - Free & Open Source (https://www.hebcal.com/)

---

**Last Updated:** November 11, 2025
**Version:** 1.0
