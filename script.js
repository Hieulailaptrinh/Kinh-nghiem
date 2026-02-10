// 1. Khởi tạo dữ liệu mẫu (nếu chưa có trong LocalStorage)
const defaultData = [
  {
    id: 1,
    title: "Mẹo tải PDF Google Drive",
    content: "Dùng code JS trong Console để tải từng ảnh về...",
  },
  {
    id: 2,
    title: "Cấu trúc HTML cơ bản",
    content: "<pre>!DOCTYPE html...</pre>",
  },
];

let notes = JSON.parse(localStorage.getItem("myDevNotes")) || defaultData;

const topicList = document.getElementById("topicList");
const displayArea = document.getElementById("displayArea");
const searchInput = document.getElementById("searchInput");

// 2. Hàm render danh sách bên trái
function renderList(data = notes) {
  topicList.innerHTML = "";
  data.forEach((note) => {
    const li = document.createElement("li");
    li.innerHTML = `<i class="fa-regular fa-file-code"></i> ${note.title}`;
    li.onclick = () => showContent(note.id); // Bắt sự kiện click
    topicList.appendChild(li);
  });
}

// 3. Hàm hiển thị nội dung bên phải
function showContent(id) {
  const note = notes.find((n) => n.id === id);
  if (note) {
    // Highlight mục đang chọn
    document
      .querySelectorAll("#topicList li")
      .forEach((li) => li.classList.remove("active"));
    event.target.classList.add("active"); // Lưu ý: cần xử lý event chuẩn hơn nếu có icon con

    displayArea.innerHTML = `
            <h1 class="content-title">${note.title}</h1>
            <div class="content-body">${note.content}</div>
            <button onclick="deleteNote(${note.id})" style="margin-top:20px; color:red; border:none; background:none; cursor:pointer;">Xóa bài này</button>
        `;
  }
}

// 4. Xử lý Thêm bài mới (Modal)
const modal = document.getElementById("noteModal");
document.getElementById("addBtn").onclick = () =>
  (modal.style.display = "block");
document.getElementsByClassName("close")[0].onclick = () =>
  (modal.style.display = "none");

document.getElementById("saveBtn").onclick = () => {
  const title = document.getElementById("inputTitle").value;
  const content = document.getElementById("inputContent").value;

  if (title && content) {
    const newNote = {
      id: Date.now(), // Tạo ID độc nhất bằng thời gian
      title: title,
      content: content, // Lưu ý: ở đây nhận text thuần, bạn có thể nhập thẻ HTML
    };
    notes.push(newNote);
    localStorage.setItem("myDevNotes", JSON.stringify(notes)); // Lưu vào trình duyệt
    renderList();
    modal.style.display = "none";
    // Reset form
    document.getElementById("inputTitle").value = "";
    document.getElementById("inputContent").value = "";
  } else {
    alert("Vui lòng nhập đủ thông tin!");
  }
};

// 5. Hàm xóa bài
window.deleteNote = function (id) {
  if (confirm("Bạn chắc chắn muốn xóa?")) {
    notes = notes.filter((n) => n.id !== id);
    localStorage.setItem("myDevNotes", JSON.stringify(notes));
    renderList();
    displayArea.innerHTML = "<h1>Đã xóa!</h1>";
  }
};

// 6. Tìm kiếm
searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  const filtered = notes.filter((n) => n.title.toLowerCase().includes(keyword));
  renderList(filtered);
}); // --- THÊM VÀO CUỐI FILE SCRIPT.JS ---

const mobileBtn = document.getElementById("mobileMenuBtn");
const sidebar = document.querySelector(".sidebar");
const overlay = document.getElementById("overlay");

// Hàm bật/tắt menu
function toggleMenu() {
  sidebar.classList.toggle("active");

  // Hiển thị overlay nếu menu đang mở
  if (sidebar.classList.contains("active")) {
    overlay.style.display = "block";
  } else {
    overlay.style.display = "none";
  }
}

// Bắt sự kiện click
mobileBtn.addEventListener("click", toggleMenu);
overlay.addEventListener("click", toggleMenu); // Bấm ra ngoài thì đóng

// Tinh chỉnh lại hàm renderList cũ một chút:
// Khi click vào 1 bài (li), nếu đang ở mobile thì phải tự đóng menu lại cho gọn
// Bạn tìm đoạn li.onclick trong hàm renderList và sửa thành:
/*
    li.onclick = () => {
        showContent(note.id);
        // Nếu đang ở mobile (có class active) thì đóng menu
        if (window.innerWidth <= 768) {
            toggleMenu();
        }
    };
*/

// Chạy lần đầu
renderList();
