
import json
import re

def main():
    json_path = 'src/data/projects.json'
    
    with open(json_path, 'r') as f:
        projects = json.load(f)
        
    # Deduplicate based on ID or Title+Year
    seen = set()
    cleaned = []
    
    for p in projects:
        # Fix year if title contains year like "Sherry (2021)"
        if p['year'] == "2024": # Default from script
             year_match = re.search(r'\((\d{4})\)', p['title'])
             if year_match:
                 p['year'] = year_match.group(1)
                 p['title'] = p['title'].replace(f"({p['year']})", "").strip()
        
        # Create a unique key
        key = f"{p['title']}-{p['year']}".lower()
        
        if key in seen:
            continue
            
        seen.add(key)
        cleaned.append(p)
        
    # Sort correctly by year descending
    cleaned.sort(key=lambda x: int(x['year']) if x['year'].isdigit() else 0, reverse=True)
    
    with open(json_path, 'w') as f:
        json.dump(cleaned, f, indent=2)
        
    print(f"Cleaned projects.json. Total items: {len(cleaned)}")

if __name__ == '__main__':
    main()
