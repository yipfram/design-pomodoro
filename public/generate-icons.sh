#!/bin/bash

# Create a simple icon using ImageMagick
convert -size 512x512 xc:"#86EFAC" \
  -fill "#166534" -draw "circle 256,200 256,100" \
  -fill none -stroke "#166534" -strokewidth 16 -draw "circle 256,256 256,176" \
  -fill none -stroke "#F0FDF4" -strokewidth 12 -draw "line 256,176 256,256 line 256,256 306,256" \
  pwa-512x512.png

convert pwa-512x512.png -resize 192x192 pwa-192x192.png

# Create favicon
convert pwa-192x192.png -resize 32x32 favicon.ico

# Create apple touch icon
convert pwa-512x512.png -resize 180x180 apple-touch-icon.png

echo "Icons generated successfully!"
