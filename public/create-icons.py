from PIL import Image, ImageDraw
import os

def create_icon(size, filename):
    # Create image with soft green background
    img = Image.new('RGB', (size, size), '#86EFAC')
    draw = ImageDraw.Draw(img)
    
    # Draw circle (timer representation)
    center = size // 2
    radius = size // 3
    draw.ellipse([center - radius, center - int(radius * 0.6), 
                  center + radius, center + int(radius * 0.6)], 
                 fill='#166534', outline='#166534')
    
    # Draw timer arc
    arc_radius = int(size * 0.3)
    draw.ellipse([center - arc_radius, center - arc_radius, 
                  center + arc_radius, center + arc_radius],
                 outline='#166534', width=max(1, size // 32))
    
    # Draw timer hand
    hand_length = int(size * 0.25)
    draw.line([center, center, center + hand_length, center - hand_length // 2],
              fill='#F0FDF4', width=max(1, size // 40))
    
    img.save(filename)
    print(f"Created {filename}")

# Check if PIL is available
try:
    create_icon(512, 'pwa-512x512.png')
    create_icon(192, 'pwa-192x192.png')
    create_icon(180, 'apple-touch-icon.png')
    
    # Create favicon
    icon = Image.open('pwa-192x192.png')
    icon.thumbnail((32, 32), Image.Resampling.LANCZOS)
    icon.save('favicon.ico')
    print("Created favicon.ico")
    
except Exception as e:
    print(f"Error: {e}")
