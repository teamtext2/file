// Khởi tạo biến theo dõi
let touchStartTime = 0;
let longPressTimeout;
let isDragging = false;
let selectedFiles = new Set();
let lastTouchPosition = { x: 0, y: 0 };

document.addEventListener('DOMContentLoaded', () => {
    const fileList = document.getElementById('file-list');
    const dropZone = document.getElementById('drop-zone');

    // Thêm sự kiện drag and drop cho desktop
    dropZone.addEventListener('dragenter', handleDragEnter);
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);

    // Thêm sự kiện touch cho mobile
    fileList.addEventListener('touchstart', handleTouchStart, { passive: false });
    fileList.addEventListener('touchmove', handleTouchMove, { passive: false });
    fileList.addEventListener('touchend', handleTouchEnd);

    // Thêm sự kiện chuột cho desktop
    fileList.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Thêm sự kiện selection cho desktop
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Control' || e.key === 'Meta') {
            fileList.classList.add('multi-select-mode');
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'Control' || e.key === 'Meta') {
            fileList.classList.remove('multi-select-mode');
        }
    });
});

// Xử lý kéo thả cho desktop
function handleDragEnter(e) {
    e.preventDefault();
    dropZone.classList.add('drag-over');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragLeave(e) {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
        dropZone.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
        handleFileUpload(files);
    }
}

// Xử lý sự kiện touch cho mobile
function handleTouchStart(e) {
    const target = e.target.closest('.file-item');
    if (!target) return;

    e.preventDefault();
    touchStartTime = Date.now();
    lastTouchPosition = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
    };

    longPressTimeout = setTimeout(() => {
        handleLongPress(target);
    }, 500);
}

function handleTouchMove(e) {
    if (!isDragging) {
        const touch = e.touches[0];
        const moveThreshold = 10;

        const deltaX = Math.abs(touch.clientX - lastTouchPosition.x);
        const deltaY = Math.abs(touch.clientY - lastTouchPosition.y);

        if (deltaX > moveThreshold || deltaY > moveThreshold) {
            clearTimeout(longPressTimeout);
        }
    }
}

function handleTouchEnd(e) {
    clearTimeout(longPressTimeout);
    const timeDiff = Date.now() - touchStartTime;

    if (timeDiff < 500) {
        const target = e.target.closest('.file-item');
        if (target) {
            handleFileClick(target);
        }
    }
}

function handleLongPress(target) {
    target.classList.add('selected');
    selectedFiles.add(target.dataset.id);
    showSelectionToolbar();
}

// Xử lý sự kiện chuột cho desktop
function handleMouseDown(e) {
    const target = e.target.closest('.file-item');
    if (!target) return;

    if (e.ctrlKey || e.metaKey) {
        toggleFileSelection(target);
    } else {
        if (!selectedFiles.has(target.dataset.id)) {
            clearSelection();
            toggleFileSelection(target);
        }
    }
}

function handleMouseMove(e) {
    if (isDragging) {
        // Xử lý kéo file
        updateDragPreview(e);
    }
}

function handleMouseUp(e) {
    if (isDragging) {
        isDragging = false;
        removeDragPreview();
    }
}

// Các hàm tiện ích
function toggleFileSelection(element) {
    const fileId = element.dataset.id;
    if (selectedFiles.has(fileId)) {
        selectedFiles.delete(fileId);
        element.classList.remove('selected');
    } else {
        selectedFiles.add(fileId);
        element.classList.add('selected');
    }
    updateSelectionUI();
}

function clearSelection() {
    selectedFiles.clear();
    document.querySelectorAll('.file-item.selected').forEach(el => {
        el.classList.remove('selected');
    });
    hideSelectionToolbar();
}

function updateSelectionUI() {
    if (selectedFiles.size > 0) {
        showSelectionToolbar();
    } else {
        hideSelectionToolbar();
    }
}

function showSelectionToolbar() {
    // Hiển thị toolbar với các nút tải xuống, xóa, v.v.
    const toolbar = document.getElementById('selection-toolbar');
    if (toolbar) {
        toolbar.classList.remove('hidden');
        document.getElementById('selected-count').textContent = selectedFiles.size;
    }
}

function hideSelectionToolbar() {
    const toolbar = document.getElementById('selection-toolbar');
    if (toolbar) {
        toolbar.classList.add('hidden');
    }
}

// Hàm xử lý tải xuống file
function downloadSelectedFiles() {
    selectedFiles.forEach(fileId => {
        // Gọi API hoặc xử lý tải xuống cho từng file
        const fileElement = document.querySelector(`.file-item[data-id="${fileId}"]`);
        if (fileElement) {
            const fileUrl = fileElement.dataset.url;
            if (fileUrl) {
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = fileElement.dataset.name || '';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    });
}

// Hàm xử lý upload file
function handleFileUpload(files) {
    // Xử lý upload file lên server
    // Thêm code xử lý upload ở đây
}