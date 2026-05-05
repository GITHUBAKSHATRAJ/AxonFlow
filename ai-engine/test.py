import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

def scrape_website(url):
    print(f"\n⏳ Scraping started for: {url}...\n")
    try:
        # Browser jaisa dikhne ke liye headers
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        
        # HTTP GET request
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        
        # BeautifulSoup se parse karna
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # ---------------------------------------------------------
        # 🖼️ NAYA LOGIC: IMAGES EXTRACT KARNA
        # ---------------------------------------------------------
        image_links = []
        # Page par jitne bhi <img> tags hain unhe dhoondo
        for img in soup.find_all('img'):
            src = img.get('src') # 'src' attribute se link nikalo
            if src:
                # Agar link relative hai, toh use poora (absolute) URL bana do
                full_image_url = urljoin(url, src)
                image_links.append(full_image_url)

        # ---------------------------------------------------------
        # 📝 PURANA LOGIC: TEXT EXTRACT KARNA
        # ---------------------------------------------------------
        # Faltu tags hatana
        for script_or_style in soup(["script", "style", "noscript", "header", "footer"]):
            script_or_style.extract()
        
        # Clean text nikalna
        clean_text = soup.get_text(separator='\n', strip=True)
        
        # Ab dono cheezein return kar rahe hain (Text aur Images ki list)
        return clean_text, image_links

    except requests.exceptions.RequestException as e:
        return f"❌ HTTP Error occurred: {e}", []
    except Exception as e:
        return f"❌ An unexpected error occurred: {e}", []

if __name__ == "__main__":
    target_url = input("🌐 Website ka URL daalein (e.g., https://en.wikipedia.org/wiki/Java): ").strip()
    
    if target_url:
        if not target_url.startswith("http"):
            target_url = "https://" + target_url

        # Function ab 2 values dega
        extracted_text, extracted_images = scrape_website(target_url)
        
        # --- IMAGES PRINT KARNA ---
        print("\n" + "=" * 50)
        print(f"🖼️ --- EXTRACTED IMAGES ({len(extracted_images)} found) --- 🖼️")
        print("=" * 50)
        
        if extracted_images:
            # Terminal na bhare isliye sirf shuru ki 10 images dikhayenge
            for i, img_url in enumerate(extracted_images[:10]):
                print(f"{i+1}. {img_url}")
            
            if len(extracted_images) > 10:
                print(f"\n... aur {len(extracted_images) - 10} images aur hain (Code mein limit hata kar sab dekh sakte ho).")
        else:
            print("Is page par koi images nahi mili.")

        # --- TEXT PRINT KARNA ---
        print("\n" + "=" * 50)
        print("📝 --- EXTRACTED TEXT --- 📝")
        print("=" * 50)
        print(extracted_text[:2000]) 
        
        if len(extracted_text) > 2000:
            print("\n... [Data lamba hai isliye baaki ka text chupa diya gaya hai. Pura dekhne ke liye code mein [:2000] hata dein]")
    else:
        print("⚠️ Koi URL nahi daala gaya!")