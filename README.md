# Pretty Emails

A simple email composer with a rich text editor and live HTML preview. Write emails in a modern editor, customize styling, and copy email-safe HTML ready for Gmail.

## Features

- **BlockNote Editor** — Rich text editing with markdown shortcuts
- **Live Preview** — See your email rendered in real-time
- **Style Controls** — Customize font, size, spacing, colors, and width
- **Email-Safe HTML** — Table-based layout with inline styles for maximum compatibility
- **One-Click Copy** — Copy HTML to clipboard, paste directly into Gmail

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Style Controls

| Control | Range | Default |
|---------|-------|---------|
| Font Family | System, Georgia, Arial, Helvetica, Times New Roman, Verdana | System |
| Font Size | 14–20px | 16px |
| Max Width | 480–720px | 560px |
| Line Height | 1.4–2.0 | 1.6 |
| Text Color | Any hex | #1a1a1a |
| Background | Any hex | #ffffff |
| Paragraph Spacing | 12–24px | 18px |

## Tech Stack

- React 19
- Vite
- BlockNote
- TypeScript

