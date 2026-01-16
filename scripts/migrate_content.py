
import json
import re
import os

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def parse_markdown(file_path, category):
    projects = []
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to find project blocks. 
    # Structure typically:
    # <div ...>
    #   <h4>Title</h4>
    #   <p><i>Role<br>Composer...</i></p>
    #   <span class="image fit"><a href="LINK"><img src="IMAGE"...></a></span>
    # </div>
    
    # We'll use a relatively loose regex to capture these blocks or iterate line by line.
    # Given the irregularity, finding <h4> then looking ahead is best.
    
    # Let's split by "<h4>" and process chunks
    chunks = content.split('<h4>')
    
    # Skip the first chunk (header stuff)
    for chunk in chunks[1:]:
        try:
            # Title is the start up to </h4>
            title_end = chunk.find('</h4>')
            if title_end == -1: continue
            title = chunk[:title_end].strip()
            
            # Role: look for <i>...</i>
            role = ""
            role_match = re.search(r'<i>(.*?)</i>', chunk, re.DOTALL)
            if role_match:
                # Remove <br> and clean up
                raw_role = role_match.group(1)
                raw_role = raw_role.replace('<br>', ' ').replace('\n', ' ')
                role = re.sub(r'\s+', ' ', raw_role).strip()
            
            # Link: <a href="...">
            link = ""
            link_match = re.search(r'href="([^"]+)"', chunk)
            if link_match:
                link = link_match.group(1)
                
            # Image: <img src="...">
            image = ""
            img_match = re.search(r'src="([^"]+)"', chunk)
            if img_match:
                image = img_match.group(1)
                if not image.startswith('/'):
                    image = '/' + image
            
            # Composer (extract from role if possible, usually "Composer - Name")
            composer = ""
            if "Composer -" in role:
                parts = role.split("Composer -")
                role = parts[0].strip()
                composer = parts[1].strip()
            
            # Year: Try to extract year from title or text (e.g. "(2022)")
            year = "2024" # Default
            year_match = re.search(r'\((\d{4})\)', title)
            if year_match:
                year = year_match.group(1)
                # Remove year from title
                title = title.replace(f'({year})', '').strip()
            
            pid = slugify(f"{title}-{year}")
            
            projects.append({
                "id": pid,
                "title": title,
                "role": role,
                "composer": composer,
                "year": year,
                "image": image,
                "link": link,
                "category": category
            })
            
        except Exception as e:
            print(f"Error parsing chunk: {e}")
            continue

    return projects

# ALSO handle <h3> tags which are used for Soundpacks (and Mixing?)
def parse_markdown_h3(file_path, category):
    projects = []
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    chunks = content.split('<h3>')
    for chunk in chunks[1:]:
        try:
            title_end = chunk.find('</h3>')
            if title_end == -1: continue
            title = chunk[:title_end].strip()

            role = ""
            role_match = re.search(r'<i>(.*?)</i>', chunk, re.DOTALL)
            if role_match:
                raw_role = role_match.group(1)
                raw_role = raw_role.replace('<br>', ' ').replace('\n', ' ')
                role = re.sub(r'\s+', ' ', raw_role).strip()

            link = ""
            link_match = re.search(r'href="([^"]+)"', chunk)
            if link_match:
                link = link_match.group(1)

            image = ""
            img_match = re.search(r'src="([^"]+)"', chunk)
            if img_match:
                image = img_match.group(1)
                if not image.startswith('/'):
                    image = '/' + image

            year = "2024" # Default? Maybe infer?
            # Mixing items don't have years explicitly in titles often.
            
            pid = slugify(f"{title}")

            projects.append({
                "id": pid,
                "title": title,
                "role": role,
                "composer": "",
                "year": year,
                "image": image,
                "link": link,
                "category": category
            })
        except Exception as e:
            print(f"Error parsing h3 chunk: {e}")
    return projects


def main():
    json_path = 'src/data/projects.json'
    
    # Load existing
    existing = []
    if os.path.exists(json_path):
        with open(json_path, 'r') as f:
            existing = json.load(f)
            
    # Map key -> project for quick update
    # Key = Title (normalized) to match
    existing_map = {slugify(p['title']): p for p in existing}
    
    files = [
        ('01_Producer.md', 'Production'),
        ('02_Creative_Programmer.md', 'Creative Technology'),
        ('03_Mixing.md', 'Mixing'),
        ('04_Releases.md', 'Discography')
    ]
    
    new_projects = []
    
    for fname, category in files:
        if not os.path.exists(fname):
            continue
            
        # Parse h4 items
        items = parse_markdown(fname, category)
        # Parse h3 items (Soundpacks, Mixing)
        items_h3 = parse_markdown_h3(fname, category)
        all_items = items + items_h3
        
        for item in all_items:
            key = slugify(item['title'])
            
            if key in existing_map:
                # Update existing
                ex = existing_map[key]
                if not ex.get('link') and item['link']:
                    ex['link'] = item['link']
                if not ex.get('image') and item['image']:
                    ex['image'] = item['image']
                # Determine category for existing items if missing
                if 'category' not in ex:
                    ex['category'] = category
            else:
                # Add new
                new_projects.append(item)
    
    # Combine
    final_list = existing + new_projects
    
    # Write back
    with open(json_path, 'w') as f:
        json.dump(final_list, f, indent=2)
        
    print(f"Updated projects.json. Total items: {len(final_list)}")

if __name__ == '__main__':
    main()
