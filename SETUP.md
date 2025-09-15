# Soccer Goal of the Year Voting App

A mobile-friendly React application for voting on the best soccer goals of the year at your club's end-of-season presentation.

## Features

- 📱 **Mobile-First Design**: Optimized for mobile devices
- 🏆 **Dual Categories**: Separate voting for Women's and Men's goals
- 🔄 **Real-Time Results**: Live vote counting with charts
- 🎯 **One Vote Per User**: Prevents multiple voting (users can change their vote)
- 🔒 **Management Panel**: Protected with passcode for vote reset
- 📊 **Live Charts**: Real-time bar charts showing vote results
- 🎨 **Beautiful UI**: Modern, responsive design

## Setup Instructions

### 1. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Realtime Database
4. Copy your Firebase config object
5. Update `/src/firebase.ts` with your configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com/",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
};
```

### 2. Database Rules

The Firebase Realtime Database rules are already configured in `database.rules.json`. Deploy them using:

```bash
firebase deploy --only database
```

### 3. Configure Goals Data

Edit `/src/components/VotingPage.tsx` to update the sample goals with your actual goals:

```javascript
const sampleGoals: { [key in Category]: Goal[] } = {
  women: [
    {
      id: 'w1',
      title: 'Player Name',
      subtitle: 'vs Opposition - Game Description',
      gifUrl: '/gifs/goal1.gif'
    },
    // Add more goals...
  ],
  men: [
    // Add men's goals...
  ]
};
```

### 4. Add Goal GIFs

1. Create a `public/gifs/` directory
2. Add your goal GIF files
3. Update the `gifUrl` paths in the goals data
4. Ensure GIF files are optimized for web (recommended: < 2MB each)

### 5. Add Background Images (Optional)

1. Create a `public/images/` directory
2. Add background images for the landing page:
   - `women-background.jpg`
   - `men-background.jpg`
3. Images should be optimized and mobile-friendly

### 6. Management Passcode

The management passcode is set to `0880` in `/src/components/ManagementPage.tsx`. You can change it by updating:

```javascript
const MANAGEMENT_PASSCODE = "0880";
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to Firebase
firebase deploy
```

## App Structure

### Routes

- `/` - Landing page (Women's vs Men's selection)
- `/women` - Women's goal voting page
- `/men` - Men's goal voting page
- `/management` - Management panel (requires passcode)
- `/results/women` - Women's results with real-time charts
- `/results/men` - Men's results with real-time charts

### Key Features

#### Voting System

- Users get a unique ID stored in localStorage
- One vote per category per user
- Users can change their vote anytime
- Votes are stored in Firebase Realtime Database

#### Real-Time Updates

- Results pages update automatically as votes come in
- Uses Firebase real-time listeners
- Bar charts show current standings

#### Management Features

- Reset votes for either category
- View results for both categories
- Passcode protection (0880)

## Customization

### Colors

Update colors in `/src/App.css`:

- Women's theme: `#ff6b9d` (pink)
- Men's theme: `#4a90e2` (blue)
- Success: `#28a745` (green)

### Goal Data Structure

Each goal requires:

- `id`: Unique identifier
- `title`: Player name
- `subtitle`: Game description
- `gifUrl`: Path to GIF file

### Mobile Optimization

The app is already optimized for mobile with:

- Touch-friendly buttons (44px minimum)
- Responsive grid layouts
- Optimized font sizes
- Smooth scrolling
- No zoom on input focus

## Troubleshooting

### Common Issues

1. **Firebase Connection Issues**

   - Verify your Firebase config in `/src/firebase.ts`
   - Check that Realtime Database is enabled
   - Ensure database rules are deployed

2. **GIFs Not Loading**

   - Check file paths in goals data
   - Ensure GIF files are in `public/gifs/`
   - Verify file permissions

3. **Votes Not Saving**

   - Check browser console for errors
   - Verify database rules are correct
   - Ensure Firebase project is active

4. **Mobile Display Issues**
   - Test in browser dev tools mobile view
   - Check viewport meta tag in `index.html`
   - Verify CSS media queries

## Production Deployment

1. Update Firebase config with production values
2. Build the app: `npm run build`
3. Deploy: `firebase deploy`
4. Test all features on mobile devices
5. Share the URL with your soccer club!

## Security Notes

- The management passcode is hardcoded and not secure for production use beyond a soccer event
- Database rules allow public read/write for voting data
- User identification relies on localStorage (not login-based)
- Suitable for trusted environments like club events

Enjoy your Goal of the Year voting! ⚽🏆
