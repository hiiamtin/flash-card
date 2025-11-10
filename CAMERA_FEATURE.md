# 📷 Camera Feature Guide

## Camera Switching on Mobile Devices

The AI Language Flashcards application now supports switching between front and back cameras on mobile devices!

## Features

### 🔄 Camera Switching
- **Automatic Detection**: The app automatically detects how many cameras are available on your device
- **Smart Button**: The switch button only appears when multiple cameras are detected
- **Toggle Functionality**: Easily switch between front (selfie) and back (environment) cameras
- **Visual Indicator**: Button shows which camera you'll switch to (e.g., "🔄 Front Camera" when using back camera)

### 📱 How to Use

1. **Open the Camera Tab**
   - Click on the "📷 Camera" tab in the flashcard creation form

2. **Start the Camera**
   - Click "📷 Start Camera" button
   - Grant camera permissions when prompted

3. **Switch Cameras** (if available)
   - Look for the "🔄 Front Camera" or "🔄 Back Camera" button
   - Click to toggle between cameras
   - The button only appears if your device has multiple cameras

4. **Capture Photo**
   - Point camera at an object
   - Click "📸 Capture" to take the photo

5. **Use or Retake**
   - Review the captured image
   - Click "✓ Use Photo" to create flashcard
   - Or click "🔄 Retake" to try again

## Technical Details

### Camera Modes

- **Environment (Back Camera)**: Default mode, best for capturing objects and scenes
- **User (Front Camera)**: Selfie mode, useful for self-study or capturing items close to you

### Implementation

The camera switching feature uses the `react-camera-pro` library with:

```javascript
facingMode={facingMode}  // 'user' or 'environment'
numberOfCamerasCallback={setNumberOfCameras}  // Detects available cameras
```

### Browser Compatibility

Camera switching works on:
- ✅ Chrome/Edge on Android
- ✅ Safari on iOS
- ✅ Firefox on Android
- ✅ Most modern mobile browsers

**Note**: Desktop devices with multiple cameras (e.g., laptops with external webcams) can also use this feature!

## Troubleshooting

### Switch Button Not Appearing

**Possible Reasons**:
1. Your device only has one camera
2. Browser doesn't have permission to access cameras
3. Camera is being used by another application

**Solutions**:
- Check if your device has multiple cameras
- Grant camera permissions in browser settings
- Close other apps using the camera
- Try a different browser

### Camera Not Working

**Common Issues**:
1. **Permission Denied**: Refresh page and allow camera access
2. **HTTPS Required**: Camera API requires HTTPS or localhost
3. **Camera in Use**: Close other apps using the camera
4. **Browser Not Supported**: Try Chrome, Safari, or Firefox

### Camera Switching Fails

If switching doesn't work:
1. Refresh the page
2. Stop and restart the camera
3. Check browser console for errors
4. Try a different browser

## Mobile-Specific Tips

### iOS (iPhone/iPad)
- Safari works best for camera features
- Make sure iOS is updated to latest version
- Grant camera permissions in Settings > Safari > Camera

### Android
- Chrome and Firefox work well
- Enable camera in browser settings
- Some devices may require additional permissions

## Privacy & Security

- ✅ Camera access is only requested when you click "Start Camera"
- ✅ No images are stored without your explicit action
- ✅ All processing happens locally in your browser
- ✅ Images are only sent to the server when you click "Use Photo"

## Best Practices

### For Best Results

1. **Good Lighting**: Ensure adequate lighting for clear images
2. **Steady Hand**: Hold device steady when capturing
3. **Clear Subject**: Focus on one object at a time
4. **Appropriate Distance**: Not too close, not too far
5. **Clean Lens**: Wipe camera lens for better quality

### Camera Selection

- **Back Camera**: Better quality, ideal for objects and scenes
- **Front Camera**: Convenient for items you're holding or nearby objects

## Examples

### Using Back Camera (Environment)
Perfect for:
- 📚 Books and documents
- 🍎 Food items
- 🏠 Household objects
- 🌳 Outdoor scenes
- 🎨 Artwork and posters

### Using Front Camera (User)
Useful for:
- ✋ Hand-held items
- 📝 Notes you're holding
- 🎯 Quick captures
- 🤳 Items close to you

## Future Enhancements

Planned features:
- 📸 Flash control
- 🔍 Zoom functionality
- 🎨 Filters and adjustments
- 📐 Aspect ratio options
- 🎯 Auto-focus controls

## Support

If you encounter issues with camera switching:
1. Check this guide's troubleshooting section
2. Review browser console for error messages
3. Try the application on a different device/browser
4. Ensure you're using HTTPS or localhost

---

**Happy Learning with Camera! 📷🎓**

*Capture the world around you and learn new vocabulary effortlessly!*

