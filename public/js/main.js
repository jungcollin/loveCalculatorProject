(function () {
  // 변수 정의
  const main = document.querySelector('.contents'); // 기존 폼
  const basicContents = main.innerHTML;
  let form = document.querySelector('#loveForm');

  // 이벤트 실행
  document.addEventListener('click', clickToAction); // 제출(submit) 클릭시
  document.addEventListener('click', reloadForm); // 재시도(again) 클릭시

  // 제출 버튼 눌렀을때
  function clickToAction(e) {
    // form 기본 이벤트 방지
    e.preventDefault();
    if (e.target && e.target.classList.contains('btn_submit')) {

      let inputData = {
        yourName: document.querySelector('#yourName').value,
        partnerName: document.querySelector('#partnerName').value
      }

      // AJAX 요청 함수 호출
      sendForm('http://127.0.0.1:3000/ajax_send_form', inputData);

      // form 리셋 input 창 비우기
      form = document.querySelector('#loveForm'); // 재시도 할때 form을 다시 지정해줘야 되는듯... 예전껄 계속 바라보는듯?
      form.reset();
    }
  }

  //AJAX 함수 정의
  function sendForm(url, data) {
    // http 전송될떄는 객체가 안되서 문자열로 보내야되서 data 가공
    let sendData = JSON.stringify(data);
    let xhr = new XMLHttpRequest();

    // 통신 상태이 변경될때마다 실행된다.
    xhr.onreadystatechange = function () {
      // 통신이 정상적으로 완료되었을때
      // 서버의 응답에 따른 로직을 여기에 작성합니다.
      if (xhr.readyState == 4 && xhr.status == 200) {

        let result = JSON.parse(this.responseText);
        let svgText = '';

        // 가끔씩 undefined 에러날때 분기처리 준비중....
        if (!result.yourName) {
          form.innerHTML = `<p class="loading">Sorry...Try Again!!!</p><button class="btn btn_again">Again</button>`;
          return false;
        }

        // 아이콘 분기
        if (result.percentage >= 80) {
          svgText = 'verygood'
        } else if (result.percentage >= 60) {
          svgText = 'sogood'
        } else if (result.percentage >= 40) {
          svgText = 'soso'
        } else if (result.percentage >= 20) {
          svgText = 'sosad'
        } else {
          svgText = 'verysad'
        }

        // 결과 그려주는 템플릿
        let renderResult = `
        <p class="result_text">YOUR NAME : <span>${result.yourName}</span></p>
        <p class="result_text">PARTNER NAME : <span>${result.partnerName}</span></p>
        <p class="result_text">PERCENTAGE : <span>${result.percentage}%</span></p>
        <p class="result_text"><span>${result.resultNum}</span></p>
        <svg class="icon">
          <image href="/images/${svgText}.svg" />
        </svg>
        <button class="btn btn_again">Again</button>
      `
        // html에 렌더
        form.innerHTML = renderResult;
      } else {
        form = document.querySelector('#loveForm'); // 재시도 할때 form을 다시 지정해줘야 되는듯... 예전껄 계속 바라보는듯?
        // 요청에 대한 응답을 기다리고 있을때
        form.innerHTML = `<p class="loading">Loading...</p>`;
      }
    };

    // 요청
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', "application/json");
    xhr.send(sendData);
  }

  function reloadForm(e) {
    e.preventDefault();
    if (e.target && e.target.classList.contains('btn_again')) {
      //do something
      main.innerHTML = basicContents;
    }
  }
})();