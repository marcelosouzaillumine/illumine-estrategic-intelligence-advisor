import re

with open('violations.log', 'r') as f:
    lines = f.readlines()

changes_by_file = {}

for line in lines:
    # Example line: "  src/components/ui/executive-opinion.tsx:47 -> [USO DE MUTED EM NARRATIVA] <ExecutiveText variant="microLabel" className="text-muted">"
    match = re.search(r'([a-zA-Z0-9_/\-\.]+):(\d+)\s*->\s*\[(.*?)\]', line)
    if match:
        file_path = match.group(1).strip()
        line_num = int(match.group(2)) - 1
        violation_type = match.group(3)
        
        if file_path not in changes_by_file:
            try:
                with open(file_path, 'r') as src:
                    changes_by_file[file_path] = src.readlines()
            except Exception as e:
                continue
                
        if line_num < len(changes_by_file[file_path]):
            src_line = changes_by_file[file_path][line_num]
            
            # Apply safe replacements
            if violation_type == 'USO DE MUTED EM NARRATIVA':
                src_line = src_line.replace('text-muted-foreground', 'text-executive-secondary')
                src_line = src_line.replace('text-muted', 'text-executive-secondary')
            
            elif violation_type == 'USO DE COR ABSOLUTA':
                src_line = re.sub(r'text-(gray|slate|zinc)-\d+', 'text-executive-secondary', src_line)
                src_line = re.sub(r'dark:text-(gray|slate|zinc)-\d+', 'dark:text-executive-secondary', src_line)

            elif violation_type == 'USO DE OPACITY EM TEXTO':
                src_line = re.sub(r'opacity-\d+(/\d+)?', '', src_line)

            elif violation_type == 'USO DE ACCENT text-secondary':
                # Sometimes `text-secondary` is used. We replace with `text-executive-secondary`.
                src_line = re.sub(r'\btext-secondary\b', 'text-executive-secondary', src_line)

            # Cleanup double spaces from opacity removals
            src_line = src_line.replace('  ', ' ')
            
            changes_by_file[file_path][line_num] = src_line

for file_path, new_lines in changes_by_file.items():
    with open(file_path, 'w') as f:
        f.writelines(new_lines)

print(f"Fixed {len(changes_by_file)} files.")
