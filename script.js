const bootScreen = document.getElementById("boot-screen");
const bootText = document.getElementById("boot-text");
const loadingFill = document.getElementById("loading-fill");
const bootStatus = document.getElementById("boot-status");
const startButton = document.getElementById("startGame");
const desktop = document.getElementById("desktop");

let albumUnlocked = false;

let recycleUnlocked = false;
let recycleUnlockPending = false;

let internetUnlocked = false;
let internetUnlockPending = false;

let day1001Shown = false;
let finalInstructionAdded = false;
let unknownPhotoMoved = false;
let unknownPhotoDragging = false;
let letterReady = false;
let letterOpened = false;
let letterTimer = null;

const bootLines = [
  "Initializing DAY1000 system...",
  "Checking current date status...",
  "Preparing day transition...",
  "Unclassified record detected.",
  "DAY500 checkpoint detected.",
  "DAY 1001 transition suspended.",
  "Preparing desktop environment..."
];

let currentLine = 0;
let progress = 0;


/* =========================
   부팅 메시지 출력
========================= */

function showNextBootLine() {

  if (currentLine >= bootLines.length) {
    finishBoot();
    return;
  }

  const line = document.createElement("div");

  line.className = "boot-line";
  line.textContent = "> " + bootLines[currentLine];

  bootText.appendChild(line);

  currentLine++;

  progress = Math.round(
    (currentLine / bootLines.length) * 100
  );

  loadingFill.style.width = progress + "%";

  setTimeout(showNextBootLine, 450);
}


/* =========================
   부팅 완료
========================= */

function finishBoot() {

  loadingFill.style.width = "100%";

  setTimeout(() => {

   bootStatus.innerHTML = `
  SYSTEM READY.<br><br>
  Current Day: 1000<br>
  Next Day: LOCKED<br>
  Unclassified Records: 1
`;

    startButton.style.display = "inline-block";

  }, 500);
}


/* =========================
   START 버튼
========================= */

startButton.addEventListener("click", async () => {

  try {

    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    }

  } catch (error) {
    console.log("전체화면 전환 실패:", error);
  }

  bootScreen.style.display = "none";
  desktop.classList.remove("hidden");

  setTimeout(() => {
    if (!unknownUnread.classList.contains("hidden")) {
      showUnknownToast();
    }
  }, 1000);

}, { once: true });


/* =========================
   아이콘 클릭 / 더블클릭
========================= */

const icons = document.querySelectorAll(".desktop-icon");

icons.forEach(icon => {

  icon.addEventListener("click", event => {
    event.stopPropagation();

    icons.forEach(i => {
      i.classList.remove("selected");
    });

    icon.classList.add("selected");
  });


icon.addEventListener("dblclick", event => {

  event.stopPropagation();

  const app = icon.dataset.app;

  if (app === "kakao") {
    openKakao();
  }

  if (app === "album") {

  if (!albumUnlocked) {
    return;
  }

  openAlbum();
}
  if (app === "recycle") {

    if (!recycleUnlocked) {
      return;
    }

    openRecycle();
  }

  if (app === "internet") {

  if (!internetUnlocked) {
    return;
  }

  openInternet();
}

  if (app === "day1001") {
    openLetter();
  }

});

});


/* 바탕화면 클릭하면 선택 해제 */
desktop.addEventListener("click", () => {

  icons.forEach(icon => {
    icon.classList.remove("selected");
  });

});

/* =========================
   카카오톡
========================= */

const kakaoWindow = document.getElementById("kakao-window");
const kakaoClose = document.getElementById("kakao-close");

const chatItems = document.querySelectorAll(".chat-item");

const chatRoomName = document.getElementById("chat-room-name");
const chatMessages = document.getElementById("chat-messages");

const chatRoom = document.querySelector(".chat-room");

const unknownToast = document.getElementById("unknown-toast");
const unknownUnread = document.getElementById("unknown-unread");
const taskbar = document.getElementById("taskbar");
let unknownToastTimer = null;

function showUnknownToast() {

  clearTimeout(unknownToastTimer);

  if (!kakaoWindow.classList.contains("hidden") &&
      chatRoom.classList.contains("unknown-room")) {
    unknownToast.classList.remove("visible");
    unknownToast.setAttribute("aria-hidden", "true");
    unknownToastTimer = null;
    openChat("unknown");
    return;
  }

  unknownUnread.classList.remove("hidden");
  unknownToast.style.bottom = taskbar.offsetHeight + "px";
  unknownToast.setAttribute("aria-hidden", "false");
  unknownToast.classList.add("visible");

  unknownToastTimer = setTimeout(() => {
    unknownToast.classList.remove("visible");
    unknownToast.setAttribute("aria-hidden", "true");
    unknownToastTimer = null;
  }, 3300);

}


/* =========================
   채팅 데이터
========================= */

const chats = {

  mallang: {
    name: "말랑이❤️",

    messages: [
      {
        type: "received",
        text: "퇴근 언제해"
      },

      {
        type: "sent",
        text: "몰라...ㅜ 아직이양"
      },

      {
        type: "received",
        text: "힝"
      },

      {
        type: "received",
        text: "아니 그게 아니라 오늘 저녁에 뭐 먹을거냐고"
      },

      {
        type: "sent",
        text: "너 술 먹고 싶어서 그러지?"
      },

      {
        type: "received",
        text: "올 때 진로 한 병"
      }
    ]
  },


  pudding: {
    name: "푸딩 🐶",

    messages: [
      {
        type: "received",
        text: "멍"
      },

      {
        type: "sent",
        text: "왜"
      },

      {
        type: "received",
        text: "멍"
      },

      {
        type: "sent",
        text: "알겠엌ㅋ"
      },

      {
        type: "received",
        text: "멍멍"
      }
    ]
  },


  unknown: {
  name: "(알 수 없음)",

  messages: [
    {
      type: "received",
      text:
`DAY1000 ARCHIVE CONNECTION ESTABLISHED.`
    },

    {
      type: "received",
      text:
`DAY 1000 종료 과정에서
분류되지 않은 기록이 감지되었습니다.`
    },

    {
      type: "received",
      text:
`해당 기록이 처리되기 전까지
DAY 1001로의 전환은 보류됩니다.`
    },

    {
      type: "received",
      text:
`기록의 마지막 감지 위치를 확인했습니다.`
    },

    {
      type: "received",
      text:
`마지막 감지 위치:
앨범 폴더`
    }
  ]
}

};


/* =========================
   카카오톡 실행
========================= */

function openKakao() {

  kakaoWindow.classList.remove("hidden");

  chatItems.forEach(item => {

    item.classList.remove("active");

    if (item.dataset.chat === "mallang") {
      item.classList.add("active");
    }

  });

  openChat("mallang");

}


/* =========================
   닫기
========================= */

kakaoClose.addEventListener("click", () => {

  kakaoWindow.classList.add("hidden");

});


/* =========================
   대화 선택
========================= */

chatItems.forEach(item => {

  item.addEventListener("click", event => {

    event.stopPropagation();

    chatItems.forEach(i => {
      i.classList.remove("active");
    });

    item.classList.add("active");

    const chat = item.dataset.chat;

    openChat(chat);

  });

});


/* =========================
   채팅방 출력
========================= */

function openChat(chatId) {

  const chat = chats[chatId];

  chatRoomName.textContent = chat.name;

  chatMessages.innerHTML = "";


  /* 알 수 없음 방 디자인 변경 */
  if (chatId === "unknown") {

  chatRoom.classList.add("unknown-room");
  unknownUnread.classList.add("hidden");
  clearTimeout(unknownToastTimer);
  unknownToastTimer = null;
  unknownToast.classList.remove("visible");
  unknownToast.setAttribute("aria-hidden", "true");

  /* 첫 지시를 확인하면 앨범 활성화 */
  if (!albumUnlocked) {
    albumUnlocked = true;
  }

} else {

  chatRoom.classList.remove("unknown-room");

}


    chat.messages.forEach(message => {

    const row = document.createElement("div");

    if (message.type === "divider") {
      row.className = "new-message-divider";
      row.textContent = message.text;

      chatMessages.appendChild(row);
      return;
    }

    row.className =
      "message-row " + message.type;

    const bubble = document.createElement("div");

    bubble.className = "message";

    bubble.textContent = message.text;

    row.appendChild(bubble);

    chatMessages.appendChild(row);

  });


  /* 항상 아래쪽 보여주기 */
  chatMessages.scrollTop =
  chatMessages.scrollHeight;

    /* 새 지시를 확인한 순간 휴지통 활성화 */
  if (chatId === "unknown" && recycleUnlockPending) {
    recycleUnlocked = true;
    recycleUnlockPending = false;

    desktop.classList.add("corrupted");
  }
/* 새 지시를 확인한 순간 인터넷 활성화 */
  if (chatId === "unknown" && internetUnlockPending) {

  internetUnlocked = true;
  internetUnlockPending = false;

}
}



showNextBootLine();

/* =========================
   앨범
========================= */

const albumWindow = document.getElementById("album-window");
const albumClose = document.getElementById("album-close");

const albumThumbs = document.querySelectorAll(".album-thumb");
const unknownPhotoThumb =
  document.querySelector('.album-thumb[data-unknown="true"]');
const day1001Icon = document.getElementById("day1001-icon");
const moveNotice = document.getElementById("move-notice");
const moveStatus = document.getElementById("move-status");
const moveDetail = document.getElementById("move-detail");

const albumPreview = document.getElementById("album-preview");
const albumFileName = document.getElementById("album-file-name");

const albumDetailsButton =
  document.getElementById("album-details-button");

const albumDetailsPanel =
  document.getElementById("album-details-panel");


/* 이상 파일을 확인했는지 기록 */
let unknownPhotoOpened = false;
let unknownPhotoDetailsOpened = false;


/* =========================
   앨범 실행
========================= */

function openAlbum() {

  albumWindow.classList.remove("hidden");

  albumThumbs.forEach(thumb => {
    if (thumb.classList.contains("active") &&
        !thumb.classList.contains("hidden")) {
      selectAlbumPhoto(
        thumb.dataset.src,
        thumb.dataset.name,
        thumb.dataset.unknown === "true"
      );
    }
  });

}


/* =========================
   앨범 닫기
========================= */

albumClose.addEventListener("click", event => {

  event.stopPropagation();

  albumWindow.classList.add("hidden");

});


/* =========================
   썸네일 선택
========================= */

albumThumbs.forEach(thumb => {

  thumb.draggable = false;
  thumb.querySelector("img").draggable = false;

  thumb.addEventListener("dragstart", event => {

    if (thumb.dataset.unknown !== "true" ||
        !day1001Icon.classList.contains("show") || unknownPhotoMoved) {
      event.preventDefault();
      return;
    }

    unknownPhotoDragging = true;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("application/x-day1000-photo", "unknown");
    event.dataTransfer.setDragImage(thumb.querySelector("img"), 33, 26);
    desktop.classList.add("photo-dragging");

  });

  thumb.addEventListener("dragend", () => {
    unknownPhotoDragging = false;
    day1001Icon.classList.remove("drop-ready");
    desktop.classList.remove("photo-dragging");
  });

  thumb.addEventListener("click", event => {

    event.stopPropagation();

    albumThumbs.forEach(item => {
      item.classList.remove("active");
    });

    thumb.classList.add("active");

    const src = thumb.dataset.src;
    const name = thumb.dataset.name;

    const isUnknown =
      thumb.dataset.unknown === "true";

    selectAlbumPhoto(
      src,
      name,
      isUnknown
    );

  });

});


/* =========================
   DAY1001 기록 이동
========================= */

albumPreview.draggable = false;

day1001Icon.addEventListener("dragover", event => {

  if (!unknownPhotoDragging || unknownPhotoMoved ||
      !day1001Icon.classList.contains("show")) {
    return;
  }

  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  day1001Icon.classList.add("drop-ready");

});

day1001Icon.addEventListener("dragleave", event => {
  if (!day1001Icon.contains(event.relatedTarget)) {
    day1001Icon.classList.remove("drop-ready");
  }
});

day1001Icon.addEventListener("drop", event => {

  event.preventDefault();
  event.stopPropagation();
  day1001Icon.classList.remove("drop-ready");
  desktop.classList.remove("photo-dragging");

  if (!unknownPhotoDragging || unknownPhotoMoved ||
      !day1001Icon.classList.contains("show") ||
      event.dataTransfer.getData("application/x-day1000-photo") !== "unknown") {
    return;
  }

  unknownPhotoMoved = true;
  unknownPhotoDragging = false;
  unknownPhotoThumb.draggable = false;
  unknownPhotoThumb.classList.add("hidden");
  unknownPhotoThumb.classList.remove("active");

  if (albumPreview.getAttribute("src") === unknownPhotoThumb.dataset.src) {
    albumThumbs[0].click();
  }

  desktop.classList.remove("corrupted", "corrupted-deep");

  moveStatus.textContent = "기록 이동 중...";
  moveDetail.textContent = "DAY 1000 → DAY 1001";
  moveNotice.classList.remove("hidden");

  setTimeout(() => {

    moveStatus.textContent = "이동 완료";
    moveDetail.textContent = "DAY 1000 종료 조건이 충족되었습니다.";

    chats.unknown.messages.push(
      { type: "divider", text: "새 메시지" },
      { type: "received", text: "기록 이동이 완료되었습니다." },
      { type: "received", text: "DAY 1000 종료 조건이 충족되었습니다." },
      { type: "received", text: "DAY 1001 전환을 준비합니다." }
    );
    showUnknownToast();

    setTimeout(() => {
      moveNotice.classList.add("hidden");
      day1001Icon.querySelector("img").src = "assets/icons/letter.png";
      day1001Icon.querySelector("img").alt = "DAY1001 편지";
      day1001Icon.classList.add("letter-ready");
      letterReady = true;
    }, 2000);

  }, 1500);

});


/* =========================
   사진 표시
========================= */

function selectAlbumPhoto(src, name, isUnknown) {

  albumPreview.src = src;
  albumFileName.textContent = name;

  albumDetailsPanel.classList.add("hidden");


  if (isUnknown) {

    unknownPhotoOpened = true;

    albumDetailsButton.classList.remove("hidden");

  } else {

    albumDetailsButton.classList.add("hidden");

  }

}


/* =========================
   세부정보 열기
========================= */

albumDetailsButton.addEventListener("click", event => {

  event.stopPropagation();

  albumDetailsPanel.classList.remove("hidden");


  /* 처음 확인했을 때만 다음 메시지 추가 */
  if (!unknownPhotoDetailsOpened) {

    unknownPhotoDetailsOpened = true;

    chats.unknown.messages.push(
              {
        type: "divider",
        text: "새 메세지"
      },

      {
        type: "received",
        text:
`해당 기록을 확인했습니다.`
      },

      {
        type: "received",
        text:
`파일 상태를 확인하는 과정에서
삭제 이력이 발견되었습니다.`
      },

      {
        type: "received",
        text:
`해당 기록은 이전에
정상적으로 삭제 처리되었습니다.`
      },

      {
        type: "received",
        text:
`복구 요청은 확인되지 않았습니다.`
      },

      {
        type: "received",
        text:
`삭제 기록을 확인하십시오.`
      }
    );

   recycleUnlockPending = true;
   showUnknownToast();

  }

});


/* =========================
   휴지통
========================= */

const recycleWindow =
  document.getElementById("recycle-window");

const recycleClose =
  document.getElementById("recycle-close");

const recycleFiles =
  document.querySelectorAll(".recycle-file");

const recycleFileTitle =
  document.getElementById("recycle-file-title");

const recycleFileContent =
  document.getElementById("recycle-file-content");


/* =========================
   휴지통 파일 데이터
========================= */

const recycleData = {

  delete: {
    name: "delete_log.txt",

    content:
`[18:41:02] 삭제 요청
대상: photo_■■.jpg

[18:41:03] 삭제 완료
원본 파일 제거됨


[--:--:--] 기록 재감지

출처: 알 수 없음
복구 기록: 없음
현재 상태: 존재`
  },


  restore: {
    name: "restore_history.log",

    content:
`복구 기록 확인

대상 파일:
photo_■■.jpg


복구 요청: 없음

자동 복원: 없음

수동 복원: 없음

백업 복원: 없음


현재 파일 상태:
존재


※ 해당 파일이 다시 생성된 경로를
확인할 수 없습니다.`
  },


  backup: {
    name: "day500_backup.zip",

    content:
`보관 기록: DAY 500

상태: 정상 완료

확인된 이상 기록:
없음


DAY 500 종료:
정상


다음 확인 지점:
DAY 1000`
  },


  readme: {
    name: "read_me.txt",

    content:
`미확인 기록 처리 지침


1. 삭제 완료된 기록이 다시 나타난 경우,
   해당 기록을 반복해서 삭제하지 마십시오.

2. 복구 이력이 확인되지 않는 경우,
   임의로 이동하거나 수정하지 마십시오.

3. 처리되지 않은 기록이 존재하는 동안
   현재 날짜를 종료하지 마십시오.

4. 다음 지시가 확인되기 전까지
   컴퓨터를 종료하지 마십시오.`
  }

};


/* =========================
   휴지통 실행
========================= */

function openRecycle() {

  recycleWindow.classList.remove("hidden");

  recycleFiles.forEach(file => {
    if (file.classList.contains("active")) {
      openRecycleFile(file.dataset.file);
    }
  });

}


/* =========================
   휴지통 닫기
========================= */

recycleClose.addEventListener("click", event => {

  event.stopPropagation();

  recycleWindow.classList.add("hidden");

});


/* =========================
   파일 선택
========================= */

recycleFiles.forEach(file => {

  file.addEventListener("click", event => {

    event.stopPropagation();

    recycleFiles.forEach(item => {
      item.classList.remove("active");
    });

    file.classList.add("active");

    const fileId = file.dataset.file;

    openRecycleFile(fileId);

  });

});


/* =========================
   파일 열기
========================= */

function openRecycleFile(fileId) {

  const file = recycleData[fileId];

  recycleFileTitle.textContent = file.name;

  recycleFileContent.textContent =
    file.content;

    if (fileId === "readme" && !internetUnlockPending && !internetUnlocked) {

  internetUnlockPending = true;

  desktop.classList.add("corrupted-deep");

  chats.unknown.messages.push(
    {
      type: "divider",
      text: "새 메세지"
    },
    {
      type: "received",
      text:
`처리 지침이 확인되었습니다.`
    },
    {
      type: "received",
      text:
`현재 기록만으로는
귀속 날짜를 확정할 수 없습니다.`
    },
    {
      type: "received",
      text:
`인터넷 내부 문서를 확인하십시오.`
    }
  );
  showUnknownToast();
}

}

/* =========================
   인터넷
========================= */

const internetWindow =
  document.getElementById("internet-window");

const internetClose =
  document.getElementById("internet-close");


function openInternet() {

  internetWindow.classList.remove("hidden");

  if (!day1001Shown) {

    day1001Shown = true;

    setTimeout(() => {

      day1001Icon.classList.remove("hidden");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          day1001Icon.classList.add("show");
          unknownPhotoThumb.draggable = !unknownPhotoMoved;

          /* DAY1001 폴더 생성 후 마지막 지시 추가 */
          if (!finalInstructionAdded) {

            finalInstructionAdded = true;

            chats.unknown.messages.push(
              {
                type: "divider",
                text: "새 메시지"
              },

              {
                type: "received",
                text:
`대상 날짜의 폴더가 확인되었습니다.`
              },

              {
                type: "received",
                text:
`분류되지 않은 기록을
올바른 날짜로 이동하십시오.`
              },

              {
                type: "received",
                text:
`대상 기록:
photo_■■.jpg`
              },

              {
                type: "received",
                text:
`이동 위치:
DAY1001`
              },

              {
                type: "received",
                text:
`기록 이동이 완료되기 전까지
컴퓨터를 종료하지 마십시오.`
              }
            );
            showUnknownToast();

          }
        });
      });

    }, 1000);

  }

}


internetClose.addEventListener("click", event => {

  event.stopPropagation();

  internetWindow.classList.add("hidden");

});


/* =========================
   DAY1001 편지
========================= */

const letterWindow = document.getElementById("letter-window");
const letterClose = document.getElementById("letter-close");
const letterSystem = document.getElementById("letter-system");
const letterContent = document.getElementById("letter-content");

function openLetter() {

  if (!unknownPhotoMoved || !letterReady ||
      !letterWindow.classList.contains("hidden")) {
    return;
  }

  letterWindow.classList.remove("hidden");

  if (!letterOpened) {
    letterSystem.classList.remove("hidden");
    letterContent.classList.add("hidden");

    letterTimer = setTimeout(() => {
      letterSystem.classList.add("hidden");
      letterContent.classList.remove("hidden");
      letterOpened = true;
      letterTimer = null;
    }, 1000);
  }

}

letterClose.addEventListener("click", event => {

  event.stopPropagation();
  clearTimeout(letterTimer);
  letterTimer = null;
  letterWindow.classList.add("hidden");

});
