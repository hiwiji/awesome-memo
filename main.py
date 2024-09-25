from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles


#객체로 어떤 request body를 받으려면 memo라는 클래스를 지정해줘야함
class Memo(BaseModel):
    id:int
    content:str
    # 받는 쪽에서도 id, content 형식 지정


memos = []
# memos라는 배열 생성

app = FastAPI()


#post요청 보낸거 받기 (메모생성)
@app.post("/memos")
def create_memo(memo:Memo):
#def create_momo(request body객체)
    memos.append(memo)
    return '메모추가에 성공했습니다!'


#get요청 보낸거 받기 (메모읽기)
@app.get("/memos")
def read_memo():
    return memos


# post요청 보낸거 받기 (메모수정)
@app.put("/memos/{memo_id}")
def put_memo(req_memo:Memo):
    for memo in memos:
        if memo.id==req_memo.id:
            memo.content=req_memo.content
            return '성공했습니다.'
    return '그런 메모는 없습니다'


@app.delete("/memos/{memo_id}")
def delete_memo(memo_id: int):
    for index, memo in enumerate (memos):
    ## enumerate : 배열에 index와 값을 같이 뽑아주는 함수
        if memo.id == memo_id:
            memos.pop(index)
            return '성공했습니다.'
    return '그런 메모는 없습니다'
    


app.mount("/", StaticFiles(directory="static", html=True), name="static")
# 루트경로로 지정. static이라는 폴더로 향하도록 , html 옵션을 true로 설정 (그럼 깔끔해짐)
# 디렉토리를 static으로 만들기`

