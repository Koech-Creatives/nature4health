import subprocess
import os
import time

# List of sites to screenshot
sites = {
    "n4h": "https://natureforhealth.org",
    "dswf": "https://davidshepherd.org/",
    "wci": "https://wildlifecoexistence.org/",
    "eu": "https://www.erlebnis-unganisha.de/themen/",
    "carbon": "https://www.carbon-direct.com/",
    "wildfire": "https://followingwildfire.com/",
    "wildlifela": "https://www.wildlife.la/",
    "lakes": "https://www.westernsydneylakes.com.au/",
    "nzon": "https://nzonfoot.com/"
}

chrome_path = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
output_dir = "/Users/user/Dev/N4H/assets"

os.makedirs(output_dir, exist_ok=True)

for name, url in sites.items():
    print(f"Taking screenshot of {name} at {url}...")
    output_path = os.path.join(output_dir, f"screenshot_{name}.png")
    
    # Chrome headless screenshot command
    cmd = [
        chrome_path,
        "--headless",
        "--disable-gpu",
        "--window-size=1280,800",
        "--hide-scrollbars",
        f"--screenshot={output_path}",
        url
    ]
    
    try:
        # Run command with 15s timeout
        subprocess.run(cmd, check=True, timeout=25)
        print(f"Successfully saved {output_path}")
    except Exception as e:
        print(f"Error taking screenshot for {name}: {e}")
        
    time.sleep(1) # Small pause between requests
