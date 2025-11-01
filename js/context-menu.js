// Tạo và quản lý context menu
class ContextMenu {
    constructor() {
        this.menu = null;
        this.init();
    }

    init() {
        // Tạo menu element
        this.menu = document.createElement('div');
        this.menu.className = 'context-menu hidden fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 min-w-[200px]';
        document.body.appendChild(this.menu);

        // Click bên ngoài để đóng menu
        document.addEventListener('click', (e) => {
            if (!this.menu.contains(e.target)) {
                this.hide();
            }
        });

        // Ngăn menu mặc định của trình duyệt
        document.addEventListener('contextmenu', (e) => {
            const fileItem = e.target.closest('.file-item');
            if (fileItem) {
                e.preventDefault();
                this.show(e.pageX, e.pageY, fileItem);
            }
        });
    }

    createMenuItem(icon, text, onClick) {
        const item = document.createElement('div');
        item.className = 'px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2';
        item.innerHTML = `
            ${icon}
            <span>${text}</span>
        `;
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            onClick();
            this.hide();
        });
        return item;
    }

    show(x, y, fileItem) {
        const isFolder = fileItem.dataset.type === 'folder';
        this.menu.innerHTML = '';

        // Icon cho menu items
        const icons = {
            download: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z"/><path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z"/></svg>',
            rename: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z"/><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z"/></svg>',
            delete: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clip-rule="evenodd"/></svg>'
        };

        // Thêm menu items
        this.menu.appendChild(this.createMenuItem(
            icons.download,
            isFolder ? 'Tải xuống thư mục' : 'Tải xuống',
            () => this.handleDownload(fileItem)
        ));

        this.menu.appendChild(this.createMenuItem(
            icons.rename,
            'Đổi tên',
            () => this.handleRename(fileItem)
        ));

        this.menu.appendChild(this.createMenuItem(
            icons.delete,
            'Xóa',
            () => this.handleDelete(fileItem)
        ));

        // Định vị menu
        const menuWidth = 200;
        const menuHeight = this.menu.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Đảm bảo menu không vượt ra ngoài màn hình
        let menuX = x;
        let menuY = y;

        if (x + menuWidth > windowWidth) {
            menuX = windowWidth - menuWidth - 10;
        }

        if (y + menuHeight > windowHeight) {
            menuY = windowHeight - menuHeight - 10;
        }

        this.menu.style.left = menuX + 'px';
        this.menu.style.top = menuY + 'px';
        this.menu.classList.remove('hidden');
    }

    hide() {
        this.menu.classList.add('hidden');
    }

    handleDownload(fileItem) {
        const fileId = fileItem.dataset.id;
        const fileName = fileItem.dataset.name;
        const fileType = fileItem.dataset.type;

        if (fileType === 'folder') {
            // Gọi API để tải xuống thư mục dưới dạng zip
            downloadFolder(fileId);
        } else {
            // Tải xuống file đơn lẻ
            downloadFile(fileId, fileName);
        }
    }

    handleRename(fileItem) {
        const fileId = fileItem.dataset.id;
        const fileName = fileItem.dataset.name;
        showRenameModal(fileId, fileName);
    }

    handleDelete(fileItem) {
        const fileId = fileItem.dataset.id;
        const fileName = fileItem.dataset.name;
        if (confirm(`Bạn có chắc chắn muốn xóa ${fileName}?`)) {
            deleteFile(fileId);
        }
    }
}

// Khởi tạo context menu khi trang được load
document.addEventListener('DOMContentLoaded', () => {
    window.contextMenu = new ContextMenu();
});

// Hàm xử lý tải xuống file
function downloadFile(fileId, fileName) {
    // Gọi API để lấy URL tải xuống
    // Ví dụ: fetch(`/api/files/${fileId}/download`)
    //   .then(response => response.blob())
    //   .then(blob => {
    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = fileName;
    //     document.body.appendChild(a);
    //     a.click();
    //     window.URL.revokeObjectURL(url);
    //     document.body.removeChild(a);
    //   });
}

// Hàm xử lý tải xuống thư mục
function downloadFolder(folderId) {
    // Gọi API để tải xuống thư mục dưới dạng zip
    // Ví dụ: fetch(`/api/folders/${folderId}/download`)
    //   .then(response => response.blob())
    //   .then(blob => {
    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = folderName + '.zip';
    //     document.body.appendChild(a);
    //     a.click();
    //     window.URL.revokeObjectURL(url);
    //     document.body.removeChild(a);
    //   });
}

// Thêm hàm xử lý long press cho mobile
let longPressTimer;
const LONG_PRESS_DURATION = 500; // 500ms for long press

function handleTouchStart(e) {
    const fileItem = e.target.closest('.file-item');
    if (!fileItem) return;

    longPressTimer = setTimeout(() => {
        // Hiển thị context menu tại vị trí chạm
        const touch = e.touches[0];
        window.contextMenu.show(touch.pageX, touch.pageY, fileItem);
    }, LONG_PRESS_DURATION);
}

function handleTouchEnd() {
    clearTimeout(longPressTimer);
}

// Thêm touch event listeners
document.addEventListener('touchstart', handleTouchStart, { passive: false });
document.addEventListener('touchend', handleTouchEnd);
document.addEventListener('touchmove', () => clearTimeout(longPressTimer));