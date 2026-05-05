from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
from urllib.parse import urljoin

def scrape_website(url):
    print(f"\n⏳ Playwright is firing up a real browser for: {url}...\n")
    try:
        # Playwright ko start karna
        with sync_playwright() as p:
            # Headless Chrome open karo
            browser = p.chromium.launch(headless=True)
            
            # Ek naya tab open karo
            page = browser.new_page()
            
            print("🌐 Navigating and waiting for DOM to load...")
            
            # 🛠️ FIXED: 'networkidle' hata kar 'domcontentloaded' kar diya
            # Ab ye ads ke rukne ka wait nahi karega, HTML aate hi aage badhega
            page.goto(url, timeout=60000, wait_until="domcontentloaded")
            
            # 🛠️ FIXED: Website ko properly saans lene aur JS chalane ke liye 3 second ka wait
            page.wait_for_timeout(3000)
            
            # Agar website pe 'lazy loading' hai, toh thoda scroll karwao
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            page.wait_for_timeout(2000) # Scroll ke baad 2 second wait karo
            
            # Pura rendered HTML nikal lo
            html_content = page.content()
            
            # Browser band kar do
            browser.close()
        
        # ---------------------------------------------------------
        # Ab HTML mil gaya hai, toh purana BeautifulSoup logic laga do
        # ---------------------------------------------------------
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # 🖼️ IMAGES EXTRACT KARNA
        image_links = []
        for img in soup.find_all('img'):
            src = img.get('src') or img.get('data-src') # data-src lazy-loaded images ke liye hota hai
            if src:
                full_image_url = urljoin(url, src)
                if full_image_url not in image_links: # Duplicate links se bachne ke liye
                    image_links.append(full_image_url)

        # 📝 TEXT EXTRACT KARNA
        for script_or_style in soup(["script", "style", "noscript", "header", "footer"]):
            script_or_style.extract()
        
        clean_text = soup.get_text(separator='\n', strip=True)
        
        return clean_text, image_links

    except Exception as e:
        return f"❌ Playwright Error occurred: {e}", []

if __name__ == "__main__":
    target_url = input("🌐 Website ka URL daalein (e.g., https://en.wikipedia.org/wiki/Java): ").strip()
    
    if target_url:
        if not target_url.startswith("http"):
            target_url = "https://" + target_url

        extracted_text, extracted_images = scrape_website(target_url)
        
        # --- IMAGES PRINT KARNA ---
        print("\n" + "=" * 50)
        print(f"🖼️ --- EXTRACTED IMAGES ({len(extracted_images)} found) --- 🖼️")
        print("=" * 50)
        
        if extracted_images:
            for i, img_url in enumerate(extracted_images[:10]):
                print(f"{i+1}. {img_url}")
            
            if len(extracted_images) > 10:
                print(f"\n... aur {len(extracted_images) - 10} images aur hain.")
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