// Messages
const messages = [
  "LaTeX: Font chữ chuyên dùng cho báo cáo luận văn là CM.",
  "C++: Con trỏ (pointer) giúp quản lý bộ nhớ tốt hơn.",
  "Matlab: Hàm plot() dùng để vẽ đồ thị 2D.",
  "Matplotlib: Module thông dụng để vẽ biểu đồ.",
  "Python: List comprehension giúp viết code ngắn gọn hơn.",
  "Excel: Hàm VLOOKUP() giúp tìm kiếm dữ liệu trong bảng.",
  "Word: Sử dụng Styles để định dạng văn bản nhất quán.",
  "PowerPoint: Sử dụng Slide Master để tạo template.",
  "Canva: Có thể tạo ảnh động GIF từ nhiều slide.",
  "LaTeX: Gói 'graphicx' giúp chèn ảnh vào văn bản.",
  "Python: 'pip' là trình quản lý gói của Python.",
  "VSCode: Công cụ tuyệt vời để lập trình.",
  "Excel: Hàm 'SUMIF()' tính tổng có điều kiện.",
  "Word: Sử dụng 'Mail Merge' để tạo thư hàng loạt.",
  "GS. Trần Đại Nghĩa: Vì sao từ chối mức lương 22 lượng vàng / tháng?",
  "PowerPoint: Sử dụng 'Morph' để tạo chuyển động mượt mà.",
  "Sheet: Dùng để quản lý thời gian làm việc của nhóm.",
  "LaTeX: 'Beamer' class chuyên dùng để tạo slide.",
  "C++: 'Smart pointers' giúp quản lý bộ nhớ tự động.",
  "Matlab: 'Simulink' dùng để mô phỏng hệ thống động.",
  "HCMUT: Đừng ai rớ tới tiếng Anh sinh viên BK.",
  "HCMUT: Trường Đại học Công nghệ TP HCM.",
  "UIT: Trường Đại học Công nghệ TP HCM.",
  "UIT: Linh vật mắt thâm như sinh viên.",
  "HCMUS: 'Cảm ơn sự góp ý của anh/chị'.",
  "HCMUS: 'Cảm ơn sự góp ý của anh/chị'.",
  "HCMUS: Nghe nói mới update portal.",
  "USSH: Đừng để thiên thạch rơi xuống đây.",
  "USSH: Đừng để thiên thạch rơi xuống đây.",
  "USSH: Khoa Triết dường như ko thuộc về đây.",
  "UEL: Nghe nói vô trường thì sẽ có bồ.",
  "HUST: 'Tôi có thằng em sinh năm 96 học BK.'",
  "HCMUT: 'Tôi có thằng em sinh năm 96 học BK.'",
  "UTE: Số một VVN.",
  "NLU: Nghe nói sv trường này đi học bằng lam bô ghi ni.",
  "NLU: Tới giảng đường chưa bạn?",
  "HUB: Học được mấy phép rồi bạn?",
  "TDTU: Ngôi trường làm bạn nhớ đến cấp 3.",
  "IU: Muốn vô mà hok bt tiếng anh.",
];

document.addEventListener("DOMContentLoaded", () => {
  const loadingText = document.getElementById("loading-text");
  const lengthOfMess = messages.length;

  // Update to a random message
  function updateLoadingText() {
    loadingText.textContent =
      messages[Math.floor(Math.random() * lengthOfMess)];
  }

  let checkLoadedInterval;

  // Call updateLoadingText after each 5000 ms
  function startCheckingLoaded() {
    loadingText.textContent = "Đang xử lý! Đợi chút!";
    checkLoadedInterval = setInterval(updateLoadingText, 5000);
  }

  startCheckingLoaded();

  window.triggerPageLoad = function () {
    clearInterval(checkLoadedInterval); // Clear checkLoadedInterval
    document.body.classList.add("loaded");
  };

  window.resetPageLoad = function () {
    document.body.classList.remove("loaded");
    startCheckingLoaded(); // Clear checkLoadedInterval
  };

  // When the window was loaded
  //resetPageLoad();
  window.addEventListener("load", triggerPageLoad);
});
