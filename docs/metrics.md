# Metrics Documentation

## 📊 Analytics Metrics

### Sessions Created (`sessions_created_total`)
- **Type:** Counter
- **Unit:** Count
- **Description:** Total number of unique sessions created
- **Labels:** `landing_page`, `referrer`
- **Calculation:** Increments by 1 when a new session is detected. It uses `sessionStorgare` to detect new sessions.
- **Example:** User opens browser → +1 session

---

### Page Views (`page_views_total`)
- **Type:** Counter
- **Unit:** Count
- **Description:** Total number of page views
- **Labels:** `pathname`
- **Calculation:** Increments by 1 on every page visit
- **Example:** User navigates to `/about` → +1 page view

---

### Session Duration (`session_duration_seconds`)
- **Type:** Histogram
- **Unit:** Seconds
- **Description:** Duration of user sessions
- **Labels:** `landing_page`, `referrer`
- **Calculation:** Time elapsed from session start to session end
- **Buckets:** `[5, 30, 120, 600, 1800, 3600, 7200]`

| Duration | Category | Interpretation |
|----------|----------|-----------------|
| < 5s | 🚫 Bounce | User left immediately |
| 5-30s | 👀 Quick | User glanced at page |
| 30s-2m | 👋 Brief | Light engagement |
| 2-10m | 👍 Moderate | Good engagement |
| 10-30m | ⭐ Strong | High interest |
| 30m-1h | 🔥 Very Strong | Very engaged user |
| > 1h | 📖 Extended | Reading/working/idle |

---

## 🎨 Web Vitals

### First Contentful Paint (`fcp_milliseconds`)
- **Type:** Histogram
- **Unit:** Milliseconds
- **Description:** Time until first content appears on screen
- **Labels:** `pathname`
- **Buckets:** `[600, 1200, 1800, 2500, 3000, 4000]`

| Metric | Good | Needs Improvement | Poor |
|--------|------|------------------|------|
| FCP | < 1800ms | 1800-3000ms | > 3000ms |

---

### Largest Contentful Paint (`lcp_milliseconds`)
- **Type:** Histogram
- **Unit:** Milliseconds
- **Description:** Time until largest element renders
- **Labels:** `pathname`
- **Buckets:** `[600, 1200, 1800, 2500, 3000, 4000]`

| Metric | Good | Needs Improvement | Poor |
|--------|------|------------------|------|
| LCP | < 2500ms | 2500-4000ms | > 4000ms |

---

### Cumulative Layout Shift (`cls_score`)
- **Type:** Histogram
- **Unit:** Score (unitless)
- **Description:** Visual stability - how much layout shifts during load
- **Labels:** `pathname`
- **Buckets:** `[0.025, 0.05, 0.1, 0.15, 0.25, 0.5]`

| Metric | Good | Needs Improvement | Poor |
|--------|------|------------------|------|
| CLS | < 0.1 | 0.1-0.25 | > 0.25 |

---

### Time to First Byte (`ttfb_milliseconds`)
- **Type:** Histogram
- **Unit:** Milliseconds
- **Description:** Time for browser to receive first byte from server
- **Labels:** `pathname`
- **Buckets:** `[100, 300, 600, 1000, 1800, 3000]`

| Metric | Good | Needs Improvement | Poor |
|--------|------|------------------|------|
| TTFB | < 600ms | 600-1800ms | > 1800ms |

---

### Interaction to Next Paint (`inp_milliseconds`)
- **Type:** Histogram
- **Unit:** Milliseconds
- **Description:** Responsiveness - time from user input to visual feedback
- **Labels:** `pathname`
- **Buckets:** `[50, 100, 200, 300, 500, 1000]`

| Metric | Good | Needs Improvement | Poor |
|--------|------|------------------|------|
| INP | < 200ms | 200-500ms | > 500ms |

---

## 📡 Metric Export

- **Exporter:** OpenTelemetry GRPC
- **Export Interval:** 15 seconds
- **Service Name:** `nextjs-app`
- **Lables**: `hostname`

---

## 🔗 Related Files

- Metrics definition: `app/lib/metrics.ts`
- Analytics API: `app/api/analytics/page-view/route.ts`
- Session tracking: `app/lib/sessionTracker.ts`
- Web Vitals reporter: `app/components/WebVitalsReporter.tsx`


## TODO
- Browser (detect browser-specific issues)
- Geographic region (regional performance)
- GDPR compliance notes
- Register click events to webapp