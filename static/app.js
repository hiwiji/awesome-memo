// 3. 메모 수정하기 (update)
async function editMemo(event) {
  const id = event.target.dataset.id;
  const editInput = prompt("수정할 값을 입력하세요!");
  const res = await fetch(`/memos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      content: editInput,
    }),
  });
  readMemo();
}

// 4. 메모 삭제하기
async function deleteMemo(event) {
  const id = parseInt(event.target.dataset.id); //id를 정수로 변환
  const res = await fetch(`/memos/${id}`, {
    method: "DELETE",
  });
  if (res.ok) {
    readMemo(); // 삭제 성공시 메모를 다시 읽음
  } else {
    alert("삭제 실패했습니다."); // 실패시 사용자 알림
  }
}

function displayMemo(memo) {
  const ul = document.querySelector("#memo-ul");

  // li 태그 생성
  const li = document.createElement("li");
  li.innerText = `[id:${memo.id}] ${memo.content}`;

  // edit버튼 생성
  const editBtn = document.createElement("button");
  editBtn.innerText = "수정하기";
  // 버튼을 누르면 editMemo 활성화
  editBtn.addEventListener("click", editMemo);
  editBtn.dataset.id = memo.id;
  //dataset 속성에 id라는 값에 memo.id를 넣어줄거다

  // delete버튼 생성
  const delBtn = document.createElement("button");
  delBtn.innerText = "삭제";
  delBtn.addEventListener("click", deleteMemo);
  delBtn.dataset.id = memo.id;

  // ul에 li 리스트 추가
  li.appendChild(editBtn);
  li.appendChild(delBtn);
  ul.appendChild(li);
}

// 2. 메모 읽기 (read)
async function readMemo() {
  const res = await fetch("/memos"); // 읽는건 get 요청 따로 옵션추가 없이 이것만 쓰면 끝

  const jsonRes = await res.json();
  // jsonRes = [{id:123, content: '블라블라'}]
  // ["a", "b", "c"].forEach(func);
  // 배열로 떨어진 res.json을 forEach구문을 사용해서 디스플레이메모
  const ul = document.querySelector("#memo-ul");
  ul.innerHTML = ""; // 위에 생성되는 ul를 초기화
  jsonRes.forEach(displayMemo);
}

// 1. 메모생성하기 (create)
async function createMemo(value) {
  // 2. 아래 value값 받기
  const res = await fetch("/memos", {
    // 4. 서버에게 메모 만들어달라는 요청 보내기
    // 그냥보내면 get 요청
    method: "POST",
    // 우리는 값을 추가해야되니까  post로 보내야함 -> 옵션추가
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: new Date().getTime(),
      content: value,
    }),
    // 자바스크립트에서 id, content 형식 보내는거
  });
  readMemo();
  // 위에 서버의 값을 업데이트 한 다음에
  // 서버에 있는 메모를 한번 가져와서 쫙 뿌려주기
}

// 메모를 제출했을 때 동작 (handleSubmit)
function handleSubmit(event) {
  event.preventDefault();
  // 이벤트가 발생하는걸 막음 이걸 안하면 깜빡이면서 제출됨
  //console.log("동작하나??");

  const input = document.querySelector("#memo-input");
  createMemo(input.value);
  // 1. input에 있는 value값 넘겨줘서 createMemo 함수 호출
  input.value = "";
  // 3. input에 들어가있는 값 없애주기 (제출했으니까!)
}

const form = document.querySelector("#memo-form");
form.addEventListener("submit", handleSubmit);
// 폼태그 안에 있는 값이 제출됐을 때 발생하는 이벤트
// 위에 메모생성하는 함수

// form에 submit 이벤트는 제출됨과 동시에 redirect가 발생됨
//새로고침을 스스로해서 이걸 방지해줘야함
// => event.preventDefault 를 사용 (위에 참고)

readMemo();
// 처음에 서버에서 불러오기
