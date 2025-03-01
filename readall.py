import os
import pyperclip

def find_js_files(directory):
    js_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith((".js", ".jsx", ".local")):
                js_files.append(os.path.join(root, file))
    return js_files

def read_file_content(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

def format_file_content(file_path, content):
    return f"{file_path}\n```\n{content}\n```\n"

def main():
    directories = ["./MyFirstApp/screens", "./MyFirstApp/components"]
    app_file = "./MyFirstApp/App.js"
    other_app_file = "./MyFirstApp/firebaseConfig.js"
    other_other_app_file = "./MyFirstApp/metro.config.js"
    other_other_other_app_file = "./MyFirstApp/babel.config.js"

    js_files = []
    for directory in directories:
        js_files.extend(find_js_files(directory))

    clipboard_content = ""
    
    if os.path.exists(app_file):
        app_content = read_file_content(app_file)
        clipboard_content += format_file_content(app_file, app_content) + "\n"

    if os.path.exists(other_app_file):
        app_content = read_file_content(other_app_file)
        clipboard_content += format_file_content(other_app_file, app_content) + "\n"

    if os.path.exists(other_other_app_file):
        app_content = read_file_content(other_other_app_file)
        clipboard_content += format_file_content(other_other_app_file, app_content) + "\n"
    
    for file_path in js_files:
        content = read_file_content(file_path)
        formatted_content = format_file_content(file_path, content)
        clipboard_content += formatted_content + "\n"
    
    pyperclip.copy(clipboard_content)
    print("Content copied to clipboard!")

if __name__ == "__main__":
    main()