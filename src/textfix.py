import re

def remove_triple_newlines(file_path):
    # 파일을 열고 내용을 읽습니다.
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # 연속된 세 번 이상의 줄바꿈을 두 번의 줄바꿈으로 치환합니다.
    cleaned_content = re.sub(r'\n{3,}', '\n\n', content)

    # 변경된 내용을 같은 파일에 다시 씁니다.
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(cleaned_content)

# 파일 경로 지정
file_path = 'game/src/App.js'

# 함수 호출
remove_triple_newlines(file_path)
